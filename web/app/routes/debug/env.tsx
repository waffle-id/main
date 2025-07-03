import { type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const env = {
    CLIENT_ID: process.env.CLIENT_ID ? "✓ Present" : "✗ Missing",
    CLIENT_SECRET: process.env.CLIENT_SECRET ? "✓ Present" : "✗ Missing",
    TWITTER_APP_KEY: process.env.TWITTER_APP_KEY ? "✓ Present" : "✗ Missing",
    TWITTER_APP_SECRET: process.env.TWITTER_APP_SECRET ? "✓ Present" : "✗ Missing",
    SESSION_SECRET: process.env.SESSION_SECRET ? "✓ Present" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV || "undefined",
  };

  return Response.json(env);
}
