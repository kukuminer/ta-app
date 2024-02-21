const BASE_PATH = "./database/migrations/";
// const fs = require("fs");
import { readdirSync, readFileSync } from "fs";

export default async function runMigrations({ db, pgp }) {
  // module.exports = async function ({ db, pgp }) {
  console.log("Checking migrations...");

  const files = readdirSync(BASE_PATH);
  files.sort();
  // console.log(files);
  var activeMigs;
  try {
    activeMigs = await db.many(
      "SELECT filename FROM migrations ORDER BY id ASC"
    );
    activeMigs = activeMigs.map((item) => item["filename"]);
    // console.log(activeMigs);
  } catch (err) {
    console.log(err);
    console.log(
      "It is likely that there is no migrations table. Running migrations now..."
    );
  }

  var skippedMigs = [];
  // If you ever add other non-migration files to /migrations, remove this if and just run the loop
  if (activeMigs?.length !== files.length) {
    for (const item of files) {
      if (!activeMigs?.includes(item)) {
        console.log("Running migration:", item);
        const mig = readFileSync(BASE_PATH + item, { encoding: "utf-8" });
        try {
          await db.tx(async (t) => {
            await t.none(mig);
            await t.none("INSERT INTO migrations (filename) VALUES ($1)", [
              item,
            ]);
          });
        } catch (err) {
          skippedMigs.push(item);
          console.log("ERROR WITH MIGRATIONS:", err);
          console.log("SKIPPED MIGRATION: ", item);
        }
      }

      // console.log(mig);
    }
    console.log("Done migrations!");
    if (skippedMigs.length > 0) {
      console.log("SKIPPED", skippedMigs.length, "MIGRATIONS");
      for (const item of skippedMigs) {
        console.log("SKIPPED: ", item);
      }
    }
  } else {
    console.log("All migrations present!");
  }
}
