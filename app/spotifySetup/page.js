"use client";
import PageFadeIn from "@/Components/PageFadeIn";
import { initiateSpotifyLogin } from "@/utilities/spotifyApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

//TODO add a check to see if the user declined the request and redirect accordinlgy / check if thats best practice

export default function SpotifySetup() {
  const router = useRouter();
  const searchParams = useSearchParams();

  //check for spotify auth, and check for budy code
  useEffect(() => {
    const buddyCode = searchParams.get("buddyCode");

    // null or set to buddy code if this page was navigated to from out buddyLink
    localStorage.setItem("buddyCode", { buddyCode });

    initiateSpotifyLogin().then(() => {
      if (success) {
        //navigate to the next page if spotify auth successful
        router.push("/calculatePage");
      }
    });
  }, []);

  return (
    <PageFadeIn>
      <div className="flex  flex-col items-center justify-center min-h-screen py-2 text-center">
        <button
          onClick={initiateSpotifyLogin}
          className="bg-green-500 p-3 rounded font-josefin"
        >
          Click here for spotify token
        </button>
      </div>
    </PageFadeIn>
  );
}
