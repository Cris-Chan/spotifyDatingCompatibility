import axios from "axios";

export const getAccessToken = async (client_id, client_secret) => {
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      grant_type: "client_credentials",
    },
  };

  try {
    const response = await axios(authOptions);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token", error);
    return null;
  }
};

/*
format for JSON return
{
   "access_token": "NgCXRKc...MzYjw",
   "token_type": "bearer",
   "expires_in": 3600
}
*/
