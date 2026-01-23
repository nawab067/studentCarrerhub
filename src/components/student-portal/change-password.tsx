"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ AUTO-FILL EMAIL FROM LOCAL STORAGE
  useEffect(() => {
    if (open) {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [open]);

  async function handleSubmit() {
    if (!email || !newPassword) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      await axios.put("http://127.0.0.1:8000/change_student_password", {
        email: email,
        new_password: newPassword,
      });

      alert("Password updated successfully");
      setNewPassword("");
      onOpenChange(false);

    } catch (error) {
      console.error("Password change failed:", error);
      alert("Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-center">
            Update your password securely
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Email (AUTO-FILLED & LOCKED) */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                className="pl-10"
                value={email}
                disabled // 🔒 cannot edit
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-sky-500 hover:bg-sky-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
