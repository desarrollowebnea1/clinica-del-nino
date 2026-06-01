import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || undefined;

  const assets = await prisma.imageAsset.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return apiSuccess(assets);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) return apiError("Archivo requerido");

    const mime = file.type.toLowerCase();
    if (!mime.startsWith("image/") && !ALLOWED_TYPES.includes(mime)) {
      return apiError("Formato no permitido. Usá JPG, PNG o WEBP.");
    }

    if (file.size > MAX_SIZE) {
      return apiError("El archivo supera el máximo de 5MB.");
    }

    const pathname = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const blob = await put(pathname, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const asset = await prisma.imageAsset.create({
      data: {
        url: blob.url,
        pathname: blob.pathname,
        filename: file.name,
        folder,
        size: file.size,
        mimeType: file.type,
      },
    });

    return apiSuccess(asset, 201);
  } catch (err) {
    console.error("Upload error:", err);
    return apiError("Error al subir imagen", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("ID requerido");

  await prisma.imageAsset.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
