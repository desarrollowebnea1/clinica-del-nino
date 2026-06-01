import {
  authCookie,
  authenticateUser,
  createSessionToken,
} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const session = await authenticateUser(email.trim(), password);
    if (!session) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = await createSessionToken(session);
    const response = NextResponse.json({
      user: { id: session.userId, email: session.email, name: session.name },
    });

    response.cookies.set(authCookie.name, token, authCookie.options);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
