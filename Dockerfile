ARG NODE_VERSION=18

FROM node:${NODE_VERSION} AS builder

ARG PNPM_VERSION=8.6.2
ARG SVC_PORT=8080

# Use development node environment in order to install all required compile-time dependencies.
ENV NODE_ENV=development
ENV PORT=$SVC_PORT

# Install pnpm.
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile && pnpm prisma generate && pnpm tsc

EXPOSE $SVC_PORT

CMD "node" "dist/index.js" 
