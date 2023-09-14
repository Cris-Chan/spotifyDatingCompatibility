"use client";
import PageFadeIn from "@/Components/PageFadeIn";
import Loading from "@/components/loading";
import { getAccessToken } from "@/utilities/spotifyApi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [buddyCode, setBuddyCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [fetchingMusicData, setFetchindMusicData] = useState(true);

  // get spotify auth, so we can get yummy data mmmmm
  // gets buddyCode if user is from buddy link,
  // gets accessToken since spotify access has been granted.
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // we dont use this yet, leaving in for later

    setBuddyCode(localStorage.getItem("buddycode"));
    console.log("buddyCode: ", buddyCode);
    if (code) {
      const fetchAccessToken = async () => {
        const data = await getAccessToken(code);
        setAccessToken(data.accessToken);
        console.log("acess token successfully aquired 😛: ", data);
      };
      fetchAccessToken();
    }
  }, [searchParams]);

  return (
    <PageFadeIn>
      <div className="flex  flex-col items-center justify-center min-h-screen py-2 text-center">
        {fetchingMusicData ? <Loading /> : <h1 className="text-2xl">hehe</h1>}
      </div>
    </PageFadeIn>
  );
}
