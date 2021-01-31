import { request } from "https";
import { URLSearchParams } from "url";

export default function (id: string, secret: string, scope: string): Promise<string> {
    const opts = {
        host: "discord.com",
        port: 443,
        path: "/api/v8/oauth2/token",
        method: "POST",
        auth: `${id}:${secret}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    const body = new URLSearchParams({
        "grant_type": "client_credentials",
        "scope": scope
    });

    return new Promise((resolve, reject) => {
        const req = request(opts, res => {
            const data = [];
            if (res.statusCode != 200) reject(res.statusCode);

            res.on("data", fragment => {
                data.push(fragment);
            });

            res.on("end", () => {
                const body = Buffer.concat(data).toString();
                const json = JSON.parse(body);
                resolve(json["access_token"]);
            });

            res.on("error", err => {
                reject(err);
            });
        });

        req.on("error", err => {
            reject(err);
        });

        req.write(body.toString());
        req.end();
    });
};