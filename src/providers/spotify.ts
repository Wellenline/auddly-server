import axios from "axios";

export enum KeyType {
	ARTISTS = "artists",
	ALBUMS = "albums",
	TRACKS = "tracks",
}
export enum Type {
	ARTIST = "artist",
	ALBUM = "album",
	TRACK = "track",
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

			if (data && data[key] && data[key].items && data[key].items.length > 0) {
				return data[key].items[0].images[0] ? data[key].items[0].images[0].url : "";
			}
		}
		// return "DEMO_IMAGE";
	} catch (e) {
		console.info(e);
	}
}


// fetch audio features for a track
export async function getTrack(type: "artist" | "album" | "playlist" | "track", key: KeyType, query: string) {
	try {

		if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET) {
			const ACCESS_TOKEN = await getAccessToken();

			const { data } = await axios.get(`https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${ACCESS_TOKEN}`,
				},
			});

			// grab first track id
			if (data && data[key] && data[key].items && data[key].items.length > 0) {
				return await getAudioFeatures(data[key].items[0].id);
			}
		}
		// return "DEMO_IMAGE";
	} catch (e) {
		console.info(e);
	}
}

// fetch audio features for a track
export async function getAudioFeatures(trackId: string) {
	try {

		if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET) {
			const ACCESS_TOKEN = await getAccessToken();

			const { data } = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
				headers: {
					Authorization: `Bearer ${ACCESS_TOKEN}`,
				},
			});

			// console.dir(response, response[key], key);
			if (data) {
				console.log("Found audio features for track", trackId, data);
				const {
					danceability,
					energy,
					key,
					loudness,
					mode,
					speechiness,

					acousticness,
					instrumentalness,
					liveness,
					valence,
					tempo,
					type,
					spotify_id,
					uri,
					track_href,
					analysis_url,
					duration_ms,
					time_signature
				} = data
				return {
					danceability,
					energy,
					key,
					loudness,
					mode,
					speechiness,

					acousticness,
					instrumentalness,
					liveness,
					valence,
					tempo,
					type,
					spotify_id,
					uri,
					track_href,
					analysis_url,
					duration_ms,
					time_signature
				};
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