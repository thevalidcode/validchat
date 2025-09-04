"use client";

import ProfileForm from "@/components/dashboard/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="h-full p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="text-white/70 mt-1">
        Update your name, email, and (mock) password.
      </p>
      <div className="mt-6 max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  );
}
