export default async function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Missing Spotify credentials" });
  }

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    const data = await tokenRes.json();

    if (data.access_token) {
      return res.status(200).json({ access_token: data.access_token });
    } else {
      return res.status(500).json({ error: "Failed to get token", details: data });
    }
  } catch (err) {
    return res.status(500).json({ error: "Request error", details: err.message });
  }
}
