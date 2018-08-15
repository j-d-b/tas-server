FROM node:10.7.0

ENV NODE_ENV=development

WORKDIR /app

COPY ./package.json /app
COPY ./yarn.lock /app

RUN yarn install

COPY . /app

USER node

ENTRYPOINT ["node", "src/index"]
