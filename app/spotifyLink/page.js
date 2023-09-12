"use client";
import PageFadeIn from "@/Components/PageFadeIn";
import { initiateSpotifyLogin } from "@/utilities/spotifyApi";

export default function spotifyLink() {
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
