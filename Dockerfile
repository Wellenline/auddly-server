FROM node:15-alpine3.10

RUN mkdir -p /app

RUN apk update && apk add sox python make g++ && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm i

COPY ./ /app
# RUN npm run build

CMD [ "npm", "start" ]
