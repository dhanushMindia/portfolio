export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getMediaUrl } from "@/lib/storage";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  const assetsWithUrls = await Promise.all(
    assets.map(async (asset) => ({
      ...asset,
      accessUrl: await getMediaUrl(asset),
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 dark:text-gray-50 mb-2">
            Media Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {assets.length} file{assets.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/media/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Upload File
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No media assets yet
          </p>
          <Link
            href="/admin/media/upload"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Upload your first file →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {assetsWithUrls.map((asset) => (
            <div
              key={asset.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden group"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-950 relative overflow-hidden flex items-center justify-center">
                {asset.fileType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.accessUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl text-gray-400">
                    {asset.fileType === "pdf" ? "📄" : "📁"}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={asset.accessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-gray-900 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-100"
                  >
                    View
                  </a>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-50 text-sm truncate" title={asset.title}>
                  {asset.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {asset.fileType}
                  </p>
                  <VisibilityBadge visibility={asset.visibility} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VisibilityBadge({ visibility }: { visibility: string }) {
  const colors = {
    PUBLIC: "text-blue-600 dark:text-blue-400",
    UNLISTED: "text-purple-600 dark:text-purple-400",
    PRIVATE: "text-red-600 dark:text-red-400",
  };

  const icons = {
    PUBLIC: "🌐",
    UNLISTED: "🔗",
    PRIVATE: "🔒",
  };

  return (
    <span
      className={`text-xs font-medium ${colors[visibility as keyof typeof colors] || colors.PRIVATE}`}
      title={visibility}
    >
      {icons[visibility as keyof typeof icons]}
    </span>
  );
}
