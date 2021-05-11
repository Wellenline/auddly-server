import geniusApi from "genius-lyrics-api";

export async function getLyrics(title: string, artist: string): Promise<string | undefined> {

	try {
		if (process.env.GENIUS_ACCESS_TOKEN) {
			const lyrics = await geniusApi.getLyrics({
				title,
				artist,
				apiKey: process.env.GENIUS_ACCESS_TOKEN,
				optimizeQuery: true,
			});

			return lyrics;
		}
	} catch (err) {
		console.log(err);
	}

}
