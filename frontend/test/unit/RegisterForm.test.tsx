import { expect } from "chai";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegisterForm from "../../app/components/RegisterForm";
import type { ServiceType } from "../../lib/types";

const serviceTypes: ServiceType[] = [{ code: "delivery", label: "Delivery" }];
const originalFetch = globalThis.fetch;

function selectDelivery() {
  localStorage.setItem("brighte-eats:services", JSON.stringify(["delivery"]));
}

function fillForm() {
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Mobile phone number"), { target: { value: "0412345678" } });
  fireEvent.change(screen.getByLabelText("Postcode"), { target: { value: "2000" } });
}

describe("RegisterForm", () => {
  describe("GIVEN a valid submission", () => {
    before(async () => {
      selectDelivery();
      globalThis.fetch = (async () =>
        new Response(
          JSON.stringify({
            data: {
              register: {
                id: "1",
                name: "Ada Lovelace",
                email: "ada@example.com",
                mobile: "0412345678",
                postcode: "2000",
                createdAt: new Date().toISOString(),
                services: [{ code: "delivery", label: "Delivery" }],
              },
            },
          }),
          { status: 200 },
        )) as typeof fetch;

      render(<RegisterForm serviceTypes={serviceTypes} />);
      fillForm();
      fireEvent.click(screen.getByRole("button", { name: "Register interest" }));
      await screen.findByRole("status");
    });

    after(() => {
      cleanup();
      localStorage.clear();
      globalThis.fetch = originalFetch;
    });

    it("shows the thank-you heading", () => {
      expect(screen.getByRole("heading", { name: "Thanks, Ada!" })).to.exist;
    });

    it("mentions the chosen service", () => {
      expect(screen.getByRole("status").textContent).to.include("delivery");
    });
  });

  describe("GIVEN the form is submitted empty", () => {
    before(async () => {
      render(<RegisterForm serviceTypes={serviceTypes} />);
      fireEvent.click(screen.getByRole("button", { name: "Register interest" }));
      await waitFor(() => screen.getByText("Enter your name."));
    });

    after(cleanup);

    it("shows a name error", () => {
      expect(screen.getByText("Enter your name.")).to.exist;
    });

    it("shows an email error", () => {
      expect(screen.getByText("Enter a valid email address.")).to.exist;
    });

    it("shows a mobile error", () => {
      expect(screen.getByText("Enter an Australian mobile, like 0412 345 678.")).to.exist;
    });

    it("shows a postcode error", () => {
      expect(screen.getByText("Postcode must be 4 digits.")).to.exist;
    });
  });

  describe("GIVEN the API call fails", () => {
    before(async () => {
      selectDelivery();
      globalThis.fetch = (async () => {
        throw new Error("network down");
      }) as typeof fetch;

      render(<RegisterForm serviceTypes={serviceTypes} />);
      fillForm();
      fireEvent.click(screen.getByRole("button", { name: "Register interest" }));
      await screen.findByRole("alert");
    });

    after(() => {
      cleanup();
      localStorage.clear();
      globalThis.fetch = originalFetch;
    });

    it("shows an error banner", () => {
      expect(screen.getByRole("alert").textContent).to.equal("We couldn't reach the server.");
    });
  });
});
