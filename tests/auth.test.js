import { verifyAuth, verifyAdmin } from "../api/_auth.js";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken");

function createReq(headers = {}) {
  return { headers, user: undefined };
}

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
    },
  };
}

describe("verifyAuth", () => {
  it("retourne 401 si aucun header Authorization", () => {
    const req = createReq();
    const res = createRes();

    const result = verifyAuth(req, res);

    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token manquant");
  });

  it("retourne 401 si le token est invalide", () => {
    const req = createReq({ authorization: "Bearer invalid" });
    const res = createRes();

    jwt.verify.mockImplementation(() => {
      throw new Error("invalid");
    });

    const result = verifyAuth(req, res);

    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token invalide");
  });

  it("ajoute req.user si le token est valide", () => {
    const req = createReq({ authorization: "Bearer abc" });
    const res = createRes();

    const payload = { id: 1, role: "USER" };
    jwt.verify.mockReturnValue(payload);

    const result = verifyAuth(req, res);

    expect(result).toEqual(payload);
    expect(req.user).toEqual(payload);
    expect(res.statusCode).toBe(200);
  });
});

describe("verifyAdmin", () => {
  it("refuse si verifyAuth échoue", () => {
    const req = createReq();
    const res = createRes();

    const result = verifyAdmin(req, res);

    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
  });

  it("refuse si role !== ADMIN", () => {
    const req = createReq({ authorization: "Bearer abc" });
    const res = createRes();

    jwt.verify.mockReturnValue({ id: 1, role: "USER" });

    const result = verifyAdmin(req, res);

    expect(result).toBeNull();
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain("Accès refusé");
  });

  it("accepte si role === ADMIN", () => {
    const req = createReq({ authorization: "Bearer abc" });
    const res = createRes();

    const payload = { id: 1, role: "ADMIN" };
    jwt.verify.mockReturnValue(payload);

    const result = verifyAdmin(req, res);

    expect(result).toEqual(payload);
    expect(req.user).toEqual(payload);
    expect(res.statusCode).toBe(200);
  });
});


