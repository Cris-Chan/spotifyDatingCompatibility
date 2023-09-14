import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        className="border-t-4 border-green-200 rounded-full w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "spring" }}
      />
    </div>
  );
}
