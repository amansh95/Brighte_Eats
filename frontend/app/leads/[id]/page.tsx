import Link from "next/link";
import { getLead } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { leadsViewToQuery, parseLeadsView, type SearchParams } from "@/lib/leadsQuery";

export default async function LeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const backQuery = leadsViewToQuery(parseLeadsView(await searchParams));
  const lead = await getLead(id);

  return (
    <div className="narrow">
      <Link href={backQuery ? `/leads?${backQuery}` : "/leads"} className="back-link">
        ← Back to leads
      </Link>
      <div className="card">
        <h1>{lead.name}</h1>
        <dl className="details">
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </dd>
          <dt>Mobile</dt>
          <dd>
            <a href={`tel:${lead.mobile}`}>{lead.mobile}</a>
          </dd>
          <dt>Postcode</dt>
          <dd>{lead.postcode}</dd>
          <dt>Registered</dt>
          <dd>{formatDateTime(lead.createdAt)}</dd>
          <dt>Interested in</dt>
          <dd>
            <div className="tags">
              {lead.services.map((s) => (
                <span key={s.code} className="tag">
                  {s.label}
                </span>
              ))}
            </div>
          </dd>
        </dl>
      </div>
    </div>
  );
}
