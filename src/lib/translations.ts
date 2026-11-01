export const translations = {
  en: {
    title: 'GenAI Event Planner',
    subtitle: 'Plan your perfect event with AI assistance',
    skipToContent: 'Skip to main content',
    form: {
      title: 'Event Details',
      eventType: 'Event Type',
      eventName: 'Event Name',
      date: 'Event Date',
      location: 'Location',
      budget: 'Budget (₹)',
      guestCount: 'Number of Guests',
      language: 'Preferred Language',
      additionalDetails: 'Additional Details',
      weddingStyle: 'Wedding Style',
      ceremonies: 'Ceremonies (comma-separated)',
      ageGroup: 'Age Group',
      theme: 'Theme (optional)',
      eventCategory: 'Event Category',
      isPublic: 'Public Event',
      submit: 'Generate Plan',
      generating: 'Generating your plan...',
      validation: {
        required: 'This field is required',
        minBudget: 'Minimum budget is ₹100',
        invalidDate: 'Please enter a valid date'
      }
    },
    eventTypes: {
      wedding: 'Wedding',
      birthday: 'Birthday',
      community: 'Community Event'
    },
    weddingStyles: {
      traditional: 'Traditional',
      modern: 'Modern',
      destination: 'Destination',
      intimate: 'Intimate'
    },
    ageGroups: {
      child: 'Child',
      teen: 'Teen',
      adult: 'Adult',
      senior: 'Senior'
    },
    categories: {
      festival: 'Festival',
      charity: 'Charity',
      sports: 'Sports',
      cultural: 'Cultural',
      social: 'Social'
    },
    plan: {
      title: 'Your Event Plan',
      summary: 'Summary',
      budget: 'Budget Breakdown',
      timeline: 'Timeline',
      vendors: 'Vendor Checklist',
      ideas: 'Personalized Ideas',
      tips: 'Tips & Recommendations',
      chat: 'Refine Your Plan',
      chatPlaceholder: 'Ask to modify the plan...',
      send: 'Send',
      offlineFallback: 'Offline Plan Available',
      downloading: 'Preparing plan...',
      priority: {
        high: 'High Priority',
        medium: 'Medium Priority',
        low: 'Low Priority'
      },
      daysBeforeEvent: 'days before event'
    },
    errors: {
      generic: 'Something went wrong. Please try again.',
      rateLimit: 'Too many requests. Please wait a moment.',
      network: 'Network error. Please check your connection.',
      validation: 'Please check your input and try again.'
    }
  },
  hi: {
    title: 'जेनएआई इवेंट प्लानर',
    subtitle: 'एआई सहायता से अपने परफेक्ट इवेंट की योजना बनाएं',
    skipToContent: 'मुख्य सामग्री पर जाएं',
    form: {
      title: 'इवेंट विवरण',
      eventType: 'इवेंट का प्रकार',
      eventName: 'इवेंट का नाम',
      date: 'इवेंट की तारीख',
      location: 'स्थान',
      budget: 'बजट (₹)',
      guestCount: 'मेहमानों की संख्या',
      language: 'पसंदीदा भाषा',
      additionalDetails: 'अतिरिक्त विवरण',
      weddingStyle: 'शादी की शैली',
      ceremonies: 'समारोह (अल्पविराम से अलग)',
      ageGroup: 'आयु वर्ग',
      theme: 'थीम (वैकल्पिक)',
      eventCategory: 'इवेंट श्रेणी',
      isPublic: 'सार्वजनिक इवेंट',
      submit: 'योजना बनाएं',
      generating: 'आपकी योजना बन रही है...',
      validation: {
        required: 'यह फील्ड आवश्यक है',
        minBudget: 'न्यूनतम बजट ₹100 है',
        invalidDate: 'कृपया एक वैध तारीख दर्ज करें'
      }
    },
    eventTypes: {
      wedding: 'शादी',
      birthday: 'जन्मदिन',
      community: 'सामुदायिक कार्यक्रम'
    },
    weddingStyles: {
      traditional: 'पारंपरिक',
      modern: 'आधुनिक',
      destination: 'डेस्टिनेशन',
      intimate: 'इंटिमेट'
    },
    ageGroups: {
      child: 'बच्चा',
      teen: 'किशोर',
      adult: 'वयस्क',
      senior: 'सीनियर'
    },
    categories: {
      festival: 'त्योहार',
      charity: 'चैरिटी',
      sports: 'खेल',
      cultural: 'सांस्कृतिक',
      social: 'सामाजिक'
    },
    plan: {
      title: 'आपकी इवेंट योजना',
      summary: 'सारांश',
      budget: 'बजट विवरण',
      timeline: 'समयरेखा',
      vendors: 'विक्रेता चेकलिस्ट',
      ideas: 'व्यक्तिगत विचार',
      tips: 'टिप्स और सिफारिशें',
      chat: 'अपनी योजना को बेहतर बनाएं',
      chatPlaceholder: 'योजना में बदलाव करने के लिए पूछें...',
      send: 'भेजें',
      offlineFallback: 'ऑफलाइन योजना उपलब्ध',
      downloading: 'योजना तैयार की जा रही है...',
      priority: {
        high: 'उच्च प्राथमिकता',
        medium: 'मध्यम प्राथमिकता',
        low: 'कम प्राथमिकता'
      },
      daysBeforeEvent: 'इवेंट से पहले दिन'
    },
    errors: {
      generic: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
      rateLimit: 'बहुत सारे अनुरोध। कृपया एक क्षण प्रतीक्षा करें।',
      network: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
      validation: 'कृपया अपना इनपुट जांचें और पुनः प्रयास करें।'
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.en;
