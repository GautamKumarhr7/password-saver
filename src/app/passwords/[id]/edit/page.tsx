"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordForm from "@/components/PasswordForm";
import toast from "react-hot-toast";

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
}

export default function EditPasswordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [password, setPassword] = useState<PasswordEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchPassword();
    }
  }, [id]);

  const fetchPassword = async () => {
    try {
      const response = await fetch(`/api/passwords/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch password");
      }
      const data = await response.json();
      setPassword(data);
    } catch (error) {
      console.error("Error fetching password:", error);
      toast.error("Failed to load password");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<PasswordEntry, "id">) => {
    try {
      const response = await fetch(`/api/passwords/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast.success("Password updated successfully");
      router.push("/");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!password) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Password not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Password</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <PasswordForm
          initialData={password}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/")}
        />
      </div>
    </div>
  );
}
