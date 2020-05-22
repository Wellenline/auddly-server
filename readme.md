# Waveline Music Server
<img width="500" src="https://preview.redd.it/3vujqpdulbi41.png?width=2756&format=png&auto=webp&s=2cd56216825a7e9d9145e6b1fb2eb7750bb079d3">

<a href="https://play.google.com/store/apps/details?id=com.waveline.app" target="_blank">
<img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" width="200">
</a>


### Using Docker-Compose
```docker
version: '3'
services:
  app:
    container_name: waveline-api
    restart: always
    build:
      context: https://github.com/Wellenline/waveline-server.git
    environment:
	  - DB_DRIVER=postgres #  mysql, cockroachdb, mariadb, sqlite, mssql,
      - MONGO_URL=mongodb://YOUR_MONGO_USER:YOUR_MONGO_PASS@mongodb/waveline?authSource=admin
      - MUSIC_PATH=/music
      - TRANSCODE_PATH=/transcoded-audio
      - ART_PATH=/album-art
      - SPOTIFY_ID=YOUR_SPOTIFY_ID
      - SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET
      - LAST_FM_KEY=YOUR_LAST_FM_API_KEY
      - AUTH_ENABLED=true
      - TRANSCODING=false # set to true to enable transcoding for flac files
      - API_KEY=12345 # replace it with something more secure
      - PORT=5000
      - HOST=http://127.0.0.1:5000
    volumes:
      - YOUR_MUSIC_PATH:/music # Mount your music inside docker
      - ./album-art:/album-art # Mount album art cache inside docker
      - ./transcoded-audio:/transcoded-audio # Mount transcoded audio cache inside docker
    ports:
      - 5000:5000
    links:
      - mongodb
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    container_name: "mongodb"
    environment:
      - MONGO_DATA_DIR=/data
      - MONGO_LOG_DIR=/dev/null
      - MONGO_INITDB_ROOT_USERNAME=YOUR_MONGO_USER
      - MONGO_INITDB_ROOT_PASSWORD=YOUR_MONGO_PASS
    volumes:
      - ./data/mongo:/data
    ports:
      - 27017:27017
    command: mongod --auth --logpath=/dev/null
```

```sh
docker-compose up -d
```


### Building From Source

You'll need [NPM](https://www.npmjs.com/get-npm) installed before continuing.

Clone the repo:
```Sh
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
MUSIC_PATH=./demo
ART_PATH=./album-art
TRANSCODE_PATH=./transcoded-audio
SPOTIFY_ID=xxxxx
SPOTIFY_SECRET=xxxxx
LAST_FM_KEY=xxxxx
MONGO_URL=mongodb://localhost/waveline
AUTH_ENABLED=false
TRANSCODING=false
API_KEY=1234
PORT=5000
HOST=http://192.168.1.120:5000
```

### Artist Pictures (Using Spotify)
To display artist pictures you need to sign up for Spotify Developer Account and create a new application
https://developer.spotify.com/dashboard/login

### Artist Bio, similar artists and tags (Using Lastfm)
To display artist bio, get similar artists and tags you need to create a new Lastfm application
https://www.last.fm/api/
https://www.last.fm/api/account/create


### Transcoding
WIP

## Roadmap
Waveline is a personal project and my current goals are

* Offline mode
* Improved Caching
* Casting support (chromecast?)
* <s>Desktop app</s>  [Wellenline/waveline-web](https://github.com/Wellenline/waveline-web)
* iOS version


## Join our discord
![Discord](https://img.shields.io/discord/712899309242286090)

https://discord.gg/hqxATH

## API
#### System
|                |Description                    |
|----------------|-------------------------------|
|`GET /system/info`|Get music library details|


#### Tracks
|                |Description                    |
|----------------|-------------------------------|
|`GET /tracks`|All tracks (query: skip, limit, genre, favourties, artist, album)|
|`GET /tracks/play/:id`|Stream audio|
|`GET /tracks/like/:id`|Toggle track favourite |
|`GET /tracks/random`| Get random tracks (query: limit) `new` |
|`GET /tracks/popular`|Get popular tracks (query: skip, limit, genre, artist, album) `new`|
|`GET /tracks/new`|New Tracks|

#### Search
|                |Description                    |
|----------------|-------------------------------|
|`GET /search`| Search (query: q) |


#### Albums
|                |Description                    |
|----------------|-------------------------------|
|`GET /albums`| Get all albums (query: skip, limit) |
|`GET /albums/random`| Get random albums (query: limit) `new` |
|`GET /albums/new`| Get new albums `new` |
|`GET /albums/art/:id`|Get Album art |


#### Artists
|                |Description                    |
|----------------|-------------------------------|
|`GET /artists`| Get all artists |
|`GET /artists/random`| Get random artists (query: limit) `new` |
|`GET /artists/new`| Get new artists `new` |


#### Playlists ()
|                |Description                    |
|----------------|-------------------------------|
|`GET /playlists`| Get all playlists |
|`POST /playlists`| Create a new playlist `{name: string, tracks: []}` |
|`PUT /playlists/:id`| Update playlist `{name: string, tracks: []}` |
|`DELTE /playlists/:id`| Delete playlist |

#### Genres
|                |Description                    |
|----------------|-------------------------------|
|`GET /genres`| Get all genres |
