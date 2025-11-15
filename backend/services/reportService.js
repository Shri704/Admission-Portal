// backend/services/reportService.js
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import Payment from "../models/Payment.js";
import Student from "../models/Student.js";

/**
 * Generate Excel report of payments
 */
export const generatePaymentExcelReport = async () => {
  const payments = await Payment.find().populate("studentId", "name email usn branch");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Payments");

  sheet.columns = [
    { header: "Student Name", key: "name", width: 25 },
    { header: "USN", key: "usn", width: 15 },
    { header: "Email", key: "email", width: 25 },
    { header: "Branch", key: "branch", width: 10 },
    { header: "Amount", key: "amount", width: 10 },
    { header: "Order ID", key: "orderId", width: 25 },
    { header: "Status", key: "status", width: 15 },
    { header: "Date", key: "createdAt", width: 20 },
  ];

  payments.forEach((p) =>
    sheet.addRow({
      name: p.studentId.name,
      usn: p.studentId.usn,
      email: p.studentId.email,
      branch: p.studentId.branch,
      amount: p.amount / 100,
      orderId: p.orderId,
      status: p.status,
      createdAt: p.createdAt.toLocaleString(),
    })
  );

  const filePath = path.join("reports", `payments_${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

/**
 * Generate PDF report of student statistics
 */
export const generateStudentPDFReport = async () => {
  const students = await Student.find();
  const doc = new PDFDocument();
  const filePath = path.join("reports", `students_${Date.now()}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text("Student Report", { align: "center" });
  doc.moveDown();

  students.forEach((s, i) => {
    doc
      .fontSize(12)
      .text(`${i + 1}. ${s.name} (${s.branch}) - Year ${s.year} - ${s.email}`);
  });

  doc.end();
  return filePath;
};
