import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

await mkdir("dist", { recursive: true });

const hashFile = async path => createHash("sha256").update(await readFile(path)).digest("hex").slice(0, 12);
const [appVersion, stylesVersion, studentVersion, practiceVersion, telegramVersion, telegramCssVersion, parentVersion, parentCssVersion] = await Promise.all([
  hashFile("app.js"),
  hashFile("styles.css"),
  hashFile("student.js"),
  hashFile("student-practice.js"),
  hashFile("telegram-manager.js"),
  hashFile("telegram-manager.css"),
  hashFile("parent.js"),
  hashFile("parent.css")
]);

for (const file of ["styles.css", "app.js", "telegram-manager.css", "telegram-manager.js", "vision-logo.jpg", "vision-login-hero.jpg", "student.css", "student.js", "student-practice.css", "student-practice.js", "parent.css", "parent.js", "_redirects", "_headers"]) {
  await copyFile(file, `dist/${file}`);
}

let indexHtml = await readFile("index.html", "utf8");
indexHtml = indexHtml
  .replace(/\.\/styles\.css(?:\?v=[^"'<>s]+)?/, `./styles.css?v=${stylesVersion}`)
  .replace(/\.\/telegram-manager\.css(?:\?v=[^"'<>s]+)?/, `./telegram-manager.css?v=${telegramCssVersion}`)
  .replace(/\.\/telegram-manager\.js(?:\?v=[^"'<>s]+)?/, `./telegram-manager.js?v=${telegramVersion}`)
  .replace(/\.\/app-current\.js(?:\?v=[^"'<>s]+)?/, `./app-current.js?v=${appVersion}`);
await writeFile("dist/index.html", indexHtml);

let studentHtml = await readFile("student.html", "utf8");
studentHtml = studentHtml
  .replace(/\.\/student-practice\.js(?:\?v=[^"'<>s]+)?/, `./student-practice.js?v=${practiceVersion}`)
  .replace(/\.\/student\.js(?:\?v=[^"'<>s]+)?/, `./student.js?v=${studentVersion}`);
await writeFile("dist/student.html", studentHtml);

let parentHtml = await readFile("parent.html", "utf8");
parentHtml = parentHtml
  .replace(/\.\/parent\.css(?:\?v=[^"'<>s]+)?/, `./parent.css?v=${parentCssVersion}`)
  .replace(/\.\/parent\.js(?:\?v=[^"'<>s]+)?/, `./parent.js?v=${parentVersion}`);
await writeFile("dist/parent.html", parentHtml);

await copyFile("app.js", "dist/app-current.js");

console.log(`Vision CRM static build complete — app ${appVersion}, styles ${stylesVersion}, telegram ${telegramVersion}, student ${studentVersion}, practice ${practiceVersion}, parent ${parentVersion}.`);
