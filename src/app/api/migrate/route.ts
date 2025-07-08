import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log("🔧 Running database migrations manually...");
    
    // Try migrate deploy first
    try {
      const { stdout: migrateOutput } = await execAsync("npx prisma migrate deploy");
      console.log("✅ Migrate deploy successful:", migrateOutput);
      
      return NextResponse.json({
        success: true,
        method: "migrate deploy",
        output: migrateOutput,
        timestamp: new Date().toISOString()
      });
    } catch (migrateError) {
      console.log("⚠️ Migrate deploy failed, trying db push...");
      
      // If migrate fails, try db push
      const { stdout: pushOutput } = await execAsync("npx prisma db push --force-reset");
      console.log("✅ DB push successful:", pushOutput);
      
      return NextResponse.json({
        success: true,
        method: "db push",
        output: pushOutput,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
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
