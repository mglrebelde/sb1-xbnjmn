import React, { useState } from 'react';
import { Category } from '../types';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

interface CategoryManagementProps {
  categories: Category[];
  onCategoryUpdate: (updatedCategories: Category[]) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, onCategoryUpdate }) => {
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const docRef = await addDoc(collection(db, 'categories'), {
          name: newCategory.trim(),
          subcategories: []
        });
        const newCategoryObj: Category = {
          id: docRef.id,
          name: newCategory.trim(),
          subcategories: []
        };
        onCategoryUpdate([...categories, newCategoryObj]);
        setNewCategory('');
      } catch (error) {
        console.error("Error adding category: ", error);
        alert("Failed to add category. Please try again.");
      }
    }
  };

  const handleAddSubcategory = async () => {
    if (selectedCategory && newSubcategory.trim()) {
      try {
        const updatedSubcategories = [...selectedCategory.subcategories, newSubcategory.trim()];
        await updateDoc(doc(db, 'categories', selectedCategory.id), {
          subcategories: updatedSubcategories
        });
        const updatedCategories = categories.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, subcategories: updatedSubcategories }
            : cat
        );
        onCategoryUpdate(updatedCategories);
        setNewSubcategory('');
      } catch (error) {
        console.error("Error adding subcategory: ", error);
        alert("Failed to add subcategory. Please try again.");
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
        const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
        onCategoryUpdate(updatedCategories);
        setSelectedCategory(null);
      } catch (error) {
        console.error("Error deleting category: ", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryToDelete: string) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
          const updatedSubcategories = category.subcategories.filter(
            (subcat) => subcat !== subcategoryToDelete
          );
          await updateDoc(doc(db, 'categories', categoryId), {
            subcategories: updatedSubcategories
          });
          const updatedCategories = categories.map((cat) =>
            cat.id === categoryId ? { ...cat, subcategories: updatedSubcategories } : cat
          );
          onCategoryUpdate(updatedCategories);
        }
      } catch (error) {
        console.error("Error deleting subcategory: ", error);
        alert("Failed to delete subcategory. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Ангилал удирдах</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Шинэ ангилал нэмэх</h3>
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Ангилалын нэр"
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAddCategory}
            className="zoon-button px-4 py-2 rounded-r-md"
          >
            Нэмэх
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Дэд ангилал нэмэх</h3>
        <div className="flex flex-col sm:flex-row sm:items-center">
          <select
            value={selectedCategory?.id || ''}
            onChange={(e) => setSelectedCategory(categories.find(cat => cat.id === e.target.value) || null)}
            className="w-full sm:w-1/3 px-3 py-2 border rounded-md sm:rounded-r-none mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Ангилал сонгох</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            placeholder="Дэд ангилалын нэр"
            className="w-full sm:w-1/3 px-3 py-2 border rounded-md sm:rounded-none mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAddSubcategory}
            className="zoon-button w-full sm:w-auto px-4 py-2 rounded-md sm:rounded-l-none"
            disabled={!selectedCategory}
          >
            Нэмэх
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Одоогийн ангилалууд:</h3>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold">{cat.name}</h4>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Устгах
                </button>
              </div>
              <ul className="list-disc pl-5">
                {cat.subcategories.map((sub, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{sub}</span>
                    <button
                      onClick={() => handleDeleteSubcategory(cat.id, sub)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Устгах
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;