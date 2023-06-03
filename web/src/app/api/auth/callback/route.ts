import { api } from "@/lib/api";
import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const registerResponse = await api.post("/register", {
    code,
  });

  const { token } = registerResponse.data;

  const redirectUrl = new URL("/", request.url);

  const cokieExpiresInSeconds = 60 * 60 * 24 * 30;
  return NextResponse.redirect(redirectUrl, {
    headers: {
      "Set-Cookie": `token=${token}; path=/; max-age=${cokieExpiresInSeconds};`,
    },
  });
}
