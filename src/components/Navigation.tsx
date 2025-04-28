
import { Link } from "react-router-dom";
import { History, Globe, Github, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./auth/AuthButton";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">{t.library}</span>
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              {t.home}
            </Link>
            <Link to="/history" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium flex items-center gap-2">
              <History className="h-4 w-4" />
              {t.changeHistory}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-gray-900 hover:text-gray-700" aria-label="Language selection">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{language === "en" ? "English" : "中文"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("zh")}>中文</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2" aria-label={`User menu for ${user.username}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem disabled>{user.username}</DropdownMenuItem>
                  {user.is_admin && (
                    <DropdownMenuItem>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>{t.logout}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
