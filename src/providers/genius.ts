import axios from "axios";
import geniusApi from "genius-lyrics-api";
export async function getLyrics(title: string, artist: string): Promise<string | undefined> {

	try {
		if (process.env.GENIUS_CLIENT && process.env.GENIUS_SECRET) {
			console.log(title, artist);
			const ACCESS_TOKEN = await getAccessToken();

			console.log(ACCESS_TOKEN);

			const lyrics = await geniusApi.getLyrics({
				title,
				artist,
				apiKey: ACCESS_TOKEN,
				optimizeQuery: true,
			});

			return lyrics;
		}
	} catch (err) {
		console.log(err);
	}

}

async function getAccessToken() {
	const { data } = await axios({
		url: "https://api.genius.com/oauth/token",
		method: "POST",
		params: {
			grant_type: "client_credentials",
		},
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data: `client_id=${process.env.GENIUS_CLIENT}&client_secret=${process.env.GENIUS_SECRET}&grant_type=client_credentials`
	});

	return data.access_token;
}