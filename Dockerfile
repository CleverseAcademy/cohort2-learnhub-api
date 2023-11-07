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

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY prisma/ ./prisma/

RUN pnpm prisma generate

COPY src/ ./src/

RUN pnpm tsc

EXPOSE $SVC_PORT

CMD "node" "dist/index.js" 
