import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const groups = await prisma.group.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Basic rate limit: 1 create per second per client via cookie
    const now = Date.now();
    const lastHeader = req.headers.get("cookie") || "";
    const lastMatch = /last_group_create=(\d+)/.exec(lastHeader);
    const last = lastMatch ? Number(lastMatch[1]) : 0;
    if (last && now - last < 1000) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "1" } });
    }

    const body = await req.json();
    const { name, telegramLink, categoryId } = body as {
      name?: string;
      telegramLink?: string;
      categoryId?: string;
    };
    if (!name || !telegramLink || !categoryId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const created = await prisma.group.create({
      data: { name: name.trim(), telegramLink: telegramLink.trim(), categoryId },
    });
    const res = NextResponse.json(created, { status: 201 });
    // Set/update last operation timestamp cookie
    const expires = new Date(Date.now() + 5 * 60 * 1000).toUTCString();
    res.headers.append("Set-Cookie", `last_group_create=${now}; Path=/; Expires=${expires}; SameSite=Lax`);
    return res;
  } catch (error) {
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}


