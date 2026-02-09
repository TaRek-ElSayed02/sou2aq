'use client';
import React, { useState, useEffect } from 'react';
import {
  Send, Mail, Phone, User, MessageCircle,
  MessageSquare, Smartphone, AtSign, Clock,
  MapPin, CheckCircle, AlertCircle, X, Loader2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

declare global {
  interface Window {
    emailjs: any;
  }
}

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    contactMethod: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [emailJSReady, setEmailJSReady] = useState(false);

  // بياناتك الصحيحة
  const emailjsConfig = {
    serviceId: 'service_md9gz29',
    templateId: 'template_73cva4f',
    userId: 'towjqO6XC_2L9adF1',
    toEmail: 'tarekmuswe24@gmail.com'
  };

  // بيانات الاتصال
  const contactInfo = {
    whatsappNumber: '01558166468', // هذا الرقم سيتحول إلى 201558166468
    emailAddress: 'tarekmuswe24@gmail.com'
  };

  useEffect(() => {
    const loadEmailJS = () => {
      if (window.emailjs) {
        window.emailjs.init(emailjsConfig.userId);
        setEmailJSReady(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;

      script.onload = () => {
        console.log('✅ EmailJS SDK loaded');
        if (window.emailjs) {
          window.emailjs.init(emailjsConfig.userId)
            .then(() => {
              console.log('✅ EmailJS initialized');
              setEmailJSReady(true);
            })
            .catch((error: any) => {
              console.error('❌ EmailJS init error:', error);
            });
        }
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
      setSubmitMessage(t("dashboard.contact.pleaseEnterName"));
      return false;
    }

    if (!formData.phone.trim()) {
      setSubmitMessage(t("dashboard.contact.pleaseEnterPhone"));
      return false;
    }

    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setSubmitMessage(t("dashboard.contact.validPhone"));
      return false;
    }

    if (!formData.email.trim()) {
      setSubmitMessage(t("dashboard.contact.pleaseEnterEmail"));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage(t("dashboard.contact.validEmail"));
      return false;
    }

    if (!formData.message.trim()) {
      setSubmitMessage(t("dashboard.contact.pleaseEnterMessage"));
      return false;
    }

    return true;
  };

  // **دالة لتنظيف رقم الهاتف**
  const cleanPhoneNumber = (phone: string): string => {
    // إزالة جميع المسافات، الأقواس، الشرطات، والرمز +
    let cleaned = phone.replace(/[\s\(\)\-\+]/g, '');

    console.log('Original phone:', phone);
    console.log('Cleaned phone:', cleaned);

    // إذا بدأ بـ 0، استبدله بـ 20 (كود مصر)
    if (cleaned.startsWith('0')) {
      cleaned = '20' + cleaned.substring(1);
    }

    // إذا بدأ بـ 1 ولا يوجد 20 قبلها، أضف 20
    if (cleaned.startsWith('1') && !cleaned.startsWith('201')) {
      cleaned = '20' + cleaned;
    }

    // تأكد أن الرقم يحتوي على 12 رقماً (201558166468)
    if (cleaned.length === 11 && cleaned.startsWith('20')) {
      // الرقم صحيح
    } else if (cleaned.length === 10 && !cleaned.startsWith('20')) {
      // أضف 20 للبداية
      cleaned = '20' + cleaned;
    }

    console.log('Final cleaned phone:', cleaned);
    return cleaned;
  };

  // **إرسال الرسالة عبر WhatsApp (معدلة)**
  const sendWhatsAppMessage = () => {
    try {
      // تنظيف رقم الهاتف ليكون دولياً
      const phoneNumber = cleanPhoneNumber(contactInfo.whatsappNumber);

      // رسالة منسقة بشكل جيد
      const message = `
 **Contact Details:**
 **Name:** ${formData.name}
 **Phone:** ${formData.phone}
 **Email:** ${formData.email}

 **Message:**
${formData.message}

 **Date:** ${new Date().toLocaleDateString()}
 **Time:** ${new Date().toLocaleTimeString()}
`;

      // ترميز الرسالة بشكل صحيح
      const encodedMessage = encodeURIComponent(message);

      // رابط WhatsApp الصحيح
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      console.log('📱 WhatsApp URL:', whatsappUrl);
      console.log('📞 Phone number:', phoneNumber);
      console.log('📝 Message length:', message.length);

      // فتح WhatsApp في نافذة جديدة
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      if (!newWindow) {
        throw new Error('Please allow popups to open WhatsApp');
      }

      return {
        success: true,
        message: 'WhatsApp opened with your message! Please click send to complete.'
      };
    } catch (error: any) {
      console.error('❌ WhatsApp error:', error);
      throw new Error('Failed to open WhatsApp: ' + error.message);
    }
  };

  // **إرسال الرسالة عبر EmailJS**
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
        subject: `New Contact Form: ${formData.name}`
      };

      console.log('📤 Sending email with params:', templateParams);

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

  // **إرسال مباشر عبر WhatsApp (زر Open WhatsApp)**
  const sendDirectWhatsApp = () => {
    try {
      const phoneNumber = cleanPhoneNumber(contactInfo.whatsappNumber);
      const defaultMessage = "Hello! I would like to contact you.";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

      console.log('Direct WhatsApp URL:', whatsappUrl);

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
      alert('Please allow popups to open WhatsApp');
    }
  };

  // **إرسال مباشر عبر الإيميل**
  const sendDirectEmail = () => {
    const mailtoUrl = `mailto:${contactInfo.emailAddress}?subject=Contact%20Form&body=Hello,%20I%20would%20like%20to%20contact%20you.`;
    window.location.href = mailtoUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      let result;

      if (formData.contactMethod === 'whatsapp') {
        result = await sendWhatsAppMessage();
        setSubmitMessage(t("dashboard.contact.whatsappOpened"));
      } else {
        if (!emailJSReady) {
          throw new Error(t("dashboard.contact.emailStillLoading"));
        }

        result = await sendEmailViaEmailJS();
        setSubmitMessage(t("dashboard.contact.emailSent"));
      }

      setSubmitStatus('success');

      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          contactMethod: formData.contactMethod
        });
      }, 3000);

    } catch (error: any) {
      console.error('❌ Error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || t("dashboard.contact.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // **اختبار رابط WhatsApp مباشرة**
  const testWhatsAppLink = () => {
    const phoneNumber = cleanPhoneNumber(contactInfo.whatsappNumber);
    const testMessage = "Test message from contact form";
    const testUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(testMessage)}`;

    console.log('Test WhatsApp Link:', testUrl);

    // فتح الرابط في نافذة جديدة
    window.open(testUrl, '_blank', 'noopener,noreferrer');

    // عرض الرابط للمستخدم أيضاً
    setSubmitMessage(`Test link: ${testUrl}`);
    setSubmitStatus('success');
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("dashboard.contact.title")}
          </h1>
          <p className="text-gray-600">
            {t("dashboard.contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* نموذج الاتصال */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("dashboard.contact.sendMessage")}</h2>

                {/* طريقة الاتصال */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("dashboard.contact.chooseMethod")}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => handleContactMethodChange('whatsapp')}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${formData.contactMethod === 'whatsapp'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <MessageCircle className="w-6 h-6" />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{t("dashboard.contact.whatsapp")}</h3>
                        <p className="text-sm text-gray-600">{t("dashboard.contact.opensWithMessage")}</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleContactMethodChange('email')}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${formData.contactMethod === 'email'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Mail className="w-6 h-6" />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{t("dashboard.contact.directEmail")}</h3>
                        <p className="text-sm text-gray-600">{t("dashboard.contact.noEmailAppNeeded")}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* زر اختبار WhatsApp (للتجربة) */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={testWhatsAppLink}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t("dashboard.contact.testWhatsappLink")}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {t("dashboard.contact.clickToTest")}
                  </p>
                </div>

                {/* حالة EmailJS */}
                <div className={`mb-6 p-4 rounded-xl ${emailJSReady
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="flex items-center gap-3">
                    {emailJSReady ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {emailJSReady ? '✅ ' + t("dashboard.contact.emailJSReady") : '⏳ ' + t("dashboard.contact.loading")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {emailJSReady
                          ? t("dashboard.contact.directEmailSending")
                          : t("dashboard.contact.initializingEmail")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* معلومات الاتصال */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline w-4 h-4 mr-2" />
                      {t("dashboard.contact.fullNameRequired")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder={t("dashboard.contact.johnDoe")}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Smartphone className="inline w-4 h-4 mr-2" />
                      {t("dashboard.contact.phoneNumberRequired")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder={t("dashboard.contact.enterPhoneNumber")}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AtSign className="inline w-4 h-4 mr-2" />
                    {t("dashboard.contact.emailAddressRequired")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder={t("dashboard.contact.yourEmail")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="inline w-4 h-4 mr-2" />
                    {t("dashboard.contact.yourMessageRequired")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder={t("dashboard.contact.typeMessageHere")}
                    required
                  />
                </div>

                {/* رسائل الحالة */}
                {submitStatus !== 'idle' && (
                  <div className={`p-4 rounded-xl ${submitStatus === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      {submitStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                          {submitStatus === 'success' ? t("dashboard.contact.successLabel") : t("dashboard.contact.errorLabel")}
                        </p>
                        <p className={`text-sm ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                          {submitMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* زر الإرسال */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || (formData.contactMethod === 'email' && !emailJSReady)}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${formData.contactMethod === 'whatsapp'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t("dashboard.contact.sending")}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>
                          {formData.contactMethod === 'whatsapp'
                            ? t("dashboard.contact.sendViaWhatsapp")
                            : t("dashboard.contact.sendDirectEmail")}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t("dashboard.contact.contactInfo")}</h3>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t("dashboard.contact.whatsapp")}</h4>
                      <p className="text-sm text-gray-600">{t("dashboard.contact.directMessaging")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-mono">{contactInfo.whatsappNumber}</p>
                    <p className="text-xs text-gray-500">
                        {t("dashboard.contact.international")}{' '}{cleanPhoneNumber(contactInfo.whatsappNumber)}
                    </p>
                    <button
                      onClick={sendDirectWhatsApp}
                      className="w-full mt-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("dashboard.contact.openWhatsapp")}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t("dashboard.contact.directEmail")}</h4>
                      <p className="text-sm text-gray-600">{t("dashboard.contact.directSending")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700 text-sm break-all">{contactInfo.emailAddress}</p>
                    <button
                      onClick={sendDirectEmail}
                      className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      {t("dashboard.contact.openEmail")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">{t("dashboard.contact.tipsForWhatsapp")}</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>{t("dashboard.contact.whatsappInstalled")}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>{t("dashboard.contact.allowPopups")}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>{t("dashboard.contact.clickSend")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}