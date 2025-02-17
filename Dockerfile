FROM oven/bun:canary-debian as build

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./

RUN bun install --frozen-lockfile

COPY . .
