import { Album } from "@src/models/album";
import { Track } from "@src/models/track";
import { DocumentType } from "@typegoose/typegoose";
import axios from "axios";
import { createHash } from "crypto";
import moment from "moment";

let LAST_FM_SESSION_KEY = "";

/**
 * Get artist metadata from LastFM
 * @param artist artist name
 * @returns artist metadata | null
 */
export async function getArtistMetadata(artist: string) {
	try {
		if (process.env.LAST_FM_API_KEY) {
			const { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${process.env.LAST_FM_API_KEY}&format=json`);

			if (data.artist) {
				return {
					tags: data.artist.tags.tag.map((tag: { name: string; }) => tag.name),
					bio: data.artist.bio.summary.replace(/(&nbsp;|<([^>]+)>)/ig, ""),
					similar: data.artist.similar.artist.map((a: { name: string; }) => a.name),
				};
			}

		}
	} catch (err) {
		console.log("[lastFM error]:", err);
	}
}
/**
 * Scrobble audio with lastFm
 * @param track Track
 */
export async function onScrobble(track: DocumentType<Track>) {
	try {
		if (!LAST_FM_SESSION_KEY) {
			LAST_FM_SESSION_KEY = await getSessionKey();
		}

		const timestamp = moment().unix();

		const params = sign({
			method: "track.scrobble",
			sk: LAST_FM_SESSION_KEY,
			artist: track.artist,
			album: (track.album as Album).name,
			track: track.name,
			timestamp
		});
		const { data } = await axios({
			url: `http://ws.audioscrobbler.com/2.0/?method=track.scrobble&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
			method: "POST",
			params: {
				...params
			},
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		// console.log(data);
	} catch (err) {
		console.log("Failed to get scrobble audio");

	}
}

async function getSessionKey() {
	try {
		const params = sign({
			method: "auth.getMobileSession",
			username: process.env.LAST_FM_USERNAME,
			password: process.env.LAST_FM_PASSWORD,
		});
		const { data } = await axios({
			url: `https://ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
			method: "POST",
			params,

			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return data.session.key;
	} catch (err) {
		console.log("Failed to get session key");
	}
}

export function sign(params: any) {
	params.api_key = process.env.LAST_FM_API_KEY;
	const keys = Object.keys(params);
	keys.sort();
	let chain = "";
	for (const key of keys) {
		chain += key + params[key];
	}
	params.api_sig = createHash("md5").update(chain + process.env.LAST_FM_API_SECRET).digest("hex");
	return params;
}
