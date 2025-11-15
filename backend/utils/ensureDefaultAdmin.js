import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { logInfo, logError } from "../services/loggerService.js";

/**
 * Ensure a default admin account exists using the provided credentials.
 * If the account exists, it'll sync the name and password when needed.
 *
 * @param {Object} options
 * @param {string} options.name
 * @param {string} options.email
 * @param {string} options.password
 */
export async function ensureDefaultAdmin({ name, email, password }) {
  try {
    if (!email || !password) {
      logInfo("Skipping default admin setup: email/password not provided.");
      return;
    }

    const normalizedEmail = email.toLowerCase();
    let admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      admin = await Admin.create({
        name: name || "Portal Super Admin",
        email: normalizedEmail,
        password,
      });
      logInfo(`✅ Default admin created with email ${normalizedEmail}`);
      return;
    }

    let updated = false;

    if (name && admin.name !== name) {
      admin.name = name;
      updated = true;
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      admin.password = password;
      updated = true;
    }

    if (updated) {
      await admin.save();
      logInfo(`✅ Default admin credentials synced for ${normalizedEmail}`);
    } else {
      logInfo(`ℹ️ Default admin already up to date for ${normalizedEmail}`);
    }
  } catch (error) {
    logError("❌ Failed to ensure default admin account", error);
    // Don't throw - let the server start even if admin creation fails
    // The admin can be created manually or the issue can be resolved later
    return;
  }
}

