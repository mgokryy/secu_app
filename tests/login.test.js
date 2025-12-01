import handler from "../api/login.js";
import * as db from "../api/_db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

vi.mock("../api/_db.js");
vi.mock("bcrypt");
vi.mock("jsonwebtoken");

function createReq(body = {}) {
  return { method: "POST", body, headers: {} };
}

function createRes() {
  const res = {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this; // nécessaire pour res.status(...).end()
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end() {
      return this;
    },
  };
  return res;
}

describe("POST /api/login handler", () => {
  it("refuse si méthode != POST", async () => {
    const req = { method: "GET", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("retourne 401 si email inconnu", async () => {
    const req = createReq({ email: "unknown@example.com", password: "Test1234!!Ab" });
    const res = createRes();

    const fakePool = {
      query: vi.fn().mockResolvedValueOnce([[]]),
    };
    db.getPool.mockReturnValue(fakePool);

    await handler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Identifiants invalides");
  });

  it("retourne 401 si mot de passe invalide", async () => {
    const req = createReq({ email: "user@example.com", password: "wrong" });
    const res = createRes();

    const fakePool = {
      query: vi.fn().mockResolvedValueOnce([[{ id: 1, role: "USER", password_hash: "hash" }]]),
    };
    db.getPool.mockReturnValue(fakePool);
    bcrypt.compare.mockResolvedValue(false);

    await handler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Identifiants invalides");
  });

  it("connecte et renvoie un cookie sécurisé en cas de succès", async () => {
    const req = createReq({ email: "user@example.com", password: "Valid1234!!" });
    const res = createRes();

    const fakePool = {
      query: vi.fn().mockResolvedValueOnce([[{ id: 1, role: "USER", password_hash: "hash", name: "User" }]]),
    };
    db.getPool.mockReturnValue(fakePool);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("dummyToken");

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("dummyToken");
    expect(res.body.role).toBe("USER");
    expect(res.headers["Set-Cookie"]).toContain("jwt=dummyToken");
    expect(res.headers["Set-Cookie"]).toContain("HttpOnly");
    expect(res.headers["Set-Cookie"]).toContain("SameSite=Strict");
  });
});