"use client";

import { useRouter } from "next/navigation";
import PasswordForm from "@/components/PasswordForm";
import toast from "react-hot-toast";

export default function NewPasswordPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    username: string;
    password: string;
    website?: string;
    notes?: string;
  }) => {
    try {
      console.log("Submitting password data:", { ...data, password: '[HIDDEN]' });
      
      const response = await fetch("/api/passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.details || errorData.error || "Failed to create password entry");
      }

      const result = await response.json();
      console.log("Password created successfully:", result.id);
      
      toast.success("Password saved successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error saving password:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save password";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Add New Password
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <PasswordForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/")}
          />
        </div>
      </div>
    </div>
  );
}
