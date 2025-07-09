"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import PasswordCard from "@/components/PasswordCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import PaginationSettings from "@/components/PaginationSettings";
import toast from "react-hot-toast";

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse {
  passwords: PasswordEntry[];
  pagination: PaginationInfo;
}

export default function Home() {
  const router = useRouter();
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageLimit, setPageLimit] = useState(10);

  const fetchPasswords = useCallback(async (page: number = 1, search: string = "", limit: number = pageLimit) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await fetch(`/api/passwords?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch passwords");
      }
      
      const data: ApiResponse = await response.json();
      setPasswords(data.passwords);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching passwords:", error);
      toast.error("Failed to load passwords");
    } finally {
      setLoading(false);
    }
  }, [pageLimit]);

  useEffect(() => {
    fetchPasswords(1, searchQuery, pageLimit);
  }, [fetchPasswords, searchQuery, pageLimit]);

  const handlePageChange = (page: number) => {
    fetchPasswords(page, searchQuery, pageLimit);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reset to page 1 when searching
    fetchPasswords(1, query, pageLimit);
  };

  const handleLimitChange = (limit: number) => {
    setPageLimit(limit);
    // Reset to page 1 when changing limit
    fetchPasswords(1, searchQuery, limit);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this password?")) {
      return;
    }

    try {
      const response = await fetch(`/api/passwords/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete password");
      }

      // Refresh the current page after deletion
      fetchPasswords(pagination.currentPage, searchQuery, pageLimit);
      toast.success("Password deleted successfully");
    } catch (error) {
      console.error("Error deleting password:", error);
      toast.error("Failed to delete password");
    }
  };

  const handleEdit = (id: string) => {
    console.log("Navigating to edit page for password ID:", id);
    router.push(`/passwords/${id}/edit`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Password Manager</h1>
        <Link
          href="/passwords/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <FaPlus /> Add New Password
        </Link>
      </div>

      {/* Search Bar and Pagination Settings */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search by title, username, website, or notes..."
          className="w-full sm:max-w-md"
        />
        <PaginationSettings
          currentLimit={pageLimit}
          onLimitChange={handleLimitChange}
          totalCount={pagination.totalCount}
        />
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-600">
          {searchQuery ? (
            <span>
              Found {pagination.totalCount} result{pagination.totalCount !== 1 ? 's' : ''} for "{searchQuery}"
            </span>
          ) : (
            <span>
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} password{pagination.totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading passwords...</div>
        ) : passwords.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchQuery ? (
              <>
                No passwords found for "{searchQuery}".
                <br />
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-blue-500 hover:text-blue-700 mt-2"
                >
                  Clear search
                </button>
              </>
            ) : (
              "No passwords saved yet. Click \"Add New Password\" to get started."
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passwords.map((password) => (
              <PasswordCard
                key={password.id}
                {...password}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && passwords.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
