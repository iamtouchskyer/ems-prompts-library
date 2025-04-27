
import { Link } from "react-router-dom";
import { History, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">EMS Prompt Library</span>
            </Link>
          </div>
          <div className="flex items-center justify-center flex-1 space-x-8">
            <Link to="/" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/history" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium flex items-center gap-2">
              <History className="h-4 w-4" />
              Change History
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">English</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>中文</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium">
              Submit
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
