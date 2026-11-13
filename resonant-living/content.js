/* =====================================================================
   CLIENT CONTENT for Resonant Living Co. The only file that changes per client.
   Section and page names come from shared/shell.js. Here, each page id gets:
     s: "ready" | "progress" | "planning"
     blocks: lead, text, quote, quotes, list, tags, facts, compare, stages,
             pending, swatches, gallery, pipeline, section, moodboard
   A section id can take { blocks } for an intro, or { subs } to replace its pages.
   ===================================================================== */
const CLIENT = {
  "name": "Resonant Living Co.",
  "sunLines": [
    "RESONANT",
    "LIVING CO."
  ]
};

const CONTENT = {
  origin: { s: "planning", blocks: [
    {"type":"lead","text":"Resonant Living Co. grew out of twenty years of study across exercise science, nervous system regulation and environmental design."},
    {"type":"text","heading":"Where it began","body":["When the founder's dance program at East Carolina University ended, she transferred back to Maine. With no dance major there, she chose exercise science with a minor in holistic health.","That training showed her that movement can't be separated from awareness, altered states or the spaces we live in."]},
    {"type":"tags","heading":"Twenty years of study","items":["Strength & conditioning","Yoga","MBSR","Meridians & chakras","Energy work","Mental health rehabilitation","Environmental design","Neurodivergent scaffolding"]},
    {"type":"text","heading":"The turn","body":["For years these lived as separate pieces. The shift came with seeing that rigid, isolated protocols fail complex, neurodivergent and high-responsibility people.","The work moved from optimizing single tactics to designing the relationships between systems: nervous system state, environment, identity and daily choices."]},
    {"type":"compare","heading":"From fragments to relationships","cols":["Traditional wellness","Resonant Living"],"rows":[["Focus","One area at a time","How systems affect each other"],["Delivery","Rigid daily protocols","Scaffolding that flexes with capacity"],["Orientation","Shame when energy drops","Capacity shifts are useful information"],["Outcome","Compliance, then burnout","Self-trust and lasting agency"]]}
  ] },

  ethos: { s: "planning", blocks: [
    {"type":"text","heading":"What resonance means","body":["Resonance isn't matching someone else's profile. It's being able to live as who you actually are."]},
    {"type":"quote","text":"Are you actually resonating at your unique profile? … can you actually be who you are?","by":"The founder"},
    {"type":"text","heading":"The founder's role","body":["A guide and navigational GPS who offers workable paths. Not a healer or a guru. Agency always stays with the client."]},
    {"type":"list","heading":"Brand pillars","items":[{"t":"Self-trust over prescription","d":"No rigid rules. Build the self-trust to choose from real-time body awareness."},{"t":"Agency over alignment","d":"Resonance means living your own profile, not fitting a wellness ideal."},{"t":"Sovereign feminine","d":"Grounded archetypes: the Valkyrie, the Queen, the wise elder."},{"t":"Anti-ableist scaffolding","d":"Systems bend to fit people, including executive dysfunction, trauma responses and energy drops."}]}
  ] },

  ethics: { s: "planning", blocks: [
    {"type":"lead","text":"An anti-shame, anti-ableist business in a market that often profits from pain."},
    {"type":"compare","heading":"How we sell","cols":["Common in wellness","Resonant Living"],"rows":[["Urgency","Engineered by pressing on pain points","Never manufactured"],["Visibility","Exposes vulnerability to convert","Supportive and capacity-aware"],["Authority","Dependence on a central healer","Sovereignty stays with the client"]]},
    {"type":"list","heading":"Commitments","items":[{"t":"Human-made touchpoints","d":"Real art, local artists and real footage. AI stays behind the scenes."},{"t":"Capped executive pay","d":"Salaries stay comfortable, not excessive."},{"t":"Reinvested surplus","d":"Extra revenue funds grants, scholarships and sponsorships."}]}
  ] },

  messaging: { s: "planning", blocks: [
    {"type":"text","heading":"Positioning","body":["Resonant Living Co. is a method for designing how a person's systems work together. It is not a self-help product.","Dysregulation isn't an intellectual failure. It's a breakdown in how someone's inner and outer systems relate."]},
    {"type":"tags","heading":"Signature language","items":["Reps of Resonance","The Next 40","Relationship architecture","Life scaffolding","Capacity, not discipline","Return to center","Access keys"]},
    {"type":"list","heading":"Voice","items":[{"t":"Grounded","d":"Calm, embodied and direct."},{"t":"Real","d":"Honest about mess and chaos, with humor."},{"t":"Intelligent","d":"Respects a sharp audience without hiding behind jargon."},{"t":"Never shaming","d":"Capacity drops are information, not failure."}]},
    {"type":"compare","heading":"Say this, not that","cols":["Say","Avoid"],"rows":[["Capacity","Discipline"],["Scaffolding","Rigid routine"],["Guide","Guru or healer"],["Return to center","Fix yourself"]]}
  ] },

  identity: { s: "planning", blocks: [
    {"type":"pending","heading":"Identity in progress","text":"The visual identity hasn't been designed yet. This page fills in as it's created.","needs":["Logo and marks","Color palette","Typography","Usage rules"]},
    {"type":"section","heading":"Brand Guidelines"},
    {"type":"swatches","heading":"Color","items":[],"empty":4},
    {"type":"text","heading":"Typography","body":["To come."]},
    {"type":"section","heading":"Logo Files"},
    {"type":"gallery","heading":"","folder":"","tiles":["Primary logo","Submark","Wordmark","Icon"]}
  ] },

  art: { s: "planning", blocks: [
    {"type":"lead","text":"The labyrinth is the central symbol: a non-linear path down to the core self and back out with more capacity."},
    {"type":"list","heading":"Visual symbols","items":[{"t":"The Labyrinth","d":"Stone paths, chambers and an ant's-eye view. Growth that isn't linear."},{"t":"Organic earthiness","d":"Forest green, wood grain, moss and slate. Grounding and safety."},{"t":"Sacred geometry","d":"Fine-line networks, fractal grids and node maps. Respect for intelligence."},{"t":"Integrated duality","d":"Dark goddess imagery, raw light and unpolished texture. Strength without performance."}]},
    {"type":"compare","heading":"Photography","cols":["Yes","No"],"rows":[["Raw natural light","Polished Instagram feed"],["Tactile, real textures","Sterile, over-curated sets"],["Real people and local artists","AI imagery in client-facing work"]]},
    {"type":"gallery","heading":"Photo library","folder":"","tiles":["Labyrinth paths","Forest & moss","Stone & slate","Founder portraits","Textures","Workspace"]}
  ] },

  library: { s: "planning", blocks: [
    {"type":"lead","text":"Finished branded assets, ready to use."},
    {"type":"gallery","heading":"Asset library","folder":"","tiles":["Logos","Social templates","1 Rep of Resonance PDF","Guided audio","Video","Email graphics"]}
  ] },

  inspo: { s: "planning", blocks: [
    {"type":"moodboard","heading":"","path":"inspo/resonant-living-","images":[[475,720],[405,720],[405,720],[393,720],[540,720],[405,720],[415,720],[403,720],[480,720],[476,720],[405,720],[405,720],[480,720],[576,720],[480,720],[574,720],[540,720],[405,720],[576,720],[483,720],[405,720],[405,720],[576,720],[325,720],[324,720],[405,720],[540,720],[480,720],[405,720],[480,720],[390,720],[480,720],[480,720],[576,720],[720,480],[580,720],[576,720],[423,720],[360,720],[578,720],[473,720],[480,720],[480,720],[480,720],[480,720],[576,720],[576,720],[576,720],[405,720],[392,720],[480,720],[332,720],[332,720],[576,720],[405,720],[388,720],[406,720],[720,720],[720,576],[576,720],[720,695],[576,720],[480,720],[713,720],[480,720],[720,719],[540,720],[405,720],[576,720],[570,720],[480,720],[513,720],[720,720],[720,547],[405,720],[403,720],[720,720],[405,720],[720,720],[542,720],[498,720],[480,720],[405,720],[579,720],[540,720],[484,720]]},
    {"type":"swatches","heading":"Colors","items":[],"empty":5}
  ] },

  freebie: { s: "planning", blocks: [
    {"type":"facts","items":[{"k":"Offer","v":"1 Rep of Resonance"},{"k":"Price","v":"Free"},{"k":"Time","v":"5 minutes"},{"k":"Format","v":"PDF, audio or video"}]},
    {"type":"text","heading":"What it is","body":["A short Get Unstuck orientation tool. It helps someone who is activated pause, scan their nervous system, notice their surroundings and make one conscious choice."]},
    {"type":"text","heading":"Why it matters","body":["It gives an immediate win with no effort, and it's the first step into the funnel."]}
  ] },

  low: { s: "planning", blocks: [
    {"type":"facts","items":[{"k":"Offer","v":"88 Reps of Resonance"},{"k":"Price","v":"$17 to $27"},{"k":"Length","v":"88 days"},{"k":"Delivery","v":"Email, SMS or private group"}]},
    {"type":"text","heading":"What it is","body":["88 short daily invitations, delivered one at a time, to return to center with a minimum viable action."]},
    {"type":"text","heading":"Why it matters","body":["It builds a low-pressure daily practice without big time commitments or triggering executive dysfunction."]}
  ] },

  high: { s: "planning", blocks: [
    {"type":"facts","items":[{"k":"Offer","v":"Resonant Living Course"},{"k":"Format","v":"4 self-paced modules"},{"k":"Support","v":"Live co-regulation labs"},{"k":"Price","v":"To be set"}]},
    {"type":"list","heading":"What's included","items":[{"t":"Video and audio modules","d":"Self-paced lessons."},{"t":"Co-regulation labs","d":"Regular live practice sessions."},{"t":"Body doubling","d":"Working alongside others to lower activation energy."},{"t":"Feedback","d":"Voice notes, Loom breakdowns and Q&A."}]},
    {"type":"text","heading":"What it solves","body":["The knowledge-execution gap. Clients learn to design their own life scaffolding, audit their capacity, manage their environment and build lasting self-trust."]}
  ] },

  programs: { s: "planning", blocks: [
    {"type":"section","heading":"4-Stage Co-Regulation"},
    {"type":"lead","text":"Four stages of support. Clients choose the stage that matches their capacity each day, and can move back at any time."},
    {"type":"stages","items":[{"t":"I show, you witness","d":"The facilitator demonstrates. The client watches with zero pressure."},{"t":"We do together","d":"Practice side by side, live or through body doubling. The facilitator is the anchor."},{"t":"You do, I witness","d":"The client leads while the facilitator watches and gives feedback."},{"t":"Independent","d":"The client practices alone, with support available as needed."}]},
    {"type":"text","heading":"Why it isn't linear","body":["A daily check-in lets clients move between high structure and independence without shame. That keeps people in the program instead of dropping out."]}
  ] },

  research: { s: "planning", blocks: [
    {"type":"lead","text":"The Next 40: capable women, 30 to 50+, who refuse to spend the second half of life in survival mode."},
    {"type":"quote","text":"I spent 40 years doing it the way I was supposed to do it. I am going to choose my next 40.","by":"The Next 40"},
    {"type":"list","heading":"Who she is","items":[{"t":"Capable","d":"Leads organizations and households, solves complex problems, cares for others."},{"t":"Well-read","d":"Knows psychology, self-help and holistic wellness well."},{"t":"Multi-passionate","d":"Visionary, intelligent and self-aware."}]},
    {"type":"list","heading":"What she's carrying","items":[{"t":"Survival cycles","d":"Urgency, over-functioning, depletion, shutdown, rebuilding."},{"t":"Complex capacity","d":"Often ADHD, a trauma history, chronic stress or perimenopause."},{"t":"Body signals","d":"Solar plexus tension, digestive trouble, deep fatigue."},{"t":"A threshold","d":"Divorce, a career change, caregiving burnout or a motherhood shift."}]},
    {"type":"text","heading":"The knowledge-execution gap","body":["She can diagnose anyone else's situation in seconds. When she tries to apply it to her own life, her body registers action as unsafe and she freezes.","Planners, decluttering and habit trackers fail her because they fix the outside and ignore her internal state."]},
    {"type":"quotes","heading":"In her words","items":["I know what I need, why can't I consistently do it?","What is the point of trying? I keep doing this with no actual change.","I'm just fucking raw dogging life right now. I have no safety, no protection, and no functional capacity."]}
  ] },

  crm: { s: "planning", blocks: [
    {"type":"pending","heading":"Connect GoHighLevel","text":"Contacts and the lead tracker will show here once GoHighLevel is connected.","needs":["GoHighLevel connection","Pipeline stages confirmed","A tag for each offer"]},
    {"type":"pipeline","heading":"Proposed pipeline","stages":[{"t":"New lead","d":"Found the brand"},{"t":"1 Rep","d":"Took the free tool"},{"t":"88 Reps","d":"Bought the micro-offer"},{"t":"Course enquiry","d":"Asked about the course"},{"t":"Enrolled","d":"In the course"}]}
  ] },

  platforms: { s: "planning", blocks: [
    {"type":"list","heading":"Where the brand shows up","items":[{"t":"TikTok","d":"The main channel. Raw, chaotic and honest."},{"t":"Long-form","d":"Podcast, long videos and essays for the bigger stories."},{"t":"Email and SMS","d":"Delivery for 88 Reps of Resonance."},{"t":"Instagram","d":"Lower priority. The brand avoids the polished feed."}]}
  ] },

  plan: { s: "planning", blocks: [
    {"type":"pending","heading":"Calendar coming later","text":"A working content calendar will live here in a future phase.","needs":["Posting rhythm","Calendar tool"]},
    {"type":"list","heading":"Content pillars","items":[{"t":"Actionable pillars","d":"Practical breakdowns of scaffolding and nervous system mechanics."},{"t":"Hero stories","d":"Long-form stories of the philosophy and real change."},{"t":"Unfiltered realness","d":"Unscripted short videos of real chaos and humor."},{"t":"Micro-invitations","d":"Daily low-effort prompts to pause and check in."}]}
  ] },

  ads: { s: "planning", blocks: [
    {"type":"pending","heading":"A future phase","text":"Paid advertising will be planned once the organic funnel is running.","needs":["Budget","Offer to promote","Ad creative"]},
    {"type":"text","heading":"Guardrail","body":["Ads follow the brand's ethics: no engineered urgency and no pressing on pain points."]}
  ] },

  vision: { subs: [
    { id: "retreat", short: "Retreat Land", title: "Land-Based Retreat", s: "planning", note: "Woodland labyrinth and practice chambers", blocks: [
      {"type":"text","heading":"A sanctuary on the land","body":["A retreat built for sensory regulation, deep rest and integration.","A woodland labyrinth ends in private practice chambers, so guests physically walk the descent and the return."]}
    ] },
    { id: "coop", short: "Co-Op", title: "Visionary Co-Op", s: "planning", note: "A referral network of aligned providers", blocks: [
      {"type":"text","heading":"A non-competitive network","body":["Aligned practitioners, space designers, somatic workers and artisans refer clients to each other through shared affiliate agreements."]}
    ] },
    { id: "legacy", short: "Give-Back", title: "Ethical Legacy", s: "planning", note: "Scholarships and state-funded access", blocks: [
      {"type":"list","heading":"Commitments","items":[{"t":"Capped salaries","d":"Comfortable, not excessive."},{"t":"Grants and scholarships","d":"Surplus revenue opens access."},{"t":"State funding","d":"Exploring Maine's Section 29 program so cost isn't a barrier."}]}
    ] },
    { id: "app", short: "App", title: "Adaptive Codex & Vitality Sync", s: "planning", note: "A daily check-in that hands out 1 to 3 access keys", blocks: [
      {"type":"lead","text":"Turning the course library into a searchable tool that responds to each person's capacity."},
      {"type":"stages","items":[{"t":"Capture","d":"Months 1 to 12. Log client capacity shifts, friction points and what works during live runs."},{"t":"Vitality Sync","d":"A 30-second mobile check-in rating nervous system state, energy and available time."},{"t":"Access keys","d":"The check-in hands out 1 to 3 targeted practices, so there's no decision fatigue."}]}
    ] }
  ] }
};

/* Light connections between related pages. Off for now; add pairs like ["research", "messaging"]. */
const LINKS = [];
