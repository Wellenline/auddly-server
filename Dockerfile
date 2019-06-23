FROM node:11.9.0

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

CMD [ "yarn", "start" ]
