import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Home className="w-4 h-4 text-error" />
      <ChevronRight className="w-4 h-4" />
      <span className="text-primary font-medium">AquaGreen AI</span>
    </nav>
  );
};

export default Breadcrumb;