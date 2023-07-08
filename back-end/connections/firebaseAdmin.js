import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccountPath = path.join(__dirname, "sa.json");
// Read the service account JSON file
const serviceAccountData = fs.readFileSync(serviceAccountPath, "utf8");
// Parse the service account JSON data
const serviceAccount = JSON.parse(serviceAccountData);
// // <-- Firebase admin SDK Initialization-->
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// // <-- End of Firebase admin SDK Initialization-->
export default serviceAccount;