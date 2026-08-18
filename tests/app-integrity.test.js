const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");

const root=path.join(__dirname,"..");
const source=fs.readFileSync(path.join(root,"app.js"),"utf8");

test("distribution app stays synchronized with the root app",()=>{assert.equal(fs.readFileSync(path.join(root,"publisering","app.js"),"utf8"),source);});
test("stored state is loaded and saved defensively",()=>{assert.match(source,/const loadState = \(\) => \{try\{/);assert.match(source,/catch\(error\).*standardoppsett/);assert.match(source,/const save = \(\) => \{try\{/);});
test("user-controlled workout text is escaped before HTML rendering",()=>{assert.match(source,/escapeHtml\(p\.name\)/);assert.match(source,/escapeHtml\(program\.name/);assert.match(source,/escapeHtml\(state\.builderName/);assert.match(source,/escapeHtml\(state\.comment/);});
test("every offline shell asset exists",()=>{const serviceWorker=fs.readFileSync(path.join(root,"sw.js"),"utf8");const shell=serviceWorker.match(/const APP_SHELL = \[(.*?)\];/s)?.[1]||"";const assets=[...shell.matchAll(/"\.\/([^"?]*)"/g)].map(match=>match[1]).filter(Boolean);assert.ok(assets.length>0);assets.forEach(asset=>assert.ok(fs.existsSync(path.join(root,asset)),`missing offline asset: ${asset}`));});
test("release and cache-busting versions stay synchronized",()=>{const index=fs.readFileSync(path.join(root,"index.html"),"utf8");const loader=fs.readFileSync(path.join(root,"description-loader.js"),"utf8");const worker=fs.readFileSync(path.join(root,"sw.js"),"utf8");const version=source.match(/APP_VERSION = "(\d+)"/)?.[1];assert.ok(version);[...index.matchAll(/\?v=(\d+)/g),...loader.matchAll(/\?v=(\d+)/g)].forEach(match=>assert.equal(match[1],version));assert.match(worker,new RegExp(`CACHE_NAME = "treningsbuddy-flat-v${version}"`));});
