# Deploy Aurora Mixer (and similar Grok App Builder apps) to GitHub Pages as PWA

Цей файл — **робоча інструкція** з досвіду чату (вересень 2026).
Читай його, коли треба знову викласти додаток на GitHub Pages з PWA.

Репо: `Konst-Andre/Grok_sandbox`  
Живий сайт: https://konst-andre.github.io/Grok_sandbox/

---

## Коротко: що працює

1. **SPA-режим** TanStack Start (`spa: { enabled: true }`)
2. **`base: "/Grok_sandbox/"`** коли `GITHUB_PAGES=true`
3. **Nitro вимкнено** для Pages (немає сервера)
4. Після збірки: `_shell.html` → `index.html`
5. **Статичний** `public/manifest.webmanifest` з шляхами під `/Grok_sandbox/`
6. У HTML виправити шляхи маніфесту/іконки з `/__grok/...` на `/Grok_sandbox/...`
7. GitHub Actions: `upload-pages-artifact` з `path: dist/client`
8. Settings → Pages → Source = **GitHub Actions**

---

## 1. `vite.config.ts` (ключові частини)

```ts
export default defineConfig(({ command, isPreview }) => {
  const isGitHubPages = process.env.GITHUB_PAGES === "true";

  return {
    base: isGitHubPages ? "/Grok_sandbox/" : "/",
    // ... server / preview без змін ...
    plugins: [
      // ... pglite, authPopup, appEnv, grokPwa, tailwind ...
      tanstackStart({
        spa: { enabled: true },
      }),
      // Nitro ТІЛЬКИ не для Pages
      ...(!isGitHubPages && (command === "build" || isPreview)
        ? [nitro({ preset: "static" })]
        : []),
      viteReact(),
    ],
  };
});
```

**Чому:**
- GitHub Pages = статичний хостинг → потрібен SPA, не SSR/Vercel.
- `base` має збігатися з іменем репо (підпапка на `*.github.io`).
- Nitro на Pages ламає збірку (`rolldownOptions.input should not be an html file...`).

---

## 2. Статичний маніфест PWA

Файл: `public/manifest.webmanifest`

```json
{
  "name": "Aurora Mixer",
  "short_name": "Aurora",
  "id": "/Grok_sandbox/",
  "start_url": "/Grok_sandbox/",
  "scope": "/Grok_sandbox/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/Grok_sandbox/__grok/icon-180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Чому не динамічний маніфест Grok:**
- На платформі Grok маніфест **генерує сервер** (`/__grok/manifest.webmanifest`).
- На Pages сервера немає → 404.
- Шляхи без `/Grok_sandbox/` теж 404.

Іконка вже є: `public/__grok/icon-180.png`.

---

## 3. Workflow (робочий)

Файл: `.github/workflows/deploy-pages.yml`

Критичні кроки після `npm run build`:

```bash
cp dist/client/_shell.html dist/client/index.html
cp public/manifest.webmanifest dist/client/manifest.webmanifest
touch dist/client/.nojekyll
```

Потім **Python** (не `sed` — sed ламав HTML):

```python
# Замінити неправильні абсолютні шляхи з grokPwaPlugin:
html = html.replace(
  'href="/__grok/manifest.webmanifest"',
  'href="/Grok_sandbox/manifest.webmanifest"'
)
html = html.replace(
  'href="/__grok/icon-180.png"',
  'href="/Grok_sandbox/__grok/icon-180.png"'
)
# Додати:
# <meta name="apple-mobile-web-app-capable" content="yes">
# <meta name="apple-mobile-web-app-title" content="Aurora">
```

Артефакт:

```yaml
path: dist/client   # НЕ dist, НЕ dist/server
```

Повний актуальний YAML дивись у репо: `.github/workflows/deploy-pages.yml`.

---

## 4. Що ламалось і як фіксили (історія)

| Проблема | Причина | Рішення |
|----------|---------|--------|
| `npm ci` fail | `package-lock.json` не в sync | `npm install` |
| Build fail: rolldown SSR | Nitro + SPA | Вимкнути Nitro коли `GITHUB_PAGES=true` |
| 404 після deploy | Немає `index.html` | Копіювати `_shell.html` → `index.html` |
| PWA не standalone / панель Safari | Маніфест 404 або шляхи `/__grok/...` | Статичний manifest + replace шляхів |
| `sed` зіпсував HTML → знову 404 | GNU sed + однорядковий HTML | Заміни через Python |
| Стара іконка на Home Screen | Кеш iOS | Видалити іконку і додати знову |

Структура після збірки (важливо):

```
dist/
  client/
    _shell.html      ← SPA shell від TanStack
    assets/
    __grok/icon-180.png
    (немає index.html, доки не скопіюємо)
  server/
```

---

## 5. Чеклист «зробити з нуля»

1. У `vite.config.ts`: `base` + `spa: { enabled: true }` + Nitro off для Pages.
2. `public/manifest.webmanifest` з `start_url` / `scope` / `icons` під `/Ім’яРепо/`.
3. Workflow: build → copy shell → fix paths → upload `dist/client`.
4. Settings → Pages → **GitHub Actions**.
5. Після деплою перевірити:
   - `https://user.github.io/Repo/` → 200 + UI
   - `.../manifest.webmanifest` → JSON 200
   - у HTML: `href="/Repo/manifest.webmanifest"`
6. iOS: видалити стару іконку → Safari → Share → Add to Home Screen.

---

## 6. Що можна чистити в репо (опційно)

**Можна прибрати** (не ламає Pages-збірку):
- `.grok/`, `AGENTS.md`
- `attachments/`, `screenshots/`
- `migrations/` (якщо БД не використовується)
- `server/` (для Pages не потрібен)
- зайві `scripts/check-*`, `browser-*`, `brand-check*`

**Залишити:**
- `src/`, `public/`, `package.json`, `package-lock.json`
- `vite.config.ts`, `tsconfig.json`
- `scripts/grok-pwa-*.mjs` (поки плагін у vite)
- `.github/workflows/deploy-pages.yml`
- цей файл `DEPLOY_GITHUB_PAGES.md`

---

## 7. Для агента (Grok) при наступному запиті

Якщо користувач каже «зроби як минулого разу / Pages / PWA»:

1. Прочитай **цей файл** і `.github/workflows/deploy-pages.yml`.
2. Не вигадуй Nitro/Vercel для Pages.
3. Не покладайся на динамічний `/__grok/manifest.webmanifest`.
4. Завжди забезпечуй `index.html` з `_shell.html`.
5. Шляхи маніфесту/іконок — з префіксом `/Ім’яРепо/`.
6. Для правок HTML у CI — Python, не sed.
7. Якщо є GitHub connector — можна пушити workflow/manifest сам.

Живий приклад робочого деплою: коміти з повідомленнями  
`Fix GitHub Pages deploy: ensure index.html + correct PWA paths`.
