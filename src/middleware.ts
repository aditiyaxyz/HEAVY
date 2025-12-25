import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const protectedPaths = ["/checkout"];

  if (protectedPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    if (!token || !JWT_SECRET) {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/checkout"] };
