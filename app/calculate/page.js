"use client";
import PageFadeIn from "@/components/PageFadeIn";

import {
  calculateSumEmbedding,
  getEmbeddings,
  calculateCompatibilityScore,
} from "@/utilities/spotifyApi";
import { useEffect, useState } from "react";

export default function Calculate() {
  const currentUserData = JSON.parse(localStorage.getItem("userData"));
  //example of format:
  /*
  {
  "name": "Cristian Villanueva",
  "genres": [
    "chicago rap",
    "hip hop",
    "rap",
    "boy band",
    "lo-fi cover",
    "lo-fi product",
    "indie folk",
    "pop folk",
    "stomp and flutter",
    "stomp and holler",
    "atlanta indie",
    "indie pop",
    "la pop",
    "pov: indie",
    "indie rock",
    "filter house",
    "indie soul",
    "conscious hip hop",
    "west coast rap",
    "alternative r&b",
    "uk contemporary r&b",
    "atl hip hop",
    "bedroom pop",
    "la indie",
    "vancouver indie",
    "lgbtq+ hip hop",
    "neo soul",
    "alternative pop rock",
    "indie electropop",
    "pittsburgh rap",
    "pop rap",
    "korean indie folk",
    "korean r&b"
  ],
  "topSongs": [
    {
      "id": "1geSWiwEHkfhPWoEpXB9Gj",
      "name": "So Free",
      "popularity": 40
    },
    {
      "id": "0MH2fBfdoOl17OSbmrwClC",
      "name": "Better Than",
      "popularity": 16
    },
    {
      "id": "2lTtnKQgjbrBA1qnOFhBkP",
      "name": "affection",
      "popularity": 1
    },
    {
      "id": "6nl9BAvm7wMV2mEEChRzA9",
      "name": "Rubble To Rubble",
      "popularity": 0
    },
    {
      "id": "7IJlk42gDKt5dfSSLwtEsp",
      "name": "Chinese Translation",
      "popularity": 0
    },
    {
      "id": "6yu0UegX2qMKcKvTurlWe2",
      "name": "Misery Is You",
      "popularity": 28
    },
    {
      "id": "2k9N4caeCIJLOWwWwssrEM",
      "name": "Easily",
      "popularity": 3
    },
    {
      "id": "2QHYdxr6Perz2Z7vJ0DszE",
      "name": "Kinship",
      "popularity": 9
    },
    {
      "id": "2ZDRA0S22sue6jpghf2qol",
      "name": "Down The Line",
      "popularity": 53
    },
    {
      "id": "2mj3wofiytzLRepX5OZjLT",
      "name": "Logan Paul",
      "popularity": 23
    },
    {
      "id": "3bj0otfkHV2NB3NBCjLZKL",
      "name": "Reverence",
      "popularity": 17
    },
    {
      "id": "2y9xyQNtut1KeOHSSkuzik",
      "name": "DÁKITI – Spotify Singles",
      "popularity": 48
    },
    {
      "id": "4FF0tP9mkoiFKLiXFeXm0q",
      "name": "Cotton Candy",
      "popularity": 57
    },
    {
      "id": "6Wu19AEKVNs5bJFuhZb4EZ",
      "name": "Second Chances",
      "popularity": 60
    },
    {
      "id": "4iJyoBOLtHqaGxP12qzhQI",
      "name": "Peaches (feat. Daniel Caesar & Giveon)",
      "popularity": 83
    },
    {
      "id": "78LMazmfqncADjyJVae8dN",
      "name": "Anything You Want",
      "popularity": 64
    },
    {
      "id": "0ygr1n1Xk1UvWrzJXjVVng",
      "name": "iloveyou",
      "popularity": 0
    },
    {
      "id": "4q6OvSJnqxZZ3N13QRRzrX",
      "name": "The Trees",
      "popularity": 47
    },
    {
      "id": "4j8Dz7TdDXoJ2z5zhqEwYX",
      "name": "Sagittarius Superstar (feat. Faye Webster)",
      "popularity": 0
    },
    {
      "id": "1rJRb5A6ZfqOuqLCwpD7Ld",
      "name": "Calvaire",
      "popularity": 50
    }
  ],
  "topArtists": [
    "Kanye West",
    "BROCKHAMPTON",
    "Lofi Fruits Music",
    "Gregory Alan Isakov",
    "Faye Webster",
    "BETWEEN FRIENDS",
    "Goth Babe",
    "FKJ",
    "Kendrick Lamar",
    "Col3trane",
    "Noname",
    "Childish Gambino",
    "The Marías",
    "Odie Leigh",
    "Peach Pit",
    "Frank Ocean",
    "Dominic Fike",
    "Grady",
    "Mac Miller",
    "HYUKOH"
  ]
}
  */
  let buddyUserData = JSON.parse(localStorage.getItem("buddyDBData"));
  // Check if the data is an array with a single object and if so, extract that object
  if (Array.isArray(buddyUserData) && buddyUserData.length === 1) {
    buddyUserData = buddyUserData[0];
  }
  console.log("Buddy User Data: ", buddyUserData);
  buddyUserData = buddyUserData.MusicProfile;
  // Check if the data is an array with a single object and if so, extract that object

  const [score, setScore] = useState("...");
  console.log("Current User Data: ", currentUserData);
  console.log("Buddy User Data: ", buddyUserData);

  const [myEmbeds, setMyEmbeds] = useState([]);

  useEffect(() => {
    const fetchEmbeds = async () => {
      const userEmbeds = await getEmbeddings(currentUserData.genres);
      const buddyEmbeds = await getEmbeddings(buddyUserData.genres);
      console.log("User Embeds: ", userEmbeds);
      console.log("Buddy Embeds: ", buddyEmbeds);

      const userAverageEmbedding = calculateSumEmbedding(userEmbeds);
      const buddyAverageEmbedding = calculateSumEmbedding(buddyEmbeds);

      const compatibilityScore = calculateCompatibilityScore(
        [userAverageEmbedding],
        [buddyAverageEmbedding]
      );

      setScore(compatibilityScore);
      console.log("User Average Embedding: ", userAverageEmbedding);
      console.log("Buddy Average Embedding: ", buddyAverageEmbedding);
      console.log("Compatibility Score: ", compatibilityScore);
    };
    fetchEmbeds();
  }, []);
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
