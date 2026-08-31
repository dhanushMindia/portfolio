"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface ProfileFormProps {
  profile: any;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    tagline: profile?.tagline || "",
    bio: profile?.bio || "",
    currentRole: profile?.currentRole || "",
    currentFocus: profile?.currentFocus?.join(", ") || "",
    location: profile?.location || "",
    linkedinUrl: profile?.linkedinUrl || "",
    email: profile?.email || "",
    resumeUrl: profile?.resumeUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setSuccess(true);
      router.refresh();
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-200">
          Profile updated successfully!
        </div>
      )}

      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Hero Tagline
          </label>
          <input
            type="text"
            required
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Quantitative Finance, Public Economics & State Analytics"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">Displayed prominently on the homepage.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Current Role
          </label>
          <input
            type="text"
            required
            value={formData.currentRole}
            onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Finance Fellow at CSPR"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Current Focus (Comma-separated)
          </label>
          <input
            type="text"
            value={formData.currentFocus}
            onChange={(e) => setFormData({ ...formData, currentFocus: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Public Debt, Fiscal Modeling, Econometrics"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            About Me / Full Bio
          </label>
          <textarea
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your long-form bio here..."
          />
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">External Links & Social</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Resume/CV URL
            </label>
            <input
              type="url"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://.../resume.pdf"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Washington, D.C."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--accent)] hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Profile Configuration"}
        </Button>
      </div>
    </form>
  );
}
