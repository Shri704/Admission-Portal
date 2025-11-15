// backend/tests/student.test.js
import request from "supertest";
import app from "../server.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup/dbSetup.js";

let token;

beforeAll(async () => {
  await connectTestDB();
  const res = await request(app).post("/api/auth/register").send({
    name: "Aditi",
    email: "aditi@example.com",
    password: "pass1234",
    branch: "IT",
    year: 1,
  });
  token = res.body.data.token;
});
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("Student Routes", () => {
  test("Fetch student profile", async () => {
    const res = await request(app)
      .get("/api/students/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Aditi");
  });
});
