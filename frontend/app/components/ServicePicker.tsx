"use client";

import Link from "next/link";
import type { ServiceType } from "@/lib/types";
import { saveSelectedServices, useSelectedServices } from "@/lib/selection";
import ServiceIcon from "./ServiceIcon";

export default function ServicePicker({ serviceTypes }: { serviceTypes: ServiceType[] }) {
  const selected = useSelectedServices();

  function toggle(code: string) {
    saveSelectedServices(selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code]);
  }

  return (
    <>
      <div className="choice-grid">
        {serviceTypes.map((service) => {
          const isSelected = selected.includes(service.code);
          return (
            <button
              key={service.code}
              type="button"
              className={isSelected ? "choice-card selected" : "choice-card"}
              aria-pressed={isSelected}
              onClick={() => toggle(service.code)}
            >
              <span className="choice-check" aria-hidden="true">
                {isSelected ? "✓" : ""}
              </span>
              <ServiceIcon code={service.code} />
              <span className="choice-title">{service.label}</span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <Link href="/register" className="button button-block continue">
          Continue
        </Link>
      )}
    </>
  );
}
