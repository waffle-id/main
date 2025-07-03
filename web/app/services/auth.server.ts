import { Authenticator } from "remix-auth";
import { Twitter2Strategy } from "remix-auth-twitter";
import { TwitterApi } from "twitter-api-v2";

export type User = {
    id: number;
    screen_name: string;
    name: string;
    profile_image_url: string;
    email?: string;
};

export let authenticator = new Authenticator<User>();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

console.log("Twitter OAuth2 credentials check:");
console.log("ClientID exists:", !!clientID);
console.log("ClientSecret exists:", !!clientSecret);

if (!clientID || !clientSecret) {
    throw new Error(
        "CLIENT_ID and CLIENT_SECRET must be provided"
    );
}

authenticator.use(
    new Twitter2Strategy(
        {
            clientID: clientID,
            clientSecret: clientSecret,
            // callbackURL: "http://127.0.0.1:5173/auth/twitter/callback",
            callbackURL: "https://waffle.food/auth/twitter/callback",
            scopes: ["users.read", "tweet.read"],
        },
        async ({ request, tokens }) => {
            try {
                const accessToken = tokens.accessToken();
                console.log("Got access token:", !!accessToken);

                const userClient = new TwitterApi(accessToken);
                const result = await userClient.v2.me({
                    "user.fields": ["profile_image_url"]
                });

                console.log("Twitter user data:", result.data);
                const { id, username } = result.data;

                return {
                    id: Number(id),
                    screen_name: username,
                    name: result.data.name,
                    profile_image_url: result.data.profile_image_url ?? "",
                };
            } catch (error) {
                console.error("Error in Twitter2Strategy verify function:", error);
                throw error;
            }
        }
    ),
    "twitter"
);
