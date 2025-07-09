import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    console.log("🔧 Initializing database tables...");
    
    // Create PasswordEntry table only
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "PasswordEntry" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "website" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "PasswordEntry_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "PasswordEntry_title_idx" ON "PasswordEntry"("title");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "PasswordEntry_createdAt_idx" ON "PasswordEntry"("createdAt");
    `;

    console.log("✅ Database tables created successfully!");
    
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
