# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
