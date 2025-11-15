// backend/utils/seedBranches.js
import Branch from "../models/Branch.js";
import { logInfo, logError } from "../services/loggerService.js";

const defaultBranches = [
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "ECE", name: "Electronics & Communication" },
  { code: "MECH", name: "Mechanical Engineering" },
  { code: "CIVIL", name: "Civil Engineering" },
  { code: "EEE", name: "Electrical & Electronics" },
  { code: "AI", name: "Artificial Intelligence" },
  { code: "IT", name: "Information Technology" },
];

export async function seedBranches() {
  try {
    logInfo("🌱 Seeding default branches...");
    
    for (const branchData of defaultBranches) {
      const existingBranch = await Branch.findOne({ code: branchData.code });
      if (!existingBranch) {
        await Branch.create({
          code: branchData.code,
          name: branchData.name,
          active: true,
        });
        logInfo(`✅ Created branch: ${branchData.code} - ${branchData.name}`);
      } else {
        logInfo(`ℹ️ Branch already exists: ${branchData.code}`);
      }
    }
    
    logInfo("✅ Branch seeding completed");
  } catch (error) {
    logError("❌ Failed to seed branches", error);
    throw error;
  }
}

