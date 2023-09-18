"use client";
import PageFadeIn from "@/components/PageFadeIn";
import Loading from "@/components/loading";
import { motion } from "framer-motion";
import { supabase } from "@/utilities/initSupa";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function Share() {
  const router = useRouter();
  const [buddyData, setBuddyData] = useState(null);
  const buddyID = localStorage.getItem("buddyID") || uuidv4();
  localStorage.setItem("buddyID", buddyID);

  console.log("buddy: " + buddyID);

  useEffect(() => {
    const fetchBuddyData = async () => {
      let { data, error } = await supabase
        .from("user_music_data")
        .select("*")
        .eq("BuddyID", buddyID);

      if (error) {
        console.log("AY CARAMBA!");
      } else {
        console.log(data);
        setBuddyData(data);
        if (data && data.length > 0) {
          router.replace("/calculate");
        }
      }
    };

    fetchBuddyData();

    // Set up a timer to fetch the data every 5 seconds
    const intervalId = setInterval(fetchBuddyData, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <PageFadeIn>
      <div className="w-screen h-screen flex flex-col items-center justify-center text-center">
        <Loading />
        <h1 className="font-josefinBold text-xl">
          Now share this link with your buddy!
          <br />
          We will start calculating when they enter their info 😛
        </h1>
        <h5 className="font-josefin text-base">
          [the page will update when your friend clicks the link]
        </h5>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{
            opacity: {
              delay: 0.8,
              type: "spring",
              stiffness: 100,
              duration: 0.8,
            },
            y: { delay: 1, type: "spring", stiffness: 100, duration: 0.8 },
          }}
          className="rounded bg-white text-black p-3 m-4 cursor-pointer"
          onClick={async () => {
            const shareData = {
              title: "Music + Love",
              text: "Check out this cool app!",
              url: process.env.NEXT_PUBLIC_REDIRECT_URL,
            };
            try {
              if (navigator.share) {
                // we are on mobile, let's use the Web Share API
                await navigator.share(shareData);
              } else {
                // we are on desktop, let's copy the link to the clipboard
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard");
              }
            } catch (err) {
              console.error("Sharing failed", err);
            }
          }}
        >
          Share
        </motion.div>
      </div>
    </PageFadeIn>
  );
}
