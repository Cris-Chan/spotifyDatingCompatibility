import { motion } from "framer-motion";

export default function PageFadeIn({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 35 }}
      transition={{ type: "spring", stiffness: 50, duration: 2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
