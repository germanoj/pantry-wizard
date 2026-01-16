import "dotenv/config";
import app from "./index.js";
import db from "./db/client.js";

const PORT = process.env.PORT || 3000;

console.log("server.js: start");
console.log("server.js: PORT", PORT);

try {
  console.log("server.js: connecting db...");
  const client = await db.connect();
  console.log("server.js: db connected");
  client.release(); // IMPORTANT: release the client you grabbed
} catch (e) {
  console.error("server.js: db connect failed", e);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server.js: listening on ${PORT}`);
});
