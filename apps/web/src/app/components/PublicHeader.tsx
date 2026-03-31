import { Code2 } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code2 className="size-8 text-blue-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dimel's School
          </span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#courses" className="text-gray-600 hover:text-blue-600 transition">
            Курсы
          </a>
          <a href="#about" className="text-gray-600 hover:text-blue-600 transition">
            О нас
          </a>
        </nav>
      </div>
    </header>
  );
}
