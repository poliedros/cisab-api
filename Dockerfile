FROM node:18.10.0 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18.10.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG REDIS_HOST=host.docker.internal
ENV REDIS_HOST=${REDIS_HOST}

ARG REDIS_PORT=6379
ENV REDIS_PORT=${REDIS_PORT}

ARG REDIS_AUTH_PASS=''
ENV REDIS_AUTH_PASS=${REDIS_AUTH_PASS}


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]