import { motion, AnimatePresence } from "framer-motion";

export const AdminPanel = ({ showPanel, generarOctavos }: any) => (
  <AnimatePresence>
    {showPanel && (
      <motion.div
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        exit={{ x: 200 }}
        className="fixed top-5 right-5 bg-white border shadow-xl rounded-lg p-4 w-72 z-[999]"
      >
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Panel de Administración
        </h3>

        <button
          onClick={generarOctavos}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-bold shadow-lg hover:scale-[1.02] transition-all"
        >
          Generar Octavos Automáticamente
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);
