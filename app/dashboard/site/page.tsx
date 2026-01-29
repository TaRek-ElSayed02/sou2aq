'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    Save, Upload, ImageIcon, Globe,
    Phone, Mail, MapPin, Clock, 
    Share2, Plus, Trash2, X,
    ChevronRight, ChevronLeft, CheckCircle, ChevronDown,
    Facebook, Twitter, Instagram, Linkedin, Youtube,
    Github, Slack, Music, Twitch, Smile, Heart, Star,
    Zap, Rocket, Award, Code, Palette, Briefcase,
    Camera, Book, Headphones, Radio, GitBranch,
    Search, Settings, Bell, Shield, Lock,File
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';

// تعريف أنواع البيانات
interface SocialMedia {
    id: number;
    name: string;
    icon: string;
    link: string;
    isCustom: boolean;
}

interface MapLocation {
    id: number;
    title: string;
    mapUrl: string;
    address: string;
}

interface WhyUsPoint {
    id: number;
    text: string;
}

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

interface SiteFormData {
    // Basic Info
    subdomain: string;
    name: string;
    description: string;
    mobile: string;
    about: string;
    
    // Media
    image: File | null;
    imageUrl: string;
    imageAlt: string;
    
    // Contact Info
    email: string;
    address: string;
    phone: string;
    addressEmail: string;
    periodOpen: string;
    maps: MapLocation[];
    
    // Policies
    privacyPolicy: string;
    termsOfUse: string;
    returnPolicy: string;
    
    // Dynamic Lists
    whyUs: WhyUsPoint[];
    faqs: FAQ[];
    socialMedia: SocialMedia[];
    
    // Settings
    activeTab: string;
    customSocialName: string;
    customSocialIcon: string;
}

const availableSocialMedia = [
    { id: 1, name: 'Facebook', icon: 'facebook' },
    { id: 2, name: 'Twitter', icon: 'twitter' },
    { id: 3, name: 'Instagram', icon: 'instagram' },
    { id: 4, name: 'LinkedIn', icon: 'linkedin' },
    { id: 5, name: 'YouTube', icon: 'youtube' },
    { id: 6, name: 'Pinterest', icon: 'pinterest' },
    { id: 7, name: 'TikTok', icon: 'tiktok' },
    { id: 8, name: 'Snapchat', icon: 'snapchat' },
    { id: 9, name: 'GitHub', icon: 'github' },
    { id: 10, name: 'Slack', icon: 'slack' },
    { id: 11, name: 'Spotify', icon: 'music' },
    { id: 12, name: 'Twitch', icon: 'twitch' },
    { id: 13, name: 'Reddit', icon: 'reddit' },
    { id: 14, name: 'WhatsApp', icon: 'whatsapp' },
    { id: 15, name: 'Telegram', icon: 'telegram' },
];

// قائمة الأيقونات المتاحة للـ Custom Platform
const availableIconsForCustom = [
    { name: 'Smile', value: 'smile', icon: 'smile' },
    { name: 'Heart', value: 'heart', icon: 'heart' },
    { name: 'Star', value: 'star', icon: 'star' },
    { name: 'Zap', value: 'zap', icon: 'zap' },
    { name: 'Rocket', value: 'rocket', icon: 'rocket' },
    { name: 'Award', value: 'award', icon: 'award' },
    { name: 'Code', value: 'code', icon: 'code' },
    { name: 'Palette', value: 'palette', icon: 'palette' },
    { name: 'Briefcase', value: 'briefcase', icon: 'briefcase' },
    { name: 'Camera', value: 'camera', icon: 'camera' },
    { name: 'Book', value: 'book', icon: 'book' },
    { name: 'Headphones', value: 'headphones', icon: 'headphones' },
    { name: 'Radio', value: 'radio', icon: 'radio' },
    { name: 'Git Branch', value: 'gitbranch', icon: 'gitbranch' },
    { name: 'Search', value: 'search', icon: 'search' },
    { name: 'Settings', value: 'settings', icon: 'settings' },
    { name: 'Bell', value: 'bell', icon: 'bell' },
    { name: 'Shield', value: 'shield', icon: 'shield' },
    { name: 'Lock', value: 'lock', icon: 'lock' },
    { name: 'Globe', value: 'globe', icon: 'globe' },
];

const SiteCreationPage = () => {
    const { currentUser } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // الحالة الأولية للفورم
    const [formData, setFormData] = useState<SiteFormData>({
        subdomain: '',
        name: '',
        description: '',
        mobile: '',
        about: '',
        image: null,
        imageUrl: '',
        imageAlt: '',
        email: '',
        address: '',
        phone: '',
        addressEmail: '',
        periodOpen: '9:00 AM - 6:00 PM',
        maps: [
            { id: 1, title: 'Main Office', mapUrl: '', address: '' }
        ],
        privacyPolicy: '',
        termsOfUse: '',
        returnPolicy: '',
        whyUs: [
            { id: 1, text: 'Professional team with 10+ years experience' },
            { id: 2, text: '24/7 customer support available' },
            { id: 3, text: 'Competitive pricing with quality guarantee' }
        ],
        faqs: [
            { id: 1, question: 'What are your working hours?', answer: 'We are open from 9:00 AM to 6:00 PM, Monday to Friday.' },
            { id: 2, question: 'Do you offer refunds?', answer: 'Yes, we offer 30-day money back guarantee on all our services.' }
        ],
        socialMedia: [
            { id: 1, name: 'Facebook', icon: 'facebook', link: '', isCustom: false },
            { id: 2, name: 'Instagram', icon: 'instagram', link: '', isCustom: false }
        ],
        activeTab: 'basic',
        customSocialName: '',
        customSocialIcon: ''
    });

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [availableSocialMediaList, setAvailableSocialMediaList] = useState(availableSocialMedia);
    const [showIconPickerDropdown, setShowIconPickerDropdown] = useState(false);
    const [showSocialMediaDropdown, setShowSocialMediaDropdown] = useState(false);

    // تعريف التابات
    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: Globe },
        { id: 'about', label: 'About & Media', icon: ImageIcon },
        { id: 'contact', label: 'Contact Info', icon: Phone },
        { id: 'content', label: 'Content', icon: File },
        { id: 'policies', label: 'Policies', icon: CheckCircle },
        { id: 'social', label: 'Social Media', icon: Share2 }
    ];

    // توليد slug من الاسم
    const generateSubdomain = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, 30);
    };

    // تحديث subdomain عند تغيير الاسم
    useEffect(() => {
        if (formData.name && !formData.subdomain) {
            const generatedSubdomain = generateSubdomain(formData.name);
            setFormData(prev => ({
                ...prev,
                subdomain: generatedSubdomain
            }));
        }
    }, [formData.name]);

    // معالجة رفع الصورة
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file (JPEG, PNG, GIF, etc.)', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB', 'error');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            image: file,
            imageUrl
        }));
        setPreviewImage(imageUrl);
    };

    // === Why Us Functions ===
    const addWhyUsPoint = () => {
        const newId = Math.max(...formData.whyUs.map(item => item.id), 0) + 1;
        setFormData(prev => ({
            ...prev,
            whyUs: [...prev.whyUs, { id: newId, text: '' }]
        }));
    };

    const updateWhyUsPoint = (id: number, text: string) => {
        setFormData(prev => ({
            ...prev,
            whyUs: prev.whyUs.map(point =>
                point.id === id ? { ...point, text } : point
            )
        }));
    };

    const removeWhyUsPoint = (id: number) => {
        setFormData(prev => ({
            ...prev,
            whyUs: prev.whyUs.filter(point => point.id !== id)
        }));
    };

    // === FAQ Functions ===
    const addFAQ = () => {
        const newId = Math.max(...formData.faqs.map(item => item.id), 0) + 1;
        setFormData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { id: newId, question: '', answer: '' }]
        }));
    };

    const updateFAQ = (id: number, field: 'question' | 'answer', value: string) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.map(faq =>
                faq.id === id ? { ...faq, [field]: value } : faq
            )
        }));
    };

    const removeFAQ = (id: number) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.filter(faq => faq.id !== id)
        }));
    };

    // === Social Media Functions ===
    const addSocialMedia = () => {
        const newId = Math.max(...formData.socialMedia.map(item => item.id), 0) + 1;
        
        // إضافة السوشيال ميديا الفاضية الأولى من القائمة المتاحة
        const availableSocial = availableSocialMediaList.find(
            social => !formData.socialMedia.some(sm => sm.name === social.name)
        );

        if (availableSocial) {
            setFormData(prev => ({
                ...prev,
                socialMedia: [
                    ...prev.socialMedia,
                    {
                        id: newId,
                        name: availableSocial.name,
                        icon: availableSocial.icon,
                        link: '',
                        isCustom: false
                    }
                ]
            }));
        }
    };

    const updateSocialMedia = (id: number, field: 'name' | 'icon' | 'link', value: string) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: prev.socialMedia.map(sm =>
                sm.id === id ? { ...sm, [field]: value } : sm
            )
        }));
    };

    const removeSocialMedia = (id: number) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: prev.socialMedia.filter(sm => sm.id !== id)
        }));
    };

    const addCustomSocialMedia = () => {
        if (!formData.customSocialName.trim() || !formData.customSocialIcon.trim()) {
            showToast('Please enter both name and icon for custom social media', 'error');
            return;
        }

        const newId = Math.max(...formData.socialMedia.map(item => item.id), 0) + 1;
        
        setFormData(prev => ({
            ...prev,
            socialMedia: [
                ...prev.socialMedia,
                {
                    id: newId,
                    name: formData.customSocialName,
                    icon: formData.customSocialIcon,
                    link: '',
                    isCustom: true
                }
            ],
            customSocialName: '',
            customSocialIcon: ''
        }));
    };

    // === Map Functions ===
    const addMapLocation = () => {
        const newId = Math.max(...formData.maps.map(item => item.id), 0) + 1;
        setFormData(prev => ({
            ...prev,
            maps: [
                ...prev.maps,
                { 
                    id: newId, 
                    title: `Location ${newId}`, 
                    mapUrl: '', 
                    address: '' 
                }
            ]
        }));
    };

    const updateMapLocation = (id: number, field: 'title' | 'mapUrl' | 'address', value: string) => {
        setFormData(prev => ({
            ...prev,
            maps: prev.maps.map(map =>
                map.id === id ? { ...map, [field]: value } : map
            )
        }));
    };

    const removeMapLocation = (id: number) => {
        if (formData.maps.length <= 1) {
            showToast('You must have at least one map location', 'error');
            return;
        }
        setFormData(prev => ({
            ...prev,
            maps: prev.maps.filter(map => map.id !== id)
        }));
    };

    // التحقق من صحة البيانات
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Basic Info validation
        if (!formData.subdomain.trim()) {
            errors.subdomain = 'Subdomain is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
            errors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
        }

        if (!formData.name.trim()) {
            errors.name = 'Site name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        }

        // Check if at least one social media link is provided
        const hasSocialLinks = formData.socialMedia.some(sm => sm.link.trim() !== '');
        if (!hasSocialLinks) {
            errors.socialMedia = 'Add at least one social media link';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // إرسال الفورم
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Prepare form data
            const formDataToSend = new FormData();
            
            // Add all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'image' && value instanceof File) {
                    formDataToSend.append('image', value);
                } else if (key === 'whyUs') {
                    const whyUsPoints = (value as WhyUsPoint[]).map(point => point.text).join('||');
                    formDataToSend.append('whyUs', whyUsPoints);
                } else if (key === 'faqs') {
                    const faqsString = (value as FAQ[]).map(faq => `${faq.question}::${faq.answer}`).join('||');
                    formDataToSend.append('faqs', faqsString);
                } else if (key === 'socialMedia') {
                    const socialMediaString = (value as SocialMedia[])
                        .map(sm => `${sm.name}:${sm.icon}:${sm.link}:${sm.isCustom}`)
                        .join('||');
                    formDataToSend.append('socialMedia', socialMediaString);
                } else if (key === 'maps') {
                    const mapsString = (value as MapLocation[])
                        .map(map => `${map.title}::${map.mapUrl}::${map.address}`)
                        .join('||');
                    formDataToSend.append('maps', mapsString);
                } else if (typeof value === 'string') {
                    formDataToSend.append(key, value);
                }
            });

            // Add user ID
            if (currentUser?.id) {
                formDataToSend.append('userId', currentUser.id.toString());
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccessMessage('Your site has been created successfully!');
            showToast('Site created successfully!', 'success');
            
            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    subdomain: '',
                    name: '',
                    description: '',
                    mobile: '',
                    about: '',
                    image: null,
                    imageUrl: '',
                    imageAlt: '',
                    email: '',
                    address: '',
                    phone: '',
                    addressEmail: '',
                    periodOpen: '9:00 AM - 6:00 PM',
                    maps: [{ id: 1, title: 'Main Office', mapUrl: '', address: '' }],
                    privacyPolicy: '',
                    termsOfUse: '',
                    returnPolicy: '',
                    whyUs: [{ id: 1, text: '' }],
                    faqs: [{ id: 1, question: '', answer: '' }],
                    socialMedia: [
                        { id: 1, name: 'Facebook', icon: 'facebook', link: '', isCustom: false },
                        { id: 2, name: 'Instagram', icon: 'instagram', link: '', isCustom: false }
                    ],
                    activeTab: 'basic',
                    customSocialName: '',
                    customSocialIcon: ''
                });
                setPreviewImage('');
                setSuccessMessage('');
            }, 2000);

        } catch (error) {
            console.error('Error creating site:', error);
            showToast('Failed to create site. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // عرض Toast
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        // Implement toast notification here
        console.log(`${type}: ${message}`);
    };

    // الحصول على الأيقونة المناسبة
    const getSocialIcon = (iconName: string, size: string = 'w-5 h-5') => {
        switch (iconName.toLowerCase()) {
            case 'facebook': return <Facebook className={size} />;
            case 'twitter': return <Twitter className={size} />;
            case 'instagram': return <Instagram className={size} />;
            case 'linkedin': return <Linkedin className={size} />;
            case 'youtube': return <Youtube className={size} />;
            case 'github': return <Github className={size} />;
            case 'slack': return <Slack className={size} />;
            case 'music': case 'spotify': return <Music className={size} />;
            case 'twitch': return <Twitch className={size} />;
            case 'smile': return <Smile className={size} />;
            case 'heart': return <Heart className={size} />;
            case 'star': return <Star className={size} />;
            case 'zap': return <Zap className={size} />;
            case 'rocket': return <Rocket className={size} />;
            case 'award': return <Award className={size} />;
            case 'code': return <Code className={size} />;
            case 'palette': return <Palette className={size} />;
            case 'briefcase': return <Briefcase className={size} />;
            case 'camera': return <Camera className={size} />;
            case 'book': return <Book className={size} />;
            case 'headphones': return <Headphones className={size} />;
            case 'radio': return <Radio className={size} />;
            case 'gitbranch': return <GitBranch className={size} />;
            case 'search': return <Search className={size} />;
            case 'settings': return <Settings className={size} />;
            case 'bell': return <Bell className={size} />;
            case 'shield': return <Shield className={size} />;
            case 'lock': return <Lock className={size} />;
            case 'globe': return <Globe className={size} />;
            // For unsupported icons, use a default share icon
            case 'pinterest': 
            case 'tiktok': 
            case 'snapchat': 
            case 'reddit': 
            case 'whatsapp': 
            case 'telegram': 
                return <Share2 className={size} />;
            default: return <Share2 className={size} />;
        }
    };

    // الحصول على السوشيال ميديا المتاحة (اللي مش موجودة بالفعل)
    const getAvailableSocialMediaOptions = () => {
        const usedSocialMedia = formData.socialMedia.map(sm => sm.name);
        return availableSocialMediaList.filter(social => !usedSocialMedia.includes(social.name));
    };

    // الرندر حسب التاب الحالي
    const renderActiveTab = () => {
        switch (formData.activeTab) {
            case 'basic':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Site Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}
                                    className={`w-full px-4 py-3.5 border-2 ${validationErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                    placeholder="Enter your site name"
                                />
                                {validationErrors.name && (
                                    <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Subdomain *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                        https://
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.subdomain}
                                        onChange={(e) => {
                                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                            setFormData(prev => ({
                                                ...prev,
                                                subdomain: value
                                            }));
                                        }}
                                        className={`w-full pl-16 pr-4 py-3.5 border-2 ${validationErrors.subdomain ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                        placeholder="your-site-name"
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                        .example.com
                                    </div>
                                </div>
                                {validationErrors.subdomain && (
                                    <p className="mt-2 text-sm text-red-600">{validationErrors.subdomain}</p>
                                )}
                                <p className="mt-2 text-sm text-gray-500">
                                    This will be your site's web address
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))}
                                    className={`w-full px-4 py-3.5 border-2 ${validationErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                    placeholder="contact@example.com"
                                />
                                {validationErrors.email && (
                                    <p className="mt-2 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        mobile: e.target.value
                                    }))}
                                    className={`w-full px-4 py-3.5 border-2 ${validationErrors.mobile ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {validationErrors.mobile && (
                                    <p className="mt-2 text-sm text-red-600">{validationErrors.mobile}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Short Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                rows={3}
                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                placeholder="Brief description of your site (appears in search results)"
                                maxLength={160}
                            />
                            <div className="flex justify-between mt-2">
                                <p className="text-sm text-gray-500">
                                    Keep it short and descriptive
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formData.description.length}/160 characters
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'about':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        About Your Business
                                    </label>
                                    <textarea
                                        value={formData.about}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            about: e.target.value
                                        }))}
                                        rows={8}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        placeholder="Tell your story... What makes your business unique?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Image Alt Text
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.imageAlt}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            imageAlt: e.target.value
                                        }))}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Description of your logo/image for accessibility"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Important for SEO and accessibility
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Site Logo/Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                                         onClick={() => fileInputRef.current?.click()}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        {previewImage ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <p className="text-gray-700 font-medium">Logo uploaded!</p>
                                                <p className="text-sm text-gray-500 mt-1">Click to upload a different image</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <Upload className="w-10 h-10 text-gray-400" />
                                                </div>
                                                <p className="text-gray-700 font-medium">Click to upload logo</p>
                                                <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                                <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
                                                    <ImageIcon className="w-4 h-4" />
                                                    Browse files
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-blue-600" />
                                        Image Guidelines
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                            <span>Use high-quality images (min 300x300 pixels)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                            <span>Square or circular images work best for logos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                            <span>Keep file size under 5MB</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                            <span>Transparent PNG recommended for logos</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <span className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        phone: e.target.value
                                    }))}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <span className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Contact Email
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.addressEmail}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        addressEmail: e.target.value
                                    }))}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="info@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Opening Hours
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.periodOpen}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        periodOpen: e.target.value
                                    }))}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="9:00 AM - 6:00 PM, Monday to Friday"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Main Address
                                    </span>
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        address: e.target.value
                                    }))}
                                    rows={3}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    placeholder="123 Business St, City, State, ZIP Code"
                                />
                            </div>
                        </div>

                        {/* Multiple Maps Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Store Locations</h3>
                                    <p className="text-gray-600">Add multiple locations with Google Maps</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addMapLocation}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Location
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.maps.map((map, index) => (
                                    <div key={map.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{map.title}</h4>
                                                    <p className="text-sm text-gray-500">Location {index + 1}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeMapLocation(map.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    disabled={formData.maps.length <= 1}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Location Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={map.title}
                                                    onChange={(e) => updateMapLocation(map.id, 'title', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="e.g., Main Office, Branch Store, Warehouse"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    value={map.address}
                                                    onChange={(e) => updateMapLocation(map.id, 'address', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="Street, City, State, ZIP Code"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Google Maps Embed URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={map.mapUrl}
                                                    onChange={(e) => updateMapLocation(map.id, 'mapUrl', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="https://maps.google.com/embed?pb=..."
                                                />
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Get the embed URL from Google Maps → Share → Embed a map
                                                </p>
                                            </div>
                                        </div>

                                        {map.mapUrl && (
                                            <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                                <div className="rounded-lg overflow-hidden border-2 border-gray-200 h-48">
                                                    <iframe
                                                        src={map.mapUrl}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title={`Map - ${map.title}`}
                                                    ></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'content':
                return (
                    <div className="space-y-8">
                        {/* Why Us Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Why Choose Us</h3>
                                    <p className="text-gray-600">List key points that make your business stand out</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addWhyUsPoint}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Point
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.whyUs.map((point, index) => (
                                    <div key={point.id} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold mt-1">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={point.text}
                                                onChange={(e) => updateWhyUsPoint(point.id, e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Enter a compelling reason to choose your business..."
                                            />
                                        </div>
                                        {formData.whyUs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeWhyUsPoint(point.id)}
                                                className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQs Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
                                    <p className="text-gray-600">Add common questions and answers</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addFAQ}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add FAQ
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.faqs.map((faq) => (
                                    <div key={faq.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Question
                                                </label>
                                                <input
                                                    type="text"
                                                    value={faq.question}
                                                    onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="What is your return policy?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Answer
                                                </label>
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                                    placeholder="We offer a 30-day return policy on all products..."
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeFAQ(faq.id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove FAQ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'policies':
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Legal & Policy Information</h3>
                            <p className="text-gray-600 mb-6">These sections will be displayed on your site's policy pages</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Privacy Policy
                                </label>
                                <textarea
                                    value={formData.privacyPolicy}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        privacyPolicy: e.target.value
                                    }))}
                                    rows={8}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Describe how you collect, use, and protect user data..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Terms of Use
                                </label>
                                <textarea
                                    value={formData.termsOfUse}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        termsOfUse: e.target.value
                                    }))}
                                    rows={8}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Outline the rules and guidelines for using your site..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Return Policy
                                </label>
                                <textarea
                                    value={formData.returnPolicy}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        returnPolicy: e.target.value
                                    }))}
                                    rows={8}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Describe your return, refund, and exchange policies..."
                                />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Legal Recommendations
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                                    <span>Be clear and specific about user rights and responsibilities</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                                    <span>Include contact information for policy inquiries</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                                    <span>Consider consulting with a legal professional for complex policies</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                                    <span>Update policies regularly to reflect changes in your business</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            case 'social':
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Social Media Profiles</h3>
                            <p className="text-gray-600">Connect your social media accounts to your site</p>
                        </div>

                        {validationErrors.socialMedia && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-600 text-sm font-medium">{validationErrors.socialMedia}</p>
                            </div>
                        )}

                        {/* Social Media List */}
                        <div className="space-y-4">
                            {formData.socialMedia.map((social) => (
                                <div key={social.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                {getSocialIcon(social.icon)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{social.name}</h4>
                                                {social.isCustom && (
                                                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                                                        Custom
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => removeSocialMedia(social.id)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Platform
                                            </label>
                                            <select
                                                value={social.name}
                                                onChange={(e) => updateSocialMedia(social.id, 'name', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                disabled={social.isCustom}
                                            >
                                                {availableSocialMediaList.map(sm => (
                                                    <option key={sm.id} value={sm.name}>
                                                        {sm.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Icon
                                            </label>
                                            <input
                                                type="text"
                                                value={social.icon}
                                                onChange={(e) => updateSocialMedia(social.id, 'icon', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="facebook"
                                                disabled={!social.isCustom}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Profile URL *
                                            </label>
                                            <input
                                                type="url"
                                                value={social.link}
                                                onChange={(e) => updateSocialMedia(social.id, 'link', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder={`https://${social.name.toLowerCase()}.com/your-profile`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Social Media Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Add from available list - Custom Dropdown */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                    Add Social Media
                                </h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowSocialMediaDropdown(!showSocialMediaDropdown)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-all"
                                        >
                                            <span className="text-gray-700 font-medium">Select a Platform</span>
                                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showSocialMediaDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {showSocialMediaDropdown && (
                                            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-blue-300 rounded-lg shadow-xl overflow-hidden">
                                                <div className="max-h-80 overflow-y-auto">
                                                    {getAvailableSocialMediaOptions().length > 0 ? (
                                                        getAvailableSocialMediaOptions().map(social => (
                                                            <button
                                                                key={social.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    const newId = Math.max(...formData.socialMedia.map(item => item.id), 0) + 1;
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        socialMedia: [
                                                                            ...prev.socialMedia,
                                                                            {
                                                                                id: newId,
                                                                                name: social.name,
                                                                                icon: social.icon,
                                                                                link: '',
                                                                                isCustom: false
                                                                            }
                                                                        ]
                                                                    }));
                                                                    setShowSocialMediaDropdown(false);
                                                                    showToast(`${social.name} added to social media`, 'success');
                                                                }}
                                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-100 transition-colors border-b border-gray-100 last:border-b-0"
                                                            >
                                                                <div className="w-6 h-6 flex-shrink-0 text-blue-600">
                                                                    {getSocialIcon(social.icon, 'w-6 h-6')}
                                                                </div>
                                                                <span className="font-medium text-gray-800 flex-grow text-left">{social.name}</span>
                                                                <Plus className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-6 text-center text-gray-500">
                                                            All platforms added!
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Add Custom Social Media */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-purple-600" />
                                    Add Custom Platform
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Platform Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customSocialName}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                customSocialName: e.target.value
                                            }))}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="e.g., Discord, Behance, Dribbble"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Icon
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowIconPickerDropdown(!showIconPickerDropdown)}
                                                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-all"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {formData.customSocialIcon ? (
                                                        <>
                                                            <div className="w-5 h-5 text-purple-600">
                                                                {getSocialIcon(formData.customSocialIcon, 'w-5 h-5')}
                                                            </div>
                                                            <span className="text-gray-700 font-medium capitalize">{formData.customSocialIcon}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-500">Choose an icon</span>
                                                    )}
                                                </div>
                                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showIconPickerDropdown ? 'rotate-180' : ''}`} />
                                            </button>

                                            {/* Icon Picker Dropdown */}
                                            {showIconPickerDropdown && (
                                                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-purple-300 rounded-lg shadow-xl overflow-hidden">
                                                    <div className="p-3 grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                                                        {availableIconsForCustom.map(icon => (
                                                            <button
                                                                key={icon.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        customSocialIcon: icon.value
                                                                    }));
                                                                    setShowIconPickerDropdown(false);
                                                                }}
                                                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                                                    formData.customSocialIcon === icon.value
                                                                        ? 'border-purple-500 bg-purple-100'
                                                                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                                                }`}
                                                                title={icon.name}
                                                            >
                                                                <div className="w-6 h-6 text-gray-700 mb-1">
                                                                    {getSocialIcon(icon.value, 'w-6 h-6')}
                                                                </div>
                                                                <span className="text-xs text-gray-600 text-center truncate">{icon.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Choose from 20+ available icons
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addCustomSocialMedia}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!formData.customSocialName || !formData.customSocialIcon}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Custom Platform
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-gray-600" />
                                Social Media Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-1.5"></div>
                                    <span>Use full profile URLs (including https://)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-1.5"></div>
                                    <span>Links will open in a new tab when clicked</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-1.5"></div>
                                    <span>Add only the platforms where you're active</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-1.5"></div>
                                    <span>Update links when you change your profile URLs</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            {/* Main Container */}
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Create Your Website
                            </h1>
                            <p className="text-gray-600">
                                Build your professional online presence in a few simple steps
                            </p>
                            <div className="mt-3 flex items-center gap-3 text-sm">
                                <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                    User: {currentUser?.fullName || 'Guest'}
                                </div>
                                <div className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-medium">
                                    {formData.subdomain ? (
                                        <span className="flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            https://{formData.subdomain}.example.com
                                        </span>
                                    ) : (
                                        'Choose a subdomain'
                                    )}
                                </div>
                            </div>
                        </div>

                        {successMessage && (
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5" />
                                    <div>
                                        <p className="font-bold">Success!</p>
                                        <p className="text-sm opacity-90">{successMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setFormData(prev => ({ ...prev, activeTab: tab.id }))}
                                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-xl font-semibold transition-all ${formData.activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {/* Progress Bar */}
                    <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8">
                        <div className="flex items-center justify-between mb-2 gap-1 sm:gap-2">
                            {tabs.map((tab, index) => (
                                <React.Fragment key={tab.id}>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${formData.activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : index < tabs.findIndex(t => t.id === formData.activeTab)
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className={`hidden md:inline text-xs sm:text-sm font-medium ${formData.activeTab === tab.id ? 'text-blue-700' : 'text-gray-500'}`}>
                                            {tab.label}
                                        </span>
                                    </div>
                                    {index < tabs.length - 1 && (
                                        <div className={`flex-1 h-1 mx-1 sm:mx-2 md:mx-4 ${index < tabs.findIndex(t => t.id === formData.activeTab) ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-8">
                            {renderActiveTab()}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-12 mt-12 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentIndex = tabs.findIndex(t => t.id === formData.activeTab);
                                        if (currentIndex > 0) {
                                            setFormData(prev => ({
                                                ...prev,
                                                activeTab: tabs[currentIndex - 1].id
                                            }));
                                        }
                                    }}
                                    disabled={formData.activeTab === 'basic'}
                                    className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-xl font-semibold transition-all ${formData.activeTab === 'basic'
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-300'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                <div className="flex items-center gap-4">
                                    {formData.activeTab !== 'social' ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentIndex = tabs.findIndex(t => t.id === formData.activeTab);
                                                if (currentIndex < tabs.length - 1) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        activeTab: tabs[currentIndex + 1].id
                                                    }));
                                                }
                                            }}
                                            className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3.5 text-sm sm:text-base bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            <span className="hidden sm:inline">Next</span>
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3.5 text-sm sm:text-base bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="hidden sm:inline">Creating Site...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    Create My Site
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Quick Preview */}
                <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Quick Preview</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span>Live Preview</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Site Name</div>
                            <div className="font-bold">{formData.name || 'Your Site Name'}</div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">URL</div>
                            <div className="font-bold text-blue-300">
                                https://{formData.subdomain || 'your-site'}.example.com
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Contact</div>
                            <div className="font-bold">{formData.email || 'email@example.com'}</div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Features</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-blue-600 rounded text-xs">{formData.maps.length} Maps</span>
                                <span className="px-2 py-1 bg-green-600 rounded text-xs">{formData.socialMedia.length} Social</span>
                                <span className="px-2 py-1 bg-purple-600 rounded text-xs">{formData.faqs.length} FAQs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Your site will be available immediately after creation. You can always edit these settings later.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Need help? Contact support at support@example.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SiteCreationPage;