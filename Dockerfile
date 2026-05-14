# Используйте более новую версию Node.js
FROM node:16-alpine
# Установите рабочую директорию внутри контейнера
WORKDIR .
# Копируйте файл package.json и package-lock.json в контейнер
COPY package.json package-lock.json ./
# Установите зависимости
RUN npm ci
# Копируйте остальные файлы проекта в контейнер
COPY . .
# Соберите ваше React приложение
RUN npm run build
# Установите веб-сервер для статических файлов (например, serve)
RUN npm install -g serve
# Откройте порт, который будет использоваться веб-сервером
EXPOSE 3000
# Запустите веб-сервер
CMD ["serve", "-s", "build", "-l", "3000"]
