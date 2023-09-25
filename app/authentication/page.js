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
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/utilities/initSupa";

export default function Authentication() {
  // determin user buddy status, get variables
  const route = useRouter();
  const searchParams = useSearchParams();
  let buddyID = searchParams.get("buddyID");
  let accessCode = searchParams.get("code");
  console.log("Initial buddyID from search param: " + buddyID); // const [accessToken, setAccessToken] = useState(null);

  // ------ logic flow to make sure user type is set and logged correcetly even after redirect ----
  if (!buddyID) {
    buddyID = localStorage.getItem("buddyID");
    console.log("Buddy ID from local storage: ", buddyID);
  }

  // If buddyID is still not present, generate a new UUID and store it in local storage
  if (!buddyID) {
    buddyID = uuidv4();
    console.log("Generated new Buddy ID: ", buddyID);
    localStorage.setItem("buddyID", buddyID);
    if (!localStorage.getItem("userType")) {
      localStorage.setItem("userType", "non-buddy");
    }
  } else {
    if (!localStorage.getItem("buddyID")) {
      console.log(
        "no buddyID in local storage, setting to whatever it is set to currently: " +
          buddyID
      );
      localStorage.setItem("buddyID", buddyID);
    }
    console.log("Buddy ID from URL params: ", buddyID);
    if (!localStorage.getItem("userType")) {
      console.log("setting user Type to buddy");
      localStorage.setItem("userType", "buddy");
    }
  }
  // ------------------------

  const getUserData = async (code) => {
    try {
      const accessToken = await getAccessToken(
        code,
        process.env.NEXT_PUBLIC_REDIRECT_URL
      );
      const musicData = await fetchUserData(accessToken);
      console.log("Successfully fetched user data: ", musicData);
      return musicData;
    } catch (error) {
      console.error("Error fetching user data: ", error);
      throw error;
    }
  };

  //get buddy data from user base
  const getAndStorebuddyDataFromDB = async (buddyCode) => {
    try {
      let userName = JSON.parse(localStorage.getItem("userData")).name;
      console.log("buddyCode: ", buddyCode);
      let { data: user_music_data, error } = await supabase
        .from("user_music_data")
        .select("*")
        .eq("BuddyID", buddyCode)
        .neq("user_name", userName);
      console.log("error: ", error);
      console.log("buddy has got the other users data: ", user_music_data);
      localStorage.setItem("buddyDBData", JSON.stringify(user_music_data));
    } catch (error) {
      console.error("Error fetching data from Supabase: ", error);
    }
  };

  const storeUserData = async (musicInfo, buddy) => {
    try {
      const { data, error } = await supabase
        .from("user_music_data")
        .insert([
          {
            MusicProfile: musicInfo,
            user_name: musicInfo.name,
            BuddyID: buddy,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting data: ", error);
        return null;
      } else {
        console.log("success inserting user data into DB");
      }

      return data;
    } catch (error) {
      console.error("Unexpected error: ", error);
      return null;
    }
  };

  // use effect routes to spotify if initial load. store the user data, push to DB, navigate aaway depending on user status
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!accessCode) {
        initiateSpotifyLogin(process.env.NEXT_PUBLIC_REDIRECT_URL);
      } else {
        getUserData(accessCode).then(async (musicData) => {
          localStorage.setItem("userData", JSON.stringify(musicData));
          console.log("User data acquired: ", musicData);

          await storeUserData(musicData, localStorage.getItem("buddyID"));

          if (localStorage.getItem("userType") == "buddy") {
            // get buddy's data and store it
            // we now should have both user and buddy data stored
            getAndStorebuddyDataFromDB(buddyID).then(() => {
              // Only route to calculate once getAndStorebuddyDataFromDB resolves
              route.replace("/calculate");
            });
          } else if (localStorage.getItem("userType") == "non-buddy") {
            // we should have user data stored by now -> move to share screen and await buddy data
            route.replace("/share");
          }
        });
      }
    }
  }, []);

  return (
    <PageFadeIn>
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading />
        <h1>{localStorage.getItem("userType")}</h1>
      </div>
    </PageFadeIn>
  );
}
