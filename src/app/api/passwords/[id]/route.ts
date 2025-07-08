import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const password = await prisma.passwordEntry.findUnique({
      where: {
        id: id,
      },
    });

    if (!password) {
      return NextResponse.json(
        { error: "Password entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(password);
  } catch (error) {
    console.error("Error fetching password:", error);
    return NextResponse.json(
      { error: "Failed to fetch password entry" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, username, password, website, notes } = body;

    const updatedPassword = await prisma.passwordEntry.update({
      where: {
        id: id,
      },
      data: {
        title,
        username,
        password,
        website,
        notes,
      },
    });

    return NextResponse.json(updatedPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Failed to update password entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.passwordEntry.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Password entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting password:", error);
    return NextResponse.json(
      { error: "Failed to delete password entry" },
      { status: 500 }
    );
  }
}
