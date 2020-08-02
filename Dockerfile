FROM node:12-alpine

RUN mkdir -p /app

#RUN apk update && apk add sox && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN apk add --no-cache --virtual build-deps \
	python \
	g++ \
	build-base \
	cairo-dev \
	jpeg-dev \
	pango-dev \
	musl-dev \
	giflib-dev \
	pixman-dev \
	pangomm-dev \
	libjpeg-turbo-dev \
	freetype-dev \
	&& npm ci \
	&& apk del build-deps \
	&& apk add --no-cache \
	cairo \
	jpeg \
	pango \
	musl \
	giflib \
	pixman \
	pangomm \
	libjpeg-turbo \
	freetype \
	sox \
	ffmpeg



COPY ./ /app
RUN npm run build

CMD [ "npm", "start" ]
