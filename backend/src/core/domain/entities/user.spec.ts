import { describe, expect, it } from "vitest";
import { User } from "./user.entity";

describe("user entity", () => {
  it("should create new user", () => {
    const user = new User({
      firstName: "Jonh",
      lastName: "Bia",
      email: "example@gmail.com",
      password: "thisPasswordHave6Characters",
    });

    expect(user).toBeInstanceOf(User);
  });

  it("should trigger an error because the password is invalid", () => {
    const user = new User({
      firstName: "Jonh",
      lastName: "Bi",
      email: "example@gmail.com",
      password: "not",
    });
  });
});
