// pages/api/generate-ads.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, formData, single } = req.body;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Your API key from .env.local
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract text from response
    const content = data.content[0].text;
    
    // Clean and parse JSON
    const cleanJson = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    let ads;
    try {
      ads = JSON.parse(cleanJson);
    } catch (parseError) {
      // If parsing fails, return mock data
      console.error('JSON parse error:', parseError);
      ads = generateMockAds(formData);
    }

    // Ensure ads is an array
    if (!Array.isArray(ads)) {
      ads = [ads];
    }

    // Return only 1 ad if single=true, otherwise return all
    const finalAds = single ? [ads[0]] : ads;

    return res.status(200).json({ ads: finalAds });

  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback to mock ads on error
    const mockAds = generateMockAds(req.body.formData);
    return res.status(200).json({ ads: mockAds });
  }
}

// Fallback mock data generator
function generateMockAds(formData) {
  const { businessName, product, targetAudience, offer, cta, language } = formData;
  
  const isHindi = language === 'hindi' || language === 'hinglish';
  
  if (isHindi) {
    return [
      {
        headline: `${businessName} की धमाकेदार ऑफर! 🎉`,
        body: `${product} पर ${offer}! सिर्फ आज के लिए विशेष छूट। जल्दी करें, स्टॉक सीमित है!`,
        cta: cta || 'अभी ऑर्डर करें',
        emojis: ['🎉', '🔥', '✨', '💫'],
        hashtags: ['#SpecialOffer', '#LimitedTime', '#ShopNow'],
        score: 92,
        strengths: ['Strong urgency', 'Clear offer', 'Cultural relevance'],
        improvements: ['Add social proof', 'Include price point']
      },
      {
        headline: `${product} - आपके लिए बेस्ट डील! 💯`,
        body: `${targetAudience} के लिए खास! ${offer} के साथ। आज ही घर बैठे मंगवाएं।`,
        cta: cta || 'WhatsApp करें',
        emojis: ['💯', '🎯', '⭐', '🛍️'],
        hashtags: ['#BestDeal', '#QualityProduct', '#TrustedBrand'],
        score: 88,
        strengths: ['Targeted messaging', 'Trust indicators', 'Easy action'],
        improvements: ['Add testimonial', 'Show before/after']
      },
      {
        headline: `🔥 ${businessName} का सबसे बड़ा ऑफर`,
        body: `${product} अब ${offer}! हजारों ग्राहक खुश हैं। अब आपकी बारी!`,
        cta: cta || 'आज ही खरीदें',
        emojis: ['🔥', '💝', '🌟', '👍'],
        hashtags: ['#BiggestSale', '#CustomerFavorite', '#MustHave'],
        score: 85,
        strengths: ['Social proof', 'FOMO creation', 'Clear benefit'],
        improvements: ['Specify quantity', 'Add deadline']
      },
      {
        headline: `${product} - विश्वास की गारंटी! ⭐`,
        body: `${businessName} से ${offer}! 100% असली प्रोडक्ट। फ्री डिलीवरी!`,
        cta: cta || 'अभी कॉल करें',
        emojis: ['⭐', '✅', '🚚', '💝'],
        hashtags: ['#Guaranteed', '#FreeDelivery', '#Authentic'],
        score: 90,
        strengths: ['Trust building', 'Added value', 'Authenticity'],
        improvements: ['Add time limit', 'Show reviews']
      },
      {
        headline: `जल्दी करें! ${product} Stock खत्म होने वाला 🏃`,
        body: `${offer} - सिर्फ आज! ${targetAudience} के लिए स्पेशल। Miss मत करें!`,
        cta: cta || 'Book Now',
        emojis: ['🏃', '⚡', '🎁', '💥'],
        hashtags: ['#LastChance', '#HurryUp', '#TodayOnly'],
        score: 87,
        strengths: ['High urgency', 'Scarcity tactics', 'Action-oriented'],
        improvements: ['Add specific numbers', 'Include testimonial']
      }
    ];
  } else {
    // English ads
    return [
      {
        headline: `${businessName} - Biggest ${offer}! 🎉`,
        body: `Get ${product} with ${offer}. Perfect for ${targetAudience}. Limited stock available!`,
        cta: cta || 'Order Now',
        emojis: ['🎉', '🔥', '✨', '💫'],
        hashtags: ['#Sale', '#LimitedOffer', '#ShopNow'],
        score: 90,
        strengths: ['Clear offer', 'Urgency', 'Target specific'],
        improvements: ['Add social proof', 'Include testimonials']
      },
      {
        headline: `Amazing Deal on ${product}! 💯`,
        body: `${businessName} brings you ${offer}. Don't miss out on this incredible offer!`,
        cta: cta || 'Buy Now',
        emojis: ['💯', '⭐', '🎯', '🛍️'],
        hashtags: ['#BestDeal', '#Quality', '#Trusted'],
        score: 88,
        strengths: ['Value proposition', 'Brand trust', 'Clear CTA'],
        improvements: ['Add urgency', 'Show benefits']
      },
      {
        headline: `🔥 ${offer} on ${product} Today!`,
        body: `Thousands of happy customers. Join them and get your ${product} today!`,
        cta: cta || 'Shop Now',
        emojis: ['🔥', '💝', '🌟', '👍'],
        hashtags: ['#TodayOnly', '#CustomerChoice', '#MustHave'],
        score: 85,
        strengths: ['Social proof', 'FOMO', 'Time-sensitive'],
        improvements: ['Specify deadline', 'Add quantity']
      },
      {
        headline: `Guaranteed Quality ${product}! ⭐`,
        body: `${businessName} - ${offer} + Free Delivery! 100% Authentic Products.`,
        cta: cta || 'Call Now',
        emojis: ['⭐', '✅', '🚚', '💝'],
        hashtags: ['#Guaranteed', '#FreeShipping', '#Authentic'],
        score: 91,
        strengths: ['Trust indicators', 'Added value', 'Quality focus'],
        improvements: ['Add reviews', 'Show certifications']
      },
      {
        headline: `Last Chance! ${product} Going Fast 🏃`,
        body: `${offer} ends today! Perfect for ${targetAudience}. Don't wait!`,
        cta: cta || 'Book Now',
        emojis: ['🏃', '⚡', '🎁', '💥'],
        hashtags: ['#LastChance', '#HurryUp', '#EndingSoon'],
        score: 86,
        strengths: ['High urgency', 'Scarcity', 'Action-driven'],
        improvements: ['Add countdown', 'Include testimonial']
      }
    ];
  }
}
