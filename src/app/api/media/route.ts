import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadFile, deleteFile, getMediaUrl } from "@/lib/storage";

/**
 * List media assets.
 * Public assets are visible to anyone.
 * Private/unlisted assets require authentication.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  const where: any = {};
  if (!isAuthenticated) {
    where.visibility = "PUBLIC";
  }

  const assets = await prisma.mediaAsset.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Authenticated users get signed URLs for non-public assets
  const assetsWithUrls = isAuthenticated
    ? await Promise.all(
        assets.map(async (asset) => ({
          ...asset,
          accessUrl: await getMediaUrl(asset),
        }))
      )
    : assets;

  return NextResponse.json({ assets: assetsWithUrls });
}

/**
 * Upload a new media asset to object storage.
 * Defaults: status DRAFT, visibility PRIVATE.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "Untitled";
    const description = formData.get("description") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to object storage — get the storage key
    const { key } = await uploadFile(file, "media");

    // Determine file type from extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    let fileType = "document";
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) fileType = "image";
    else if (ext === "pdf") fileType = "pdf";
    else if (["xlsx", "xls", "csv"].includes(ext)) fileType = "spreadsheet";
    else if (["pptx", "ppt"].includes(ext)) fileType = "presentation";

    // Create asset record — always defaults to PRIVATE
    const asset = await prisma.mediaAsset.create({
      data: {
        title,
        description,
        fileName: file.name,
        fileUrl: key,
        fileType,
        mimeType: file.type,
        fileSize: file.size,
        visibility: "PRIVATE",
      },
    });

    // Generate signed URL for immediate preview
    const accessUrl = await getMediaUrl({
      fileUrl: asset.fileUrl,
      visibility: asset.visibility,
    });

    return NextResponse.json(
      {
        asset: { ...asset, accessUrl },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

/**
 * Delete a media asset from object storage and database.
 */
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await deleteFile(asset.fileUrl);
    await prisma.mediaAsset.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
