"use client";
import PageFadeIn from "@/Components/PageFadeIn";
import { getAccessToken } from "@/utilities/spotifyApi";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

//TODO: make this a loading animation and upon successful fetch of acess toke, redirect to our main app page

export default function SpotifyLink() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (code) {
      const fetchAccessToken = async () => {
        const data = await getAccessToken(code);
        console.log("OK LEST GOO: ", data);
      };
      fetchAccessToken();
    }
  }, [searchParams]);
  return (
    <PageFadeIn>
      <div className="flex  flex-col items-center justify-center min-h-screen py-2 text-center">
        <h1>SUCCESS</h1>
      </div>
    </PageFadeIn>
  );
}
