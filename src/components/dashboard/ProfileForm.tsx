"use client";

import { useStore } from "@/store/useStore";
import Button from "@/components/ui/button";
import { useState } from "react";

export default function ProfileForm() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState(""); // dummy only

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setUser({ name, email });
        setPassword("");
      }}
    >
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="text-sm text-white/70">Name</label>
        <input
          title="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white outline-none"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="text-sm text-white/70">Email</label>
        <input
          title="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white outline-none"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="text-sm text-white/70">Password (dummy)</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
          className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white outline-none"
        />
        <p className="mt-2 text-xs text-white/50">
          Password change is mocked in MVP. Wire to backend later.
        </p>
      </div>

      <Button type="submit">Save changes</Button>
    </form>
  );
}
