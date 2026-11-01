import { EventInput } from '@/schemas/eventSchemas';
import { EventPlan } from '@/schemas/planSchemas';

export function generateOfflineFallbackPlan(input: EventInput): EventPlan {
  const planId = `offline-${Date.now()}`;
  const isHindi = input.language === 'hi';

  const budgetPerGuest = Math.floor(input.budget / input.guestCount);
  
  const baseBudget = [
    {
      category: isHindi ? 'स्थल' : 'Venue',
      description: isHindi ? 'इवेंट स्थल किराया' : 'Event venue rental',
      estimatedCost: Math.floor(input.budget * 0.25),
      priority: 'high' as const
    },
    {
      category: isHindi ? 'खानपान' : 'Catering',
      description: isHindi ? 'भोजन और पेय पदार्थ' : 'Food and beverages',
      estimatedCost: Math.floor(input.budget * 0.30),
      priority: 'high' as const
    },
    {
      category: isHindi ? 'सजावट' : 'Decoration',
      description: isHindi ? 'स्थल सजावट' : 'Venue decoration',
      estimatedCost: Math.floor(input.budget * 0.15),
      priority: 'medium' as const
    },
    {
      category: isHindi ? 'फोटोग्राफी' : 'Photography',
      description: isHindi ? 'फोटो और वीडियो कवरेज' : 'Photo and video coverage',
      estimatedCost: Math.floor(input.budget * 0.12),
      priority: 'medium' as const
    },
    {
      category: isHindi ? 'मनोरंजन' : 'Entertainment',
      description: isHindi ? 'संगीत और मनोरंजन' : 'Music and entertainment',
      estimatedCost: Math.floor(input.budget * 0.10),
      priority: 'low' as const
    },
    {
      category: isHindi ? 'विविध' : 'Miscellaneous',
      description: isHindi ? 'आकस्मिक खर्च' : 'Contingency expenses',
      estimatedCost: Math.floor(input.budget * 0.08),
      priority: 'low' as const
    }
  ];

  const baseTimeline = [
    {
      daysBeforeEvent: 90,
      task: isHindi ? 'योजना शुरू करें' : 'Start Planning',
      description: isHindi ? 'बजट तय करें और शुरुआती रिसर्च करें' : 'Finalize budget and initial research',
      responsible: isHindi ? 'आप' : 'You'
    },
    {
      daysBeforeEvent: 60,
      task: isHindi ? 'स्थल बुक करें' : 'Book Venue',
      description: isHindi ? 'स्थल चुनें और बुकिंग की पुष्टि करें' : 'Select and confirm venue booking',
      responsible: isHindi ? 'इवेंट आयोजक' : 'Event Organizer'
    },
    {
      daysBeforeEvent: 45,
      task: isHindi ? 'विक्रेता बुक करें' : 'Book Vendors',
      description: isHindi ? 'खानपान, फोटोग्राफर, सजावटकर्ता' : 'Caterer, photographer, decorator',
      responsible: isHindi ? 'इवेंट आयोजक' : 'Event Organizer'
    },
    {
      daysBeforeEvent: 30,
      task: isHindi ? 'निमंत्रण भेजें' : 'Send Invitations',
      description: isHindi ? 'अतिथि सूची को अंतिम रूप दें और निमंत्रण भेजें' : 'Finalize guest list and send invitations',
      responsible: isHindi ? 'आप' : 'You'
    },
    {
      daysBeforeEvent: 14,
      task: isHindi ? 'विवरण की पुष्टि करें' : 'Confirm Details',
      description: isHindi ? 'सभी विक्रेताओं और व्यवस्थाओं की पुष्टि करें' : 'Confirm all vendors and arrangements',
      responsible: isHindi ? 'इवेंट आयोजक' : 'Event Organizer'
    },
    {
      daysBeforeEvent: 7,
      task: isHindi ? 'अंतिम तैयारी' : 'Final Preparations',
      description: isHindi ? 'अंतिम मिनट की जांच और समायोजन' : 'Last minute checks and adjustments',
      responsible: isHindi ? 'सभी' : 'All'
    },
    {
      daysBeforeEvent: 1,
      task: isHindi ? 'इवेंट डे रिहर्सल' : 'Event Day Rehearsal',
      description: isHindi ? 'अंतिम रन-थ्रू और सेटअप' : 'Final run-through and setup',
      responsible: isHindi ? 'सभी' : 'All'
    }
  ];

  const baseVendors = [
    {
      category: isHindi ? 'खानपान' : 'Catering',
      type: isHindi ? 'खानपान सेवा' : 'Catering Service',
      estimatedCost: `₹${budgetPerGuest * input.guestCount * 0.3}`,
      whenToBook: isHindi ? '45-60 दिन पहले' : '45-60 days before',
      tips: isHindi ? 'मेनू टेस्टिंग का अनुरोध करें' : 'Request menu tasting'
    },
    {
      category: isHindi ? 'स्थल' : 'Venue',
      type: isHindi ? 'इवेंट स्थल' : 'Event Venue',
      estimatedCost: `₹${Math.floor(input.budget * 0.25)}`,
      whenToBook: isHindi ? '60-90 दिन पहले' : '60-90 days before',
      tips: isHindi ? 'साइट विजिट अवश्य करें' : 'Must do site visit'
    },
    {
      category: isHindi ? 'फोटोग्राफी' : 'Photography',
      type: isHindi ? 'फोटोग्राफर और वीडियोग्राफर' : 'Photographer & Videographer',
      estimatedCost: `₹${Math.floor(input.budget * 0.12)}`,
      whenToBook: isHindi ? '30-45 दिन पहले' : '30-45 days before',
      tips: isHindi ? 'पोर्टफोलियो की समीक्षा करें' : 'Review portfolio'
    }
  ];

  const baseIdeas = [
    {
      title: isHindi ? 'थीम-आधारित सजावट' : 'Theme-based Decoration',
      description: isHindi ? 'एक समन्वित रंग योजना और थीम चुनें' : 'Choose a cohesive color scheme and theme',
      category: isHindi ? 'सजावट' : 'Decoration'
    },
    {
      title: isHindi ? 'व्यक्तिगत स्पर्श' : 'Personal Touches',
      description: isHindi ? 'कस्टम साइनेज और व्यक्तिगत पक्ष जोड़ें' : 'Add custom signage and personalized favors',
      category: isHindi ? 'विवरण' : 'Details'
    },
    {
      title: isHindi ? 'मेहमान सहभागिता' : 'Guest Engagement',
      description: isHindi ? 'इंटरैक्टिव तत्व या फोटो बूथ शामिल करें' : 'Include interactive elements or photo booth',
      category: isHindi ? 'मनोरंजन' : 'Entertainment'
    }
  ];

  const baseTips = isHindi ? [
    'अप्रत्याशित खर्चों के लिए बजट का 10% अलग रखें',
    'लिखित अनुबंध के साथ सभी बुकिंग की पुष्टि करें',
    'एक विस्तृत चेकलिस्ट और टाइमलाइन बनाएं',
    'बैकअप योजना रखें (खराब मौसम के लिए)',
    'भुगतान शर्तों पर बातचीत करें और सब कुछ दस्तावेज करें'
  ] : [
    'Set aside 10% of budget for unexpected expenses',
    'Confirm all bookings with written contracts',
    'Create a detailed checklist and timeline',
    'Have backup plans (for bad weather)',
    'Negotiate payment terms and document everything'
  ];

  return {
    planId,
    eventSummary: isHindi 
      ? `${input.eventName} के लिए बुनियादी योजना - ${input.date} को ${input.location} में ${input.guestCount} मेहमानों के साथ। कुल बजट: ₹${input.budget.toLocaleString('en-IN')}`
      : `Basic plan for ${input.eventName} - ${input.date} at ${input.location} with ${input.guestCount} guests. Total budget: ₹${input.budget.toLocaleString('en-IN')}`,
    budgetBreakdown: baseBudget,
    timeline: baseTimeline,
    vendorChecklist: baseVendors,
    personalizedIdeas: baseIdeas,
    tips: baseTips
  };
}
