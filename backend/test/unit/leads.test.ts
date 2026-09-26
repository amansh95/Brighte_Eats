import { expect } from "chai";
import { getLead, getLeads, getServiceTypes, registerLead } from "../../src/leads.js";
import { prisma } from "../../src/prisma.js";
import { clearLeads } from "../helpers.js";

describe("leads (unit)", () => {
  after(clearLeads);

  describe("registerLead", () => {
    describe("GIVEN a valid request to register a lead", () => {
      describe("GIVEN a lead is new and doesnt exist", () => {
        let lead: Awaited<ReturnType<typeof registerLead>>;

        before(async () => {
          lead = await registerLead({
            name: "Ada Lovelace",
            email: "ada@example.com",
            mobile: "0412345678",
            postcode: "2000",
            services: ["delivery"],
          });
        });

        after(clearLeads);

        it("returns the lead's name", () => {
          expect(lead.name).to.equal("Ada Lovelace");
        });

        it("returns the lead's services", () => {
          expect(lead.services.map((s) => s.code)).to.deep.equal(["delivery"]);
        });
      });

      describe("GIVEN a lead already exists", () => {
        let first: Awaited<ReturnType<typeof registerLead>>;
        let second: Awaited<ReturnType<typeof registerLead>>;

        before(async () => {
          first = await registerLead({
            name: "Grace Hopper",
            email: "Grace@Example.com",
            mobile: "0412345678",
            postcode: "2000",
            services: ["delivery"],
          });
          second = await registerLead({
            name: "Grace Hopper",
            email: "grace@example.com",
            mobile: "0412345678",
            postcode: "2000",
            services: ["payment"],
          });
        });

        after(clearLeads);

        it("returns the same lead id", () => {
          expect(second.id).to.equal(first.id);
        });

        it("merges the new service with the existing ones", () => {
          expect(second.services.map((s) => s.code).sort()).to.deep.equal(["delivery", "payment"]);
        });
      });

      describe("GIVEN the request references a newly added service type", () => {
        let customServiceTypeId: number;
        let lead: Awaited<ReturnType<typeof registerLead>>;

        before(async () => {
          const custom = await prisma.serviceType.create({ data: { code: "custom", label: "Custom" } });
          customServiceTypeId = custom.id;
          lead = await registerLead({
            name: "Alan Turing",
            email: "alan@example.com",
            mobile: "0412345678",
            postcode: "2000",
            services: ["custom"],
          });
        });

        after(async () => {
          await clearLeads();
          await prisma.serviceType.delete({ where: { id: customServiceTypeId } });
        });

        it("accepts the new service type with no code change", () => {
          expect(lead.services.map((s) => s.code)).to.deep.equal(["custom"]);
        });
      });
    });

    describe("GIVEN an invalid request to register a lead", () => {
      describe("GIVEN the request includes an unknown service", () => {
        let lead: Awaited<ReturnType<typeof registerLead>>;

        before(async () => {
          lead = await registerLead({
            name: "Not Real",
            email: "notreal@example.com",
            mobile: "0412345678",
            postcode: "2000",
            services: ["not-a-real-service"],
          });
        });

        after(clearLeads);

        it("ignores the unknown service", () => {
          expect(lead.services).to.deep.equal([]);
        });
      });
    });
  });

  describe("getLeads", () => {
    describe("GIVEN a valid request to get leads", () => {
      describe("GIVEN the lead exists", () => {
        let page: Awaited<ReturnType<typeof getLeads>>;

        before(async () => {
          await registerLead({ name: "A", email: "a@example.com", mobile: "0412345671", postcode: "2000", services: ["delivery"] });
          await registerLead({ name: "B", email: "b@example.com", mobile: "0412345672", postcode: "2000", services: ["payment"] });
          page = await getLeads({ limit: 10, offset: 0, services: ["delivery"] });
        });

        after(clearLeads);

        it("returns only the matching lead", () => {
          expect(page.totalCount).to.equal(1);
        });

        it("returns the matching lead's name", () => {
          expect(page.items[0].name).to.equal("A");
        });
      });

      describe("GIVEN the lead doesnt exist", () => {
        let page: Awaited<ReturnType<typeof getLeads>>;

        before(async () => {
          page = await getLeads({ limit: 10, offset: 0, services: ["delivery"] });
        });

        after(clearLeads);

        it("returns a total count of zero", () => {
          expect(page.totalCount).to.equal(0);
        });

        it("returns no items", () => {
          expect(page.items).to.deep.equal([]);
        });
      });
    });
  });

  describe("getLead", () => {
    describe("GIVEN a valid request to get a lead", () => {
      describe("GIVEN the lead exists", () => {
        let created: Awaited<ReturnType<typeof registerLead>>;
        let lead: Awaited<ReturnType<typeof getLead>>;

        before(async () => {
          created = await registerLead({
            name: "Katherine Johnson",
            email: "katherine@example.com",
            mobile: "0412345678",
            postcode: "2000",
            services: ["delivery"],
          });
          lead = await getLead(created.id);
        });

        after(clearLeads);

        it("returns the lead", () => {
          expect(lead?.id).to.equal(created.id);
        });
      });

      describe("GIVEN the lead doesnt exist", () => {
        let lead: Awaited<ReturnType<typeof getLead>>;

        before(async () => {
          lead = await getLead("00000000-0000-0000-0000-000000000000");
        });

        it("returns null", () => {
          expect(lead).to.equal(null);
        });
      });
    });
  });

  describe("getServiceTypes", () => {
    describe("GIVEN the seeded service types", () => {
      let types: Awaited<ReturnType<typeof getServiceTypes>>;

      before(async () => {
        types = await getServiceTypes();
      });

      it("returns the seeded codes", () => {
        expect(types.map((t) => t.code)).to.include.members(["delivery", "pick-up", "payment"]);
      });
    });
  });
});
