"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import { useStore } from "@/store/useStore";

export default function OnboardingPage() {
  const { settings, updateSettings } = useStore();
  const [url, setUrl] = useState(settings.siteUrl ?? "");
  const [showSnippet, setShowSnippet] = useState(false);

  const snippet = `<script src="https://cdn.validchat.com/widget.js" data-key="${settings.publicKey}" data-position="${settings.position}" data-color="${settings.color}" defer></script>`;

  return (
    <section className="relative min-h-[calc(100vh-88px)] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#020617] via-[#071025] to-[#041021] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-extrabold"
        >
          Quick Onboarding
        </motion.h1>
        <p className="mt-3 text-white/70">
          Add your website (optional), then copy the embed script. You can
          always configure the widget later.
        </p>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="text-sm text-white/70">
            Website URL (optional)
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-site.com"
            className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
          />
          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => {
                updateSettings({ siteUrl: url });
                setShowSnippet(true);
              }}
            >
              Continue
            </Button>
            <Button variant="ghost" onClick={() => setShowSnippet(true)}>
              Skip & show snippet
            </Button>
          </div>
        </div>

        {showSnippet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="text-sm text-white/70">
              Embed this in your site’s <code>&lt;head&gt;</code> or just before{" "}
              <code>&lt;/body&gt;</code>:
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-black/50 p-3 text-xs text-emerald-300">
              {snippet}
            </pre>
            <div className="mt-3 flex gap-3">
              <Button onClick={() => navigator.clipboard.writeText(snippet)}>
                Copy
              </Button>
              <a href="/dashboard/chats">
                <Button variant="ghost">Go to Dashboard →</Button>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
