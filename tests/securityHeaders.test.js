import { setSecurityHeaders } from "../api/_securityHeaders.js";

function createFakeRes() {
  const headers = {};
  return {
    setHeader(key, value) {
      headers[key] = value;
    },
    get headers() {
      return headers;
    },
  };
}

describe("setSecurityHeaders", () => {
  it("ajoute X-Content-Type-Options: nosniff", () => {
    const res = createFakeRes();
    setSecurityHeaders(res);
    expect(res.headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("ajoute X-Frame-Options: DENY", () => {
    const res = createFakeRes();
    setSecurityHeaders(res);
    expect(res.headers["X-Frame-Options"]).toBe("DENY");
  });
});


