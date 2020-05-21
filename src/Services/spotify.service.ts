import axios from "axios";
export enum KeyTypes {
	ARTISTS = "artists",
	ALBUMS = "albums",
}
export enum Types {
	ARTIST = "artist",
	ALBUM = "album",
}
export class SpotifyService {
	private static _instance: SpotifyService;

	public static get instance(): SpotifyService {
		if (!SpotifyService._instance) {
			SpotifyService._instance = new SpotifyService();
		}

		return SpotifyService._instance;
	}

	private ACCESS_TOKEN: string;

	/**
	 * Fetch album art and artist pictures from Spotify
	 * @param type A comma-separated list of item types to search across. Valid types are: album , artist, playlist, and track.
	 * @param key needle
	 * @param query Search query keywords and optional field filters
	 */
	public async picture(type: string, key: KeyTypes, query: string) {
		try {
			// console.log(type, key, query);
			/*if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET) {
				this.ACCESS_TOKEN = await this.authorize();

				const response = await this.search(type, query);
				// console.dir(response, response[key], key);
				if (response && response[key] && response[key].items && response[key].items.length > 0) {
					return response[key].items[0].images[0] ? response[key].items[0].images[0].url : "";
				}
			}*/
			return "DEMO_IMAGE";
		} catch (e) {
			console.info(e);
		}
	}

	public async search(type: string, query: string) {
		// console.log(`https://api.spotify.com/v1/search?type=${type}&q=${query}`);
		const response = await axios.get(`https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(query)}`, {
			headers: {
				Authorization: `Bearer ${this.ACCESS_TOKEN}`,
			},
		});
		return response.data;

	}

	public async authorize() {

		const response = await axios({
			url: "https://accounts.spotify.com/api/token",
			method: "POST",
			params: {
				grant_type: "client_credentials",
			},
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": `Basic ${Buffer.from(process.env.SPOTIFY_ID + ":" + process.env.SPOTIFY_SECRET).toString("base64")}`,
			},
		});

		return response.data.access_token;
	}
}
