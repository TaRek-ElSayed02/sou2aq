'use client';
import React, { useState, useEffect } from 'react';
import { Send, Mail, MessageCircle, Phone, CheckCircle } from 'lucide-react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer.tsx/Footer';
import { useLanguage } from '../context/LanguageContext';

declare global {
  interface Window {
    emailjs: any;
  }
}

export default function Contact() {
  const { t, dir, isArabic } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailJSReady, setEmailJSReady] = useState(false);

  const emailjsConfig = {
    serviceId: 'service_md9gz29',
    templateId: 'template_73cva4f',
    userId: 'towjqO6XC_2L9adF1',
    toEmail: 'tarekmuswe24@gmail.com'
  };

  const contactInfo = {
    whatsappNumber: '01558166468',
    emailAddress: 'tarekmuswe24@gmail.com'
  };

  // Load EmailJS
  useEffect(() => {
    const loadEmailJS = () => {
      if (window.emailjs) {
        window.emailjs.init(emailjsConfig.userId);
        setEmailJSReady(true);
        console.log('✅ EmailJS already loaded and initialized');
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;

      script.onload = () => {
        console.log('✅ EmailJS SDK loaded from CDN');
        if (window.emailjs) {
          window.emailjs.init(emailjsConfig.userId)
            .then(() => {
              console.log('✅ EmailJS initialized successfully');
              setEmailJSReady(true);
            })
            .catch((error: any) => {
              console.error('❌ EmailJS init error:', error);
            });
        }
      };

      script.onerror = () => {
        console.error('❌ Failed to load EmailJS SDK');
      };

      document.head.appendChild(script);
    };

    loadEmailJS();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactMethodChange = (method: 'whatsapp' | 'email') => {
    setFormData(prev => ({ ...prev, contactMethod: method }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSubmitMessage(t('common.pleaseEnterName'));
      setSubmitStatus('error');
      return false;
    }

    if (!formData.email.trim()) {
      setSubmitMessage(t('common.pleaseEnterEmail'));
      setSubmitStatus('error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage(t('common.pleaseEnterEmail'));
      setSubmitStatus('error');
      return false;
    }

    if (!formData.phone.trim()) {
      setSubmitMessage(t('common.pleaseEnterPhone'));
      setSubmitStatus('error');
      return false;
    }

    if (!formData.subject.trim()) {
      setSubmitMessage(t('common.pleaseEnterSubject'));
      setSubmitStatus('error');
      return false;
    }

    if (!formData.message.trim()) {
      setSubmitMessage(t('common.pleaseEnterMessage'));
      setSubmitStatus('error');
      return false;
    }

    return true;
  };

  const cleanPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/[\s\(\)\-\+]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '20' + cleaned.substring(1);
    }
    if (cleaned.startsWith('1') && !cleaned.startsWith('201')) {
      cleaned = '20' + cleaned;
    }
    return cleaned;
  };

  const sendWhatsAppMessage = () => {
    try {
      const phoneNumber = cleanPhoneNumber(formData.phone);
      const message = `Hello,\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      return true;
    } catch (error) {
      return false;
    }
  };

  const sendEmailViaEmailJS = async () => {
    try {
      if (!window.emailjs) {
        throw new Error('EmailJS SDK not loaded');
      }

      const templateParams = {
        from_name: formData.name,
        name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        reply_to: formData.email,
        contact_subject: `New Contact Form: ${formData.subject}`
      };

      console.log('📤 Sending email with params:', templateParams);
      console.log('Service ID:', emailjsConfig.serviceId);
      console.log('Template ID:', emailjsConfig.templateId);
      console.log('User ID:', emailjsConfig.userId);

      const response = await window.emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.userId
      );

      console.log('✅ Email sent successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ EmailJS Error:', error);
      let errorMessage = 'Failed to send email. ';
      if (error.status === 0) {
        errorMessage += 'Network error. Check internet connection.';
      } else if (error.status === 400) {
        errorMessage += 'Bad request. Check template variables.';
      } else if (error.status === 404) {
        errorMessage += 'Template not found. Check Template ID.';
      } else {
        errorMessage += error.text || error.message || 'Unknown error.';
      }
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('📝 Form submitted');
    console.log('Contact method:', formData.contactMethod);
    console.log('EmailJS ready:', emailJSReady);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus('idle');

    try {
      if (formData.contactMethod === 'whatsapp') {
        console.log('📱 Sending via WhatsApp');
        const success = sendWhatsAppMessage();
        if (success) {
          setSubmitStatus('success');
          setSubmitMessage(t('common.whatsappOpened'));
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            contactMethod: 'email'
          });
          setTimeout(() => {
            setSubmitStatus('idle');
          }, 5000);
        } else {
          setSubmitStatus('error');
          setSubmitMessage(t('common.failedToOpenWhatsapp'));
        }
      } else {
        console.log('✉️ Sending via Email');
        if (!emailJSReady) {
          console.log('⚠️ EmailJS not ready yet');
          setSubmitStatus('error');
          setSubmitMessage(t('common.emailJSStillLoading'));
          setIsSubmitting(false);
          return;
        }

        const result = await sendEmailViaEmailJS();
        console.log('✅ Email sent result:', result);
        setSubmitStatus('success');
        setSubmitMessage(t('common.messageSentSuccess'));
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          contactMethod: 'email'
        });
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      }
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white ${isArabic ? 'text-right' : 'text-left'}`} dir={dir}>
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6">
              {t('common.getInTouch')}
            </h1>
            <p className="text-xl text-[#1E293B] mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('common.getInTouchDesc')}
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-100 rounded-2xl p-8 md:p-12 border border-gray-300">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('common.fullName')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('common.yourName')}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isArabic ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('common.emailAddress')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('common.yourEmail')}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isArabic ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                  </div>

                  {/* Phone and Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('common.phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t('common.phoneNumberPlaceholder')}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isArabic ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('common.subject')}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={t('common.messageSubject')}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isArabic ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      {t('common.message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t('common.writeYourMessage')}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none ${isArabic ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  {/* Contact Method Selection */}
                  <div className="border-t border-gray-300 pt-6">
                    <label className="block text-sm font-medium text-black mb-4">
                      {t('common.contactMethod')}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleContactMethodChange('email')}
                        className={`p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                          formData.contactMethod === 'email'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 bg-white hover:border-blue-300'
                        }`}
                      >
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div className={isArabic ? 'text-right' : 'text-left'}>
                          <p className="font-semibold text-black">{t('common.emailOption')}</p>
                          <p className="text-sm text-gray-600">{t('common.emailOptionDesc')}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContactMethodChange('whatsapp')}
                        className={`p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                          formData.contactMethod === 'whatsapp'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 bg-white hover:border-blue-300'
                        }`}
                      >
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <div className={isArabic ? 'text-right' : 'text-left'}>
                          <p className="font-semibold text-black">{t('common.whatsappOption')}</p>
                          <p className="text-sm text-gray-600">{t('common.whatsappOptionDesc')}</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-300 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-700">{submitMessage}</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700">{submitMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        {t('common.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t('common.sendMessage')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Email Card */}
                <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-black">{t('common.contactInfoEmail')}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{contactInfo.emailAddress}</p>
                  <p className="text-sm text-gray-600">{t('common.respondWithin')}</p>
                </div>

                {/* WhatsApp Card */}
                <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-black">{t('common.contactInfoPhone')}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">+20 155 816 6468</p>
                  <p className="text-sm text-gray-600">{t('common.chatWithUs')}</p>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-black">{t('common.quickReply')}</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {t('common.quickReplyDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
