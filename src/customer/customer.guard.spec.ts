import { CustomerGuard } from "./customer.guard";

describe("CustomerGuard", () => {
  it("should be defined", () => {
    expect(new CustomerGuard()).toBeDefined();
  });
});
