"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, Home } from "lucide-react";
import Button from "./ui/button";

interface Props {
  isAuthenticated?: boolean;
  username?: string | null;
  onLogout?: () => void;
}

/**
 * Header: glass effect, neon accents, mobile menu animation, auth-aware.
 * Place at page top. It uses CSS backdrop and subtle 3D shadow for depth.
 */
export default function Header({
  isAuthenticated = true,
  username = null,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 28);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed w-full text-white z-50 top-0 left-0 transition-all ${
        scrolled ? "backdrop-blur-md bg-black/40 shadow-lg" : "bg-transparent"
      }`}
      aria-label="ValidChat Main Header"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.12))",
              boxShadow:
                "0 8px 40px rgba(7,10,35,0.55), inset 0 -6px 18px rgba(124,58,237,0.06)",
            }}
          >
            {/* simple neon chat bubble svg */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-5 4V5z"
                fill="#0b1020"
              />
              <path
                d="M7 8h10M7 12h7"
                stroke="url(#g)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="leading-tight">
            <div className="text-white font-semibold text-lg tracking-tight">
              ValidChat
            </div>
            <div className="text-[11px] text-white/60 -mt-0.5">
              Real-time support that feels alive
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard/chats"
                className="text-sm text-white/80 hover:text-white transition"
              >
                Chats
              </Link>
              <Link
                href="/dashboard/widget"
                className="text-sm text-white/80 hover:text-white transition"
              >
                Widget
              </Link>
            </>
          ) : (
            <>
              <Link
                href="#features"
                className="text-sm text-white/80 hover:text-white transition"
              >
                Features
              </Link>
              <Link
                href="#how"
                className="text-sm text-white/80 hover:text-white transition"
              >
                How it works
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-white/80 hover:text-white transition"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-sm text-white/80 hover:text-white transition"
              >
                Docs
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2"
              >
                <Button variant="ghost" className="rounded-full px-4 py-2">
                  <User size={16} />{" "}
                  <span className="ml-2">{username ?? "Agent"}</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md text-white/90 hover:bg-white/5"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile sliding panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="md:hidden bg-black/70 backdrop-blur-md border-t border-white/6"
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard/chats" className="py-2">
                    Chats
                  </Link>
                  <Link href="/dashboard/widget" className="py-2">
                    Widget
                  </Link>
                </>
              ) : (
                <>
                  <Link href="#features" className="py-2">
                    Features
                  </Link>
                  <Link href="#how" className="py-2">
                    How it works
                  </Link>
                  <Link href="#pricing" className="py-2">
                    Pricing
                  </Link>
                  <Link href="/docs" className="py-2">
                    Docs
                  </Link>
                </>
              )}

              <div className="pt-3 border-t border-white/6">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard/profile">
                      <span className="block py-2">Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onLogout && onLogout();
                      }}
                      className="w-full text-left py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <span className="block py-2">Log in</span>
                    </Link>
                    <Link href="/auth">
                      <span className="block py-2">Get started</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
