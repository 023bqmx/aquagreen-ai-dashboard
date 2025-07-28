import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Home className="w-4 h-4 text-red-500" />
      <ChevronRight className="w-4 h-4" />
      <span className="text-blue-600 font-medium">เอคัวกรีน เอไอ</span>
    </nav>
  );
};

export default Breadcrumb;