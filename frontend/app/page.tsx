import { getServiceTypes } from "@/lib/api";
import ServicePicker from "./components/ServicePicker";

export const dynamic = "force-dynamic";

export default async function ChooseServicesPage() {
  const serviceTypes = await getServiceTypes();

  return (
    <div className="panel">
      <p className="eyebrow">Brighte Eats is coming soon</p>
      <h1 className="display">What are you interested in?</h1>
      <p className="panel-intro">Choose one or more services, then continue to register your interest.</p>
      <ServicePicker serviceTypes={serviceTypes} />
    </div>
  );
}
