import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

/**
 * Footer: 3-column responsive footer with subtle glass and neon touches.
 */
export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/6 text-white/80">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-black font-bold shadow-lg">
              V
            </div>
            <div>
              <div className="font-semibold text-white">ValidChat</div>
              <div className="text-xs text-white/60">
                Realtime messaging built for developers
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/60 max-w-sm">
            ValidChat gives you the primitives to handle conversations, persist
            history, and operate agents in real-time. Host data where you want
            and scale at your pace.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/docs">
                <span className="hover:text-white">Docs</span>
              </Link>
            </li>
            <li>
              <Link href="/pricing">
                <span className="hover:text-white">Pricing</span>
              </Link>
            </li>
            <li>
              <Link href="/integrations">
                <span className="hover:text-white">Integrations</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about">
                <span className="hover:text-white">About</span>
              </Link>
            </li>
            <li>
              <Link href="/careers">
                <span className="hover:text-white">Careers</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy">
                <span className="hover:text-white">Privacy</span>
              </Link>
            </li>
          </ul>

          <div className="mt-6 flex gap-3">
            <Link
              aria-label="Github"
              href="https://github.com"
              className="p-2 rounded-md hover:bg-white/4"
            >
              <Github size={18} />
            </Link>
            <Link
              aria-label="Twitter"
              href="https://twitter.com"
              className="p-2 rounded-md hover:bg-white/4"
            >
              <Twitter size={18} />
            </Link>
            <Link
              aria-label="LinkedIn"
              href="https://linkedin.com"
              className="p-2 rounded-md hover:bg-white/4"
            >
              <Linkedin size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 py-4">
        <div className="max-w-7xl mx-auto px-6 text-xs text-white/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} ValidChat. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/terms">
              <span>Terms</span>
            </Link>
            <Link href="/privacy">
              <span>Privacy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
