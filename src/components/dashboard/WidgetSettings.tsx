"use client";

import { useStore } from "@/store/useStore";
import Button from "@/components/ui/button";
import { useCallback, useMemo } from "react";

export default function WidgetSettings() {
  const { settings, updateSettings, regenerateKey } = useStore();

  const snippet = useMemo(
    () =>
      `<script src="https://cdn.validchat.com/widget.js" data-key="${settings.publicKey}" data-position="${settings.position}" data-color="${settings.color}" defer></script>`,
    [settings]
  );

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(snippet);
  }, [snippet]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="text-sm text-white/70">Site URL (optional)</label>
          <input
            value={settings.siteUrl ?? ""}
            onChange={(e) => updateSettings({ siteUrl: e.target.value })}
            placeholder="https://your-site.com"
            className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="text-sm text-white/70">Widget Color</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              title="Choose color"
              type="color"
              value={settings.color}
              onChange={(e) => updateSettings({ color: e.target.value })}
              className="h-10 w-14 rounded bg-transparent"
            />
            <input
              title="Hex color code"
              value={settings.color}
              onChange={(e) => updateSettings({ color: e.target.value })}
              className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white outline-none"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="text-sm text-white/70">Position</label>
          <select
            title="Select widget position"
            value={settings.position}
            onChange={(e) =>
              updateSettings({
                position: e.target.value as "bottom-right" | "bottom-left",
              })
            }
            className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white outline-none"
          >
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="text-sm text-white/70">Public Key</label>
          <div className="mt-2 flex md:flex-nowrap flex-wrap items-center gap-2">
            <input
              value={settings.publicKey}
              readOnly
              className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white outline-none"
            />
            <Button variant="ghost" onClick={regenerateKey}>
              Regenerate
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-sm text-white/70">Embed Snippet</div>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/50 p-3 text-xs text-emerald-300">
          {snippet}
        </pre>
        <div className="mt-3">
          <Button onClick={copy}>Copy snippet</Button>
        </div>
      </div>
    </div>
  );
}
