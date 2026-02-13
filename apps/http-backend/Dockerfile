FROM node:20-alpine AS deps

WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/http-backend/package.json apps/http-backend/

COPY packages ./packages

RUN npm install -g pnpm && pnpm install --filter ./apps/http-backend/...

#----BUILD STAGE--
FROM node:20-alpine AS builder

WORKDIR /repo

COPY . .

COPY --from=deps /repo/node_modules ./node_modules

RUN pnpm --filter ./apps/http-backend... build

RUN npm prune --prod
#--PROD--
FROM node:20-alpine

WORKDIR /app

COPY --from=build /repo/apps/http-backend/package.json ./

COPY --from=builder /repo/node_modules ./node_modules

COPY --from=builder /repo/apps/http-backend/dist ./dist

EXPOSE 5000

CMD [ "pnpm","run","start" ]