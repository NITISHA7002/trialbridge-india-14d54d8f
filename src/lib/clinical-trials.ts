// Browser-safe ClinicalTrials.gov v2 API client + match scorer.

export type SearchInput = {
  condition: string;
  age?: number | null;
  gender?: "Male" | "Female" | "All" | "" | null;
  city?: string | null;
};

export type Trial = {
  nctId: string;
  title: string;
  briefSummary: string;
  phase: string;
  status: string;
  conditions: string[];
  interventions: string[];
  eligibility: string;
  minAge: number | null;
  maxAge: number | null;
  sex: string;
  locations: { facility: string; city: string; country: string }[];
  matchScore: number;
  matchReasons: string[];
  description: string;
};

const API = "https://clinicaltrials.gov/api/v2/studies";

function parseAgeYears(text: string | undefined): number | null {
  if (!text) return null;
  const m = text.match(/(\d+)\s*(Years|Year|Months|Month|Weeks|Week|Days|Day)/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit.startsWith("year")) return n;
  if (unit.startsWith("month")) return Math.round(n / 12);
  if (unit.startsWith("week")) return Math.round(n / 52);
  return 0;
}

function scoreTrial(t: Omit<Trial, "matchScore" | "matchReasons">, input: SearchInput) {
  let score = 0;
  const reasons: string[] = [];
  const q = input.condition.trim().toLowerCase();

  // Condition keyword match: 40
  if (q) {
    const haystack = (t.conditions.join(" ") + " " + t.title + " " + t.briefSummary).toLowerCase();
    if (haystack.includes(q)) {
      score += 40;
      reasons.push("Condition matches");
    } else {
      const tokens = q.split(/\s+/).filter((w) => w.length > 3);
      const hits = tokens.filter((w) => haystack.includes(w)).length;
      if (hits) {
        score += Math.min(30, hits * 10);
        reasons.push("Partial condition match");
      }
    }
  }

  // Age within range: 25
  if (input.age != null) {
    const minOk = t.minAge == null || input.age >= t.minAge;
    const maxOk = t.maxAge == null || input.age <= t.maxAge;
    if (minOk && maxOk) {
      score += 25;
      reasons.push("Age eligible");
    }
  } else {
    score += 10;
  }

  // Gender match: 15
  if (input.gender && input.gender !== "" && input.gender !== "All") {
    const sex = (t.sex || "ALL").toUpperCase();
    if (sex === "ALL" || sex === input.gender.toUpperCase()) {
      score += 15;
      reasons.push("Gender eligible");
    }
  } else {
    score += 10;
  }

  // City match: 20
  if (input.city && input.city.trim()) {
    const cityQ = input.city.trim().toLowerCase();
    const inCity = t.locations.some((l) => l.city.toLowerCase().includes(cityQ));
    if (inCity) {
      score += 20;
      reasons.push("Hospital in your city");
    }
  } else {
    score += 10;
  }

  return { score: Math.min(100, score), reasons };
}

export async function searchTrials(input: SearchInput): Promise<Trial[]> {
  const params = new URLSearchParams({
    "query.cond": input.condition,
    "filter.overallStatus": "RECRUITING",
    "query.locn": "India",
    pageSize: "30",
    format: "json",
  });

  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error(`ClinicalTrials.gov error: ${res.status}`);
  const json = await res.json();
  const studies = (json.studies ?? []) as any[];

  const trials: Trial[] = studies.map((s) => {
    const proto = s.protocolSection ?? {};
    const id = proto.identificationModule ?? {};
    const desc = proto.descriptionModule ?? {};
    const cond = proto.conditionsModule ?? {};
    const elig = proto.eligibilityModule ?? {};
    const arms = proto.armsInterventionsModule ?? {};
    const status = proto.statusModule ?? {};
    const design = proto.designModule ?? {};
    const contacts = proto.contactsLocationsModule ?? {};

    const locations = ((contacts.locations ?? []) as any[])
      .filter((l) => (l.country ?? "").toLowerCase() === "india")
      .map((l) => ({
        facility: l.facility ?? "",
        city: l.city ?? "",
        country: l.country ?? "",
      }));

    const base = {
      nctId: id.nctId ?? "",
      title: id.briefTitle ?? "Untitled trial",
      briefSummary: desc.briefSummary ?? "",
      phase: (design.phases ?? []).join(", ") || "N/A",
      status: status.overallStatus ?? "",
      conditions: cond.conditions ?? [],
      interventions: ((arms.interventions ?? []) as any[]).map((i) => i.name ?? "").filter(Boolean),
      eligibility: elig.eligibilityCriteria ?? "",
      minAge: parseAgeYears(elig.minimumAge),
      maxAge: parseAgeYears(elig.maximumAge),
      sex: elig.sex ?? "ALL",
      locations,
      description: desc.briefSummary ?? "",
    };

    const { score, reasons } = scoreTrial(base, input);
    return { ...base, matchScore: score, matchReasons: reasons };
  });

  trials.sort((a, b) => b.matchScore - a.matchScore);
  return trials;
}