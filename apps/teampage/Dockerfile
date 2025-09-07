FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json ./
COPY pnpm-lock.yaml ./

COPY packages ./packages
COPY apps ./apps

RUN pnpm install --no-frozen-lockfile

WORKDIR /app/apps/teampage

ARG NOTION_API_KEY
ARG NOTION_PEOPLE_DATABASE_ID
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG KEYCLOAK_ISSUER
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV NOTION_API_KEY=$NOTION_API_KEY
ENV NOTION_PEOPLE_DATABASE_ID=$NOTION_PEOPLE_DATABASE_ID
ENV KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET
ENV KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

RUN pnpm run build

FROM node:18-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production

ARG NOTION_API_KEY
ARG NOTION_PEOPLE_DATABASE_ID
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG KEYCLOAK_ISSUER
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV NOTION_API_KEY=$NOTION_API_KEY
ENV NOTION_PEOPLE_DATABASE_ID=$NOTION_PEOPLE_DATABASE_ID
ENV KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET
ENV KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/teampage/.next/standalone/server.js /app/
COPY --from=builder --chown=nextjs:nodejs /app/apps/teampage/.next/standalone/package.json /app/
COPY --from=builder --chown=nextjs:nodejs /app/apps/teampage/.next/standalone/.next /app/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/teampage/.next/static /app/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/teampage/public /app/public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules /app/node_modules
ENV NODE_PATH=/app/node_modules

USER nextjs
EXPOSE 80
ENV PORT=80
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]