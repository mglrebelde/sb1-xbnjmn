import { db } from '../firebase';
import { collection, addDoc, GeoPoint } from 'firebase/firestore';
import { Business, Review } from '../types';

const exampleBusinesses: Partial<Business>[] = [
  {
    name: "Хоолны Газар",
    category: "Ресторан",
    subcategory: "Монгол хоол",
    description: "Уламжлалт монгол хоол, орчин үеийн амт",
    address: "Сүхбаатар дүүрэг, 1-р хороо, Энх тайвны өргөн чөлөө 5",
    contactInfo: {
      phone: "7611-1234",
      email: "info@hooltszar.mn",
    },
    website: "https://hooltszar.mn",
    operatingHours: {
      "Monday": "10:00 AM - 10:00 PM",
      "Tuesday": "10:00 AM - 10:00 PM",
      "Wednesday": "10:00 AM - 10:00 PM",
      "Thursday": "10:00 AM - 10:00 PM",
      "Friday": "10:00 AM - 11:00 PM",
      "Saturday": "11:00 AM - 11:00 PM",
      "Sunday": "11:00 AM - 9:00 PM",
    },
    photos: ["https://example.com/hooltszar1.jpg", "https://example.com/hooltszar2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/hooltszar",
      instagram: "https://instagram.com/hooltszar",
    },
    rating: 4.5,
    latitude: 47.9184,
    longitude: 106.9177,
    isSponsored: false,
    isFeatured: true,
    aimag: "Улаанбаатар",
    soum: "Сүхбаатар дүүрэг",
  },
  {
    name: "Гоо Сайхны Салон",
    category: "Гоо сайхан",
    subcategory: "Үсчин",
    description: "Таны гоо сайханд зориулсан бүх төрлийн үйлчилгээ",
    address: "Баянгол дүүрэг, 3-р хороо, Энхтайваны өргөн чөлөө 12",
    contactInfo: {
      phone: "7622-5678",
      email: "info@goosaihan.mn",
    },
    website: "https://goosaihan.mn",
    operatingHours: {
      "Monday": "9:00 AM - 8:00 PM",
      "Tuesday": "9:00 AM - 8:00 PM",
      "Wednesday": "9:00 AM - 8:00 PM",
      "Thursday": "9:00 AM - 8:00 PM",
      "Friday": "9:00 AM - 9:00 PM",
      "Saturday": "10:00 AM - 9:00 PM",
      "Sunday": "10:00 AM - 6:00 PM",
    },
    photos: ["https://example.com/goosaihan1.jpg", "https://example.com/goosaihan2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/goosaihan",
      instagram: "https://instagram.com/goosaihan",
    },
    rating: 4.7,
    latitude: 47.9137,
    longitude: 106.9011,
    isSponsored: true,
    isFeatured: false,
    aimag: "Улаанбаатар",
    soum: "Баянгол дүүрэг",
  },
  {
    name: "Шүдний Эмнэлэг",
    category: "Эрүүл мэнд",
    subcategory: "Шүдний эмч",
    description: "Таны инээмсэглэлийг илүү гэрэлтүүлэх мэргэжлийн шүдний эмнэлэг",
    address: "Хан-Уул дүүрэг, 1-р хороо, Чингисийн өргөн чөлөө 17",
    contactInfo: {
      phone: "7633-9012",
      email: "info@shudniiemuulug.mn",
    },
    website: "https://shudniiemuulug.mn",
    operatingHours: {
      "Monday": "9:00 AM - 6:00 PM",
      "Tuesday": "9:00 AM - 6:00 PM",
      "Wednesday": "9:00 AM - 6:00 PM",
      "Thursday": "9:00 AM - 6:00 PM",
      "Friday": "9:00 AM - 6:00 PM",
      "Saturday": "10:00 AM - 3:00 PM",
      "Sunday": "Closed",
    },
    photos: ["https://example.com/shudniiemuulug1.jpg", "https://example.com/shudniiemuulug2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/shudniiemuulug",
    },
    rating: 4.8,
    latitude: 47.9021,
    longitude: 106.8845,
    isSponsored: false,
    isFeatured: true,
    aimag: "Улаанбаатар",
    soum: "Хан-Уул дүүрэг",
  },
];

const exampleReviews: Partial<Review>[] = [
  {
    businessId: "",
    rating: 5,
    comment: "Маш амттай хоол, дотно үйлчилгээ. Заавал очиж үзэх хэрэгтэй!",
    userName: "Болд",
  },
  {
    businessId: "",
    rating: 4,
    comment: "Үсчин маш сайн ажилласан. Үнэ нь бага зэрэг өндөр байсан ч үр дүнд нь сэтгэл хангалуун байна.",
    userName: "Сарнай",
  },
  {
    businessId: "",
    rating: 5,
    comment: "Мэргэжлийн түвшин өндөртэй эмч нар. Тав тухтай орчин бүрдүүлсэн байна.",
    userName: "Бат-Эрдэнэ",
  },
];

export const populateExampleData = async () => {
  try {
    for (const business of exampleBusinesses) {
      const docRef = await addDoc(collection(db, 'businesses'), {
        ...business,
        rating: 0,
        latitude: business.latitude,
        longitude: business.longitude,
      });
      
      // Add reviews for this business
      const reviewPromises = exampleReviews.map(review => 
        addDoc(collection(db, 'reviews'), {
          ...review,
          businessId: docRef.id,
          createdAt: new Date(),
        })
      );
      await Promise.all(reviewPromises);

      // Update business rating
      const businessRef = doc(db, 'businesses', docRef.id);
      await updateDoc(businessRef, {
        rating: exampleReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / exampleReviews.length,
      });
    }
    console.log("Example data populated successfully");
  } catch (error) {
    console.error("Error populating example data:", error);
  }
};