"use client";

import WidgetSettings from "@/components/dashboard/WidgetSettings";

export default function WidgetPage() {
  return (
    <div className="h-full p-6">
      <h1 className="text-2xl font-bold">Widget Settings</h1>
      <p className="text-white/70 mt-1">
        Configure color, position, and copy your embed snippet.
      </p>
      <div className="mt-6">
        <WidgetSettings />
      </div>
    </div>
  );
}
