import React from 'react';
import { Business } from '../types';
import { Star, MapPin, Phone, Mail, Globe, Clock, Award, Zap, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <div className={`zoon-card p-6 mb-4 ${business.isFeatured ? 'border-2 border-yellow-400' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-gray-800">{business.name}</h2>
        <div className="flex space-x-2">
          {business.isSponsored && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Sponsored
            </span>
          )}
          {business.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Featured
            </span>
          )}
        </div>
      </div>
      <p className="text-orange-500 font-medium mb-2">{business.category} - {business.subcategory}</p>
      <p className="text-sm mb-4 text-gray-600">{business.description}</p>
      <div className="flex items-center mb-4">
        <Star className="w-5 h-5 text-yellow-400 mr-1" />
        <span className="font-medium">{business.rating.toFixed(1)}</span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          {business.address}
        </p>
        <p className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          {business.contactInfo.phone}
        </p>
        <p className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          {business.contactInfo.email}
        </p>
        <p className="flex items-center">
          <Globe className="w-4 h-4 mr-2 text-gray-400" />
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
            {business.website}
          </a>
        </p>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <div>
            {Object.entries(business.operatingHours).map(([day, hours]) => (
              <p key={day}>{day}: {hours}</p>
            ))}
          </div>
        </div>
      </div>
      {business.photos.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Photos</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {business.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`${business.name} photo ${index + 1}`} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex space-x-4">
        {business.socialMedia.facebook && (
          <a href={business.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            <Facebook className="w-5 h-5" />
          </a>
        )}
        {business.socialMedia.instagram && (
          <a href={business.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600">
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {business.socialMedia.twitter && (
          <a href={business.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400">
            <Twitter className="w-5 h-5" />
          </a>
        )}
        {business.socialMedia.linkedin && (
          <a href={business.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700">
            <Linkedin className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default BusinessCard;