import { Suspense } from "react";
import { getServiceTypes } from "@/lib/api";
import { leadsViewToQuery, parseLeadsView, type SearchParams } from "@/lib/leadsQuery";
import Spinner from "../components/Spinner";
import LeadsFilters from "./LeadsFilters";
import LeadsTable from "./LeadsTable";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const view = parseLeadsView(await searchParams);
  const serviceTypes = await getServiceTypes();

  return (
    <>
      <h1>Leads</h1>
      <LeadsFilters view={view} serviceTypes={serviceTypes} />
      <Suspense key={leadsViewToQuery(view)} fallback={<Spinner label="Loading leads" />}>
        <LeadsTable view={view} />
      </Suspense>
    </>
  );
}
