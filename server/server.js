import app from "#index";
import db from "#db/client";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await db.connect();

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
}

start();
