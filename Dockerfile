FROM node:14.17-alpine AS PRODUCTION

ENV NODE_ENV production

ENV PORT 8046

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8046

CMD  [ "npm", "run", "start-production" ]
