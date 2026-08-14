// All AI prompts live here so they are easy to tune and easy to explain in viva.

export const brandLine = (b = {}) =>
  `Brand: ${b.name || "My Brand"} | Industry: ${b.industry || "General"} | Tone: ${b.tone || "Friendly"} | Audience: ${b.audience || "Gen Z"} | Keywords: ${(b.keywords || []).join(", ") || "none"}`;

export const captionPrompt = (brand, topic, platform, goal) => `
You are the social media manager of this brand.
${brandLine(brand)}
Task: write 3 ${platform} post options about "${topic}". Campaign goal: ${goal}.
Rules: match the brand tone, hook in the first 6 words, 1 clear CTA, no emoji spam (max 4).
Return ONLY JSON:
{"options":[{"caption":"...","hashtags":["#a","#b"],"hook":"...","bestTime":"e.g. Tue 7 PM"}]}
`;

export const viralityPrompt = (brand, caption, platform) => `
${brandLine(brand)}
Rate this ${platform} caption for virality: """${caption}"""
Judge: hook strength, emotion, clarity, shareability, CTA, hashtag quality.
Return ONLY JSON:
{"score":0-100,"breakdown":{"hook":0-100,"emotion":0-100,"clarity":0-100,"shareability":0-100,"cta":0-100},
"reasons":["..."],"improvedCaption":"..."}
`;

export const trendPrompt = (brand) => `
${brandLine(brand)}
Act as a trend analyst. List 6 CURRENT social media trends/formats this brand can realistically use.
For each: how hot it is (heatScore 0-100), how well it fits the brand (fitScore 0-100),
hours left before it dies (windowHours), a concrete content idea, and why it fits.
Return ONLY JSON:
{"trends":[{"title":"...","platform":"instagram","category":"...","heatScore":0,"fitScore":0,"windowHours":0,"contentIdea":"...","why":"..."}]}
`;

export const replyPrompt = (brand, message, type) => `
${brandLine(brand)}
An incoming ${type} from a follower: """${message}"""
1) Classify sentiment (positive/neutral/negative), intent (praise/complaint/question/lead/spam),
   priority 1-5 (5 = brand risk, reply now).
2) Write a reply in brand tone, under 40 words, human, never robotic.
3) escalate = true if it needs a human (legal, refund, abuse, PR risk).
Return ONLY JSON:
{"sentiment":"...","intent":"...","priority":1,"reply":"...","escalate":false}
`;

export const influencerPrompt = (brand, list) => `
${brandLine(brand)}
Here are candidate influencers (JSON): ${JSON.stringify(list)}
Rank the best 5 for a collaboration with this brand.
Consider niche fit, audience overlap, engagement rate vs followers, and cost efficiency.
Return ONLY JSON:
{"matches":[{"handle":"...","matchScore":0-100,"reason":"...","collabIdea":"...","expectedReach":0}]}
`;

export const strategyPrompt = (brand, stats) => `
${brandLine(brand)}
This week's numbers: ${JSON.stringify(stats)}
Act as the brand's marketing manager. Give a weekly action plan.
Return ONLY JSON:
{"summary":"2 lines","wins":["..."],"problems":["..."],"actions":[{"day":"Mon","task":"...","why":"..."}]}
`;
