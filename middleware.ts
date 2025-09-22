import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_USER = process.env.DASHBOARD_USER || "";
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic realm=\"Dashboard\"",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  // If credentials are not configured, allow access (developer convenience)
  if (!DASHBOARD_USER || !DASHBOARD_PASSWORD) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const base64Credentials = authHeader.split(" ")[1] || "";
    const decoded = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [user, pass] = decoded.split(":");

    if (user === DASHBOARD_USER && pass === DASHBOARD_PASSWORD) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
  } catch {
    // fallthrough to unauthorized
  }

  return unauthorized();
}

export const config = {
  matcher: ["/dashboard"],
};


