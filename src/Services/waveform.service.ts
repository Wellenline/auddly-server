import { existsSync, mkdirSync, createReadStream, createWriteStream, readFileSync, writeFileSync, writeFile } from "fs";
import { spawn } from "child_process";

import { createCanvas } from "canvas";
import { Track } from "../Entities/track";
export interface IWaveformOptions {
	width?: number;
	height?: number;
	barWidth?: number;
	barGap?: number;
	waveColor?: string;
	waveAlpha?: number;
	backgroundColor?: string;
	baseline?: number;
	padding?: number;
	baselineWidth?: number;
	baselineColor?: string;
}
export class WaveformService {
	private static _instance: WaveformService;

	public static get instance(): WaveformService {
		if (!WaveformService._instance) {
			WaveformService._instance = new WaveformService();
		}

		return WaveformService._instance;
	}

	public async load(track: Track, color?: string) {
		const options: IWaveformOptions = {};

		if (color) {
			options.waveColor = `#${color}`;
		}

		/*const file = `./waveforms/${track.id}-${options.waveColor ? "highlight" : "base"}.png`;

		if (existsSync(file)) {
			return readFileSync(file);
		}

		const buffer = await this.create(track.path, options);
		writeFile(file, buffer, (err) => console.error(err));*/
		const buffer = await this.create(track.path, options);

		return buffer;
	}

	private async create(file?: string, options?: IWaveformOptions) {


		const defaults: IWaveformOptions = {
			width: 1240,
			height: 150,
			barWidth: 15,
			barGap: 0.5,
			waveColor: "gray",
			waveAlpha: 1,
			backgroundColor: "transparent",
			baseline: 75,
			padding: 10,
			baselineWidth: 0,
			baselineColor: "white"
		};

		options = Object.assign({}, defaults, options);

		const canvas = createCanvas(options.width, options.height);
		const canvasContext = canvas.getContext("2d");

		const data = await this.getPcmData(file);

		const step = Math.floor(data.length / options.width);
		const ratio = options.baseline / options.height;
		const vals = [];
		canvasContext.imageSmoothingEnabled = false;

		canvasContext.fillStyle = options.backgroundColor;
		canvasContext.fillRect(0, 0, options.width, options.height);

		canvasContext.fillStyle = options.waveColor;

		for (let i = 0; i < options.width; i += options.barWidth) {
			const position = i * step;
			let sum = 0.0;
			for (let j = position; j <= (position + step) - 1; j++) {
				sum += Math.pow(data[j], 2);
			}
			vals.push(Math.sqrt(sum / data.length) * 10000);
		}

		const maxValue = Math.max.apply(null, vals);

		vals.forEach((val, index) => {
			const scale = options.height / maxValue;
			val *= scale;
			let w = options.barWidth;
			if (options.barGap !== 0) {
				w *= Math.abs(1 - options.barGap);
			}
			const x = index * options.barWidth + (w / 2);

			let lowerHeight = val * ratio;

			if (lowerHeight < options.padding) {
				lowerHeight = 1;
			} else {
				lowerHeight -= options.padding;
			}

			let upperHeight = val * (1 - ratio);

			if (upperHeight < options.padding) {
				upperHeight = 1;
			} else {
				upperHeight -= options.padding;
			}

			if (options.waveAlpha < 1) {
				canvasContext.clearRect(x, options.baseline, w, upperHeight);
				canvasContext.clearRect(x, options.baseline, w, -lowerHeight);
				canvasContext.globalAlpha = options.waveAlpha;
			}
			canvasContext.fillRect(x, options.baseline, w, upperHeight);
			canvasContext.fillRect(x, options.baseline, w, -lowerHeight);
		});

		if (options.baselineWidth >= 1) {
			canvasContext.fillStyle = options.baselineColor;
			canvasContext.fillRect(0, options.baseline - (options.baselineWidth / 2), options.width, options.baselineWidth);
		}


		return canvas.toBuffer();
	}


	private getPcmData(file: string, options?: { stereo?: boolean, sampleRate?: number }): Promise<any[]> {
		return new Promise((resolve, reject) => {
			let outputStr = "";
			let oddByte = null;
			let channel = 0;
			let hasData = false;
			const samples = [];

			options = options || {
				stereo: true,
				sampleRate: 44100
			};

			const channels = options.stereo ? 2 : 1;
			const sampleRate = options.sampleRate;

			const ffmpeg = spawn("ffmpeg", ["-i", file, "-f", "s16le", "-ac", channels.toString(),
				"-acodec", "pcm_s16le", "-ar", sampleRate.toString(), "-y", "pipe:1"]);

			ffmpeg.stdout.on("data", (data) => {
				hasData = true;

				let value: number;
				let i = 0;
				const dataLen = data.length;

				if (oddByte !== null) {
					// tslint:disable-next-line: no-bitwise
					value = ((data.readInt8(i++, true) << 8) | oddByte) / 32767.0;
					if (channel === 0) {
						samples.push(value);
					}

					channel = ++channel % 2;
				}

				for (; i < dataLen; i += 2) {
					value = data.readInt16LE(i, true) / 32767.0;
					if (channel === 0) {
						samples.push(value);
					}
					channel = ++channel % 2;
				}

				oddByte = (i < dataLen) ? data.readUInt8(i, true) : null;
			});

			ffmpeg.stderr.on("data", (data) => {
				outputStr += data.toString();
			});

			ffmpeg.stderr.on("end", () => {
				if (hasData) {
					resolve(samples);
				} else {
					reject(outputStr);
				}
			});
		});
	}
}
