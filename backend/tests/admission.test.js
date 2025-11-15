// backend/tests/admission.test.js
import request from "supertest";
import app from "../server.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup/dbSetup.js";

let token;

beforeAll(async () => {
  await connectTestDB();
  const reg = await request(app).post("/api/auth/register").send({
    name: "Pallavi",
    email: "pallavi@example.com",
    password: "Pass@123",
    branch: "CSE",
    year: 1,
  });
  token = reg.body.data.token;
});
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("Admission API", () => {
  test("Apply for admission", async () => {
    const res = await request(app)
      .post("/api/admissions/apply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        year: 1,
        branch: "CSE",
        documents: [],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.status).toBe("pending");
  });
});
