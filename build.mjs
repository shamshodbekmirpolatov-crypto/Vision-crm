import { mkdir, copyFile } from "node:fs/promises";

await mkdir("dist", { recursive: true });

for (const file of ["index.html", "styles.css", "app.js", "vision-logo.jpg", "vision-login-hero.jpg", "student.html", "student.css", "student.js", "student-practice.css", "student-practice.js", "_redirects", "_headers"]) {
  await copyFile(file, `dist/${file}`);
}

console.log("Vision CRM static build complete.");
