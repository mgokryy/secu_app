import leaderboardHandler from "../api/scores/leaderboard/[grid_id].js";
import * as db from "../api/_db.js";

vi.mock("../api/_db.js");

function createReq(grid_id, method = "GET") {
  return { method, query: { grid_id } };
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
    end() {
      return this;
    },
  };
}

describe("GET /api/scores/leaderboard/:grid_id", () => {
  it("refuse si méthode != GET", async () => {
    const req = createReq(1, "POST");
    const res = createRes();

    await leaderboardHandler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("retourne les meilleurs scores groupés par user", async () => {
    const req = createReq(1, "GET");
    const res = createRes();

    const fakeRows = [
      { name: "Alice", user_id: 1, best_score: 900, best_duration: 40, first_time: "2025-01-01" },
      { name: "Bob", user_id: 2, best_score: 800, best_duration: 50, first_time: "2025-01-02" },
    ];

    const fakePool = {
      query: vi.fn().mockResolvedValueOnce([fakeRows]),
    };
    db.getPool.mockReturnValue(fakePool);

    await leaderboardHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe("Alice");
  });
});