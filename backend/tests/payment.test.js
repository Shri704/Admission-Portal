// backend/tests/payment.test.js
import request from "supertest";
import app from "../server.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup/dbSetup.js";

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("Payment API", () => {
  test("Rejects payment verification with invalid signature", async () => {
    const res = await request(app)
      .post("/api/payments/verify")
      .send({
        razorpay_order_id: "order_12345",
        razorpay_payment_id: "pay_fake",
        razorpay_signature: "wrong",
      });
    expect(res.statusCode).toBe(401);
  });
});
