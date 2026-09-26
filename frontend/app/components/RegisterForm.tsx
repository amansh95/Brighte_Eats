"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { registerLead } from "@/app/actions";
import { saveSelectedServices, useSelectedServices } from "@/lib/selection";
import type { Lead, ServiceType } from "@/lib/types";
import { normalizeRegistration, validateRegistration, type FieldErrors } from "@/lib/validation";

type Contact = { name: string; email: string; mobile: string; postcode: string };

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; lead: Lead };

const emptyContact: Contact = { name: "", email: "", mobile: "", postcode: "" };

export default function RegisterForm({ serviceTypes }: { serviceTypes: ServiceType[] }) {
  const selectedCodes = useSelectedServices();
  const selected = serviceTypes.filter((s) => selectedCodes.includes(s.code));
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const submitting = status.kind === "submitting";

  function updateContact(field: keyof Contact, value: string) {
    setContact((c) => ({ ...c, [field]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = normalizeRegistration({ ...contact, services: selectedCodes });
    const clientErrors = validateRegistration(input);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setStatus({ kind: "idle" });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const result = await registerLead(input);
      if (result.ok) {
        saveSelectedServices([]);
        setStatus({ kind: "success", lead: result.lead });
      } else {
        setErrors(result.fieldErrors);
        setStatus({ kind: "error", message: result.message });
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="state-success" role="status">
        <p className="eyebrow">You&apos;re on the list</p>
        <h1 className="display">Thanks, {status.lead.name.split(" ")[0]}!</h1>
        <p>
          We&apos;ve registered your interest in {status.lead.services.map((s) => s.label.toLowerCase()).join(", ")}.
          We&apos;ll email {status.lead.email} when Brighte Eats launches near {status.lead.postcode}.
        </p>
        <div className="actions">
          <Link href="/" className="button">
            Register someone else
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="form">
      <p className="eyebrow">{selected.map((s) => s.label).join(" · ")}</p>
      <h1 className="display">Tell us about you</h1>
      <p className="panel-intro">We&apos;ll let you know as soon as Brighte Eats is available in your area.</p>

      {status.kind === "error" && (
        <div className="banner banner-error" role="alert">
          {status.message}
        </div>
      )}

      <fieldset disabled={submitting}>
        <TextField id="name" label="Full name" autoComplete="name" value={contact.name} error={errors.name} onChange={(v) => updateContact("name", v)} />
        <TextField id="email" label="Email" type="email" autoComplete="email" value={contact.email} error={errors.email} onChange={(v) => updateContact("email", v)} />
        <TextField id="mobile" label="Mobile phone number" type="tel" autoComplete="tel" placeholder="0412 345 678" value={contact.mobile} error={errors.mobile} onChange={(v) => updateContact("mobile", v)} />
        <TextField id="postcode" label="Postcode" inputMode="numeric" autoComplete="postal-code" maxLength={4} value={contact.postcode} error={errors.postcode} onChange={(v) => updateContact("postcode", v)} />

        <button type="submit" className="button button-block">
          {submitting ? "Registering…" : "Register interest"}
        </button>
      </fieldset>
      <p className="fine-print">
        We&apos;re collecting your details so we can contact you about Brighte Eats. We won&apos;t share them with anyone else.
      </p>
    </form>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  ...inputProps
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <div className={error ? "field has-error" : "field"}>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} {...inputProps} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
