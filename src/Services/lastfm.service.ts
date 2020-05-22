import axios from "axios";
export class LastfmService {
	private static _instance: LastfmService;

	public static get instance(): LastfmService {
		if (!LastfmService._instance) {
			LastfmService._instance = new LastfmService();
		}
		return LastfmService._instance;
	}

	public async artist(artist: string) {
		try {

			if (process.env.LAST_FM_KEY) {
				const { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${process.env.LAST_FM_KEY}&format=json`);

				if (data.artist) {
					return {
						tags: data.artist.tags.tag.map((tag) => tag.name),
						bio: data.artist.bio.content,
						similar: data.artist.similar.artist.map((a) => a.name),
					};
				}

			}
		} catch (e) {
			console.error(e);
		}
	}
}
