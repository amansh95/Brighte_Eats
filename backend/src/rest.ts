import type { IncomingMessage, ServerResponse } from "node:http";
import { getLead, getLeads, type LeadSortField, type SortDirection } from "./leads.js";

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function parseSortBy(value: string | null): LeadSortField {
  return value === "name" ? "NAME" : "CREATED_AT";
}

function parseSortDir(value: string | null): SortDirection {
  return value === "asc" ? "ASC" : "DESC";
}

export async function handleRestRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] !== "leads") return false;

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return true;
  }

  if (segments.length === 1) {
    const page = await getLeads({
      limit: Number(url.searchParams.get("limit") ?? 20),
      offset: Number(url.searchParams.get("offset") ?? 0),
      services: url.searchParams.getAll("service"),
      sortBy: parseSortBy(url.searchParams.get("sortBy")),
      sortDir: parseSortDir(url.searchParams.get("sortDir")),
    });
    sendJson(res, 200, page);
    return true;
  }

  if (segments.length === 2) {
    const lead = await getLead(segments[1]);
    if (!lead) {
      sendJson(res, 404, { error: "Lead not found" });
      return true;
    }
    sendJson(res, 200, lead);
    return true;
  }

  return false;
}
