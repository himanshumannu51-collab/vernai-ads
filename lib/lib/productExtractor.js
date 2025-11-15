// lib/productExtractor.js

const PRODUCT_DATABASE = {
  laptop: {
    category: 'electronics',
    fullName: 'Laptop Computer',
    painPoints: ['slow performance', 'short battery life', 'expensive', 'too heavy'],
    benefits: ['productivity boost', 'portability', 'powerful performance', 'multitasking'],
    targetAudience: ['students', 'professionals', 'gamers', 'content creators'],
    useCases: ['work from home', 'gaming', 'video editing', 'online classes'],
    priceRange: '₹25,000-₹1,50,000',
    competitors: ['desktop computers', 'tablets'],
    emotionalTriggers: ['career growth', 'freedom', 'efficiency', 'modernity']
  },
  
  phone: {
    category: 'electronics',
    fullName: 'Smartphone',
    painPoints: ['battery drains fast', 'storage always full', 'camera quality poor', 'slow performance'],
    benefits: ['stay connected', 'capture memories', 'entertainment on-go', 'productivity'],
    targetAudience: ['youth', 'professionals', 'photographers', 'everyone'],
    useCases: ['photography', 'social media', 'work emails', 'video calls', 'entertainment'],
    priceRange: '₹8,000-₹1,50,000',
    competitors: ['other smartphones', 'cameras'],
    emotionalTriggers: ['connection', 'memories', 'status', 'convenience']
  },
  
  shoes: {
    category: 'fashion',
    fullName: 'Shoes/Footwear',
    painPoints: ['uncomfortable', 'expensive', 'wear out quickly', 'not stylish'],
    benefits: ['all-day comfort', 'style statement', 'durability', 'confidence'],
    targetAudience: ['athletes', 'professionals', 'fashion enthusiasts', 'everyday users'],
    useCases: ['running', 'office wear', 'casual outings', 'gym', 'parties'],
    priceRange: '₹500-₹15,000',
    competitors: ['other footwear brands'],
    emotionalTriggers: ['comfort', 'confidence', 'style', 'self-expression']
  },
  
  gym: {
    category: 'fitness',
    fullName: 'Gym Membership',
    painPoints: ['too expensive', 'too crowded', 'far from home', 'intimidating'],
    benefits: ['fitness goals', 'health improvement', 'community', 'expert guidance'],
    targetAudience: ['fitness enthusiasts', 'beginners', 'weight loss seekers', 'bodybuilders'],
    useCases: ['weight loss', 'muscle building', 'staying fit', 'stress relief'],
    priceRange: '₹1,000-₹5,000/month',
    competitors: ['home workouts', 'other gyms'],
    emotionalTriggers: ['transformation', 'confidence', 'health', 'social belonging']
  },
  
  pizza: {
    category: 'food',
    fullName: 'Pizza',
    painPoints: ['expensive delivery', 'gets cold', 'limited options', 'unhealthy'],
    benefits: ['delicious', 'quick', 'variety', 'satisfying'],
    targetAudience: ['families', 'students', 'office workers', 'party hosts'],
    useCases: ['weekend treats', 'parties', 'quick dinner', 'hangouts'],
    priceRange: '₹150-₹800',
    competitors: ['burgers', 'biryani', 'home cooking'],
    emotionalTriggers: ['indulgence', 'happiness', 'togetherness', 'convenience']
  },
  
  // Add more products as needed
  headphones: {
    category: 'electronics',
    fullName: 'Headphones',
    painPoints: ['poor sound quality', 'uncomfortable', 'wire tangles', 'expensive'],
    benefits: ['immersive sound', 'comfort', 'wireless freedom', 'noise cancellation'],
    targetAudience: ['music lovers', 'gamers', 'commuters', 'professionals'],
    useCases: ['music', 'gaming', 'calls', 'focus work'],
    priceRange: '₹500-₹30,000',
    competitors: ['earbuds', 'speakers'],
    emotionalTriggers: ['escape', 'focus', 'quality', 'style']
  },
};

/**
 * Extracts rich product context from 1-3 word input
 */
export function extractProduct(input) {
  if (!input) return null;
  
  const normalized = input.toLowerCase().trim();
  
  // Direct match
  if (PRODUCT_DATABASE[normalized]) {
    return {
      success: true,
      ...PRODUCT_DATABASE[normalized],
      originalInput: input
    };
  }
  
  // Fuzzy match (plurals, variations)
  for (const [key, value] of Object.entries(PRODUCT_DATABASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        success: true,
        ...value,
        originalInput: input
      };
    }
  }
  
  // Generic fallback
  return {
    success: true,
    category: 'general',
    fullName: input,
    painPoints: ['high cost', 'limited availability', 'quality concerns'],
    benefits: ['value for money', 'convenience', 'reliability'],
    targetAudience: ['general consumers'],
    useCases: ['everyday use'],
    priceRange: 'varies',
    competitors: ['alternatives'],
    emotionalTriggers: ['satisfaction', 'trust'],
    originalInput: input
  };
}
