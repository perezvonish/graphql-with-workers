FROM node:22

WORKDIR /app

# Копируем только нужные файлы
COPY worker/package*.json ./
COPY worker/tsconfig.json ./
COPY worker/src ./src

# Устанавливаем зависимости
RUN npm install

# Компилируем TypeScript
RUN npm run build

# Запускаем main.js
CMD ["node", "dist/main.js"]
