// lib/adCategories.js

export const AD_CATEGORIES = {
  ugc: {
    id: 'ugc',
    name: 'UGC (User Generated Content)',
    description: 'Real person testimonial style',
    structure: 'Hook → Personal Story → Product Experience → Result',
    bestFor: ['trust-building', 'authenticity', 'social proof'],
    
    buildPrompt: (productData, form) => {
      const { fullName, painPoints, benefits, emotionalTriggers } = productData;
      const mainPain = painPoints[0] || 'a common problem';
      const mainBenefit = benefits[0] || 'great results';
      const emotion = emotionalTriggers[0] || 'satisfaction';
      
      return `You are a real customer sharing your genuine experience with ${fullName}.

Write a UGC-style ad in FIRST PERSON as if you're telling a friend about your experience.

Structure:
1. Hook: Start with a relatable problem you had ("I was so frustrated with ${mainPain}...")
2. Discovery: How you found this product ("Then I discovered ${form.businessName || 'this product'}...")
3. Experience: What happened when you used it (be specific and honest)
4. Result: The transformation/benefit you got ("Now I ${mainBenefit}!")
5. Recommendation: Encourage others to try it

Tone: ${form.tone}, authentic, conversational, like talking to a friend
Language: ${form.language}
Audience: ${form.audience || 'general consumers'}

Requirements:
- Use "I", "me", "my" throughout
- Include specific details (not generic)
- Sound natural, not salesy
- Show emotion (${emotion})
- End with genuine recommendation
- Keep it ${form.language === 'Hindi' ? 'in Hindi script' : form.language === 'Hinglish' ? 'in mixed Hindi-English' : 'in English'}
- Length: 2-3 short paragraphs

Output only the ad copy, no labels or tags.`;
    }
  },
  
  productDemo: {
    id: 'productDemo',
    name: 'Product Demo',
    description: 'Show features and benefits',
    structure: 'Problem → Features → Benefits → CTA',
    bestFor: ['feature-rich products', 'new launches', 'education'],
    
    buildPrompt: (productData, form) => {
      const { fullName, painPoints, benefits, useCases } = productData;
      const features = benefits.slice(0, 3);
      
      return `You are showcasing ${fullName} in a product demo ad.

Write a PRODUCT DEMO style ad that highlights key features and benefits.

Structure:
1. Problem Hook: Quick question about common pain ("Tired of ${painPoints[0]}?")
2. Solution Intro: Introduce the product ("Meet ${form.businessName || fullName}")
3. Feature Showcase: List 3-4 key features with checkmarks (✓)
4. Benefits: What these features mean for the user
5. Use Cases: Show ${useCases.slice(0, 2).join(', ')}
6. CTA: Clear call to action with ${form.offer || 'special offer'}

Tone: ${form.tone}, enthusiastic, educational
Language: ${form.language}
Audience: ${form.audience || 'people interested in ' + fullName}

Requirements:
- Start with attention-grabbing question
- Use bullet points/checkmarks for features
- Connect features to real benefits
- Include emojis (3-5 max) if tone is Friendly/Exciting
- End with strong CTA: ${form.cta || 'Buy Now / Try Today'}
- ${form.offer ? 'Highlight offer: ' + form.offer : ''}
- Keep it ${form.language === 'Hindi' ? 'in Hindi' : form.language === 'Hinglish' ? 'in Hinglish' : 'in English'}

Output only the ad copy, ready to post.`;
    }
  },
  
  problemSolution: {
    id: 'problemSolution',
    name: 'Problem → Solution',
    description: 'Address pain point, offer solution',
    structure: 'Pain → Agitate → Solution → CTA',
    bestFor: ['pain-point marketing', 'urgent needs', 'comparison'],
    
    buildPrompt: (productData, form) => {
      const { fullName, painPoints, benefits, competitors, emotionalTriggers } = productData;
      const bigPain = painPoints[0];
      const bigBenefit = benefits[0];
      
      return `You are writing a PROBLEM → SOLUTION ad for ${fullName}.

Write using the PAS (Problem-Agitate-Solution) framework.

Structure:
1. Problem: Identify the main pain point vividly ("${bigPain}")
2. Agitate: Make them feel the pain (consequences, frustration)
3. Solution: Present ${form.businessName || fullName} as the answer
4. Proof: Quick reason why it works (1 sentence)
5. CTA: Urgent call to action

Tone: ${form.tone}, empathetic but solution-focused
Language: ${form.language}
Audience: ${form.audience || 'people struggling with ' + bigPain}
Emotion: Tap into ${emotionalTriggers[0] || 'relief and satisfaction'}

Requirements:
- Start with relatable pain point
- Agitate briefly (don't overdo it)
- Present solution as obvious answer
- Show contrast (before vs after)
- Create urgency in CTA
- ${form.offer ? 'Include limited-time offer: ' + form.offer : 'Add FOMO element'}
- Keep it ${form.language === 'Hindi' ? 'in Hindi' : form.language === 'Hinglish' ? 'in Hinglish' : 'in English'}
- Length: 3-4 short paragraphs

Output only the ad copy, no formatting tags.`;
    }
  }
};

/**
 * Get the appropriate prompt based on category + product data
 */
export function getCategoryPrompt(category, productData, formData) {
  const cat = AD_CATEGORIES[category];
  if (!cat) return null;
  
  return cat.buildPrompt(productData, formData);
}
