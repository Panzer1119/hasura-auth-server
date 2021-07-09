FROM node:14.17-alpine AS PRODUCTION

ENV NODE_ENV production

ENV PORT 8046

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 8046

CMD  [ "npm", "run", "start-production" ]
