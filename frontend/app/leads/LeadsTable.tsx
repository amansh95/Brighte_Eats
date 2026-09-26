import Link from "next/link";
import { getLeads } from "@/lib/api";
import { PAGE_SIZE, leadsViewToQuery, type LeadsView } from "@/lib/leadsQuery";
import { formatDate } from "@/lib/format";

export default async function LeadsTable({ view }: { view: LeadsView }) {
  const page = await getLeads({
    limit: PAGE_SIZE,
    offset: (view.page - 1) * PAGE_SIZE,
    services: view.services,
    sortBy: view.sortBy,
    sortDir: view.sortDir,
  });
  const totalPages = Math.max(1, Math.ceil(page.totalCount / PAGE_SIZE));
  const listQuery = leadsViewToQuery(view);

  const first = page.offset + 1;
  const last = page.offset + page.items.length;

  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Postcode</th>
              <th scope="col">Services</th>
              <th scope="col">Registered</th>
            </tr>
          </thead>
          <tbody>
            {page.items.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <Link href={`/leads/${lead.id}${listQuery ? `?${listQuery}` : ""}`} className="row-link">
                    {lead.name}
                  </Link>
                </td>
                <td>{lead.email}</td>
                <td>{lead.postcode}</td>
                <td>
                  <div className="tags">
                    {lead.services.map((s) => (
                      <span key={s.code} className="tag">
                        {s.label}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="pagination" aria-label="Pagination">
        <span>
          {first}–{last} of {page.totalCount}
        </span>
        <div className="actions">
          <PageLink view={view} page={view.page - 1} disabled={view.page <= 1}>
            Previous
          </PageLink>
          <span>
            Page {view.page} of {totalPages}
          </span>
          <PageLink view={view} page={view.page + 1} disabled={view.page >= totalPages}>
            Next
          </PageLink>
        </div>
      </nav>
    </>
  );
}

function PageLink({
  view,
  page,
  disabled,
  children,
}: {
  view: LeadsView;
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return <span className="button button-secondary button-disabled" aria-disabled="true">{children}</span>;
  }
  const query = leadsViewToQuery({ ...view, page });
  return (
    <Link href={query ? `/leads?${query}` : "/leads"} className="button button-secondary">
      {children}
    </Link>
  );
}
