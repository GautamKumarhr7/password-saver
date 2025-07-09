import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Try to connect to the database
    await prisma.$connect();
    console.log("Database connection successful");
    
    // Try to count password entries
    const passwordCount = await prisma.passwordEntry.count();
    console.log("Password entry count:", passwordCount);
    
    return NextResponse.json({
      status: "success",
      database: "connected",
      passwordCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
