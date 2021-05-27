<a href="https://music.auddly.app" target="_blank">
	<img src="https://raw.githubusercontent.com/Wellenline/auddly/dev/app-icon.png" width="100">
</a>
# Auddly Music Server
[![Discord](https://img.shields.io/discord/712899309242286090?logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/mJQm8SJ)

![](https://raw.githubusercontent.com/Wellenline/auddly/dev/preview.png)


```Use the 3.1.0 version if you wish to keep using the mongodb version```

## Getting Started
Waveline works with following databases: `postgres`, `mysql`, `cockroachdb`, `mariadb`, `sqlite`, `mssql`

You can pull the latest Waveline image from [Docker Hub](https://hub.docker.com/r/wellenline/waveline-server) and run it by using the following command:

```
docker run -d --name="Waveline-Server" \
  -e DB_DRIVER=sqlite \
  -e MUSIC_PATH=/music \
  -e CACHE_PATH=/cache \
  -e ART_PATH=/album-art \
  -e SPOTIFY_ID=YOUR_SPOTIFY_ID \
  -e SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET \
  -e GENIUS_ACCESS_TOKEN=YOUR_GENIUS_ACCESS_TOKEN \
  -e LAST_FM_KEY=YOUR_LAST_FM_KEY \
  -e AUTH_ENABLED=true \
  -e API_KEY=12345 \
  -e PORT=5000 \
  -e HOST=http://127.0.0.1:5000 \
  -p 5000:5000 \
  -v YOUR_MUSIC_PATH:/music \
  -v ./data:/data \
  --restart unless-stopped \
  wellenline/waveline-server:latest
```

## Using Docker-Compose
```docker
version: '3'
services:
  app:
    container_name: waveline-api
    restart: always
    build:
      context: https://github.com/Wellenline/waveline-server.git
    environment:
      - DB_DRIVER=sqlite # postgres,  mysql, cockroachdb, mariadb, sqlite, mssql,
      - DB_HOST=DATABASE_HOST
      - DB_PORT=DATABASE_PORT
      - DB_USERNAME=DATABASE_USERNAME
      - DB_PASSWORD=DATABASE_PASSWORD
      - DB_NAME=DATABASE_NAME
      - MUSIC_PATH=/music
      - CACHE_PATH=/cache
      - ART_PATH=/album-art
      - SPOTIFY_ID=YOUR_SPOTIFY_ID
      - SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET
      - LAST_FM_KEY=YOUR_LAST_FM_API_KEY
      - API_KEY=12345 # remove if you wish to disable auth
      - PORT=5000
      - HOST=http://127.0.0.1:5000
    volumes:
      - YOUR_MUSIC_PATH:/music # Mount your music inside docker
      - ./cache:/cache # Mount dir for album art cache
    ports:
      - 5000:5000
```

```sh
docker-compose up -d
```


## Building From Source

You'll need [NPM](https://www.npmjs.com/get-npm) installed before continuing.

Clone the repo:
```sh
git clone https://github.com/wellenline/waveline-server.git
cd waveline-server
```

Initialize the build using NPM:
```sh
npm i
npm run build
npm start
```

Sample .env file:
```env
DB_DRIVER=sqlite # postgres,  mysql, cockroachdb, mariadb, sqlite, mssql,
DB_HOST=DATABASE_HOST
DB_PORT=DATABASE_PORT
DB_USERNAME=DATABASE_USERNAME
DB_PASSWORD=DATABASE_PASSWORD
DB_NAME=DATABASE_NAME
MUSIC_PATH=PATH_TO_YOUR_MUSIC
CACHE_PATH=./cache
SPOTIFY_ID=YOUR_SPOTIFY_ID
SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET
LAST_FM_KEY=YOUR_LAST_FM_API_KEY
API_KEY=xxxxxxxxxxxx # replace it with something more secure
PORT=5000
HOST=http://127.0.0.1:5000
```

## Artist Pictures (from Spotify)
To display artist pictures you need to sign up for Spotify Developer Account and create a new application
https://developer.spotify.com/dashboard/login

## Artist Bio, similar artists and tags (from Lastfm)
To display artist bio, get similar artists and tags you need to create a new Lastfm application
https://www.last.fm/api/account/create



## API
#### System
|                |Description                    |
|----------------|-------------------------------|
|`GET /system/info`|Get music library details|


#### Tracks
|                |Description                    |
|----------------|-------------------------------|
|`GET /tracks`|All tracks (query: skip, limit, genre, popular, liked, artist, album)|
|`GET /tracks/play/:id`|Stream audio|
|`GET /tracks/like/:id`|Toggle track favourite |
|`GET /tracks/random`| Get random tracks (query: limit) `new` |

#### Search
|                |Description                    |
|----------------|-------------------------------|
|`GET /search`| Search (query: q) |


#### Albums
|                |Description                    |
|----------------|-------------------------------|
|`GET /albums`| Get all albums (query: skip, limit, artist) |
|`GET /albums/:if`| Get all album |
|`GET /albums/random`| Get random albums (query: limit) `new` |
|`GET /albums/art/:id`|Get Album art |


#### Artists
|                |Description                    |
|----------------|-------------------------------|
|`GET /artists`| Get all artists (query: skip, limit) |
|`GET /artists/random`| Get random artists (query: limit) `new` |


#### Playlists ()
|                |Description                    |
|----------------|-------------------------------|
|`GET /playlists`| Get all playlists (query: skip, limit) |
|`POST /playlists`| Create a new playlist `{ name: string, picture?: string }` |
|`POST /playlists/:id`| Add track to playlist `{ track: number }` |
|`PUT /playlists/:id`| Update playlist `{ name: string, tracks: [] }` |
|`DELETE /playlists/:id`| Delete playlist |
|`DELETE /playlists/:id/:track`| Delete track from playlist |


#### Genres
|                |Description                    |
|----------------|-------------------------------|
|`GET /genres`| Get all genres |
