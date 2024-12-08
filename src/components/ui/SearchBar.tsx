import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative max-w-md">
      <input
        type="text"
        placeholder="Search universities..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
    </div>
  );
}