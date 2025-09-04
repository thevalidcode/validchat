"use client";

import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Button from "../ui/button";

/**
 * Hero: 3D parallax card cluster, neon gradient, long explanatory copy.
 * Designed to be long and educational. Accessible headings and CTAs included.
 */

export default function Hero() {
  // small mouse parallax for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const router = useRouter();
  const goTo = (url: string) => {
    router.push(url);
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-24 pb-20 min-h-[calc(100vh-88px)] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#020617] via-[#071025] to-[#041021] text-white"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
    >
      {/* subtle animated starfield */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(124,58,237,0.06),transparent)]"
          animate={{ opacity: [0.7, 0.4, 0.7] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: text content */}
        <div className="w-full lg:w-6/12">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            ValidChat — Live Conversations, Reimagined
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl"
          >
            ValidChat is a developer-first, lightweight, and extensible customer
            messaging platform. Drop it into any web property and start
            real-time conversations with users in minutes. Built for product
            teams who need speed, control, and deep integrations without vendor
            lock-in.
          </motion.p>

          <div className="mt-8 flex gap-4">
            <Button size="lg" onClick={() => goTo("/auth")}>
              Get started — Free
            </Button>
            <a href="#how" className="self-center">
              <Button variant="ghost" size="lg">
                See how it works
              </Button>
            </a>
          </div>

          {/* micro-features row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="bg-white/6 rounded-xl p-4 shadow-[0_8px_40px_rgba(2,6,23,0.6)]">
              <div className="text-xs text-white/60">Latency</div>
              <div className="font-semibold">Sub-200ms real-time delivery</div>
            </div>
            <div className="bg-white/6 rounded-xl p-4 shadow-[0_8px_40px_rgba(2,6,23,0.6)]">
              <div className="text-xs text-white/60">Privacy</div>
              <div className="font-semibold">
                Store chat data in your Postgres
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3D mock chat cluster */}
        <div className="w-full lg:w-6/12 flex justify-center items-center">
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative w-[360px] md:w-[520px] h-[420px] md:h-[520px] perspective-800"
          >
            {/* floating gradient orbs */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -left-8 -top-8 w-40 h-40 rounded-full blur-3xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] opacity-30 pointer-events-none"
            />
            <motion.div
              initial={{ scale: 1 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute right-6 bottom-6 w-36 h-36 rounded-full blur-2xl bg-gradient-to-r from-[#06b6d4] to-[#f472b6] opacity-28 pointer-events-none"
            />

            {/* Main mock card */}
            <motion.div
              initial={{ y: -6, opacity: 0.98 }}
              animate={{ y: [-6, 0, -6] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="relative rounded-2xl bg-gradient-to-br from-[#071025] to-[#071527] border border-white/6 shadow-[0_30px_80px_rgba(3,7,18,0.8)] p-4"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* header bar */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399] shadow-[0_6px_18px_rgba(52,211,153,0.08)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <div className="ml-auto text-xs text-white/60">
                  Connected • 3 agents
                </div>
              </div>

              {/* messages area */}
              <div className="mt-3 h-[300px] md:h-[380px] overflow-hidden rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] p-4">
                <div className="space-y-4">
                  <div className="max-w-[78%] bg-gradient-to-r from-[#0f1724] to-[#071025] px-4 py-3 rounded-2xl text-sm shadow-inner">
                    <div className="text-white/90 font-medium">
                      Customer: Hi, can I check shipment status?
                    </div>
                    <div className="text-xs text-white/60 mt-2">2:11 PM</div>
                  </div>

                  <div className="max-w-[70%] ml-auto bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-4 py-3 rounded-2xl text-sm text-white shadow-md">
                    <div className="font-medium">
                      Agent: Sure, may I have your order id?
                    </div>
                    <div className="text-xs text-white/90 mt-2">2:12 PM</div>
                  </div>

                  <div className="max-w-[78%] bg-[rgba(255,255,255,0.03)] px-4 py-3 rounded-2xl text-sm">
                    <div className="text-white/90">
                      Customer: It's #A93829 — also I need delivery today.
                    </div>
                    <div className="text-xs text-white/60 mt-2">2:12 PM</div>
                  </div>

                  <div className="max-w-[70%] ml-auto bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-4 py-3 rounded-2xl text-sm text-white shadow-md">
                    <div className="font-medium">
                      Agent: I see — I'm escalating to Ops. ETA 3 hours.
                    </div>
                    <div className="text-xs text-white/90 mt-2">2:13 PM</div>
                  </div>
                </div>
              </div>

              {/* input mock */}
              <div className="mt-4 flex items-center gap-3 px-2">
                <input
                  className="flex-1 rounded-full bg-white/4 px-4 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
                  placeholder="Type a message..."
                  aria-label="Chat input preview"
                />
                <div className="rounded-full p-2 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
