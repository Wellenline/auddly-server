import { AlbumModel } from "../Models/album.model";
import { TrackModel } from "../Models/track.model";
import { ArtistModel } from "../Models/artist.model";
import { Resource, Get, Context } from "@wellenline/via";
import { Track } from "../Entities/track";
import { Like, Raw, getManager } from "typeorm";
import { Album } from "../Entities/album";
import { Artist } from "../Entities/artist";
@Resource("/search")
export class Search {
	/**
	 * @api {get} /search?q=:SEARCH_QUERY Search
	 * @apiDescription Search tracks, artists and albums
	 * @apiGroup Search
	 * @apiName search.index
	 * @apiVersion 3.0.0
	 * @returns { albums: [], artists: [], tracks: []}
	 */
	@Get("/")
	public async index(@Context("query") query: { q: string }) {
		const results = {
			albums: [],
			artists: [],
			tracks: [],
		};
		results.tracks = await getManager().createQueryBuilder(Track, "track")
			.select()
			.where("LOWER(track.artist) LIKE :q", { q: `%${query.q.toString().toLowerCase()}%` })
			.orWhere("LOWER(track.name) LIKE :q", { q: `%${query.q.toString().toLowerCase()}%` })
			.leftJoinAndSelect("track.artists", "artists")
			.leftJoinAndSelect("track.playlists", "playlists")

			.leftJoinAndSelect("track.album", "album")
			.leftJoinAndSelect("album.artist", "albumArtist")
			.leftJoinAndSelect("track.genre", "genre")
			.getMany();

		results.albums = await getManager().createQueryBuilder(Album, "album")
			.select()
			.where("LOWER(album.name) LIKE :q", { q: `%${query.q.toString().toLowerCase()}%` })
			.leftJoinAndSelect("album.artist", "artist")
			.getMany();

		results.artists = await getManager().createQueryBuilder(Artist, "artist")
			.select()
			.where("LOWER(name) LIKE :q", { q: `%${query.q.toString().toLowerCase()}%` })
			.getMany();

		return results;
	}

}
