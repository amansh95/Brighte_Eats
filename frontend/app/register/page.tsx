import Link from "next/link";
import { getServiceTypes } from "@/lib/api";
import RegisterForm from "../components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const serviceTypes = await getServiceTypes();

  return (
    <>
      <Link href="/" className="back-link">
        ‹ Back
      </Link>
      <div className="panel">
        <RegisterForm serviceTypes={serviceTypes} />
      </div>
    </>
  );
}
