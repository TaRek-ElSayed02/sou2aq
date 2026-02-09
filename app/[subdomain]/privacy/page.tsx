'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const { t, isArabic, dir } = useTranslation();
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subdomain) return;

    const fetchSiteData = async () => {
      try {
        // Get siteId from subdomain
        const siteIdResponse = await fetch(`http://localhost:5000/api/site/idBySubdomain/${subdomain}`);
        const siteIdData = await siteIdResponse.json();
        const siteId = siteIdData.data.id;

        // Get site data
        const siteResponse = await fetch(`http://localhost:5000/api/site/${siteId}`);
        const siteData = await siteResponse.json();
        setSiteData(siteData.data);
      } catch (error) {
        console.error('Error fetching site data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/${subdomain}`}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-gray-900 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: siteData?.privacy_policy || (isArabic
                  ? '<h2>سياسة الخصوصية</h2><p>نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك.</p>'
                  : '<h2>Privacy Policy</h2><p>We are committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your information.</p>'
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
