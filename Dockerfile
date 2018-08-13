FROM node:10.7.0

WORKDIR /app

COPY ./package.json /app
COPY ./yarn.lock /app

RUN yarn install

COPY . /app

USER node

ENTRYPOINT ["yarn", "start"]
