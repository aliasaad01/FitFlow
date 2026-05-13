import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-main-bg flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* الدائرة الخارجية المتحركة */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-white/5 border-t-brand-primary rounded-full"
        />

        {/* اللوغو أو أيقونة في المنتصف */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute text-brand-primary font-black text-xl"
        >
          FitFlow
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-gray-400 font-bold tracking-widest text-sm uppercase"
      >
        جاري تحضير تدريبك...
      </motion.p>
    </div>
  );
};

export default PageLoader;
