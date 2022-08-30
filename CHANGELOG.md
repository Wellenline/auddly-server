# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.0.0](https://github.com/Wellenline/waveline-server/compare/v4.0.0...v5.0.0) (2022-08-30)


### ⚠ BREAKING CHANGES

* **core:** Api endpoints have changed

### Features

* **core:** users ([46ba169](https://github.com/Wellenline/waveline-server/commit/46ba16962fbb6b91ddc54094ae9a95ed50090cc1))
* **insights:** basic insights about listening habits ([64ceee4](https://github.com/Wellenline/waveline-server/commit/64ceee489d7076722aac3576fef84adb6077dec6))
* **playlists:** populate track, album, artist metadata when querying playlists ([5a61b24](https://github.com/Wellenline/waveline-server/commit/5a61b24c4001c154bc5eea4fb5d537f14d7aaff0))
* **tracks:** fix filtering ([3131d95](https://github.com/Wellenline/waveline-server/commit/3131d952686b7eee2d95b25eaec1aece3c7ce39b))
* **users:** multi user support ([8c4bfa1](https://github.com/Wellenline/waveline-server/commit/8c4bfa141e8f303dd12b0dd6ca1dd6e2fe2ade7c))

## [4.0.0](https://github.com/Wellenline/waveline-server/compare/v3.2.0...v4.0.0) (2021-05-30)


### ⚠ BREAKING CHANGES

* **database:** SQL will be dropped

### Features

* **genre:** change how genres are formatted ([207755c](https://github.com/Wellenline/waveline-server/commit/207755cde4475dc3c143f57b1a1d515028e3d2b6))
* **lyrics:** fetch song lyrics from genius ([2b5cfed](https://github.com/Wellenline/waveline-server/commit/2b5cfed15a5423352254f8deb321cd30f7a6d873))
* **sort:** ability to sort by all properties ([7959305](https://github.com/Wellenline/waveline-server/commit/79593056c9e5f20f6e2dcbffbf0d3b6e8d53312e))
* **track:** scrobble audio using lastfm ([77d1475](https://github.com/Wellenline/waveline-server/commit/77d1475029df66af0fd51c2de3be7e83a2df866b))
* **tracks:** track sorting ([6187e34](https://github.com/Wellenline/waveline-server/commit/6187e3490fcd8b90a980e7b1cf0cfc16fb7702cb))


### Bug Fixes

* **albums:** fix content type ([1bc0ac2](https://github.com/Wellenline/waveline-server/commit/1bc0ac2c3f69ce831b7b3a4c9eaebe6cf975e41e))
* **artists:** remove optional chaining ([9c88d80](https://github.com/Wellenline/waveline-server/commit/9c88d80d30d84acaf6ff648d97c126184b5916af))
* **docker:** fix builds ([cfa4d9c](https://github.com/Wellenline/waveline-server/commit/cfa4d9c078888ba074ae667acab866b65d10cf8f))
* **docker ts-node:** update to latest version ([87d850e](https://github.com/Wellenline/waveline-server/commit/87d850e8825ff162d120e6a2d7ee95b8259573de))
* **genius:** cache access_token ([de67942](https://github.com/Wellenline/waveline-server/commit/de67942156e4c8d6a1c5228ded2467469412582a))
* **genius:** use pre-generated accesstoken ([0963da4](https://github.com/Wellenline/waveline-server/commit/0963da461c9b247551e36a19e8643b7ccc28d543))
* **library:** check if genre exists ([dd65d25](https://github.com/Wellenline/waveline-server/commit/dd65d256114cd4e4ee63e7140282a18f924bf659))
* **library:** remove console log and update model ([6e9cee9](https://github.com/Wellenline/waveline-server/commit/6e9cee97af6fee0b346d1d1867bc71c7f11c5dbd))
* **package:** fix start command ([a97b955](https://github.com/Wellenline/waveline-server/commit/a97b9556f1fce1b6b0d825c8603f7e7b394beb66))
* **playlists:** make sure playlist exists before deleting a track ([637247e](https://github.com/Wellenline/waveline-server/commit/637247edc9bcc2ce1614f962ff2e26df1c517025))
* **sync:** debug logs ([5a9a2dd](https://github.com/Wellenline/waveline-server/commit/5a9a2dd6fa3204325c4bcbd1e4b0af3b1fa32e62))
* **tracks:** switch from .limit -> .take ([7d1c4d9](https://github.com/Wellenline/waveline-server/commit/7d1c4d9d0f6ea5d9d137810039fc5079c15381b0))


* **database:** stop using typeorm and SQL in general ([895182d](https://github.com/Wellenline/waveline-server/commit/895182db9baf7c2740e742466ec16758165bbefd))

## [3.2.0](https://github.com/MihkelBaranov/waveline-server/compare/v3.1.0...v3.2.0) (2020-05-29)


### Features

* **album:** include artist data ([6c8f5ea](https://github.com/MihkelBaranov/waveline-server/commit/6c8f5eae8169d64edaaefdaabab6b95ba7996645))
* **app:** remove mongo ([e10e860](https://github.com/MihkelBaranov/waveline-server/commit/e10e8604ff78eab88efaae9b4522b9ca8a811a4c))
* **artist:** include artist bio, tags and similar artists from lastfm ([53b1116](https://github.com/MihkelBaranov/waveline-server/commit/53b111677ea52baaf28a10abf5f46eaeba7a85e8))
* **database:** switch from mongo to postgres ([5d97245](https://github.com/MihkelBaranov/waveline-server/commit/5d972455533eefe784c877fe8c7123cc11c36d4f))
* **db:** remove db ([c6f7f48](https://github.com/MihkelBaranov/waveline-server/commit/c6f7f48335c0b5c0328330bc041f1a3ef7355c74))
* **lastfm:** remove html tags from artist summary ([50ef036](https://github.com/MihkelBaranov/waveline-server/commit/50ef0366efdf4b041f9fa74453e540ef7fb43479))
* **playlists:** update playlist endpoints to use new db engine ([a85577c](https://github.com/MihkelBaranov/waveline-server/commit/a85577c935de15488b52f6b63499d2912fdace88))
* **search:** update search to use psql ([212117d](https://github.com/MihkelBaranov/waveline-server/commit/212117d5cdded7bb0818f1e3e102dd0b1c7a6672))
* **tracks:** conditional transcoding ([1567871](https://github.com/MihkelBaranov/waveline-server/commit/1567871a9979998d633cfaccfdc0f3ca2c9ec5eb))
* **tracks:** include artist details on album object ([278629c](https://github.com/MihkelBaranov/waveline-server/commit/278629ca40986fd9b56bfd7fab9eb506b60e7395))
* **tracks:** return playlist tracks from /tracks endpoint ([d0b7f4a](https://github.com/MihkelBaranov/waveline-server/commit/d0b7f4a8077b89c9e53a64791a2aae9866f8907c))
* **tracks:** store track no ([79f17f8](https://github.com/MihkelBaranov/waveline-server/commit/79f17f8a9f4fd5be2fe0aa6b91be3298b760d28e))


### Bug Fixes

* **app:** remove mongo import ([ab8a971](https://github.com/MihkelBaranov/waveline-server/commit/ab8a9711ec3bc8a0b1bb5a7e312d5d61b7d1fca1))
* **artist:** check if lastfm responds with data ([740c404](https://github.com/MihkelBaranov/waveline-server/commit/740c4048455f23778459f8de771aec03c2ea10dd))
* **artist:** fix saving track when artist bio returns undefined ([94dfeda](https://github.com/MihkelBaranov/waveline-server/commit/94dfeda5be401d8514d9d26b6c2800d9863d9d39))
* **artist:** fix some tracks failing to save ([bf042f8](https://github.com/MihkelBaranov/waveline-server/commit/bf042f81583194ead0a3fcd3804726041b62a1b5))
* **enities:** make duration, picture etc fields nullable ([9f1ae23](https://github.com/MihkelBaranov/waveline-server/commit/9f1ae23efba9627adb26e8215ed663f9a526811a))
* **search:** convery query to string ([971c1d5](https://github.com/MihkelBaranov/waveline-server/commit/971c1d51abb6205b124461ad7755e5cb06f4c774))
* **sync:** fix sync ([3ce84cc](https://github.com/MihkelBaranov/waveline-server/commit/3ce84cc3a0e99db372714e9ed53890c7e4972846))
* **track:** include audio duration ([d5646c8](https://github.com/MihkelBaranov/waveline-server/commit/d5646c87e89c534e1c5f8e6a8fe082d168b3f5d3))
* **tracks:** fix popular tracks ([7e99b7f](https://github.com/MihkelBaranov/waveline-server/commit/7e99b7fd79a5ff86e340cea911fcb4b6e53a3076))
* **tracks:** respect query params ([4be25d0](https://github.com/MihkelBaranov/waveline-server/commit/4be25d004a6090c7bcbb9b489d00409c9e1543ca))
* **tracks:** update liked query ([b46d853](https://github.com/MihkelBaranov/waveline-server/commit/b46d85363c2b2fe6820886b183ffe168e868ce3f))

## [3.1.0](https://github.com/MihkelBaranov/waveline-server/compare/v3.0.0...v3.1.0) (2020-05-09)


### Features

* **app:** update env vars ([7035de8](https://github.com/MihkelBaranov/waveline-server/commit/7035de8950f534744bc8d1a26d4cfce8fd8ed9d3))
* **library:** improve error handling ([f7bb122](https://github.com/MihkelBaranov/waveline-server/commit/f7bb1220a7e563bff359f789ff3068184b9885e9))
* **sync:** remote sync ([85b962e](https://github.com/MihkelBaranov/waveline-server/commit/85b962e6cc8e938cf32d1855904e73dbbcc41c67))
* **tracks:** make transcoding optional ([0447405](https://github.com/MihkelBaranov/waveline-server/commit/044740571a947d23d29584dea8436ebd13760743)), closes [#23](https://github.com/MihkelBaranov/waveline-server/issues/23)


### Bug Fixes

* **library:** remove test ext from ext array ([60ed8fb](https://github.com/MihkelBaranov/waveline-server/commit/60ed8fb993ee626fa9587b6609cb743196d12d9c))
* **metadata:** use try/catch with async/await instead of chaining .catch ([a2d4db1](https://github.com/MihkelBaranov/waveline-server/commit/a2d4db186519301a97ffc571ccb53778fb881029))
* **tracks:** transcode only flacs for now ([dae4aa3](https://github.com/MihkelBaranov/waveline-server/commit/dae4aa3e7199adc3d9d8fc55473170495e0a96f7))

## [3.0.0](https://github.com/MihkelBaranov/waveline-server/compare/v2.3.0...v3.0.0) (2020-04-18)


### ⚠ BREAKING CHANGES

* **libraryservice:** LibraryService.instance.sync() and /system/sync endpoint got removed

### Features

* **docker:** use alpine image ([55e0968](https://github.com/MihkelBaranov/waveline-server/commit/55e09685bba96597b83461ab36cc47898c0c8621))
* **genre.model:** add findOrCreate method for genre model ([accbe4f](https://github.com/MihkelBaranov/waveline-server/commit/accbe4f640b9965e9bec11f16885a7198e97aa23))
* **libraryservice:** add transcoding support ([e449a06](https://github.com/MihkelBaranov/waveline-server/commit/e449a06e09bf03a22a6d0b00e1604eca34c82080))
* **libraryservice:** remove progress module ([0ee7929](https://github.com/MihkelBaranov/waveline-server/commit/0ee79291988e1fc082b66d70dbb5a63599365c6f))
* **system:** include os specific details in /system/info endpoint ([a8fc4c0](https://github.com/MihkelBaranov/waveline-server/commit/a8fc4c0725f000c54abd6962ffbc45e91e0d2347))
* **tracks:** update /play endpoint to use range headers ([9eeec4f](https://github.com/MihkelBaranov/waveline-server/commit/9eeec4f08d2575beb6c48e530df1e1572c5648f2))


### Bug Fixes

* **app:** headers ([a7415d3](https://github.com/MihkelBaranov/waveline-server/commit/a7415d3db54ed268e9015f5aa82206620e2d0df5))
* **dockerfile:** fix dockerfile ([493c114](https://github.com/MihkelBaranov/waveline-server/commit/493c1147980d15ccbde8c2426c1a90570bf8582e))


* **libraryservice:** rewrite LibraryService to use chokidar ([5685275](https://github.com/MihkelBaranov/waveline-server/commit/56852757e719938c14d6c83b5252de9d3ac06b94))

## [2.3.0](https://github.com/MihkelBaranov/waveline-server/compare/v2.2.0...v2.3.0) (2020-04-13)


### Features

* **library:** include progress bar when scanning the library ([2d6df62](https://github.com/MihkelBaranov/waveline-server/commit/2d6df6291e704e8835de466468ada85ed76111aa))
* **tracks:** endpoint for popular tracks(ordered by play count) ([dde3e05](https://github.com/MihkelBaranov/waveline-server/commit/dde3e05926d40ab6808f6ed11002ec7844e65ef4))
* cors ([d62680a](https://github.com/MihkelBaranov/waveline-server/commit/d62680a75de397105eb943090a9867e2ebdda8e5))


### Bug Fixes

* **cors:** allow headers ([379378c](https://github.com/MihkelBaranov/waveline-server/commit/379378c0b1eff703031a61e9200903085e29c681))

## [2.2.0](https://github.com/MihkelBaranov/waveline-server/compare/v2.1.1...v2.2.0) (2020-03-10)


### Features

* new API endpoints & new dev apk ([5d334c2](https://github.com/MihkelBaranov/waveline-server/commit/5d334c296ac53e87b20dcce4786c4b65c8a00374))

### [2.1.1](https://github.com/MihkelBaranov/waveline-server/compare/v2.1.0...v2.1.1) (2020-02-23)

## [2.1.0](https://github.com/MihkelBaranov/waveline-server/compare/v2.0.3...v2.1.0) (2020-02-22)


### Features

* include debug apk ([49331de](https://github.com/MihkelBaranov/waveline-server/commit/49331de))
* **playlists:** playlist endpoints + querying ([1d3d042](https://github.com/MihkelBaranov/waveline-server/commit/1d3d042))
* **playlists:** testing out custom playlists ([a4a1365](https://github.com/MihkelBaranov/waveline-server/commit/a4a1365))

### [2.0.3](https://github.com/MihkelBaranov/waveline-server/compare/v2.0.2...v2.0.3) (2019-09-05)


### Bug Fixes

* fix imports ([181f6dc](https://github.com/MihkelBaranov/waveline-server/commit/181f6dc))

### [2.0.2](https://github.com/MihkelBaranov/waveline-server/compare/v2.0.1...v2.0.2) (2019-09-04)

### [2.0.1](https://github.com/MihkelBaranov/waveline-server/compare/v1.0.0...v2.0.1) (2019-09-04)
