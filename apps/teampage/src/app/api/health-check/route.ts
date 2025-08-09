import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

export function HEAD() {
  return new Response(null, { status: 200 });
}
