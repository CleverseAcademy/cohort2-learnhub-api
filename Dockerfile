FROM node:18.16.0

RUN npm install -g pnpm@8.6.2

WORKDIR /app

COPY . .

RUN pnpm install && tsc

# CMD "/bin/sh" "-c" "pwd && ls -al"
CMD "node" "dist/index.js"