import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
  return apiSuccess(faqs);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  if (!body.question?.trim() || !body.answer?.trim()) {
    return apiError("Pregunta y respuesta requeridas");
  }

  const faq = await prisma.fAQ.create({
    data: {
      question: body.question.trim(),
      answer: body.answer.trim(),
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return apiSuccess(faq, 201);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  if (!body.id) return apiError("ID requerido");

  const data: Record<string, unknown> = {};
  if (body.question !== undefined) data.question = body.question;
  if (body.answer !== undefined) data.answer = body.answer;
  if (body.active !== undefined) data.active = body.active;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

  const faq = await prisma.fAQ.update({
    where: { id: body.id },
    data,
  });

  return apiSuccess(faq);
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("ID requerido");

  await prisma.fAQ.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
