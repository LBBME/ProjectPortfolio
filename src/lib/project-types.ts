export type ProjectResult = {
  label: string;
  value: string;
  note?: string;
};

export type ValidationItem = {
  check: string;
  status: "pass" | "partial" | "planned";
  note?: string;
};

export type ReproItem = {
  step: string;
  detail: string;
};

export type ProjectFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  domain: string;
  tools: string[];
  tags: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "planned";
  updatedAt: string;
  readingMinutes: number;
  results: ProjectResult[];
  validation: ValidationItem[];
  reproducibility: ReproItem[];
};

export type Project = ProjectFrontmatter & {
  content: string;
  headings: { id: string; text: string; level: 2 | 3 }[];
};

export const PROJECT_SCHEMA_EXAMPLES: ProjectFrontmatter[] = [
  {
    title: "IPW Icing Verification Pipeline",
    slug: "ipw-icing-verification-pipeline",
    summary:
      "Automated Fluent -> FENSAP-ICE Flow/DROP3D/ICE3D pipeline with batch post-processing.",
    domain: "Aircraft Icing",
    tools: ["Fluent", "FENSAP-ICE", "Python", "SLURM"],
    tags: ["verification", "automation", "hpc", "icing"],
    featured: true,
    status: "completed",
    updatedAt: "2026-02-11",
    readingMinutes: 5,
    results: [
      {
        label: "Batch runtime reduction",
        value: "37% (placeholder)"
      }
    ],
    validation: [
      {
        check: "Mass balance tolerance",
        status: "pass"
      }
    ],
    reproducibility: [
      {
        step: "Pin solver version",
        detail: "Document exact Fluent/FENSAP build versions."
      }
    ]
  }
];
