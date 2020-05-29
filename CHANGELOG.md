# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
