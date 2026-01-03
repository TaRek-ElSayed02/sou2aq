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

export default function About() {
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
              Who Are We?
            </h1>
            <p className="text-xl text-[#1E293B] mb-8 max-w-3xl mx-auto leading-relaxed">
              We are a platform dedicated to helping job seekers create
              professional resumes in a simple and effective way. Our mission
              is to empower you to land your dream job through a standout resume
              that highlights your skills and experience.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className=" rounded-2xl p-8 md:p-12 border border-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-[#1E293B] text-lg leading-relaxed">
              <p>
                The idea behind CV Builder started from a personal experience
                faced by our founders while searching for jobs. We noticed that
                many talented individuals were missing great opportunities due
                to poorly designed or unprofessional resumes.
              </p>
              <p>
                We decided to build a solution that makes resume creation easy
                and accessible to everyone. No design skills or technical
                experience required. Just enter your information and within
                minutes you’ll have a professional resume ready to download and
                send.
              </p>
              <p>
                Today, we are proud to have helped thousands of users secure
                their ideal jobs through resumes created on our platform.
              </p>
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-4">
              How We Help You
            </h2>
            <p className="text-xl text-[#1E293B] max-w-2xl mx-auto">
              We provide a complete experience for building and managing your
              resume
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Simple Form */}
            <div className="bg-[#1A2035] rounded-xl p-8 border border-gray-800">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Simple & Smart Form
                  </h3>
                  <p className="text-gray-300">
                    Fill out an easy form with your personal details, experience,
                    skills, and certifications. The form guides you step by step
                    with no complexity.
                  </p>
                </div>
              </div>

              <div className="pl-16 space-y-3">
                <Feature text="Smart auto-filled fields" />
                <Feature text="Writing suggestions" />
                <Feature text="Automatic saving" />
              </div>
            </div>

            {/* Instant Result */}
            <div className="bg-[#1A2035] rounded-xl p-8 border border-gray-800">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Instant Results
                  </h3>
                  <p className="text-gray-300">
                    As soon as you finish entering your information, your resume
                    appears instantly with a professional design ready for
                    download.
                  </p>
                </div>
              </div>

              <div className="pl-16 space-y-3">
                <Feature text="Live preview while typing" />
                <Feature text="High-quality PDF export" />
                <Feature text="Ready for printing & sharing" />
              </div>
            </div>
          </div>

          {/* Dashboard */}
          <div className="bg-gradient-to-br from-[#1A2035] to-[#0F1525] rounded-2xl p-12 border border-gray-800">
            <div className="flex gap-4 mb-10">
              <div className="w-14 h-14 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Layout className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">
                  Personal Dashboard
                </h3>
                <p className="text-gray-300">
                  Manage your account and resumes with ease
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                icon={<Settings />}
                title="Easy Editing"
                text="Update your information anytime and see changes instantly."
              />
              <DashboardCard
                icon={<FileText />}
                title="Multiple Resumes"
                text="Create different resumes for different job applications."
              />
              <DashboardCard
                icon={<Palette />}
                title="Multiple Templates"
                text="Switch designs anytime and choose what fits you best."
              />
              <DashboardCard
                icon={<Shield />}
                title="Data Security"
                text="Your data is protected with the highest security standards."
              />
              <DashboardCard
                icon={<CheckCircle />}
                title="Auto Save"
                text="Every change is saved automatically to your account."
              />
              <DashboardCard
                icon={<Users />}
                title="Continuous Support"
                text="Our support team is always ready to help you."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#1E293B] mb-8 max-w-2xl mx-auto">
            Join thousands of users who landed their dream jobs with professional
            resumes.
          </p>
          <button
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            Get Started Now
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
      <CheckCircle className="w-5 h-5 text-blue-500" />
      <span className="text-gray-300">{text}</span>
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
    <div className="bg-[#0A0F1F] rounded-lg p-6 border border-gray-800">
      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 text-blue-500">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}
