"use client";
import { motion } from "framer-motion";
import PageFadeIn from "@/Components/PageFadeIn";
import Link from "next/link";

export default function Home() {
  return (
    <PageFadeIn>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 text-center">
        <div>
          <h1 className={`font-josefinBold text-9xl text-[#1DB954]`}>
            MUSIC +
          </h1>
          <h1 className={`font-josefinBold text-9xl`}>LOVE?</h1>
          <motion.h3
            className={`font-josefin`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1,
              type: "spring",
              stiffness: 100,
              duration: 0.8,
            }}
          >
            Use your music taste to calculate your compatibility 👀
          </motion.h3>
        </div>
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
          className=" rounded bg-white text-black p-3 m-4"
        >
          <Link className={"font-josefin"} href={"/spotifyLink"}>
            Try it out
          </Link>
        </motion.div>
      </div>
    </PageFadeIn>
  );
}
