"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RoleSwitcher() {
  const { user, updateUserRole } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const roles = ["Super Admin", "Moderator", "Regular User", "Guest"];

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    setLoading(true);
    const loadingToast = toast.loading("Updating role...");

    try {
      const res = await fetch("/api/auth/user/update-role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, role: newRole }),
      });

      if (res.ok) {
        toast.success(`Role updated to ${newRole}`, { id: loadingToast });
        updateUserRole(newRole); // Update context instantly
        router.refresh(); // Refresh server components
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update role", { id: loadingToast });
      }
    } catch (error) {
      console.error("Role update error:", error);
      toast.error("Failed to update role", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">QA Tool:</span>
      <select
        value={user.role || "Regular User"}
        onChange={handleRoleChange}
        disabled={loading}
        className="text-xs bg-gray-50 border border-gray-200 text-gray-700 py-1 px-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
}
