// Fallback data used when Gemini is unavailable. Keeps the demo bulletproof.

export const mockCaptions = (topic = "our product") => ({
  options: [
    { caption: `Stop scrolling. ${topic} just got a serious upgrade.`, hashtags: ["#newdrop", "#upgrade", "#trending", "#brandpilot"], hook: "Stop scrolling", bestTime: "Tue 7 PM" },
    { caption: `We tested ${topic} for 30 days. Here's what nobody tells you.`, hashtags: ["#honestreview", "#30days", "#behindthescenes"], hook: "We tested it for 30 days", bestTime: "Thu 8 PM" },
    { caption: `Your feed needed this. ${topic}, but make it effortless.`, hashtags: ["#effortless", "#dailyroutine", "#musthave"], hook: "Your feed needed this", bestTime: "Sat 11 AM" },
  ],
});

export const mockVirality = {
  score: 74,
  breakdown: { hook: 80, emotion: 70, clarity: 85, shareability: 65, cta: 70 },
  reasons: ["Strong opening hook", "CTA could be sharper", "Hashtags are broad, add 2 niche tags"],
  improvedCaption: "Stop scrolling — this changes your routine. Save this before it's gone.",
};

export const mockTrends = {
  trends: [
    { title: "POV storytelling reels", platform: "instagram", category: "format", heatScore: 92, fitScore: 78, windowHours: 60, contentIdea: "POV: your first day using our product", why: "High completion rate format right now" },
    { title: "Founder talking-head clips", platform: "linkedin", category: "format", heatScore: 84, fitScore: 88, windowHours: 120, contentIdea: "60s founder story on why you started", why: "Builds trust fast for small brands" },
    { title: "Before/After split screen", platform: "instagram", category: "format", heatScore: 79, fitScore: 82, windowHours: 72, contentIdea: "Messy desk vs organised desk", why: "Instant visual proof of value" },
    { title: "Ask-me-anything carousels", platform: "instagram", category: "engagement", heatScore: 71, fitScore: 74, windowHours: 96, contentIdea: "5 questions customers keep asking", why: "Drives saves and comments" },
    { title: "Micro-tutorial threads", platform: "twitter", category: "education", heatScore: 68, fitScore: 70, windowHours: 48, contentIdea: "3-step tutorial thread", why: "Cheap to produce, high shares" },
    { title: "Behind-the-scenes packing", platform: "instagram", category: "authenticity", heatScore: 65, fitScore: 90, windowHours: 150, contentIdea: "Pack an order with us", why: "Authenticity beats polish this quarter" },
  ],
};

export const mockReply = {
  sentiment: "neutral",
  intent: "question",
  priority: 2,
  reply: "Great question! We usually ship within 2-3 days. Drop us a DM with your order ID and we'll check it for you.",
  escalate: false,
};

export const mockMatches = (list = []) => ({
  matches: list.slice(0, 5).map((i, idx) => ({
    handle: i.handle,
    matchScore: 92 - idx * 6,
    reason: `${i.niche} audience overlaps with your target and engagement is ${i.engagementRate}%.`,
    collabIdea: "Co-created reel + discount code for their audience",
    expectedReach: Math.round((i.followers || 10000) * 0.35),
  })),
});

export const mockStrategy = {
  summary: "Engagement is up but reach is flat. Double down on reels and reply faster.",
  wins: ["Reels outperform static posts by 2.4x", "Positive sentiment at 68%"],
  problems: ["Posting gaps on weekends", "Negative comments unanswered for 12h+"],
  actions: [
    { day: "Mon", task: "Publish POV reel", why: "Format is peaking this week" },
    { day: "Wed", task: "Reply to all pending DMs", why: "Response time drives trust" },
    { day: "Fri", task: "Launch influencer collab", why: "Weekend reach is highest" },
  ],
};
