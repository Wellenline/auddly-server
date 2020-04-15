FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm i

COPY ./ /app
RUN npm run build

CMD [ "npm", "start" ]
