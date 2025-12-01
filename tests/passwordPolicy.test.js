import { isPasswordStrong } from "../api/_passwordPolicy.js";

describe("isPasswordStrong", () => {
  it("refuse un mot de passe trop court", () => {
    expect(isPasswordStrong("Ab1!")).toBe(false);
  });

  it("refuse si moins de 3 types de caractères", () => {
    // uniquement minuscules + chiffres
    expect(isPasswordStrong("abcd1234abcd")).toBe(false);
  });

  it("accepte avec minuscules/majuscules/chiffres", () => {
    expect(isPasswordStrong("Abcdef123456")).toBe(true);
  });

  it("accepte avec minuscules/majuscules/spéciaux", () => {
    expect(isPasswordStrong("Abcdef!!!!ghij")).toBe(true);
  });

  it("accepte avec 4 types de caractères", () => {
    expect(isPasswordStrong("Abcd1234!!EF")).toBe(true);
  });

  it("refuse un mot de passe vide", () => {
    expect(isPasswordStrong("")).toBe(false);
  });

  it("refuse un mot de passe juste des chiffres", () => {
    expect(isPasswordStrong("1234567890123")).toBe(false);
  });

  it("refuse un mot de passe juste des lettres", () => {
    expect(isPasswordStrong("abcdefghijkLMN")).toBe(false);
  });
});


