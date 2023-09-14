"use client";
import PageFadeIn from "@/Components/PageFadeIn";
import Loading from "@/components/loading";
import { getAccessToken } from "@/utilities/spotifyApi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/utilities/initSupa";

/*

 * check for buddy code: 
  null -> start share flow* (initial user)
  yes -> start calculate flow (buddy user)

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
  const [user, setUser] = useState(null); // helper for clairty / readability for my brain 🧠. is either "initial" or "buddy"
  const [accessToken, setAccessToken] = useState(null);
  const [fetchingMusicData, setFetchindMusicData] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  /*
  const shareUrl =
      "http://localhost:3000/calculatePage/spotifySetup" + buddyCode
        ? "?buddyCode=" + buddyCode
        : "";
  */

  // our setup for this page (run once obvi)
  // once setup is done we should have: [buddycode], [spotifydata], [user type set]
  useEffect(() => {
    const code = searchParams.get("code"); // get spotify access code

    setBuddyCode(localStorage.getItem("buddycode")); // get buddy code, if one is stored
    if (!buddyCode) {
      // if no buddy code stored, create one. store it. and set us as an inital user, and generate our share link
      setUser("initial");
      const newBuddyCode = uuidv4();
      setBuddyCode(newBuddyCode);
      localStorage.setItem("buddycode", newBuddyCode);
      setShareUrl(
        "http://localhost:3000/calculatePage/spotifySetup?buddyCode=" +
          newBuddyCode
      );
    } else if (user == null) {
      setUser("buddy"); // else set user as "buddy" user
    }
    console.log("buddyCode: ", buddyCode);
    if (code) {
      // if access code present from spotify (set through url parameter inredirect back from spotify auth)
      const fetchAccessToken = async () => {
        const data = await getAccessToken(code);
        setAccessToken(data.accessToken);
        console.log("acess token successfully aquired 😛: ", data);
        // localStorage.setItem("usermusicdata", JSON.stringify(data));
      };
      fetchAccessToken();
    }
  }, [searchParams]);

  const InitialUserScreen = () => {
    return (
      <div>
        <div className="m-5">
          <Loading />
        </div>

        <h2 className={`font-josefin`}>
          ok now the fun part, share your buddy link with a friend to get
          started calulating 😼,
        </h2>
        <h2> This page will update when they link their spotify</h2>
        <motion.button
          className=" rounded bg-white text-black p-3 m-4"
          whileHover={{ scale: 1.1 }}
          onClick={async () => {
            // allow for native mobile sharing ui, fallback for web
            if (navigator.share) {
              try {
                await navigator.share({
                  title: "Share this link",
                  url: shareUrl,
                });
              } catch (error) {
                console.error("Something went wrong sharing the url", error);
              }
            } else {
              // Fallback for desktop browsers
              try {
                await navigator.clipboard.writeText(shareUrl);
                //TODO visual feedback for copy
              } catch (error) {
                console.error("Failed to copy text: ", error);
              }
            }
          }}
        >
          Share
        </motion.button>
      </div>
    );
  };

  const BuddyUserScreen = () => {
    return <h1>hi</h1>;
  };

  return (
    <PageFadeIn>
      <div className="flex  flex-col items-center justify-center min-h-screen py-2 text-center">
        {fetchingMusicData ? (
          <Loading />
        ) : user === "initial" ? (
          <InitialUserScreen />
        ) : (
          <BuddyUserScreen />
        )}
      </div>
    </PageFadeIn>
  );
}
