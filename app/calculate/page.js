"use client";
import PageFadeIn from "@/components/PageFadeIn";

import {
  calculateSumEmbedding,
  getEmbeddings,
  calculateCompatibilityScore,
} from "@/utilities/spotifyApi";
import { useEffect, useState } from "react";

export default function Calculate() {
  const [currentUserData, setCurrentUserData] = useState({});
  const [buddyUserData, setBuddyUserData] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      let userData = JSON.parse(localStorage.getItem("userData")) || {};
      setCurrentUserData(userData);
      console.log("TRIED setting user data");
      if (Object.keys(userData).length !== 0) {
        console.log("User data retrieved:", userData);
      }

      let buddyData = JSON.parse(localStorage.getItem("buddyDBData")) || {};
      // Check if the data is an array with a single object and if so, extract that object
      if (Array.isArray(buddyData) && buddyData.length === 1) {
        buddyData = buddyData[0];
      }
      setBuddyUserData(buddyData.MusicProfile || {});
      if (Object.keys(buddyData.MusicProfile || {}).length !== 0) {
        console.log("Buddy data retrieved:", buddyData.MusicProfile);
      }
    }
  }, []);

  const [score, setScore] = useState("...");

  const [myEmbeds, setMyEmbeds] = useState([]);

  useEffect(() => {
    const fetchEmbeds = async () => {
      const userEmbeds = await getEmbeddings(currentUserData.genres || []);
      const buddyEmbeds = await getEmbeddings(buddyUserData.genres || []);

      const userAverageEmbedding = calculateSumEmbedding(userEmbeds);
      const buddyAverageEmbedding = calculateSumEmbedding(buddyEmbeds);

      let compatibilityScore = 0;
      if (userAverageEmbedding.length > 0 && buddyAverageEmbedding.length > 0) {
        compatibilityScore = calculateCompatibilityScore(
          [userAverageEmbedding],
          [buddyAverageEmbedding]
        );
      }

      setScore(compatibilityScore);
    };
    fetchEmbeds();
  }, [currentUserData, buddyUserData]);
  return (
    <PageFadeIn>
      <div className="flex flex-col items-center justify-center space-y-2 min-h-screen">
        <h1 className="font-josefinBold">Similarity score:</h1>
        <div className=" flex flex-row items-center justify-center text-center gap-x-10">
          <div className="flex flex-col gap-4 place-items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
            >
              <mask
                id=":ric:"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="36"
                height="36"
              >
                <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
              </mask>
              <g mask="url(#:ric:)">
                <rect width="36" height="36" fill="#4eb3de"></rect>
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="36"
                  transform="translate(7 -3) rotate(197 18 18) scale(1.2)"
                  fill="#fcf09f"
                  rx="6"
                ></rect>
                <g transform="translate(3.5 -4) rotate(-7 18 18)">
                  <path
                    d="M15 21c2 1 4 1 6 0"
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                  ></path>
                  <rect
                    x="12"
                    y="14"
                    width="1.5"
                    height="2"
                    rx="1"
                    stroke="none"
                    fill="#000000"
                  ></rect>
                  <rect
                    x="22"
                    y="14"
                    width="1.5"
                    height="2"
                    rx="1"
                    stroke="none"
                    fill="#000000"
                  ></rect>
                </g>
              </g>
            </svg>
          </div>
          <h1 className="font-josefinBold text-3xl">{score}</h1>
          <div className="flex flex-col gap-4 place-items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
            >
              <mask
                id=":rgq:"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="36"
                height="36"
              >
                <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
              </mask>
              <g mask="url(#:rgq:)">
                <rect width="36" height="36" fill="#8de0a6"></rect>
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="36"
                  transform="translate(-4 -4) rotate(148 18 18) scale(1.1)"
                  fill="#f27c7c"
                  rx="36"
                ></rect>
                <g transform="translate(-4 -3) rotate(8 18 18)">
                  <path
                    d="M15 20c2 1 4 1 6 0"
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                  ></path>
                  <rect
                    x="11"
                    y="14"
                    width="1.5"
                    height="2"
                    rx="1"
                    stroke="none"
                    fill="#000000"
                  ></rect>
                  <rect
                    x="23"
                    y="14"
                    width="1.5"
                    height="2"
                    rx="1"
                    stroke="none"
                    fill="#000000"
                  ></rect>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </PageFadeIn>
  );
}
