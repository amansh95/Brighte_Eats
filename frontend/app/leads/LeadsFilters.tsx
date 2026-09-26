"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ServiceType } from "@/lib/types";
import { SORT_OPTIONS, leadsViewToQuery, type LeadsView } from "@/lib/leadsQuery";

export default function LeadsFilters({ view, serviceTypes }: { view: LeadsView; serviceTypes: ServiceType[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function navigate(next: Partial<LeadsView>) {
    const query = leadsViewToQuery({ ...view, ...next, page: 1 });
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname));
  }

  function toggleService(code: string, checked: boolean) {
    navigate({ services: checked ? [...view.services, code] : view.services.filter((c) => c !== code) });
  }

  return (
    <div className="filters" aria-busy={pending}>
      <div className="filter-group" role="group" aria-label="Filter by service">
        <span className="label">Services</span>
        {serviceTypes.map((service) => (
          <label key={service.code} className="chip">
            <input
              type="checkbox"
              checked={view.services.includes(service.code)}
              onChange={(e) => toggleService(service.code, e.target.checked)}
            />
            {service.label}
          </label>
        ))}
        {view.services.length > 0 && (
          <button type="button" className="link-button" onClick={() => navigate({ services: [] })}>
            Clear
          </button>
        )}
      </div>
      <label className="filter-group">
        <span className="label">Sort</span>
        <select
          value={`${view.sortBy}:${view.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split(":") as [LeadsView["sortBy"], LeadsView["sortDir"]];
            navigate({ sortBy, sortDir });
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
