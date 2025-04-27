import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">EMS Prompts</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/remote-servers" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Remote Servers
            </Link>
            <Link to="/resources" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Resources
            </Link>
          </div>
          <div>
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
