"use client";
import PageFadeIn from "@/components/PageFadeIn";
import Loading from "@/components/loading";
import {
  fetchUserData,
  getAccessToken,
  initiateSpotifyLogin,
} from "@/utilities/spotifyApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Authentication() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buddyID = searchParams.get("buddyID");
  const accessCode = searchParams.get("code");
  const [error, setError] = useState(null);
  if (buddyID) {
    localStorage.setItem("buddyID", buddyID);
  }

  const redirectToSpotify = async () => {
    try {
      await initiateSpotifyLogin(process.env.NEXT_PUBLIC_REDIRECT_URL);
    } catch (error) {
      setError("Error redirecting to Spotify: " + error);
    }
  };

  const fetchAndStoreUserData = async () => {
    try {
      const accessToken = await getAccessToken(
        accessCode,
        process.env.NEXT_PUBLIC_REDIRECT_URL
      );
      const userDataProfile = await fetchUserData(accessToken);
      localStorage.setItem("userData", JSON.stringify(userDataProfile));
      router.replace(buddyID ? "/calculate" : "/share");
    } catch (error) {
      setError("Error fetching user data: " + error);
    }
  };
  useEffect(() => {
    const getSpotifyAccess = async () => {
      if (!accessCode) {
        await redirectToSpotify();
      } else {
        await fetchAndStoreUserData();
      }
    };

    getSpotifyAccess();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PageFadeIn>
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading />
      </div>
    </PageFadeIn>
  );
}
