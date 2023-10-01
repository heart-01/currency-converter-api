FROM node:16-alpine

ARG ENV_BUILD_IMAGE

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE $API_PORT

CMD [ "npm", "run", "start:prod" ]