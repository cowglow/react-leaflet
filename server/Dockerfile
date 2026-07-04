FROM node:22
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install
COPY . .
RUN pnpm prisma:generate
EXPOSE 4000
CMD ["pnpm", "dev"]
