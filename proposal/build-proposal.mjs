import fs from "node:fs";
const c = JSON.parse(fs.readFileSync(new URL("./proposal-content.json", import.meta.url), "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const items = c.items.map((i) => `<section><h2>${esc(i.h)}</h2>${i.t.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`).join("\n");
const lic = c.license.map((p) => `<p>${esc(p)}</p>`).join("");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(c.title)} - Round 1 Project Proposal</title>
<style>
@page { size: Letter; margin: 0.5in 0.65in; }
* { box-sizing: border-box; }
body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #1c2430; font-size: 9.6pt; line-height: 1.38; margin: 0; }
header { border-bottom: 3px solid #0b6b5c; padding-bottom: 8px; margin-bottom: 10px; }
header h1 { font-size: 21pt; margin: 0 0 3px 0; color: #0b3d36; letter-spacing: -0.3px; }
header .sub { font-size: 9.2pt; color: #4a5a68; }
header .ent { font-size: 9.2pt; color: #4a5a68; margin-top: 2px; }
.grid { display: block; }
section { break-inside: avoid; margin: 0 0 6px 0; padding: 0 0 0 10px; border-left: 3px solid #cfe7e2; }
section h2 { font-size: 10.2pt; margin: 0 0 1px 0; color: #0b6b5c; }
section p { margin: 0; }
.lic { margin-top: 8px; padding-top: 6px; border-top: 1px solid #c8d1d8; font-size: 8pt; color: #44525f; line-height: 1.32; }
.lic h3 { font-size: 8.4pt; margin: 0 0 2px 0; color: #2b3844; }
.lic p { margin: 0 0 2px 0; }
</style></head><body>
<header><h1>${esc(c.title)}</h1><div class="sub">${esc(c.subtitle)}</div><div class="ent">${esc(c.entrant)}</div></header>
<div class="grid">${items}</div>
<div class="lic"><h3>${esc(c.licenseHeading)}</h3>${lic}</div>
</body></html>`;
fs.writeFileSync(new URL("./proposal.html", import.meta.url), html);
console.log("html written", html.length);
