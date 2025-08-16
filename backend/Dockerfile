FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/*.js ./
COPY backend/*.json ./

RUN npm run build

CMD ["node", "dist/main"]
