"use client";
import { motion } from "framer-motion";
import PageFadeIn from "@/components/PageFadeIn";
import Link from "next/link";
import { supabase } from "@/utilities/initSupa";
import { useEffect } from "react";
import Image from "next/image";

const imageSize = 100;

export default function Home() {
  console.log("Component rendering");

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("PAGE RENDERING (app)");
      localStorage.clear(); //! THIS IS FOR TESTING, CLEAR THIS
    }
  }, []);
  return (
    <PageFadeIn>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 text-center">
        <div>
          <h1 className={`drop-shadow-harsh font-puffy text-9xl`}>
            SPOTIFY-MATES
          </h1>
          <motion.h3
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
        <Link className={"font-josefin"} href={"/authentication"}>
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
            className="text-black p-3 m-4 relative flex items-center justify-center"
          >
            <Image width={imageSize} height={imageSize} src="/heart.svg" />
            <p className="absolute">Try it</p>
          </motion.div>
        </Link>
      </div>
    </PageFadeIn>
  );
}
