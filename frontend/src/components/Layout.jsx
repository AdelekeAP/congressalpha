import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, Outlet } from "react-router-dom"; // Make sure Outlet is imported

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu
              </SheetDescription>

              <nav className="mt-4 flex flex-col gap-4">
                <Link to="/" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link to="/politicians" onClick={() => setOpen(false)}>Politicians</Link>
                <Link to="/trades" onClick={() => setOpen(false)}>Trade Feed</Link>
                <Link to="/settings" onClick={() => setOpen(false)}>Settings</Link>
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold">CongressAlpha</h1>
        </div>

        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </header>

      {/* ⬇️ This is where your page content (like Dashboard) will render */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
