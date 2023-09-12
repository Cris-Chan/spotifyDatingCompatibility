"use client";
import axios from "axios";
import querystring from "querystring";

//!! MAKE SURE LOGS ARE REMOVED BEFORE WE DEPLOY
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
console.log("client_id -> ", client_id);
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
console.log("client_secret -> ", client_secret);
const redirect_uri = "http://localhost:3000/spotifySuccess";
console.log("redirect_uri -> ", redirect_uri);
const scope = "user-read-private user-read-email";
console.log("scope -> ", scope);

// Function to initiate the OAuth process and redirect the user
export const initiateSpotifyLogin = () => {
  // TODO: utilize state in a cookie for extra authentication. for now lets just circel back later
  const state = generateRandomString(16);

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
    state,
  });
  window.location = `https://accounts.spotify.com/authorize?${queryParams}`;
};

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

// Function to exchange the authorization code for an access token
export const getAccessToken = async (code) => {
  console.log("getAccessTokenFunc: code->", code);

  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("grant_type", "authorization_code");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      body: params,
    });

    const data = await response.json();
    return data; // This will contain your access token
  } catch (error) {
    console.error("Error fetching access token", error);
  }
};
