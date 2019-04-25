import axios from "axios";
export class Spotify {
	private ACCESS_TOKEN: string;
	public async search(type: string, query: string) {
		try {
			await this.authorize();
			const response = await axios.get(`https://api.spotify.com/v1/search?type=${type}&q=${query}`, {
				headers: {
					Authorization: `Bearer ${this.ACCESS_TOKEN}`,
				},
			});
			return response.data;
		} catch (e) {
			throw new Error(e);
		}
	}

	public async authorize() {
		try {
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

			this.ACCESS_TOKEN = response.data.access_token;

			return response.data;
		} catch (e) {
			throw new Error(e);
		}

	}
}
