import { Can } from "@src/middleware/access";
import { Chart, ChartModel } from "@src/models/chart";
import { ScanModel } from "@src/models/scan";
import { TrackModel } from "@src/models/track";
import { Resource, Get, Before, Context, IContext } from "@wellenline/via";
import moment from "moment";
import * as os from "os";


@Resource("/insights")
export class Insights {
	@Get("/")
	@Before(Can())
	public async albums(@Context() context: IContext) {
		const start = context.query.start || moment().subtract(1, "week").format("YYYY-MM-DD");
		const end = context.query.end || moment().add(1, "day").format("YYYY-MM-DD");
		const albums = await ChartModel.aggregate([
			{
				$match: {
					created_by: new ChartModel.base.Types.ObjectId(context.payload.id),
					created_at: {
						$gte: new Date(start),
						$lte: new Date(end),
					},
				},
			},

			{
				$sort: {
					created_at: -1,
				},
			},
			{
				$group: {
					_id: "$album",
					count: { $sum: 1 },
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
			{
				$limit: 5,
			},
			{
				$lookup: {
					from: "albums",
					localField: "_id",
					foreignField: "_id",
					as: "album",

				}
			},
			{
				$lookup: {
					from: "artists",
					localField: "album.artist",
					foreignField: "_id",
					as: "artist",

				}
			}, {
				$unwind: {
					path: "$artist",
				},
			},
			{
				$unwind: {
					path: "$album",
				},
			}, {
				$project: {
					_id: 0,
					album: {
						_id: "$album._id",
						name: "$album.name",
						picture: "$album.picture",
					},
					artist: {
						_id: "$artist._id",
						name: "$artist.name",
					},
					playcount: "$count",
				}
			}

		]);

		const tracks = await ChartModel.aggregate([
			{
				$match: {
					created_by: new ChartModel.base.Types.ObjectId(context.payload.id),
					created_at: {
						$gte: new Date(start),
						$lte: new Date(end),
					},
				},
			},

			{
				$sort: {
					created_at: -1,
				},
			},
			{
				$group: {
					_id: "$track",
					count: { $sum: 1 },
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
			{
				$limit: 5,
			},
			{
				$lookup: {
					from: "tracks",
					localField: "_id",
					foreignField: "_id",
					as: "track",

				}
			},

			{
				$unwind: {
					path: "$track",
				},
			},

			{
				$project: {
					_id: 0,
					track: {
						_id: "$track._id",
						name: "$track.name",

						artist: "$track.artist",
					},

					playcount: "$count",
				}
			}
		]);

		const artists = await ChartModel.aggregate([
			{
				$match: {
					created_by: new ChartModel.base.Types.ObjectId(context.payload.id),
					created_at: {
						$gte: new Date(start),
						$lte: new Date(end),
					},
				},
			},

			{
				$sort: {
					created_at: -1,
				},
			},
			{
				$group: {
					_id: "$artist",
					count: { $sum: 1 },
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
			{
				$limit: 15,
			},
			{
				$lookup: {
					from: "artists",
					localField: "_id",
					foreignField: "_id",
					as: "artist",

				}
			},
			{
				$unwind: {
					path: "$artist",
				},
			},

			{
				$project: {
					_id: "$artist._id",
					name: "$artist.name",
					picture: "$artist.picture",

					playcount: "$count",
				}
			}
		]);

		const playtime = await ChartModel.aggregate([
			{
				$match: {
					created_by: new ChartModel.base.Types.ObjectId(context.payload.id),
					created_at: {
						$gte: new Date(start),
						$lte: new Date(end),
					},
				},
			},
			{
				$lookup: {
					from: "tracks",
					localField: "track",
					foreignField: "_id",
					as: "track",

				}
			},
			{
				$unwind: {
					path: "$track",
				},
			},
			{
				$group: {
					_id: null,
					sum: { $sum: "$track.duration", },
				},
			},

			{
				$project: {
					_id: 0,
					total: "$sum",
				}
			},
		]);

		const streams_by_day = await ChartModel.aggregate([
			{
				$match: {
					created_by: new ChartModel.base.Types.ObjectId(context.payload.id),
					created_at: {
						$gte: new Date(start),
						$lte: new Date(end),
					},
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$created_at",
						},
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
			{
				$project: {
					_id: 0,
					date: "$_id",
					count: "$count",
				}
			}
		]);

		const buildDateRanges = (d1: string, d2: string) => {
			const range = [];
			const startDate = moment(d1);
			const endDate = moment(d2);
			while (startDate.isSameOrBefore(endDate)) {
				range.push(startDate.format("YYYY-MM-DD"));
				startDate.add(1, "day");
			}
			return range;
		};

		const dateRange = buildDateRanges(start, end);

		const mappedData = dateRange.map((d) => {
			const momentDate = moment(d, "YYYY-MM-DD");

			const found = streams_by_day.find((item) => {
				return moment(item.date, "YYYY-MM-DD").isSame(momentDate, "date");
			});

			return {
				date: d,
				count: found?.count || 0,
			};

		});

		const server = await ScanModel.findOne().sort("-end").lean();


		return {
			plays: {
				labels: dateRange,
				values: mappedData.map((item) => item.count),
			},
			server: {
				...server,
				version: process.env.npm_package_version,
				arch: os.arch(),
				node_version: process.version,
				num_cpus: os.cpus().length,
				uptime: process.uptime(),
				free_mem: os.freemem(),
			},
			streams_by_day,
			stream_seconds: playtime[0],
			albums,
			tracks,
			artists: artists.sort(() => Math.random() - 0.5),

		};

	}
}
