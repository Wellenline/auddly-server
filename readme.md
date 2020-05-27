# Waveline Music Server
[![Discord](https://img.shields.io/discord/712899309242286090?logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/mJQm8SJ)
<img src="https://preview.redd.it/3vujqpdulbi41.png?width=2756&format=png&auto=webp&s=2cd56216825a7e9d9145e6b1fb2eb7750bb079d3">

<a href="https://play.google.com/store/apps/details?id=com.waveline.app" target="_blank">
<img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" width="200">
</a>

## Getting Started
You need a [MongoDB](https://www.mongodb.com/) server before you can use Waveline. See the [docker-compose.yml](https://github.com/Wellenline/waveline-server/blob/master/sample.docker-compose.yml) sample if you're unsure on how to set this up.

You can pull the latest Waveline image from [Docker Hub](https://hub.docker.com/r/wellenline/waveline-server) and run it by using the following command:

```
docker run -d --name="Waveline-Server" \
  -e MONGO_URL=mongodb://YOUR_MONGO_USER:YOUR_MONGO_PASS@mongodb/waveline?authSource=admin \
  -e MUSIC_PATH=/music \
  -e TRANSCODE_PATH=/transcoded-audio \
  -e ART_PATH=/album-art \
  -e SPOTIFY_ID=YOUR_SPOTIFY_ID \
  -e SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET \
  -e AUTH_ENABLED=true \
  -e API_KEY=12345 \
  -e PORT=5000 \
  -e HOST=http://127.0.0.1:5000 \
  -p 5000:5000 \
  -v YOUR_MUSIC_PATH:/music \
  -v ./album-art:/album-art \
  -v ./transcoded-audio:/transcoded-audio \
  --restart unless-stopped \
  wellenline/waveline-server:latest
```

### Using Docker-Compose
Instead of using `docker run`, you can use [Docker-Compose](https://github.com/docker/compose) to orchestrate your Waveline setup, consisting of a [MongoDB](https://www.mongodb.com/) instance and a Waveline-Server:

```docker
version: '3'
services:
  app:
    image: wellenline/waveline-server:latest
    environment:
      - MONGO_URL=mongodb://YOUR_MONGO_USER:YOUR_MONGO_PASS@mongodb/waveline?authSource=admin
      - MUSIC_PATH=/music
      - TRANSCODE_PATH=/transcoded-audio
      - ART_PATH=/album-art
      - SPOTIFY_ID=YOUR_SPOTIFY_ID
      - SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET
      - AUTH_ENABLED=true
      - TRANSCODING=false # set to true to enable transcoding for flac files
      - API_KEY=12345 # replace it with something more secure
      - PORT=5000
      - HOST=http://127.0.0.1:5000
    ports:
      - 5000:5000
    volumes:
      - YOUR_MUSIC_PATH:/music # Mount your music inside docker
      - ./album-art:/album-art # Mount album art cache inside docker
      - ./transcoded-audio:/transcoded-audio # Mount transcoded audio cache inside docker
    restart: unless-stopped
    links:
      - mongodb
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    environment:
      - MONGO_DATA_DIR=/data
      - MONGO_LOG_DIR=/dev/null
      - MONGO_INITDB_ROOT_USERNAME=YOUR_MONGO_USER
      - MONGO_INITDB_ROOT_PASSWORD=YOUR_MONGO_PASS
    ports:
      - 27017:27017
    volumes:
      - ./data/mongo:/data
    restart: unless-stopped
    command: mongod --auth --logpath=/dev/null
```
Then run `docker-compose up -d` to bring the containers online.

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
MONGO_URL=mongodb://YOUR_MONGO_USER:YOUR_MONGO_PASS@mongodb/waveline?authSource=admin
MUSIC_PATH=/music
TRANSCODE_PATH=/transcoded-audio
TRANSCODING=false
ART_PATH=/album-art
SPOTIFY_ID=YOUR_SPOTIFY_ID
SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET
AUTH_ENABLED=true
API_KEY=12345 # replace it with something more secure
PORT=5000
HOST=http://127.0.0.1:5000
```

### Artist Pictures (Using Spotify)
To display artist pictures you need to sign up for [Spotify Developer Account](https://developer.spotify.com/dashboard/login) and create a new application, then pass the `client id` and `client secret` to Waveline as environment variables.

### Transcoding
WIP

## Roadmap
Waveline is a personal project and my current goals are

* Offline mode
* Improved Caching
* Casting support (chromecast?)
* <strike>Desktop app</strike>  [Wellenline/waveline-web](https://github.com/Wellenline/waveline-web)
* iOS version


## API
#### System
| Route                  | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| `GET /system/info`     | Get music library details                                           |


#### Tracks
| Route                  | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| `GET /tracks`          | All tracks (query: skip, limit, genre, favourties, artist, album)   |
| `GET /tracks/play/:id` | Stream audio                                                        |
| `GET /tracks/like/:id` | Toggle track favourite                                              |
| `GET /tracks/random`   | Get random tracks (query: limit) `new`                              |
| `GET /tracks/popular`  | Get popular tracks (query: skip, limit, genre, artist, album) `new` |
| `GET /tracks/new`      | Get new Tracks                                                      |

#### Search
| Route                  | Description                                                         |
|------------------------|---------------------------------------------------------------------|
|`GET /search`           | Search (query: q)                                                   |

#### Albums
| Route                  | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| `GET /albums`          | Get all albums (query: skip, limit)                                 |
| `GET /albums/random`   | Get random albums (query: limit) `new`                              |
| `GET /albums/new`      | Get new albums `new`                                                |
| `GET /albums/art/:id`  | Get Album art                                                       |


#### Artists
| Route                  | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| `GET /artists`         | Get all artists                                                     |
| `GET /artists/random`  | Get random artists (query: limit) `new`                             |
| `GET /artists/new`     | Get new artists `new`                                               |


#### Playlists
| Route                  | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| `GET /playlists`       | Get all playlists                                                   |
| `POST /playlists`      | Create a new playlist `{name: string, tracks: []}`                  |
| `PUT /playlists/:id`   | Update playlist `{name: string, tracks: []}`                        |
| `DELTE /playlists/:id` | Delete playlist                                                     |

#### Genres
| Route                  | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| `GET /genres`          | Get all genres                                                      |
