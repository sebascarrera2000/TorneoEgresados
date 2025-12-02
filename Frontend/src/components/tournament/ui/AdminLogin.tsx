import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, KeyRound } from "lucide-react";

export const AdminLogin = ({
  showLogin,
  setUser,
  setPass,
  authenticate,
}: any) => (
  <AnimatePresence>
    {showLogin && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-white shadow-xl rounded-xl p-6 w-80 border border-gray-200"
        >
          <div className="flex justify-center mb-3">
            <ShieldCheck className="text-blue-600" size={46} />
          </div>

          <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
            Admin Access
          </h2>

          <label className="text-sm font-semibold">Usuario</label>
          <input
            className="w-full mt-1 mb-2 p-2 border rounded-md"
            onChange={(e) => setUser(e.target.value)}
          />

          <label className="text-sm font-semibold">Contraseña</label>
          <input
            type="password"
            className="w-full mt-1 mb-4 p-2 border rounded-md"
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            onClick={authenticate}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <KeyRound size={18} /> Ingresar
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
