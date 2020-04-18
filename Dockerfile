FROM node:alpine

RUN mkdir -p /app

RUN apt update && apt install sox

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm i

COPY ./ /app
RUN npm run build

CMD [ "npm", "start" ]
