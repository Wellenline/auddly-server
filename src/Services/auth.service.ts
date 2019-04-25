import { IRequest, IResponse, INext, HttpStatus, app } from "liquid-http";

export class AuthService {

	public middleware(whitelist: string[]) {
		return async (req: IRequest, res: IResponse, next: INext) => {
			if (process.env.AUTH_ENABLED === "true") {
				if (whitelist.some((v) => req.parsed.path.indexOf(v) > -1)) {
					return next();
				}

				const api_key = req.headers["x-api-key"] || req.query.key;
				if (!api_key) {

					res.writeHead(HttpStatus.UNAUTHORIZED, app.headers);
					res.write(JSON.stringify({
						statusCode: HttpStatus.UNAUTHORIZED,
						message: "API Key missing",
					}));

					return res.end();
				}

				if (process.env.API_KEY !== api_key) {
					res.writeHead(HttpStatus.UNAUTHORIZED, app.headers);
					res.write(JSON.stringify({
						statusCode: HttpStatus.UNAUTHORIZED,
						message: "Invalid API Key",
					}));

					return res.end();
				}

				next();
			} else {
				next();
			}

		};
	}
}
