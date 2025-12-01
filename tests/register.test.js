import handler from "../api/register.js";
import * as db from "../api/_db.js";
import * as policy from "../api/_passwordPolicy.js";
import bcrypt from "bcrypt";

vi.mock("../api/_db.js");
vi.mock("../api/_passwordPolicy.js");
vi.mock("bcrypt");

function createReq(body = {}) {
  return { method: "POST", body };
}

function createRes() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
  };
}

describe("POST /api/register handler", () => {
  it("refuse si champs manquants", async () => {
    const req = createReq({ email: "", name: "", password: "" });
    const res = createRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Champs obligatoires");
  });

  it("refuse si email invalide", async () => {
    const req = createReq({
      email: "invalid",
      name: "Test",
      password: "Abcd1234!!EF",
      consent: true,
    });
    const res = createRes();

    policy.isPasswordStrong.mockReturnValue(true);

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email invalide");
  });

  it("refuse si mot de passe trop faible", async () => {
    const req = createReq({
      email: "test@example.com",
      name: "Test",
      password: "weak",
      consent: true,
    });
    const res = createRes();

    policy.isPasswordStrong.mockReturnValue(false);

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Mot de passe trop faible");
  });

  it("refuse sans consentement explicite", async () => {
    const req = createReq({
      email: "test@example.com",
      name: "Test",
      password: "Abcd1234!!EF",
      consent: false,
    });
    const res = createRes();

    policy.isPasswordStrong.mockReturnValue(true);

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Le consentement est obligatoire");
  });

  it("refuse si email déjà utilisé", async () => {
    const req = createReq({
      email: "exists@example.com",
      name: "Test",
      password: "Abcd1234!!EF",
      consent: true,
    });
    const res = createRes();

    policy.isPasswordStrong.mockReturnValue(true);

    const fakePool = {
      query: vi.fn()
        // SELECT id FROM users WHERE email = ?
        .mockResolvedValueOnce([[{ id: 1 }]])
    };
    db.getPool.mockReturnValue(fakePool);

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email déjà utilisé");
  });

  it("crée un utilisateur valide", async () => {
    const req = createReq({
      email: "new@example.com",
      name: "New",
      password: "Abcd1234!!EF",
      consent: true,
    });
    const res = createRes();

    policy.isPasswordStrong.mockReturnValue(true);
    bcrypt.hash.mockResolvedValue("hashedPassword");

    const fakePool = {
      query: vi
        .fn()
        // SELECT id FROM users WHERE email = ?
        .mockResolvedValueOnce([[]])
        // INSERT INTO users ...
        .mockResolvedValueOnce([{ insertId: 1 }]),
    };
    db.getPool.mockReturnValue(fakePool);

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Inscription réussie");
    expect(fakePool.query).toHaveBeenCalledTimes(2);
  });
});