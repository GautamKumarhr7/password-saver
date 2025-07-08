import { NextResponse } from "next/server";

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Not set",
    // Show first few characters of DATABASE_URL if it exists (for debugging)
    DATABASE_URL_PREVIEW: process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.substring(0, 20) + "..." : 
      "Not available",
    RENDER: process.env.RENDER ? "✅ Running on Render" : "❌ Not on Render",
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(envVars);
}
