import { expect } from "chai";
import { render, screen } from "@testing-library/react";
import RegisterForm from "../../app/components/RegisterForm";

describe("smoke", () => {
  it("renders", () => {
    render(<RegisterForm serviceTypes={[{ code: "delivery", label: "Delivery" }]} />);
    expect(screen.getByLabelText("Full name")).to.exist;
  });
});
