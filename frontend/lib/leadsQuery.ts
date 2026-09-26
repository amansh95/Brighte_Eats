import type { LeadSortField, SortDirection } from "./types";

export const PAGE_SIZE = 10;

export type SearchParams = Record<string, string | string[] | undefined>;

export type LeadsView = {
  services: string[];
  sortBy: LeadSortField;
  sortDir: SortDirection;
  page: number;
};

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "name:asc", label: "Name A–Z" },
  { value: "name:desc", label: "Name Z–A" },
];

function list(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseLeadsView(params: SearchParams): LeadsView {
  const sortBy: LeadSortField = params.sort === "name" ? "name" : "createdAt";
  const sortDir: SortDirection = params.dir === "asc" ? "asc" : "desc";
  const page = Number(params.page ?? 1);
  return { services: list(params.service), sortBy, sortDir, page };
}

export function leadsViewToQuery(view: LeadsView): string {
  const query = new URLSearchParams();
  view.services.forEach((code) => query.append("service", code));
  if (view.sortBy !== "createdAt") query.set("sort", view.sortBy);
  if (view.sortDir !== "desc") query.set("dir", view.sortDir);
  if (view.page > 1) query.set("page", String(view.page));
  return query.toString();
}
