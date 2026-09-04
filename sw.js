"use strict";
importScripts("./pako_inflate.min.js");

const BUILD_ID = "mys772-5cf040b44315";
const GAME_BUNDLE = "payload/game-v0772.bundle";

self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") self.skipWaiting();
  if (event.data === "getBuildId" && event.ports[0]) event.ports[0].postMessage(BUILD_ID);
});

function isGame(pathname) {
  return pathname.endsWith("/game-v0772.html");
}

async function serveGame() {
  const bundleUrl = new URL(GAME_BUNDLE, self.registration.scope);
  const response = await fetch(bundleUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("Game bundle request failed: " + response.status);

  let body;
  if (typeof DecompressionStream === "function" && response.body) {
    body = response.body.pipeThrough(new DecompressionStream("gzip"));
  } else {
    const compressed = new Uint8Array(await response.arrayBuffer());
    const inflater = self.pako || pako;
    body = inflater.ungzip(compressed);
  }

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-DoLP-Web-Build": BUILD_ID,
      "X-DoLP-Core": "0.5.12.6 DoLP v0.772",
      "X-DoLP-Art-Pack": "aokiutage_mys_v0.772",
      "X-DoLP-Images": "official-same-origin-static",
    },
  });
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (!isGame(url.pathname)) return;

  event.respondWith(serveGame().catch(error => {
    console.error(error);
    return new Response(
      "<!doctype html><meta charset=utf-8><title>DoLP 載入失敗</title><p>遊戲核心載入失敗，請回到主網址重新整理。</p>",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }));
});
