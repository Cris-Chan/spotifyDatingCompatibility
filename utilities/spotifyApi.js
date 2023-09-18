"use client";
import axios from "axios";
import querystring from "querystring";

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/calculatePage";
const scope = "user-read-private user-read-email user-top-read";

// Function to initiate the OAuth process and redirect the user, returns promise
export const initiateSpotifyLogin = (string) => {
  return new Promise((resolve, reject) => {
    // Generate the state and save it in the session storage
    const state = generateRandomString(16);
    sessionStorage.setItem("spotify_auth_state", state);

    const queryParams = querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri: string ? string : redirect_uri,
      state,
    });

    // Navigate to the Spotify login page in the same window
    window.location.href = `https://accounts.spotify.com/authorize?${queryParams}`;
  });
};

//!! Internal function
// Function to generate a random string for the OAuth state parameter
const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

//!! Internal function
export const getAccessToken = async (code, redirect_uri) => {
  const form = {
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code",
  };
  const headers = {
    Authorization:
      "Basic " +
      new Buffer.from(client_id + ":" + client_secret).toString("base64"),
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(form),
      { headers }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token: ", error);
    throw error;
  }
};
export const fetchUserData = async (token) => {
  try {
    const profileResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const topArtistResponse = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const topSongsResponse = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?time_range=long_term",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const genres = new Set(
      topArtistResponse.data.items.flatMap((artist) => artist.genres)
    );
    const name = profileResponse.data.display_name;
    const topArtists = topArtistResponse.data.items.map(
      (artist) => artist.name
    );
    const topSongs = topSongsResponse.data.items.map((song) => song.name);

    console.log("DATA AQUIRED: ", name, topArtists, topSongs, genres);
    return { name, topArtists, topSongs, genres };
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
};
