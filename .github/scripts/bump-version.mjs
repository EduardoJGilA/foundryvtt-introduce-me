import { readFileSync, writeFileSync } from "node:fs";

const bumpPatch = (version) => {
    const parts = version.split(".").map(Number);
    parts[2] = (parts[2] ?? 0) + 1;
    return parts.join(".");
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const newVersion = bumpPatch(pkg.version);

pkg.version = newVersion;
writeFileSync("package.json", JSON.stringify(pkg, null, "\t") + "\n");

const modulePath = "src/module.json";
const mod = JSON.parse(readFileSync(modulePath, "utf8"));
mod.version = newVersion;
writeFileSync(modulePath, JSON.stringify(mod, null, 2) + "\n");

const output = process.env.GITHUB_OUTPUT;
if (output) writeFileSync(output, `version=${newVersion}\n`, { flag: "a" });
console.log(`Bumped version to ${newVersion}`);
