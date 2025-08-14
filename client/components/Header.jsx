"use client";
import React, { useEffect, useState } from "react";
import {
  Bitcoin,
  Bookmark,
  Clock,
  Command,
  FileText,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

const Header = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        setSelectedTransaction(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <TooltipProvider>
      <header className="border-b glass sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Bitcoin className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Trace Lite
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Advanced Blockchain Investigation Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommandPaletteOpen(true)}
                    className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                  >
                    <span className="text-xl">⌘K</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open Command Palette</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass border-2 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Command className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Command Palette</h3>
                </div>
                <Input
                  placeholder="Search commands, addresses, or actions..."
                  className="mb-4"
                  autoFocus
                />
                <div className="space-y-2">
                  {[
                    {
                      icon: Search,
                      label: "New Investigation",
                      shortcut: "⌘N",
                    },
                    { icon: Clock, label: "Recent Searches", shortcut: "⌘R" },
                    {
                      icon: Bookmark,
                      label: "Saved Addresses",
                      shortcut: "⌘S",
                    },
                    { icon: FileText, label: "Export Report", shortcut: "⌘E" },
                    { icon: Settings, label: "Settings", shortcut: "⌘," },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-between hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.shortcut}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};

export default Header;
