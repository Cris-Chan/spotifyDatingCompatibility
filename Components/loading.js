import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="p-5">
      <motion.div
        className="border-t-4 border-green-400 rounded-full w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
