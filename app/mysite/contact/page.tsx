'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you. Get in touch with us today.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-pink-100 p-3 rounded-lg flex-shrink-0 h-fit">
                <MapPin className="text-pink-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Address</h3>
                <p className="text-gray-600">123 Shopping Street</p>
                <p className="text-gray-600">Riyadh, Saudi Arabia 12345</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-pink-100 p-3 rounded-lg flex-shrink-0 h-fit">
                <Phone className="text-pink-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Phone</h3>
                <p className="text-gray-600">+966 11 234 5678</p>
                <p className="text-gray-600 text-sm">Mon - Fri, 9AM - 6PM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-pink-100 p-3 rounded-lg flex-shrink-0 h-fit">
                <Mail className="text-pink-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Email</h3>
                <p className="text-gray-600">support@storemart.com</p>
                <p className="text-gray-600 text-sm">24-hour reply</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-900 font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                placeholder="Message subject"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 resize-none"
                placeholder="Your message"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-96 bg-gray-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.1848894825364!2d46.6771311!3d24.7745312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03d6d7d7d7d7%3A0x7d7d7d7d7d7d7d7d!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </section>
    </div>
  );
}
