# Dariia Letucha Portfolio — Cloudflare Worker

Это готовая production-сборка сайта для Cloudflare Workers со статическими ассетами.

## Загрузка

1. Распакуйте ZIP-архив.
2. Откройте Terminal в распакованной папке.
3. Установите Wrangler: `npm install`.
4. Войдите в Cloudflare: `npx wrangler login`.
5. Проверьте пакет без публикации: `npm run check`.
6. Опубликуйте: `npm run deploy`.

После первого деплоя Cloudflare создаст Worker `dariia-letucha-portfolio` и выдаст адрес `*.workers.dev`. Свой домен можно подключить в Workers & Pages → нужный Worker → Settings → Domains & Routes.

Важно: это Worker-проект с серверным рендерингом и динамическими страницами. Не загружайте содержимое `dist/client` как обычный статический Pages-сайт — в таком режиме динамические маршруты портфолио работать не будут.

## Что внутри

- `dist/server` — готовый серверный Worker;
- `dist/client` — все изображения, видео, шрифты, CSS и клиентский JavaScript;
- `wrangler.jsonc` — конфигурация Cloudflare;
- `package.json` — закреплённая версия Wrangler и команды проверки/деплоя.

В архиве нет токенов, паролей и файлов локальной разработки.
