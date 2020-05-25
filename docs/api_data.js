define({ "api": [
  {
    "type": "post",
    "url": "/playlists",
    "title": "Create a new playlist",
    "description": "<p>Create a new playlist</p>",
    "group": "Playlists",
    "name": "playlists.create",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>playlist name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "picture",
            "description": "<p>Optional playlist picture</p>"
          }
        ]
      }
    },
    "version": "3.0.0",
    "filename": "src/Http/playlists.ts",
    "groupTitle": "Playlists"
  },
  {
    "type": "delete",
    "url": "/playlists/:playlistId/",
    "title": "Delete playlist",
    "description": "<p>Delete playlist</p>",
    "group": "Playlists",
    "name": "playlists.delete",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "playlist",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "version": "3.0.0",
    "filename": "src/Http/playlists.ts",
    "groupTitle": "Playlists"
  },
  {
    "type": "get",
    "url": "/playlists",
    "title": "List all playlists",
    "description": "<p>List all playlists</p>",
    "group": "Playlists",
    "name": "playlists.index",
    "version": "3.0.0",
    "filename": "src/Http/playlists.ts",
    "groupTitle": "Playlists"
  },
  {
    "type": "delete",
    "url": "/playlists/:playlistId/:trackId",
    "title": "Remove track from playlist",
    "description": "<p>Remove track from playlist</p>",
    "group": "Playlists",
    "name": "playlists.removeFromPlaylist",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "playlistId",
            "optional": false,
            "field": "playlist",
            "description": "<p>id</p>"
          },
          {
            "group": "Parameter",
            "type": "trackId",
            "optional": false,
            "field": "track",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "version": "3.0.0",
    "filename": "src/Http/playlists.ts",
    "groupTitle": "Playlists"
  },
  {
    "type": "put",
    "url": "/playlists/:playlistId/",
    "title": "Update playlist",
    "description": "<p>Update playlist</p>",
    "group": "Playlists",
    "name": "playlists.update",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "playlistId",
            "optional": false,
            "field": "playlist",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "version": "3.0.0",
    "filename": "src/Http/playlists.ts",
    "groupTitle": "Playlists"
  },
  {
    "type": "post",
    "url": "/playlists/:playlistId",
    "title": "Add track to playlist",
    "description": "<p>Add track to playlist</p>",
    "group": "Playlists",
    "name": "playlists.upload",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "playlistId",
            "optional": false,
            "field": "playlist",
            "description": "<p>id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "track",
            "description": "<p>track id to add to playlist</p>"
          }
        ]
      }
    },
    "version": "3.0.0",
    "filename": "src/Http/playlists.ts",
    "groupTitle": "Playlists"
  },
  {
    "type": "get",
    "url": "/playlists/:id",
    "title": "Get playlist",
    "description": "<p>Get playlist</p>",
    "group": "Playlists",
    "name": "playlists.view",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "playlist",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "version": "3.0.0",
    "filename": "src/Http/playlists.ts",
    "groupTitle": "Playlists"
  },
  {
    "type": "get",
    "url": "/search?q=:SEARCH_QUERY",
    "title": "Search",
    "description": "<p>Search tracks, artists and albums</p>",
    "group": "Search",
    "name": "search.index",
    "version": "3.0.0",
    "filename": "src/Http/search.ts",
    "groupTitle": "Search"
  }
] });
