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

const getTrackMetrics = async (IdList, token) => {
  // take a list of music ID's
  // return a list of arrays with metric data (sudo embeddings)
  try {
    const idString = IdList.join(",");
    const metricArrayList = await axios
      .get(`https://api.spotify.com/v1/audio-features?ids=${idString}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("response for track data: ", response);
        return response.data.audio_features.map((trackdata) => {
          return [
            trackdata.acousticness,
            trackdata.danceability,
            trackdata.energy,
            trackdata.instrumentalness,
            trackdata.liveness,
            trackdata.speechiness,
            trackdata.valence,
          ];
        });
      });
    return metricArrayList;
  } catch (error) {
    console.log("error getting the track metrics: " + error);
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

    const embeddings = await getTrackMetrics(
      topSongs.map((songObject) => songObject.id),
      token
    );

    console.log(
      "DATA AQUIRED: ",
      name,
      topArtists,
      topSongs,
      genres,
      embeddings
    );
    return { name, topArtists, topSongs, genres, embeddings };
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
  const sum = embeddings.reduce((acc, curr) => {
    return acc.map((num, idx) => num + curr[idx]);
  }, new Array(embeddings[0].length).fill(0));

  return sum;
};
const weights = [
  0.1, // acousticness
  0.2, // danceability
  0.15, // energy
  0.05, // instrumentalness
  0.1, // liveness
  0.1, // speechiness
  0.2, // valence
];

// Sensitivity factor for adjusting the score, higher value makes the score more sensitive to differences
// Adjust this value to make the score more or less sensitive to differences in the embeddings
const sensitivity = 0.8;

export const calculateCompatibilityScore = (embeddings1, embeddings2) => {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  console.log("embeddings1:", embeddings1);
  console.log("embeddings2:", embeddings2);
  console.log("weights:", weights);
  console.log("sensitivity:", sensitivity);

  for (let i = 0; i < embeddings1.length; i++) {
    dotProduct += weights[i] * embeddings1[i] * embeddings2[i];
    magnitude1 += weights[i] * Math.pow(embeddings1[i], 2);
    magnitude2 += weights[i] * Math.pow(embeddings2[i], 2);
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  // Calculate cosine similarity and convert it to a score between 1 and 100
  const similarity = dotProduct / (magnitude1 * magnitude2);
  const score = Math.round(((similarity + 1) / 2) * 100 * sensitivity); // cosine similarity ranges from -1 to 1, so we normalize it to 0-1

  return score;
};
