# ---------- Build stage ----------
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Кеш зависимостей
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
# если есть — не критично, просто ускорит линт/тайпы
#COPY eslint.config.mjs .  || true
#COPY .prettierrc .  || true

RUN pnpm install --frozen-lockfile

# Сборка NestJS
COPY src ./src
RUN pnpm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Копируем только нужное
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV PORT=3000
ENV TZ=UTC

EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --retries=10 CMD node -e "require('http').get('http://localhost:3000/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/main.js"]
