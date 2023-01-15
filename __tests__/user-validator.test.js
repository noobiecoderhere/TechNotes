const { isValidCreateUserReq } = require("../utils/validators/user-validator");

describe("Check create user request validity", () => {
  it("Returns true for valid requests", () => {
    expect(isValidCreateUserReq("krishna", "krishna", ["Employee"])).toBe(true);
  });

  it("Invalid username", () => {
    expect(isValidCreateUserReq("", "krishna", ["Employee"])).toBe(false);
  });

  it("Invalid password", () => {
    expect(isValidCreateUserReq("krishna", "", ["Employee"])).toBe(false);
  });

  it("Invalid role type", () => {
    expect(isValidCreateUserReq("krishna", "krishna", "Employee")).toBe(false);
  });

  it("Empty role array", () => {
    expect(isValidCreateUserReq("krishna", "krishna", [])).toBe(false);
  });

  it("Invalid role", () => {
    expect(isValidCreateUserReq("krishna", "krishna", ["hi"])).toBe(false);
  });
});
