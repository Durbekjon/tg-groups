import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GLOBAL_ID = "global";

export async function GET() {
  try {
    const row = await prisma.visitors.upsert({
      where: { id: GLOBAL_ID },
      update: {},
      create: { id: GLOBAL_ID },
    });
    return NextResponse.json({ count: row.count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get visitors" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const updated = await prisma.visitors.upsert({
      where: { id: GLOBAL_ID },
      update: { count: { increment: 1 } },
      create: { id: GLOBAL_ID, count: 1 },
    });
    return NextResponse.json({ count: updated.count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to increment visitors" }, { status: 500 });
  }
}


