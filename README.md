# SPA Messenger (Учебный проект Яндекс.Практикум)

Проект представляет собой одностраничное приложение-мессенджер, разработанный в рамках курса Яндекс.Практикум. В приложении реализована авторизация, работа с чатами, компонентный подход и собственный мини-фреймворк на TypeScript.

## Функционал

- Роутинг с защитой маршрутов (RouteGuard)
- Компонентная архитектура (Block, EventBus)
- Собственный HTTP-клиент (HTTPTransport)
- Поддержка WebSocket для обмена сообщениями
- Работа с API:
  - Регистрация, вход, выход
  - Обновление данных и аватара профиля
  - Список, создание, удаление чатов
  - Добавление и удаление пользователей из чата
- Валидация форм регистрации и авторизации
- ESLint, Prettier, Husky (pre-commit)

## Макет приложения

<img src="https://www.svgrepo.com/show/452202/figma.svg" alt="Figma" width="18" height="18" /> [Макет разрабатываемого приложения](https://www.figma.com/design/SXczNhdiiOZJgogyqk54Iu/Messenger?node-id=0-1&t=dpI4SGRkugKncPCH-1)

## Демо (netlify)

<img src="https://www.svgrepo.com/show/376339/netlify.svg" alt="Figma" width="18" height="18" /> [Ссылка на netlify](https://partialmessenger.netlify.app/)

## Стек технологий

- TypeScript
- Handlebars
- CSS Modules
- Vite
- Jest (unit-тестирование)
- ESLint + Prettier
- Netlify (деплой)

## Инструкция по развертыванию

npm install
npm run start (запускает и билдит проект)

## Тесты

Для запуска unit-тестов используется Jest. Выполните команду:
npm run test

## Статус и планы по разработке

Проект заверешен, возможно стили исправлю в будующем
