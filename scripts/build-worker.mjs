import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/, "$1"));
const webRoot = join(root, "web");
const distRoot = join(root, "dist");
const runtime = await readFile(join(root, "worker", "runtime.js"), "utf8");
const assets = {};

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name);
    if (entry.isDirectory()) await collect(filename);
    else if (entry.isFile()) {
      const route = "/" + relative(webRoot, filename).split(sep).join("/");
      const body = await readFile(filename);
      assets[route === "/index.html" ? "/" : route] = {
        body: body.toString("base64"),
        type: contentType(extname(filename).toLowerCase())
      };
    }
  }
}

function contentType(ext) {
  return ({ ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".png":"image/png", ".svg":"image/svg+xml", ".mp3":"audio/mpeg", ".txt":"text/plain; charset=utf-8" })[ext] || "application/octet-stream";
}

await collect(webRoot);
await rm(distRoot, { recursive: true, force: true });
await mkdir(join(distRoot, "server"), { recursive: true });
await mkdir(join(distRoot, ".openai"), { recursive: true });
await writeFile(join(distRoot, "server", "index.js"), `const ASSETS=${JSON.stringify(assets)};\n${runtime}`);
await writeFile(join(distRoot, ".openai", "hosting.json"), await readFile(join(root, ".openai", "hosting.json")));
console.log(`Built Worker with ${Object.keys(assets).length} embedded assets.`);
