require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

async function migrate() {
  await connectDB();
  const db = mongoose.connection.db;
  const collection = db.collection("schedules");

  // Drop old dayOfWeek-based index if it exists
  const indexes = await collection.indexes();
  const oldIndex = indexes.find(
    (idx) => idx.key && idx.key.doctorId && idx.key.dayOfWeek,
  );
  if (oldIndex) {
    console.log("Dropping old index:", oldIndex.name);
    await collection.dropIndex(oldIndex.name);
    console.log("Old index dropped.");
  } else {
    console.log("No old dayOfWeek index found — skipping.");
  }

  // Remove old schedules that use dayOfWeek (no date field)
  const result = await collection.deleteMany({ date: { $exists: false } });
  console.log(
    `Removed ${result.deletedCount} old dayOfWeek-based schedule(s).`,
  );

  // The new index (doctorId + date) will be auto-created by Mongoose on next startup
  console.log("Migration complete. Start the server to create the new index.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
