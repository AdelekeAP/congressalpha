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
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-100 text-brand-800">
      {/* Header */}
      <header className="p-4 border-b border-brand-700 bg-brand-800 text-brand-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Mobile Drawer Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-brand-100">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="bg-brand-800 text-brand-100 border-r border-brand-700">
              <SheetTitle className="text-lg">Menu</SheetTitle>
              <SheetDescription className="sr-only">Navigation menu</SheetDescription>

              <nav className="mt-6 flex flex-col gap-4 text-brand-100">
                <Link to="/" onClick={() => setOpen(false)} className="hover:text-brand-400">
                  Dashboard
                </Link>
                <Link to="/politicians" onClick={() => setOpen(false)} className="hover:text-brand-400">
                  Politicians
                </Link>
                <Link to="/trades" onClick={() => setOpen(false)} className="hover:text-brand-400">
                  Trade Feed
                </Link>
                <Link to="/settings" onClick={() => setOpen(false)} className="hover:text-brand-400">
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold text-brand-100">CongressAlpha</h1>
        </div>

        {/* Profile / Placeholder Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-600" />
      </header>

      {/* Page Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
