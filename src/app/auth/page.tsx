"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] via-[#071025] to-[#041021] text-white px-6">
      {/* Background animated glow */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-600 blur-3xl opacity-20"
        animate={{ y: [0, 30, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-cyan-500 blur-3xl opacity-10"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_80px_rgba(124,58,237,0.25)] p-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="text-center text-white/70 mb-8">
          {isLogin
            ? "Login to your ValidChat dashboard and manage conversations in real-time."
            : "Sign up to start using ValidChat and elevate your customer experience."}
        </p>

        <form className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block mb-2 text-sm text-white/70">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm text-white/70">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-white/70">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <Button size="lg" className="w-full mt-4">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/70">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-purple-400 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
