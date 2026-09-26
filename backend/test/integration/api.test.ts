import { expect } from "chai";
import type { AddressInfo } from "node:net";
import { createServer } from "../../src/server.js";
import { clearLeads } from "../helpers.js";

describe("API (integration)", () => {
  let baseUrl: string;
  const server = createServer();

  before(async () => {
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    await clearLeads();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  async function graphql(query: string, variables?: Record<string, unknown>) {
    const res = await fetch(`${baseUrl}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    return { status: res.status, body: await res.json() };
  }

  const REGISTER_MUTATION = `mutation ($input: RegisterInput!) {
    register(input: $input) { id name services { code } }
  }`;

  describe("register mutation", () => {
    describe("GIVEN a valid request to register a lead", () => {
      let result: Awaited<ReturnType<typeof graphql>>;

      before(async () => {
        result = await graphql(REGISTER_MUTATION, {
          input: { name: "Rest Tester", email: "rest@example.com", mobile: "0412345678", postcode: "2000", services: ["delivery"] },
        });
      });

      after(clearLeads);

      it("returns 200", () => {
        expect(result.status).to.equal(200);
      });

      it("returns the lead's name", () => {
        expect(result.body.data.register.name).to.equal("Rest Tester");
      });

      it("returns the lead's services", () => {
        expect(result.body.data.register.services).to.deep.equal([{ code: "delivery" }]);
      });
    });

    describe("GIVEN an invalid request to register a lead", () => {
      let result: Awaited<ReturnType<typeof graphql>>;

      before(async () => {
        result = await graphql(`mutation { register(input: {}) { id } }`);
      });

      it("returns a GraphQL error", () => {
        expect(result.body.errors).to.exist;
      });

      it("returns no data", () => {
        expect(result.body.data).to.equal(undefined);
      });
    });
  });

  describe("GET /leads", () => {
    describe("GIVEN a valid request to get leads", () => {
      describe("GIVEN the lead exists", () => {
        let body: { totalCount: number; items: { name: string }[] };
        let status: number;

        before(async () => {
          await graphql(REGISTER_MUTATION, {
            input: { name: "Rest Tester", email: "rest@example.com", mobile: "0412345678", postcode: "2000", services: ["delivery"] },
          });
          const res = await fetch(`${baseUrl}/leads?limit=5`);
          status = res.status;
          body = await res.json();
        });

        after(clearLeads);

        it("returns 200", () => {
          expect(status).to.equal(200);
        });

        it("returns a total count of one", () => {
          expect(body.totalCount).to.equal(1);
        });

        it("returns the lead's name", () => {
          expect(body.items[0].name).to.equal("Rest Tester");
        });
      });

      describe("GIVEN the lead doesnt exist", () => {
        let body: { totalCount: number; items: unknown[] };

        before(async () => {
          const res = await fetch(`${baseUrl}/leads?limit=5`);
          body = await res.json();
        });

        it("returns a total count of zero", () => {
          expect(body.totalCount).to.equal(0);
        });

        it("returns no items", () => {
          expect(body.items).to.deep.equal([]);
        });
      });
    });
  });

  describe("GET /leads/:id", () => {
    describe("GIVEN a valid request to get a lead", () => {
      describe("GIVEN the lead exists", () => {
        let created: { id: string };
        let status: number;
        let body: { id: string };

        before(async () => {
          const registerResult = await graphql(REGISTER_MUTATION, {
            input: { name: "Rest Tester", email: "rest@example.com", mobile: "0412345678", postcode: "2000", services: ["delivery"] },
          });
          created = registerResult.body.data.register;
          const res = await fetch(`${baseUrl}/leads/${created.id}`);
          status = res.status;
          body = await res.json();
        });

        after(clearLeads);

        it("returns 200", () => {
          expect(status).to.equal(200);
        });

        it("returns the lead", () => {
          expect(body.id).to.equal(created.id);
        });
      });

      describe("GIVEN the lead doesnt exist", () => {
        let status: number;

        before(async () => {
          const res = await fetch(`${baseUrl}/leads/00000000-0000-0000-0000-000000000000`);
          status = res.status;
        });

        it("returns 404", () => {
          expect(status).to.equal(404);
        });
      });
    });
  });
});
