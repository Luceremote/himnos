// Generado por scripts/build-pwa.js - no editar a mano
const VERSION = "3f88f739ce14";
const BASE = "/himnos";
const APP_CACHE = 'himnos-app-' + VERSION;
const SHEET_CACHE = 'himnos-partituras-v1';
const FILES = ["/himnos/_expo/static/js/web/entry-01f2cb8c76668dd7b91c498e736de9f6.js","/himnos/assets/node_modules/@expo-google-fonts/instrument-sans/400Regular/InstrumentSans_400Regular.2b81d5b6a0ff6239ab299c80e4fcceb7.ttf","/himnos/assets/node_modules/@expo-google-fonts/instrument-sans/500Medium/InstrumentSans_500Medium.e0b177a490e51f6ceac9eedac735288c.ttf","/himnos/assets/node_modules/@expo-google-fonts/instrument-sans/600SemiBold/InstrumentSans_600SemiBold.b0c4d14368e931d548bddc090025985c.ttf","/himnos/assets/node_modules/@expo-google-fonts/newsreader/400Regular/Newsreader_400Regular.b1d919187d5645f84124ef065868ba9e.ttf","/himnos/assets/node_modules/@expo-google-fonts/newsreader/400Regular_Italic/Newsreader_400Regular_Italic.f7b81d92eb42d85de96b6dc1c72d2c36.ttf","/himnos/assets/node_modules/@expo-google-fonts/newsreader/500Medium/Newsreader_500Medium.df89e83cfd4e37176dda53076a01b3b7.ttf","/himnos/assets/node_modules/@react-navigation/elements/lib/module/assets/back-icon-mask.5223c8d9b0d08b82a5670fb5f71faf78.png","/himnos/assets/node_modules/@react-navigation/elements/lib/module/assets/back-icon.35ba0eaec5a4f5ed12ca16fabeae451d.png","/himnos/assets/node_modules/expo-router/assets/error.563d5e3294b67811d0a1aede6f601e30.png","/himnos/assets/node_modules/expo-router/assets/file.b6c297a501e289394b0bc5dc69c265e6.png","/himnos/assets/node_modules/expo-router/assets/forward.9d9c5644f55c2f6e4b7f247c378b2fe9.png","/himnos/assets/node_modules/expo-router/assets/pkg.5974eb3e1c5314e8d5a822702d7d0740.png","/himnos/favicon.ico","/himnos/icons/apple-touch-icon.png","/himnos/icons/icon-192.png","/himnos/icons/icon-512.png","/himnos/index.html","/himnos/manifest.webmanifest"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('himnos-app-') && k !== APP_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Cualquier ruta de la app (/hymn/S12, /categories...) abre la app guardada
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(APP_CACHE)
        .then((c) => c.match(BASE + '/index.html'))
        .then((r) => r || fetch(req))
    );
    return;
  }

  // Partituras, su letra en español y Verovio: se guardan la primera vez que se usan
  if (/\.(mei|lyr|vjs)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(SHEET_CACHE).then((c) =>
        c.match(req, { ignoreSearch: true }).then((hit) =>
          hit || fetch(req).then((res) => {
            if (res.ok) c.put(req, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }

  // Las fuentes se piden con ?platform=web&hash=...; el nombre del archivo ya lleva su hash, así que se ignora
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
