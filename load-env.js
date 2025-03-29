const fs = require("fs");
const path = require("path");
const successColor = "\x1b[32m%s\x1b[0m";
const checkSign = "\u{2705}";
require("dotenv").config();

let envFile = `production: ${process.env.NODE_ENV === "prod"},
    apiUrl: '${process.env.API_URL}',
    apiUrlStatics: '${process.env.URL_STATICS}',
    googleClientId: '${process.env.GOOGLE_CLIENT_ID}',
    secretKey: '${process.env.SECRET_KEY}'`;

envFile = `export const environment = {
      ${envFile}
     }`;
const targetPath = path.join(__dirname, `/src/environments`);

if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);

fs.writeFile(`${targetPath}/environment.ts`, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.info(
      successColor,
      `${checkSign} Successfully generated environment file`
    );
  }
});
