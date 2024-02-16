const BASE_PATH = "./database/migrations/";

module.exports = async function ({ db, pgp }) {
  console.log("Checking migrations...");

  const fs = require("fs");
  const files = fs.readdirSync(BASE_PATH);
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

  if (activeMigs?.length !== files.length) {
    for (item of files) {
      if (!activeMigs?.includes(item)) {
        console.log("Running migration:", item);
        const mig = fs.readFileSync(BASE_PATH + item, { encoding: "utf-8" });
        try {
          await db.tx(async (t) => {
            await t.none(mig);
            await t.none("INSERT INTO migrations (filename) VALUES ($1)", [
              item,
            ]);
          });
        } catch (err) {
          console.log("ERROR WITH MIGRATIONS:", err);
          console.log("SKIPPED MIGRATION: ", item);
        }
      }

      // console.log(mig);
    }
    console.log("Done migrations!");
  } else {
    console.log("All migrations present!");
  }
};
