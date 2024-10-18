import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { Business, Category } from '../types';

interface BusinessFormProps {
  businessId?: string;
  categories: Category[];
  onSubmit: () => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ businessId, categories, onSubmit }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    address: '',
    contactInfo: { phone: '', email: '' },
    website: '',
    operatingHours: {},
    photos: [],
    socialMedia: {},
  });

  useEffect(() => {
    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId]);

  const fetchBusinessData = async () => {
    if (businessId) {
      const businessDoc = await getDoc(doc(db, 'businesses', businessId));
      if (businessDoc.exists()) {
        setFormData(businessDoc.data() as Business);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value },
    }));
  };

  const handleOperatingHoursChange = (day: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: { ...prev.operatingHours, [day]: value },
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const businessData = {
      ...formData,
      ownerId: currentUser.uid,
      isSponsored: false,
      isFeatured: false,
    };

    try {
      if (businessId) {
        await updateDoc(doc(db, 'businesses', businessId), businessData);
      } else {
        await addDoc(collection(db, 'businesses'), businessData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Failed to save business. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">Бизнесийн нэр</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="category" className="block mb-1">Ангилал</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Ангилал сонгох</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>

      {formData.category && (
        <div>
          <label htmlFor="subcategory" className="block mb-1">Дэд ангилал</label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Дэд ангилал сонгох</option>
            {categories
              .find((cat) => cat.name === formData.category)
              ?.subcategories.map((subcat, index) => (
                <option key={index} value={subcat}>{subcat}</option>
              ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="description" className="block mb-1">Тайлбар</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          rows={4}
        ></textarea>
      </div>

      <div>
        <label htmlFor="address" className="block mb-1">Хаяг</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block mb-1">Утасны дугаар</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.contactInfo?.phone}
          onChange={handleContactInfoChange}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-1">Имэйл хаяг</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.contactInfo?.email}
          onChange={handleContactInfoChange}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="website" className="block mb-1">Вэбсайт</label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block mb-1">Ажиллах цаг</label>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <div key={day} className="flex items-center mb-2">
            <span className="w-24">{day}:</span>
            <input
              type="text"
              value={formData.operatingHours?.[day] || ''}
              onChange={(e) => handleOperatingHoursChange(day, e.target.value)}
              placeholder="e.g., 9:00 AM - 5:00 PM"
              className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block mb-1">Сошиал медиа</label>
        {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform) => (
          <div key={platform} className="flex items-center mb-2">
            <span className="w-24 capitalize">{platform}:</span>
            <input
              type="url"
              value={formData.socialMedia?.[platform] || ''}
              onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
              placeholder={`${platform} URL`}
              className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <button type="submit" className="zoon-button w-full px-4 py-2 rounded-md">
        {businessId ? 'Шинэчлэх' : 'Үүсгэх'}
      </button>
    </form>
  );
};

export default BusinessForm;