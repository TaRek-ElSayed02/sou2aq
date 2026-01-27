'use client';
import React from 'react';
import { Mail, Phone, MapPin, LinkedinIcon, TwitterIcon, MessageCircle, Github } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  description: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
    github?: string;
  };
}

export default function TeamPage() {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Ahmed Mohammed',
      position: 'Project Manager',
      department: 'Management',
      email: 'ahmed.mohammed@company.com',
      phone: '+966501234567',
      location: 'Riyadh, Saudi Arabia',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      description: 'Experienced project manager with 8 years of expertise in team leadership and large-scale projects',
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        whatsapp: 'https://wa.me/966501234567',
        github: '#'
      }
    },
    {
      id: 2,
      name: 'Fatima Ali',
      position: 'Full Stack Developer',
      department: 'Development',
      email: 'fatima.ali@company.com',
      phone: '+966502345678',
      location: 'Jeddah, Saudi Arabia',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      description: 'Specialized developer in React and Node.js with 6 years of professional experience',
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        whatsapp: 'https://wa.me/966502345678',
        github: '#'
      }
    },
    {
      id: 3,
      name: 'Mahmoud Hassan',
      position: 'UI/UX Designer',
      department: 'Design',
      email: 'mahmoud.hassan@company.com',
      phone: '+966503456789',
      location: 'Dammam, Saudi Arabia',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      description: 'Creative designer specializing in user experience and interactive interfaces',
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        whatsapp: 'https://wa.me/966503456789',
        github: '#'
      }
    },
    {
      id: 4,
      name: 'Layla Sarah',
      position: 'Digital Marketing Specialist',
      department: 'Marketing',
      email: 'layla.sarah@company.com',
      phone: '+966504567890',
      location: 'Riyadh, Saudi Arabia',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      description: 'Digital marketing expert with 5 years of experience in analytics and campaigns',
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        whatsapp: 'https://wa.me/966504567890',
        github: '#'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Team</h1>
        <p className="text-gray-600">Meet our talented team members</p>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div 
            key={member.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            {/* Member Image */}
            <div className="relative overflow-hidden h-48 bg-gradient-to-b from-blue-100 to-blue-50">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Name and Position */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-semibold text-sm mb-1">{member.position}</p>
              <p className="text-gray-600 text-xs mb-3">{member.department}</p>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {member.description}
              </p>

              {/* Contact Information */}
              <div className="space-y-2 mb-4 border-t border-gray-100 pt-4">
                {/* Email */}
                <div className="flex items-start gap-2">
                  <Mail size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 break-words">{member.email}</p>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600">{member.phone}</p>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600">{member.location}</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 pt-3 border-t border-gray-100 flex-wrap">
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    className="flex-1 min-w-fit bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg py-2 px-2 flex items-center justify-center transition-colors duration-200"
                    title="LinkedIn"
                  >
                    <LinkedinIcon size={14} />
                  </a>
                )}
                {member.socialLinks.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    className="flex-1 min-w-fit bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg py-2 px-2 flex items-center justify-center transition-colors duration-200"
                    title="Twitter"
                  >
                    <TwitterIcon size={14} />
                  </a>
                )}
                {member.socialLinks.whatsapp && (
                  <a
                    href={member.socialLinks.whatsapp}
                    className="flex-1 min-w-fit bg-green-50 hover:bg-green-100 text-green-600 rounded-lg py-2 px-2 flex items-center justify-center transition-colors duration-200"
                    title="WhatsApp"
                  >
                    <MessageCircle size={14} />
                  </a>
                )}
                {member.socialLinks.github && (
                  <a
                    href={member.socialLinks.github}
                    className="flex-1 min-w-fit bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 px-2 flex items-center justify-center transition-colors duration-200"
                    title="GitHub"
                  >
                    <Github size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
