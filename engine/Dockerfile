FROM node:20-alpine AS base

RUN apk add --no-cache tzdata curl
ENV TZ=Asia/Jakarta

COPY . /app

WORKDIR /app


# FROM base as builder


RUN npm install

RUN npm run build

# RUN npm prune --omit=dev -f

# FROM base

# COPY --from=builder /app/ /app/

EXPOSE 7000:7000

CMD ["npm", "run", "start"]