# ---- build ----
FROM node:22 AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY prisma ./prisma
RUN pnpm prisma:generate
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

# ---- production ----
FROM node:22 AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
RUN corepack enable && pnpm --version
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
