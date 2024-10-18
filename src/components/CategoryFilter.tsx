import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-4">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <option value="">Бүх ангилал</option>
        {categories.map((category) => (
          <optgroup key={category.id} label={category.name}>
            <option value={category.name}>{category.name}</option>
            {category.subcategories.map((subcategory, index) => (
              <option key={index} value={`${category.name}:${subcategory}`}>
                {subcategory}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;