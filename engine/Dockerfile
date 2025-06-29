FROM node:20-alpine AS base

RUN apk add --no-cache tzdata
ENV TZ=Asia/Jakarta

COPY . /app

WORKDIR /app


# FROM base as builder


RUN npm install

RUN npm run build

# RUN npm prune --omit=dev -f

# FROM base

# COPY --from=builder /app/ /app/

EXPOSE 8000:8000

CMD ["npm", "run", "start"]