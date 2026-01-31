'use client';

import React, { useState } from 'react';
import { Search, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const blogs = [
    {
      id: 1,
      title: 'Top 10 Fashion Trends for 2025',
      author: 'Sara Johnson',
      date: 'March 20, 2025',
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1490725967868-a0aa59e6aab1?w=600&h=600&fit=crop',
      excerpt: 'Discover the latest fashion trends that are taking over the industry this season. From bold colors to classic styles, we have everything.',
    },
    {
      id: 2,
      title: 'How to Choose Perfect Shoes',
      author: 'Mike Smith',
      date: 'March 18, 2025',
      category: 'Style',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      excerpt: 'A comprehensive guide to finding the perfect shoes for any occasion and style preference.',
    },
    {
      id: 3,
      title: 'Electronics Buying Guide 2025',
      author: 'Emma Davis',
      date: 'March 15, 2025',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1516111309421-b37b4d5aa22f?w=600&h=600&fit=crop',
      excerpt: 'Everything you need to know before buying your next electronic device. Expert tips and recommendations.',
    },
    {
      id: 4,
      title: 'Spring Collection Preview',
      author: 'Lisa Anderson',
      date: 'March 12, 2025',
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop',
      excerpt: 'Get an exclusive preview of our spring collection before the official release. Fresh designs and colors.',
    },
    {
      id: 5,
      title: 'Best Interior Design Trends',
      author: 'John Wilson',
      date: 'March 10, 2025',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
      excerpt: 'Transform your home with the latest interior design trends. Modern and comfortable living spaces.',
    },
    {
      id: 6,
      title: 'Sustainable Fashion: A Guide',
      author: 'Alice Brown',
      date: 'March 8, 2025',
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      excerpt: 'Learn about sustainable fashion and how to make eco-friendly choices when shopping.',
    },
  ];

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600">Tips, trends, and insights from our experts</p>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400" size={20} />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group h-full flex flex-col">
              <div className="overflow-hidden h-48 bg-gray-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="inline-block bg-pink-100 text-pink-600 text-sm font-bold px-3 py-1 rounded-full mb-3 w-fit">
                  {blog.category}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-600 transition">{blog.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <User size={16} />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar size={16} />
                    <span>{blog.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
