import { GraphQLError } from "graphql";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AU_MOBILE = /^(?:04\d{8}|\+614\d{8})$/;
const AU_POSTCODE = /^\d{4}$/;

export function assertValidRegisterInput(input: {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
}) {
  if (!input.name.trim()) {
    throw new GraphQLError("Enter a name.", { extensions: { code: "BAD_USER_INPUT" } });
  }
  if (!EMAIL.test(input.email)) {
    throw new GraphQLError("Enter a valid email address.", { extensions: { code: "BAD_USER_INPUT" } });
  }
  if (!AU_MOBILE.test(input.mobile)) {
    throw new GraphQLError("Enter a valid Australian mobile number, like 0412345678.", { extensions: { code: "BAD_USER_INPUT" } });
  }
  if (!AU_POSTCODE.test(input.postcode)) {
    throw new GraphQLError("Postcode must be 4 digits.", { extensions: { code: "BAD_USER_INPUT" } });
  }
}
