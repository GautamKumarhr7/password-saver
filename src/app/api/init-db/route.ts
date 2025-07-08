import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    console.log("🔧 Initializing database tables...");
    
    // Try to create tables using Prisma's $executeRaw
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "PasswordEntry" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "website" TEXT,
        "notes" TEXT,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "PasswordEntry_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "PasswordEntry_userId_idx" ON "PasswordEntry"("userId");
    `;

    await prisma.$executeRaw`
      ALTER TABLE "PasswordEntry" 
      ADD CONSTRAINT IF NOT EXISTS "PasswordEntry_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
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
