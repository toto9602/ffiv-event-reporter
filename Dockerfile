FROM oven/bun:canary-alpine as build

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./

RUN bun install --frozen-lockfile

COPY . .
