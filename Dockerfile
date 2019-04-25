FROM node:11.9.0

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN yarn

COPY . /app

EXPOSE 5002

CMD [ "yarn", "start" ]
