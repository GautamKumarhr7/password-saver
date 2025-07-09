import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause for search
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { username: { contains: search, mode: 'insensitive' as const } },
        { website: { contains: search, mode: 'insensitive' as const } },
        { notes: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    // Get passwords with pagination
    const [passwords, totalCount] = await Promise.all([
      prisma.passwordEntry.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.passwordEntry.count({ where })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      passwords,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext,
        hasPrev
      }
    });
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

    console.log("Creating password entry...");
    
    const passwordEntry = await prisma.passwordEntry.create({
      data: {
        title,
        username,
        password,
        website,
        notes,
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
