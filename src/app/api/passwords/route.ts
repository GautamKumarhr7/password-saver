import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const passwords = await prisma.passwordEntry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(passwords);
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return NextResponse.json(
      { error: "Failed to fetch passwords" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST /api/passwords - Starting request");
    
    const body = await request.json();
    console.log("Request body:", body);
    
    const { title, username, password, website, notes } = body;

    // Validate required fields
    if (!title || !username || !password) {
      console.log("Missing required fields:", { title: !!title, username: !!username, password: !!password });
      return NextResponse.json(
        { error: "Title, username, and password are required" },
        { status: 400 }
      );
    }

    console.log("Checking for existing user...");
    
    // First, check if a user exists, if not create one
    let user = await prisma.user.findFirst();

    if (!user) {
      console.log("No user found, creating default user...");
      // Create a default user if none exists
      user = await prisma.user.create({
        data: {
          email: "default@example.com",
          password: "defaultpassword", // In a real app, this should be hashed
          name: "Default User",
        },
      });
      console.log("Created user:", user.id);
    } else {
      console.log("Found existing user:", user.id);
    }

    console.log("Creating password entry...");
    
    const passwordEntry = await prisma.passwordEntry.create({
      data: {
        title,
        username,
        password,
        website,
        notes,
        userId: user.id,
      },
    });

    console.log("Password entry created successfully:", passwordEntry.id);
    return NextResponse.json(passwordEntry);
  } catch (error) {
    console.error("Error creating password entry:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: "Failed to create password entry",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
