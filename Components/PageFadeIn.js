import { motion } from "framer-motion";

export default function PageFadeIn({ children, className }) {
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.div>;
}
