# MongoDB Connection Setup Guide

## Current Error: Authentication Failed

The error `bad auth : Authentication failed` means your MongoDB username or password is incorrect.

## How to Fix

### For MongoDB Atlas (Cloud):

1. **Get Your Connection String:**
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com)
   - Go to your cluster → Click **"Connect"**
   - Choose **"Connect your application"**
   - Copy the connection string

2. **URL Encode Special Characters:**
   If your password contains special characters, you MUST encode them:
   
   | Character | Encoded |
   |-----------|---------|
   | `@` | `%40` |
   | `:` | `%3A` |
   | `/` | `%2F` |
   | `?` | `%3F` |
   | `#` | `%23` |
   | `[` | `%5B` |
   | `]` | `%5D` |
   | ` ` (space) | `%20` |

   **Example:**
   - Password: `my@pass:word`
   - Encoded: `my%40pass%3Aword`
   - Connection string: `mongodb+srv://username:my%40pass%3Aword@cluster.mongodb.net/dbname`

3. **Update your `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:encoded_password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
   ```

4. **Verify Database User:**
   - In MongoDB Atlas, go to **Database Access**
   - Check if your database user exists
   - If not, create a new user with password
   - Make sure the user has read/write permissions

5. **Check IP Whitelist:**
   - Go to **Network Access** in MongoDB Atlas
   - Add your current IP address or `0.0.0.0/0` (for testing only)

### For Local MongoDB:

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Or check Services
   services.msc
   ```

2. **Connection String Format:**
   ```env
   MONGO_URI=mongodb://localhost:27017/admission-portal
   ```
   
   If you have authentication enabled locally:
   ```env
   MONGO_URI=mongodb://username:password@localhost:27017/admission-portal
   ```

3. **Create a Database User (if needed):**
   ```javascript
   use admin
   db.createUser({
     user: "your_username",
     pwd: "your_password",
     roles: ["readWriteAnyDatabase"]
   })
   ```

## Quick Test

To test your connection string, you can use MongoDB Compass or run:

```bash
# Install MongoDB Shell (mongosh)
mongosh "your_connection_string"
```

## Common Issues

### Issue 1: Password with @ symbol
**Problem:** Password `my@pass123`  
**Solution:** Use `my%40pass123` in connection string

### Issue 2: Password with special characters
**Problem:** Password `P@ssw0rd!`  
**Solution:** Use `P%40ssw0rd%21` in connection string

### Issue 3: User doesn't exist
**Solution:** Create a new database user in MongoDB Atlas

### Issue 4: Wrong database name
**Solution:** Verify the database name in your connection string matches your actual database

## Example .env File

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://myuser:mypassword123@cluster0.xxxxx.mongodb.net/admission-portal?retryWrites=true&w=majority

# If password has special characters, encode them:
# MONGO_URI=mongodb+srv://myuser:my%40pass%21word@cluster0.xxxxx.mongodb.net/admission-portal?retryWrites=true&w=majority
```

## Still Having Issues?

1. Double-check your username and password
2. Try creating a new database user with a simple password (no special characters)
3. Verify your IP is whitelisted in MongoDB Atlas
4. Check MongoDB Atlas cluster status (make sure it's not paused)
5. Try the connection string from MongoDB Atlas dashboard directly

