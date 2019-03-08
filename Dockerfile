FROM node:10.7.0

ENV NODE_ENV=development

WORKDIR /tas-server

COPY ./package.json /tas-server
COPY ./yarn.lock /tas-server

RUN yarn install

COPY . /tas-server

ENTRYPOINT ["node", "lib/index"]
