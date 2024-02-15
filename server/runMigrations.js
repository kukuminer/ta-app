module.exports = async function ({ db, pgp }) {
  console.log("running migrations");
  const fs = require("fs");
  const res = await db.one("SELECT NOW()");
  console.log(res);
  console.log("Done migrations!");
};
