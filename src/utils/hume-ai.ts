import { fetchAccessToken } from "hume";

export async function getHumeAccessToken(): Promise<string> {
  let accessToken = "";

  try {
    accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY),
    });
  } catch (error) {
    console.error("Failed to fetch Hume access token:", error);
  }

  return accessToken;
}
