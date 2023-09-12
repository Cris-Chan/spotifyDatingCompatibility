"use client";
import { motion } from "framer-motion";
import PageFadeIn from "@/Components/PageFadeIn";
import { Luckiest_Guy, Pacifico } from "next/font/google";

const Pacificoo = Pacifico({ subsets: ["latin"], weight: "400" });
const luckiestGuy = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

export default function Home() {
  return (
    <PageFadeIn>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div>
          <motion.h1
            className={`${luckiestGuy.className} text-9xl text-[#1DB954]`}
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            MUSIC +
          </motion.h1>
          <motion.h1
            className={`${Pacificoo.className} text-9xl`}
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            LOVE?
          </motion.h1>
        </div>
      </div>
    </PageFadeIn>
  );
}
