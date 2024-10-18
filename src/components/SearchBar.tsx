import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Category } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  categories: Category[];
}

export interface SearchFilters {
  keyword: string;
  category: string;
  aimag: string;
  soum: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, categories }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    category: '',
    aimag: '',
    soum: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleInputChange}
          placeholder="Түлхүүр үг..."
          className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Бүх ангилал</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          name="aimag"
          value={filters.aimag}
          onChange={handleInputChange}
          placeholder="Аймаг..."
          className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <input
          type="text"
          name="soum"
          value={filters.soum}
          onChange={handleInputChange}
          placeholder="Сум..."
          className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="zoon-button w-full px-6 py-3 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center"
      >
        <Search className="w-5 h-5 mr-2" />
        Хайх
      </button>
    </form>
  );
};

export default SearchBar;