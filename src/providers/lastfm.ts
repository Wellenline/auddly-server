import axios from "axios";

/**
 * Get artist metadata from LastFM
 * @param artist artist name
 * @returns artist metadata | null
 */
export async function getArtistMetadata(artist: string) {
	try {
		if (process.env.LAST_FM_KEY) {
			const { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${process.env.LAST_FM_KEY}&format=json`);

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