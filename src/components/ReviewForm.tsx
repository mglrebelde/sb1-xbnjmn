import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

interface ReviewFormProps {
  businessId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ businessId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to submit a review.');
      return;
    }

    try {
      await addDoc(collection(db, 'reviews'), {
        businessId,
        userId: currentUser.uid,
        rating,
        comment,
        createdAt: new Date()
      });
      setRating(0);
      setComment('');
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Сэтгэгдэл бичих</h3>
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Таны сэтгэгдэл..."
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        rows={3}
      ></textarea>
      <button
        type="submit"
        className="zoon-button mt-2 px-4 py-2 rounded-md"
        disabled={!currentUser}
      >
        {currentUser ? 'Илгээх' : 'Нэвтэрнэ үү'}
      </button>
    </form>
  );
};

export default ReviewForm;