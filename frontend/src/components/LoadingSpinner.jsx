import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      {/* Simple loading spinner */}
      <motion.div
        className="border-4 border-green-200 rounded-full size-16 border-t-green-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;