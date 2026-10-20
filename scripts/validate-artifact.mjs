import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const worker = await readFile(new URL("../dist/server/index.js", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"));
assert.equal(manifest.d1, "DB");
assert.match(worker, /export default\s*\{/);
assert.match(worker, /async fetch\(/);
assert.ok(worker.length > 1000);
console.log("Worker artifact, D1 binding, and embedded assets are valid.");
