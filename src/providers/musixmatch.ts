import axios from "axios";
import { JSDOM } from "jsdom";

const cache: any = {};

const domRequest = async (url: string) => {
	const response = await axios({
		url,
		method: "GET",
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.148 Safari/537.36 Vivaldi/1.4.589.38"
		}
	});


	if (response.status !== 200) { throw new Error("Lyrics unavailable"); }

	const dom = new JSDOM(response.data, { url });
	const $$ = (x: any) => [...dom.window.document.querySelectorAll(x)];
	const text = (x: { childNodes: any; }) => x ? [...x.childNodes].find(y => y.nodeName === "#text").nodeValue : null;

	return { $$, text };
};

export const getData = async (query: any) => {
	if (query in cache) { return cache[query]; }

	const list = await searchFor(query);
	if (list.length > 0) {
		const result = await extractFrom(list[0].url);

		cache[query] = result;
		return result;
	}

	return false;
};

const searchFor = async (query: string | number | boolean) => {
	const url = `https://musixmatch.com/search/${encodeURIComponent(query)}/tracks`;
	console.log(url);
	const { $$, text } = await domRequest(url);

	return $$(".tracks.list li").map(li => ({
		title: text(li.querySelector(".title span")),
		artist: text(li.querySelector(".artist")),
		url: li.querySelector(".title").href,
		art: li.querySelector("img").srcset.split(",").splice(-1)[0].trim().split(" ")[0]
	}));
};

const extractFrom = async (url: any) => {
	const { $$, text } = await domRequest(url);

	return {
		url,
		title: text($$(".mxm-track-title__track")[0]),
		artists: $$(".mxm-track-title__artist").map(x => text(x)),
		album: text($$(".mxm-track-footer__album h2")[0]),
		art: $$(".banner-album-image img")[0].src,
		lyrics: $$(".mxm-lyrics__content").map(x => x.textContent).join("\n")
	};
};