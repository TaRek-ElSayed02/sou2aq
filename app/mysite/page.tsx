'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, ChevronDown, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';

export default function MysitePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 12, minutes: 34, seconds: 56 });
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: '🏪' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'shoes', name: 'Shoes', icon: '👟' },
    { id: 'furniture', name: 'Furniture', icon: '🛋️' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
  ];

  const products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 199.99,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      category: 'electronics',
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      price: 299.99,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: 'electronics',
    },
    {
      id: 3,
      name: 'Digital Camera',
      price: 599.99,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=500&fit=crop',
      category: 'electronics',
    },
    {
      id: 4,
      name: 'Leather Jacket',
      price: 149.99,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
      category: 'fashion',
    },
    {
      id: 5,
      name: 'Classic T-Shirt',
      price: 29.99,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      category: 'fashion',
    },
    {
      id: 6,
      name: 'Sports Shoes',
      price: 89.99,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      category: 'shoes',
    },
    {
      id: 7,
      name: 'Designer Sneakers',
      price: 129.99,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop',
      category: 'shoes',
    },
    {
      id: 8,
      name: 'Modern Sofa',
      price: 899.99,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
      category: 'furniture',
    },
  ];

  const features = [
    { icon: '🚚', title: 'Free Shipping', description: 'On orders over $50' },
    { icon: '✅', title: 'Quality Guaranteed', description: '100% authentic products' },
    { icon: '💰', title: 'Best Prices', description: 'Competitive pricing' },
    { icon: '📞', title: '24/7 Support', description: 'Customer service always available' },
  ];

  const faqs = [
    { question: 'What payment methods do you accept?', answer: 'We accept credit cards, debit cards, PayPal, and digital wallets.' },
    { question: 'What is your return policy?', answer: 'We offer 30-day returns for unused items with original packaging.' },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days, express shipping 2-3 days.' },
    { question: 'Is customer support available?', answer: 'Yes, we have 24/7 customer support via email, phone, and chat.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', rating: 5, text: 'Amazing quality products and fast shipping!' },
    { name: 'Mike Smith', rating: 5, text: 'Great prices and excellent customer service.' },
    { name: 'Emma Davis', rating: 4, text: 'Very satisfied with my purchase. Will shop again!' },
    { name: 'Lisa Anderson', rating: 5, text: 'Best online store I have shopped from.' },
  ];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory.toLowerCase());

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-200 to-yellow-200 rounded-full opacity-20 -ml-32 -mb-32"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-pink-200 text-pink-700 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                🔥 Trending Item
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Women's Latest Fashion Sale
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Discover our exclusive collection of premium fashion products at unbeatable prices.
              </p>
              <div className="mb-8">
                <p className="text-gray-600 mb-2">Starting at</p>
                <p className="text-4xl font-bold text-pink-500">$ 20.00</p>
              </div>
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-bold transition">
                SHOP NOW →
              </button>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1490725967868-a0aa59e6aab1?w=600&h=600&fit=crop"
                alt="Fashion"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`p-6 rounded-2xl text-center transition transform hover:scale-105 ${
                activeCategory === cat.name
                  ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-lg'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="font-semibold">{cat.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="overflow-hidden h-48 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-500">${product.price}</span>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-pink-50 transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 bg-gradient-to-r from-pink-500 to-orange-400 rounded-3xl text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
            <p className="text-xl mb-8 opacity-90">Get 30% off on all items this week only!</p>
            <button className="bg-white text-pink-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-4xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
              <p className="text-sm opacity-75">Days</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <p className="text-sm opacity-75">Hours</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <p className="text-sm opacity-75">Minutes</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <p className="text-sm opacity-75">Seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-600 transition ${expandedFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="px-6 py-4 bg-white text-gray-600 border-t border-gray-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-900">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Visit Our Store</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.1848894825364!2d46.6771311!3d24.7745312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03d6d7d7d7d7%3A0x7d7d7d7d7d7d7d7d!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="text-pink-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">123 Shopping Street, Riyadh, Saudi Arabia 12345</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="text-pink-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+966 11 234 5678</p>
                <p className="text-gray-600 text-sm">Mon - Fri, 9AM - 6PM</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="text-pink-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@storemart.com</p>
                <p className="text-gray-600 text-sm">24-hour reply</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 bg-gray-900 text-white rounded-3xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-8">Get the latest deals and news delivered to your inbox</p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-bold transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
