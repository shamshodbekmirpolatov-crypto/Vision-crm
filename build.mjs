import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

await mkdir("dist", { recursive: true });

const hashFile = async path => createHash("sha256").update(await readFile(path)).digest("hex").slice(0, 12);
const [appVersion, studentVersion, practiceVersion, telegramVersion, telegramCssVersion] = await Promise.all([
  hashFile("app.js"),
  hashFile("student.js"),
  hashFile("student-practice.js"),
  hashFile("telegram-manager.js"),
  hashFile("telegram-manager.css")
]);

for (const file of ["styles.css", "app.js", "telegram-manager.css", "telegram-manager.js", "vision-logo.jpg", "vision-login-hero.jpg", "student.css", "student.js", "student-practice.css", "student-practice.js", "_redirects", "_headers"]) {
  await copyFile(file, `dist/${file}`);
}

let indexHtml = await readFile("index.html", "utf8");
indexHtml = indexHtml
  .replace(/\.\/telegram-manager\.css(?:\?v=[^"'<>\s]+)?/, `./telegram-manager.css?v=${telegramCssVersion}`)
  .replace(/\.\/telegram-manager\.js(?:\?v=[^"'<>\s]+)?/, `./telegram-manager.js?v=${telegramVersion}`)
  .replace(/\.\/app-current\.js(?:\?v=[^"'<>\s]+)?/, `./app-current.js?v=${appVersion}`);
await writeFile("dist/index.html", indexHtml);

let studentHtml = await readFile("student.html", "utf8");
studentHtml = studentHtml
  .replace(/\.\/student-practice\.js(?:\?v=[^"'<>\s]+)?/, `./student-practice.js?v=${practiceVersion}`)
  .replace(/\.\/student\.js(?:\?v=[^"'<>\s]+)?/, `./student.js?v=${studentVersion}`);
await writeFile("dist/student.html", studentHtml);

await copyFile("app.js", "dist/app-current.js");

console.log(`Vision CRM static build complete — app ${appVersion}, telegram ${telegramVersion}, student ${studentVersion}, practice ${practiceVersion}.`);
