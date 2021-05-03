import axios from "axios";

export enum KeyType {
	ARTISTS = "artists",
	ALBUMS = "albums",
}
export enum Type {
	ARTIST = "artist",
	ALBUM = "album",
}


/**
 * Fetch album art and artist pictures from Spotify
 * @param type A comma-separated list of item types to search across. Valid types are: album , artist, playlist, and track.
 * @param key needle
 * @param query Search query keywords and optional field filters
 */
export async function getPicture(type: "artist" | "album" | "playlist" | "track", key: KeyType, query: string) {
	try {
		// console.log(type, key, query);
		if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET) {
			const ACCESS_TOKEN = await getAccessToken();

			const { data } = await axios.get(`https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${ACCESS_TOKEN}`,
				},
			});

			// console.dir(response, response[key], key);
			if (data && data[key] && data[key].items && data[key].items.length > 0) {
				return data[key].items[0].images[0] ? data[key].items[0].images[0].url : "";
			}
		}
		// return "DEMO_IMAGE";
	} catch (e) {
		console.info(e);
	}
}

/**
 * Get spotify access token
 * @returns access token
 */
async function getAccessToken() {
	const { data } = await axios({
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

	return data.access_token;
}