"use client";
import Avatar from "@/Components/Avatar";
import LineGraph from "@/Components/lineGraph";
import PageFadeIn from "@/components/PageFadeIn";

import {
  calculateSumEmbedding,
  getEmbeddings,
  calculateCompatibilityScore,
  calculateArtistOverlapScore,
  calculateSongPopularitySimilarityScore,
  calculateGenreOverlapScore,
  calculateSongFeatureSimilarityScore,
} from "@/utilities/spotifyApi";
import { useEffect, useState } from "react";

export default function Calculate() {
  const [currentUserData, setCurrentUserData] = useState({});
  const [buddyUserData, setBuddyUserData] = useState({});

  useEffect(() => {
    // GET both buddy and user data from local storage
    if (typeof window !== "undefined") {
      let userData = JSON.parse(localStorage.getItem("userData")) || {};
      setCurrentUserData(userData);
      console.log("TRIED setting user data");
      if (Object.keys(userData).length !== 0) {
        console.log("User data retrieved:", userData);
      } else {
        console.log(" HMMM: user data is looking weird man: " + userData);
      }

      let buddyData = JSON.parse(localStorage.getItem("buddyDBData")) || {};
      // Check if the data is an array with a single object and if so, extract that object
      // AKA make format align
      if (Array.isArray(buddyData) && buddyData.length === 1) {
        buddyData = buddyData[0];
      }
      setBuddyUserData(buddyData.MusicProfile || {});

      if (Object.keys(buddyData.MusicProfile || {}).length !== 0) {
        console.log("Buddy data retrieved:", buddyData.MusicProfile);
      } else {
        console.log(" HMMM: user data is looking weird man: " + buddyData);
      }
    }
  }, []);

  const [genreSimilarity, setGenreSimilarity] = useState(0);
  const [artisstSimilarity, setArtistSimilarity] = useState(0);
  const [uniquenessScore, setUniquenessScore] = useState(0);
  const [topSongSimilarity, setTopSongSimilarity] = useState(0);

  useEffect(() => {
    //set all our data
    if (
      Object.keys(currentUserData).length > 0 &&
      Object.keys(buddyUserData).length > 0
    ) {
      setArtistSimilarity(
        calculateArtistOverlapScore(currentUserData, buddyUserData)
      );
      setUniquenessScore(
        calculateSongPopularitySimilarityScore(currentUserData, buddyUserData)
      );
      setGenreSimilarity(
        calculateGenreOverlapScore(currentUserData, buddyUserData)
      );
      setTopSongSimilarity(
        calculateSongFeatureSimilarityScore(
          currentUserData.topSongsMetaData,
          buddyUserData.topSongsMetaData
        )
      );
    }
  }, [currentUserData, buddyUserData]);
  return (
    <PageFadeIn>
      <div className=" text-center text-black flex items-center justify-center min-h-screen min-w-screen">
        <div className="w-4/5 rounded-3xl h-auto flex flex-col bg-white drop-shadow-harsh items-center p-8">
          <div className="px-5 flex flex-row min-w-full items-center place-content-between">
            <Avatar
              name={"cristian Villanueva"}
              url={
                "https://www.njpac.org/wp-content/uploads/2023/06/800x600_ShaneGillis_onsale7.jpg"
              }
            />
            <Avatar
              name={"Melissa Huffines"}
              url={
                "https://www.njpac.org/wp-content/uploads/2023/06/800x600_ShaneGillis_onsale7.jpg"
              }
            />
          </div>
          <div className="mt-6 flex flex-col min-w-full gap-4 items-center justify-center">
            <LineGraph
              label={"Genre similarity"}
              totalValueAvailable={100}
              currentValue={genreSimilarity}
            />
            <LineGraph
              label={"Top Artist similarity"}
              totalValueAvailable={100}
              currentValue={artisstSimilarity}
            />
            <LineGraph
              label={"Uniqueness similarity"}
              totalValueAvailable={100}
              currentValue={uniquenessScore}
            />
            <LineGraph
              label={"Top Song similarity"}
              totalValueAvailable={100}
              currentValue={topSongSimilarity}
            />
          </div>
        </div>
      </div>
    </PageFadeIn>
  );
}
