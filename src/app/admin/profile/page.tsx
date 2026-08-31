import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/admin/forms/ProfileForm";

export const metadata = {
  title: "Edit Profile & Config | Admin",
};

export default async function ProfileAdminPage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">
          Profile & Site Config
        </h1>
        <p className="text-[var(--text-muted)] mt-1">
          Manage your homepage hero, about me bio, and site-wide metadata.
        </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
