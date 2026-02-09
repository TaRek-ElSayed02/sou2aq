'use client';
import React, { useState, useMemo } from 'react';
import { Calendar, User, Clock, ChevronLeft, MessageSquare, Share2, BookOpen, Tag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer.tsx/Footer';

export default function Blog() {
  const { t, dir, isArabic } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const blogPosts = [
    {
      id: 1,
      title: 'How to Write a Resume That Gets Recruiter Attention in 2026',
      excerpt: 'A comprehensive guide to writing a professional resume that helps you stand out from hundreds of job applicants, with practical tips and real examples.',
      author: 'Ahmed Mohammed',
      date: 'March 15, 2025',
      category: 'Professional Tips',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800',
      featured: true,
      timestamp: new Date('2025-03-15').getTime()
    },
    {
      id: 2,
      title: '10 Common Resume Mistakes That Get Your Application Rejected',
      excerpt: 'Avoid these common mistakes that most job seekers make that lead to rejection of their resumes.',
      author: 'Sarah Al Ali',
      date: 'March 10, 2025',
      category: 'Skill Development',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-03-10').getTime()
    },
    {
      id: 3,
      title: 'Resume Design: The Ultimate Guide to Colors and Fonts',
      excerpt: 'How to choose the right colors and fonts for your resume to reflect your professional personality and catch the reader\'s attention.',
      author: 'Mohammed Al-Khalid',
      date: 'March 5, 2025',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-03-05').getTime()
    },
    {
      id: 4,
      title: 'How to Customize Your Resume for Each Job Application',
      excerpt: 'Why you need to customize your resume for each job and how to do it effectively to increase your chances of acceptance.',
      author: 'Nora Al-Saad',
      date: 'February 28, 2025',
      category: 'Strategies',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-28').getTime()
    },
    {
      id: 5,
      title: 'Secrets to Writing a Skills Section in Your Resume',
      excerpt: 'How to showcase your skills professionally so that the hiring manager immediately realizes your value to the organization.',
      author: 'Khaled Al-Fahad',
      date: 'February 22, 2025',
      category: 'Writing',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-22').getTime()
    },
    {
      id: 6,
      title: 'Smart Resumes: Using Keywords to Your Advantage',
      excerpt: 'How to use the right keywords to pass automated screening systems and reach the hiring manager.',
      author: 'Fatema Al-Qassim',
      date: 'February 18, 2025',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-18').getTime()
    },
    {
      id: 7,
      title: 'Tips for Successful Job Interviews',
      excerpt: 'How to prepare for job interviews and answer difficult questions with confidence and professionalism.',
      author: 'Ali Abdullah',
      date: 'February 15, 2025',
      category: 'Professional Tips',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-15').getTime()
    },
    {
      id: 8,
      title: 'How to Write an Effective Cover Letter',
      excerpt: 'A practical guide to writing a cover letter that catches the hiring manager\'s attention and increases your chances of getting the job.',
      author: 'Mona Al-Rashid',
      date: 'February 12, 2025',
      category: 'Writing',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-12').getTime()
    },
    {
      id: 9,
      title: 'Best Job Search Platforms in 2025',
      excerpt: 'A guide to the best platforms and websites for finding jobs in different fields and sectors.',
      author: 'Salem Al-Harbi',
      date: 'February 8, 2025',
      category: 'Strategies',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-08').getTime()
    },
    {
      id: 10,
      title: 'How to Build an Effective Professional Network',
      excerpt: 'Practical strategies for building and developing a professional network that helps you advance in your career.',
      author: 'Layla Al-Qahtani',
      date: 'February 5, 2025',
      category: 'Skill Development',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-05').getTime()
    },
    {
      id: 11,
      title: 'Career Development: How to Plan Your Professional Future',
      excerpt: 'Practical steps to plan your professional future and set goals for continuous development.',
      author: 'Fahad Al-Otaibi',
      date: 'February 1, 2025',
      category: 'Skill Development',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-02-01').getTime()
    },
    {
      id: 12,
      title: 'Tech Tools That Help You in Your Job Search',
      excerpt: 'The most important tools and apps that can help you in your journey to find the right job.',
      author: 'Nawaf Al-Shammari',
      date: 'January 28, 2025',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-28').getTime()
    },
    {
      id: 13,
      title: 'How to Negotiate Salary and Benefits',
      excerpt: 'Smart strategies and tricks for negotiating salary and job benefits with confidence and professionalism.',
      author: 'Reem Al-Subaie',
      date: 'January 25, 2025',
      category: 'Professional Tips',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-25').getTime()
    },
    {
      id: 14,
      title: 'Creative Resumes: When Are They Appropriate?',
      excerpt: 'When you should use a creative resume and when a traditional resume is the better choice.',
      author: 'Mohammed Al-Najdi',
      date: 'January 22, 2025',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-22').getTime()
    },
    {
      id: 15,
      title: 'How to Showcase Your Previous Projects in Your Resume',
      excerpt: 'An effective way to display your previous projects and achievements in your resume to attract the attention of hiring managers.',
      author: 'Salma Al-Harthy',
      date: 'January 18, 2025',
      category: 'Writing',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800',
      featured: false,
      timestamp: new Date('2025-01-18').getTime()
    }
  ];

  const categories = [
    t('common.allArticles'),
    t('common.professionalTips'),
    t('common.designCategory'),
    t('common.writing'),
    t('common.strategies'),
    t('common.skillDevelopment'),
    t('common.technology')
  ];

  const popularTags = [
    'Resume',
    'Job Search',
    'Career',
    'Design',
    'Tips',
    'Jobs',
    'Skills',
    'Success',
    'Development',
    'Professional'
  ];

  const filteredPosts = useMemo(() => {
    let filtered = [...blogPosts];

    if (selectedCategory !== t('common.allArticles')) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    filtered = filtered.filter(post => !post.featured);

    filtered.sort((a, b) => {
      if (sortOrder === t('common.newest')) {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });

    return filtered;
  }, [selectedCategory, sortOrder]);

  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [currentPage, filteredPosts, postsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / postsPerPage);
  }, [filteredPosts.length, postsPerPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const featuredPost = blogPosts.find(post => post.featured);

  const handleCategorySelect = (category : string) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const handleSortChange = (order : string) => {
    setSortOrder(order);
    setCurrentPage(1); 
  };

  const handlePageChange = (pageNumber : number) => {
    setCurrentPage(pageNumber);
  };

  const handleShare = (postId :number) => {
    console.log('Sharing article:', postId);
  };

  const handleReadMore = (postId:number) => {
    window.location.href = `/blog/${postId}`;
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white ${isArabic ? 'text-right' : 'text-left'}`} dir={dir}>
      <Header />

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6 leading-tight">
              {t('common.blogs')}
            </h1>
            <p className="text-xl text-[#1E293B] mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('common.blogDesc')}
            </p>
          </div>
        </section>

        {featuredPost && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border border-gray-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-black text-sm font-medium px-4 py-1 rounded-full">
                      {t('common.featuredArticle')}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-black mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mb-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReadMore(featuredPost.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition w-fit flex items-center gap-2"
                  >
                    {t('common.readArticle')}
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
                <div
                  className="h-64 lg:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredPost.image})` }}
                />
              </div>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
                  {selectedCategory === t('common.allArticles') ? t('common.latestArticles') : selectedCategory}
                  <span className="text-gray-400 text-sm font-normal ml-2">
                    ({filteredPosts.length} {t('common.articles')})
                  </span>
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">{t('common.sortBy')}</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-100 border border-gray-300 text-black rounded-lg px-4 py-2 text-sm"
                  >
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {currentPosts.length > 0 ? (
                  currentPosts.map(post => (
                    <div key={post.id} className="bg-gray-100 rounded-xl overflow-hidden border border-gray-300 hover:border-blue-700/50 transition group">
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-blue-600 text-sm font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {post.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold cursor-pointer text-black mb-3 group-hover:text-black transition">
                          {post.title}
                        </h3>
                        <p className="text-gray-700 text-sm mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                          <div className="flex items-center gap-4 text-gray-600 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleShare(post.id)}
                              className="text-gray-400 hover:text-blue-600 transition"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReadMore(post.id)}
                              className="text-black hover:text-blue-600 transition flex items-center gap-1"
                            >
                              <span className="text-sm">{t('common.readMore')}</span>
                              <ChevronLeft className="w-4 h-4 rotate-180" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-400 text-lg">{t('common.noArticles')}</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg transition ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-black hover:bg-blue-200 hover:border-blue-300'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>

                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 text-black rounded-lg hover:bg-blue-200 hover:border-blue-300 transition"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="text-gray-600 px-2">...</span>
                      )}
                    </>
                  )}

                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-lg transition ${
                        currentPage === number
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-black hover:text-white hover:bg-blue-200 hover:border-blue-300'
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="text-gray-400 px-2">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 text-black rounded-lg hover:bg-blue-200 hover:border-blue-300 transition"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg transition ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-black hover:bg-blue-200 hover:border-blue-300'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div className="text-center mt-4 text-gray-600 text-sm">
                  {t('common.showingArticles')} {(currentPage - 1) * postsPerPage + 1} {t('common.to')}{' '}
                  {Math.min(currentPage * postsPerPage, filteredPosts.length)} {t('common.of')}{' '}
                  {filteredPosts.length} {t('common.articles')}
                </div>
              )}
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-6 space-y-8">
                <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
                  <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-black" />
                    {t('common.articleCategories')}
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                        className={`flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-200 transition group ${
                          selectedCategory === category 
                            ? 'bg-gray-200 text-black' 
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        <span>{category}</span>
                        {selectedCategory === category && (
                          <ChevronLeft className="w-4 h-4 opacity-100 transition" />
                        )}
                        {selectedCategory !== category && (
                          <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {t('common.articlesYouMightLike')}
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              {t('common.discoverMoreContent')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts
              .filter(post => post.id !== featuredPost?.id)
              .slice(0, 3)
              .map(post => (
                <div key={post.id} className="bg-gray-100 rounded-xl p-6 border border-gray-300 hover:border-blue-300 transition group">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-black text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-3 group-hover:text-black transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                    <span className="text-gray-600 text-sm">{post.date}</span>
                    <button
                      onClick={() => handleReadMore(post.id)}
                      className="text-black hover:text-blue-600 transition flex items-center gap-1 text-sm"
                    >
                      <span>{t('common.readArticle')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 md:p-16 text-center border border-blue-300/50">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
              {t('common.readyToCreateResume')}
            </h2>
            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
              {t('common.startNowFree')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
                style={{ color: "white" }}
              >
                {t('common.startFree')}
              </Link>
              <Link
                href="/templates"
                className="bg-transparent hover:bg-white/10 text-black border border-black/30 px-8 py-4 rounded-lg text-lg font-semibold transition"
                style={{ color: "black" }}
              >
                {t('common.browseTemplates')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
