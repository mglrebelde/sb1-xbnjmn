import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { Business, PromotionPlan } from '../types';
import BusinessForm from './BusinessForm';

const BusinessOwnerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [promotionPlans, setPromotionPlans] = useState<PromotionPlan[]>([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchOwnedBusinesses();
      fetchPromotionPlans();
      fetchCategories();
    }
  }, [currentUser]);

  const fetchOwnedBusinesses = async () => {
    if (!currentUser) return;
    const q = query(collection(db, 'businesses'), where('ownerId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    const businesses: Business[] = [];
    querySnapshot.forEach((doc) => {
      businesses.push({ id: doc.id, ...doc.data() } as Business);
    });
    setOwnedBusinesses(businesses);
  };

  const fetchPromotionPlans = async () => {
    const querySnapshot = await getDocs(collection(db, 'promotionPlans'));
    const plans: PromotionPlan[] = [];
    querySnapshot.forEach((doc) => {
      plans.push({ id: doc.id, ...doc.data() } as PromotionPlan);
    });
    setPromotionPlans(plans);
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categoriesList = [];
    querySnapshot.forEach((doc) => {
      categoriesList.push({ id: doc.id, ...doc.data() });
    });
    setCategories(categoriesList);
  };

  const handlePromoteBusiness = async (businessId: string, planId: string) => {
    const plan = promotionPlans.find(p => p.id === planId);
    if (!plan) return;

    const businessRef = doc(db, 'businesses', businessId);
    const endDate = Timestamp.fromDate(new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000));

    await updateDoc(businessRef, {
      isSponsored: plan.isSponsored,
      isFeatured: plan.isFeatured,
      promotionEndDate: endDate
    });

    // Here you would typically integrate with a payment gateway
    alert(`Payment of $${plan.price} processed successfully. Your business is now promoted!`);

    fetchOwnedBusinesses();
  };

  const handleBusinessFormSubmit = () => {
    setShowBusinessForm(false);
    fetchOwnedBusinesses();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Бизнес эзэмшигчийн самбар</h2>
      {showBusinessForm ? (
        <BusinessForm
          categories={categories}
          onSubmit={handleBusinessFormSubmit}
          businessId={selectedBusiness?.id}
        />
      ) : (
        <>
          <button
            onClick={() => {
              setSelectedBusiness(null);
              setShowBusinessForm(true);
            }}
            className="zoon-button px-4 py-2 rounded-md mb-4"
          >
            Шинэ бизнес нэмэх
          </button>
          {ownedBusinesses.length === 0 ? (
            <p>Та одоогоор ямар нэг бизнес эзэмшээгүй байна.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-2">Таны бизнесүүд</h3>
                <ul>
                  {ownedBusinesses.map((business) => (
                    <li
                      key={business.id}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => setSelectedBusiness(business)}
                    >
                      {business.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="col-span-2">
                {selectedBusiness && (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{selectedBusiness.name}</h3>
                    <button
                      onClick={() => setShowBusinessForm(true)}
                      className="zoon-button px-4 py-2 rounded-md mb-4"
                    >
                      Засах
                    </button>

                    <h3 className="text-xl font-semibold mt-6 mb-2">Бизнесээ дэмжих</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {promotionPlans.map((plan) => (
                        <div key={plan.id} className="border p-4 rounded">
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p>{plan.description}</p>
                          <p>Үнэ: ${plan.price}</p>
                          <p>Хугацаа: {plan.duration} өдөр</p>
                          <button
                            onClick={() => handlePromoteBusiness(selectedBusiness.id, plan.id)}
                            className="zoon-button px-4 py-2 rounded mt-2"
                          >
                            Энэ төлөвлөгөөг сонгох
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add a reviews section here if needed */}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessOwnerDashboard;