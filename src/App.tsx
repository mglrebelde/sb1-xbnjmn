import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Business, Category } from './types';
import BusinessCard from './components/BusinessCard';
import SearchBar, { SearchFilters } from './components/SearchBar';
import ReviewForm from './components/ReviewForm';
import Map from './components/Map';
import Auth from './components/Auth';
import Pagination from './components/Pagination';
import CategoryManagement from './components/CategoryManagement';
import BusinessOwnerDashboard from './components/BusinessOwnerDashboard';
import Profile from './components/Profile';
import { Building2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { populateExampleData } from './utils/populateExampleData';

const ITEMS_PER_PAGE = 6;

function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    fetchBusinesses();
    fetchCategories();
    // Uncomment the following line to populate example data (run only once)
    // populateExampleData();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const businessesQuery = query(collection(db, 'businesses'));
      const businessSnapshot = await getDocs(businessesQuery);
      const businessList = businessSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      setBusinesses(businessList);
      setFilteredBusinesses(businessList);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    let filtered = businesses;

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(business => 
        business.name.toLowerCase().includes(keyword) ||
        business.description.toLowerCase().includes(keyword)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(business => business.category === filters.category);
    }

    if (filters.aimag) {
      filtered = filtered.filter(business => business.aimag?.toLowerCase().includes(filters.aimag.toLowerCase()));
    }

    if (filters.soum) {
      filtered = filtered.filter(business => business.soum?.toLowerCase().includes(filters.soum.toLowerCase()));
    }

    setFilteredBusinesses(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBusinesses = filteredBusinesses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="zoon-header py-4">
          <div className="zoon-container flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-orange-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Бизнес Лавлах</h1>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="text-gray-600 hover:text-orange-500">Нүүр</a></li>
                <li><a href="/categories" className="text-gray-600 hover:text-orange-500">Ангилал</a></li>
                <li><a href="/about" className="text-gray-600 hover:text-orange-500">Тухай</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="zoon-container py-8">
          <div className="mb-8">
            <Auth />
          </div>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={
              <>
                {userRole === 'admin' && (
                  <div className="mb-8">
                    <CategoryManagement categories={categories} onCategoryUpdate={setCategories} />
                  </div>
                )}
                <div className="mb-8">
                  <SearchBar onSearch={handleSearch} categories={categories} />
                </div>
                <div className="mb-8">
                  <Map businesses={filteredBusinesses} />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentBusinesses.map((business) => (
                    <div key={business.id} className={`${business.isFeatured ? 'col-span-2' : ''}`}>
                      <BusinessCard business={business} />
                      <ReviewForm businessId={business.id} />
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            } />
            <Route path="/business-owner-dashboard" element={<BusinessOwnerDashboard />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="zoon-container">
            <p>&copy; 2023 Бизнес Лавлах. Бүх эрх хуулиар хамгаалагдсан.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;