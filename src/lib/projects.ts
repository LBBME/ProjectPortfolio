import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ElementType } from "react";
import type { Project, ProjectFrontmatter } from "@/lib/project-types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function toId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractHeadings(content: string): { id: string; text: string; level: 2 | 3 }[] {
  const lines = content.split("\n");
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const text = line.replace("## ", "").trim();
      headings.push({ id: toId(text), text, level: 2 });
    }
  }

  return headings;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function tokenSimilarity(queryToken: string, candidateToken: string): number {
  if (queryToken === candidateToken) return 1;
  if (candidateToken.startsWith(queryToken) || queryToken.startsWith(candidateToken)) return 0.9;
  if (candidateToken.includes(queryToken) || queryToken.includes(candidateToken)) return 0.8;

  const minLength = Math.min(queryToken.length, candidateToken.length);
  if (minLength >= 5 && levenshteinDistance(queryToken, candidateToken) === 1) return 0.72;
  return 0;
}

function parseProject(fileContent: string): Project {
  const { data, content } = matter(fileContent);
  const frontmatter = data as ProjectFrontmatter;

  return {
    ...frontmatter,
    content,
    headings: extractHeadings(content)
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const files = await fs.readdir(PROJECTS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const projects = await Promise.all(
    mdxFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(PROJECTS_DIR, file), "utf8");
      return parseProject(raw);
    })
  );

  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getRenderedProject(
  slug: string,
  components?: Record<string, ElementType>
) {
  const project = await getProjectBySlug(slug);
  if (!project) return null;

  const { content } = await compileMDX({
    source: project.content,
    options: { parseFrontmatter: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
    components
  });

  return { project, content };
}

export function filterProjects(
  projects: Project[],
  query: string,
  tags: string[]
): Project[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedTags = tags.map((tag) => tag.toLowerCase());
  const queryTokens = tokenize(normalizedQuery)
    .map((token) => token.trim())
    .filter(Boolean);

  const synonymMap: Record<string, string[]> = {
    ipw2: ["icing", "fpcs", "verification"],
    ipw: ["icing", "fpcs", "verification"],
    icing: ["ipw", "fensap", "verification"],
    fsae: ["motorsport", "external-flow", "aero"],
    lab: ["cfd-lab", "validation", "mesh-study"],
    cfd: ["simulation", "validation", "mesh-study"]
  };

  const tagMatches = (project: Project): boolean =>
    normalizedTags.length === 0 ||
    normalizedTags.every((tag) => project.tags.map((t) => t.toLowerCase()).includes(tag));

  if (queryTokens.length === 0) {
    return projects.filter(tagMatches);
  }

  const scored = projects
    .filter(tagMatches)
    .map((project) => {
      const titleTokens = tokenize(project.title);
      const summaryTokens = tokenize(project.summary);
      const domainTokens = tokenize(project.domain);
      const tagTokens = project.tags.flatMap((tag) => tokenize(tag));
      const toolTokens = project.tools.flatMap((tool) => tokenize(tool));
      const searchable = [
        project.title,
        project.summary,
        project.domain,
        ...project.tags,
        ...project.tools
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      let matchedTokens = 0;

      for (const token of queryTokens) {
        const expanded = [token, ...(synonymMap[token] ?? [])];
        let bestTokenScore = 0;

        for (const candidate of expanded) {
          if (searchable.includes(candidate)) {
            bestTokenScore = Math.max(bestTokenScore, 0.35);
          }

          for (const target of titleTokens) {
            bestTokenScore = Math.max(bestTokenScore, tokenSimilarity(candidate, target) * 4.5);
          }
          for (const target of tagTokens) {
            bestTokenScore = Math.max(bestTokenScore, tokenSimilarity(candidate, target) * 3.8);
          }
          for (const target of toolTokens) {
            bestTokenScore = Math.max(bestTokenScore, tokenSimilarity(candidate, target) * 3.2);
          }
          for (const target of domainTokens) {
            bestTokenScore = Math.max(bestTokenScore, tokenSimilarity(candidate, target) * 2.4);
          }
          for (const target of summaryTokens) {
            bestTokenScore = Math.max(bestTokenScore, tokenSimilarity(candidate, target) * 1.6);
          }
        }

        if (bestTokenScore > 0) matchedTokens += 1;
        score += bestTokenScore;
      }

      if (searchable.includes(normalizedQuery)) {
        score += 2.5;
      }

      return { project, score, matchedTokens };
    })
    .filter((entry) => entry.matchedTokens === queryTokens.length || entry.score >= 5.2)
    .sort((a, b) => b.score - a.score || b.project.updatedAt.localeCompare(a.project.updatedAt));

  return scored.map((entry) => entry.project);
}

export function getAllTags(projects: Project[]): string[] {
  const counts = new Map<string, number>();
  for (const tag of projects.flatMap((p) => p.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .map(([tag]) => tag)
    .sort();
}
