GlowLuxe / Magazin kosmetic - запуск на другом ПК

1) Установите Node.js LTS (рекомендуется 20.x):
   https://nodejs.org/

2) Распакуйте архив в любую папку.

3) Откройте терминал в папке проекта и выполните:
   npm install

4) Запуск в режиме разработки:
   npm run dev
   Затем откройте адрес из терминала (обычно http://localhost:5173).

5) Сборка production:
   npm run build

6) Локальный просмотр production-сборки:
   npm run preview

Примечание:
- node_modules в архив обычно не включаются (они устанавливаются через npm install).
- Если порт занят, Vite автоматически предложит другой.

Постоянная ссылка через GitHub Pages:
1) Создайте пустой репозиторий на GitHub (например: magazin-kosmetic).
2) Загрузите в него файлы этого проекта (включая .github/workflows/deploy-gh-pages.yml).
3) В репозитории откройте Settings -> Pages и выберите Source: GitHub Actions.
4) Сделайте push в ветку main.
5) Через 1-3 минуты сайт будет доступен по ссылке:
   https://<ваш-логин>.github.io/<имя-репозитория>/
