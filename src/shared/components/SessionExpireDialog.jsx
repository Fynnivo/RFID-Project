import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";
import isTokenExpired from "@/shared/utils/lib/auth.js";

export default function SessionExpireDialog({ logout }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (isTokenExpired(token)) {
      setOpen(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    if (logout) logout();
    window.location.href = "/";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleLogout();
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Sesi Berakhir</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p>Sesi login Anda telah habis. Silakan login kembali untuk melanjutkan.</p>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
