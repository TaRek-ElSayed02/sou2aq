'use client';
import React from 'react';
import {
  FileText,
  Users,
  Zap,
  CheckCircle,
  Shield,
  Palette,
  Layout,
  Settings,
} from 'lucide-react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer.tsx/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  
  const handleClick = () => {
    window.location.href = '/auth/register';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-left">
      <Header />

      <main className="flex-grow" dir="ltr">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6">
              {t('common.whoAreWe')}
            </h1>
            <p className="text-xl text-[#1E293B] mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('common.whoAreWeDesc')}
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className=" rounded-2xl p-8 md:p-12 border border-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6">
              {t('common.ourStory')}
            </h2>
            <div className="space-y-4 text-[#1E293B] text-lg leading-relaxed">
              <p>
                {t('common.storyPart1')}
              </p>
              <p>
                {t('common.storyPart2')}
              </p>
              <p>
                {t('common.storyPart3')}
              </p>
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-4">
              {t('common.howWeHelp')}
            </h2>
            <p className="text-xl text-[#1E293B] max-w-2xl mx-auto">
              {t('common.helpYouDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Simple Form */}
            <div className="bg-gray-100 rounded-xl p-8 border border-gray-300">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {t('common.simpleSmartForm')}
                  </h3>
                  <p className="text-gray-700">
                    {t('common.formDesc')}
                  </p>
                </div>
              </div>

              <div className="pl-16 space-y-3">
                <Feature text={t('common.smartAutoFilled')} />
                <Feature text={t('common.writingSuggestions')} />
                <Feature text={t('common.automaticSaving')} />
              </div>
            </div>

            {/* Instant Result */}
            <div className="bg-gray-100 rounded-xl p-8 border border-gray-300">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {t('common.instantResults')}
                  </h3>
                  <p className="text-gray-700">
                    {t('common.instantDesc')}
                  </p>
                </div>
              </div>

              <div className="pl-16 space-y-3">
                <Feature text={t('common.livePreview')} />
                <Feature text={t('common.highQualityPdf')} />
                <Feature text={t('common.readyForPrinting')} />
              </div>
            </div>
          </div>

          {/* Dashboard */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-12 border border-gray-300">
            <div className="flex gap-4 mb-10">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <Layout className="w-7 h-7 text-black" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-black">
                  {t('common.personalDashboard')}
                </h3>
                <p className="text-gray-700">
                  {t('common.manageDashboard')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                icon={<Settings />}
                title={t('common.easyEditing')}
                text={t('common.easyEditingDesc')}
              />
              <DashboardCard
                icon={<FileText />}
                title={t('common.multipleResumes')}
                text={t('common.multipleResumesDesc')}
              />
              <DashboardCard
                icon={<Palette />}
                title={t('common.multipleTemplates')}
                text={t('common.multipleTemplatesDesc')}
              />
              <DashboardCard
                icon={<Shield />}
                title={t('common.dataSecurity')}
                text={t('common.dataSecurityDesc')}
              />
              <DashboardCard
                icon={<CheckCircle />}
                title={t('common.autoSave')}
                text={t('common.autoSaveDesc')}
              />
              <DashboardCard
                icon={<Users />}
                title={t('common.continuousSupport')}
                text={t('common.continuousSupportDesc')}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6">
            {t('common.readyToStart')}
          </h2>
          <p className="text-xl text-[#1E293B] mb-8 max-w-2xl mx-auto">
            {t('common.readyToStartDesc')}
          </p>
          <button
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            {t('common.getStartedNow')}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* Helpers */
function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-black" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-gray-100 rounded-lg p-6 border border-gray-300">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-black">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-black mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}
