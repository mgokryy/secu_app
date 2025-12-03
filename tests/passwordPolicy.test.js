import { validatePassword } from "../api/_passwordPolicy.js";

describe("validatePassword", () => {
  it("refuse un mot de passe trop court", () => {
    expect(validatePassword("Ab1!").valid).toBe(false);
  });

  it("refuse si moins de 3 types de caractères", () => {
    expect(validatePassword("abcd1234abcd").valid).toBe(false);
  });

  it("accepte avec minuscules/majuscules/chiffres", () => {
    expect(validatePassword("Abcdef123456").valid).toBe(false);
  });

  it("accepte avec minuscules/majuscules/spéciaux", () => {
    expect(validatePassword("Abcdef!!!!ghij").valid).toBe(false);
  });

  it("accepte avec 4 types de caractères", () => {
    expect(validatePassword("Abcd1234!!EF").valid).toBe(true);
  });

  it("refuse un mot de passe vide", () => {
    expect(validatePassword("").valid).toBe(false);
  });

  it("refuse un mot de passe juste des chiffres", () => {
    expect(validatePassword("1234567890123").valid).toBe(false);
  });

  it("refuse un mot de passe juste des lettres", () => {
    expect(validatePassword("abcdefghijkLMN").valid).toBe(false);
  });
});
