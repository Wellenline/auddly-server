# Waveline Music Server
<img width="500" src="https://preview.redd.it/3vujqpdulbi41.png?width=2756&format=png&auto=webp&s=2cd56216825a7e9d9145e6b1fb2eb7750bb079d3">

<a href="https://play.google.com/store/apps/details?id=com.waveline.app" target="_blank">
<img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" width="200">
</a>

## Database
Waveline works following databases: `postgres, mysql, cockroachdb, mariadb, sqlite, mssql,`

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
      - DB_DRIVER=postgres #  mysql, cockroachdb, mariadb, sqlite, mssql,
      - DB_HOST=DATABASE_HOST
      - DB_PORT=DATABASE_PORT
      - DB_USERNAME=DATABASE_USERNAME
      - DB_PASSWORD=DATABASE_PASSWORD
      - DB_NAME=DATABASE_NAME
      - MUSIC_PATH=/music
      - TRANSCODE_PATH=/transcoded-audio
      - ART_PATH=/album-art
      - SPOTIFY_ID=YOUR_SPOTIFY_ID
      - SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET
      - LAST_FM_KEY=YOUR_LAST_FM_API_KEY
      - API_KEY=12345 # remove if you wish to disable auth
      - PORT=5000
      - HOST=http://127.0.0.1:5000
    volumes:
      - YOUR_MUSIC_PATH:/music # Mount your music inside docker
      - ./album-art:/album-art # Mount album art cache inside docker
      - ./transcoded-audio:/transcoded-audio # Mount transcoded audio cache inside docker
    ports:
      - 5000:5000
```

```sh
docker-compose up -d
```

## Artist Pictures (Using Spotify)
To display artist pictures you need to sign up for Spotify Developer Account and create a new application
https://developer.spotify.com/dashboard/login

## Artist Bio, similar artists and tags (Using Lastfm)
To display artist bio, get similar artists and tags you need to create a new Lastfm application
https://www.last.fm/api/
https://www.last.fm/api/account/create


## Transcoding
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
