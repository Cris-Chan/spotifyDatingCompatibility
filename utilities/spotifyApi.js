"use client";
import axios from "axios";
import querystring from "querystring";

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URL;
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
    const genres = Array.from(
      new Set(topArtistResponse.data.items.flatMap((artist) => artist.genres))
    );
    const name = profileResponse.data.display_name;
    const topArtists = topArtistResponse.data.items.map(
      (artist) => artist.name
    );
    const topSongs = topSongsResponse.data.items.map((song) => ({
      name: song.name,
      id: song.id,
      popularity: song.popularity,
    }));

    console.log("DATA AQUIRED: ", name, topArtists, topSongs, genres);
    return { name, topArtists, topSongs, genres };
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
};
export const getEmbeddings = async (genreArray) => {
  console.log("embeddings soon to be's : " + genreArray);
  const headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
    "Content-Type": "application/json",
  };

  const requests = genreArray.map((genre) => {
    const data = {
      input: genre,
      model: "text-embedding-ada-002",
    };

    return axios.post("https://api.openai.com/v1/embeddings", data, {
      headers,
    });
  });

  try {
    const responses = await Promise.all(requests);
    return responses.map((response) => response.data.data[0].embedding);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const calculateSumEmbedding = (embeddings) => {
  // Ensure that the embeddings array is in the correct format
  if (!Array.isArray(embeddings) || !embeddings.every(Array.isArray)) {
    throw new Error(
      "Invalid format for embeddings. Expected an array of arrays."
    );
  }

  const sum = embeddings.reduce((acc, curr) => {
    // Ensure that each embedding is of the correct length
    if (curr.length !== 1536) {
      throw new Error(
        "Invalid format for individual embedding. Expected an array of length 1536."
      );
    }

    return acc.map((num, idx) => num + curr[idx]);
  }, new Array(embeddings[0].length).fill(0));

  return sum;
};
export const calculateCompatibilityScore = (embeddings1, embeddings2) => {
  // Ensure that the embeddings arrays are in the correct format
  if (
    !Array.isArray(embeddings1) ||
    !embeddings1.every(Array.isArray) ||
    !Array.isArray(embeddings2) ||
    !embeddings2.every(Array.isArray)
  ) {
    throw new Error(
      "Invalid format for embeddings. Expected an array of arrays."
    );
  }

  // Ensure that each embedding is of the correct length
  if (embeddings1[0].length !== 1536 || embeddings2[0].length !== 1536) {
    throw new Error(
      "Invalid format for individual embedding. Expected an array of length 1536."
    );
  }

  // Calculate the dot product of the two embeddings
  let dotProduct = 0;
  for (let i = 0; i < embeddings1[0].length; i++) {
    dotProduct += embeddings1[0][i] * embeddings2[0][i];
  }

  // Calculate the magnitude of the two embeddings
  let magnitude1 = 0;
  let magnitude2 = 0;
  for (let i = 0; i < embeddings1[0].length; i++) {
    magnitude1 += embeddings1[0][i] * embeddings1[0][i];
    magnitude2 += embeddings2[0][i] * embeddings2[0][i];
  }
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  // Calculate the cosine similarity and scale it to a score between 1 and 100
  const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);
  const score = Math.round(cosineSimilarity * 100); // scale from 0-1 to 1-100 and round to the nearest whole number

  return score;
};
