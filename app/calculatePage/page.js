"use client";
import PageFadeIn from "@/Components/PageFadeIn";
import { getAccessToken } from "@/utilities/spotifyApi";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

/*

 * check for buddy code: 
  null -> start share flow*
  yes -> start calculate flow

 * SHARE FLOW
  --loading
  make music profile from spotify data
  generate buddy code and store data in DB
  --
  show share buttong with search parameter including buddy code

  await DB entry with same buddy code 🧑‍💻 (timeout after 5 minutes) -> .then calculate flow

  * calculate flow
    - uhm yea p self exp[lanitory, render ui and show score

*/

export default function CalculatePage() {
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
