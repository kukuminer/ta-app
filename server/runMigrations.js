function readFile(e) {}

const BASE_PATH = "./database/migrations/";

module.exports = async function ({ db, pgp }) {
  console.log("running migrations");

  const fs = require("fs");
  const files = fs.readdirSync(BASE_PATH);
  console.log(files);
  for (item of files) {
    // console.log(item);
    const mig = fs.readFileSync(BASE_PATH + item, { encoding: "utf-8" });
    db.tx(async (t) => {
      try {
        const res = await t.none(mig);
      } catch (err) {
        console.log("ERROR WITH MIGRATIONS:", e);
        console.log("SKIPPED MIGRATION: ", item);
      }
    });

    // console.log(mig);
  }

  console.log("Done migrations!");
};
