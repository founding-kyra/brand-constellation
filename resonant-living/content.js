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

  plan: { s: "progress", blocks: [
    {"type":"lead","text":"Build an audience of sensitive, high-responsibility women aged 30 to 50 who recognize themselves in Lauren's message, begin trusting her approach, and become interested in working with her."},
    {"type":"text","heading":"How the month moves","body":["From recognition, to trust, to participation, to invitation. One idea can become a profile post, a community conversation and a reel."]},
    { "type": "calendar", "heading": "The calendar", "weeks": [
      { "t": "Week 1 · Recognition", "d": "Help her see that the Access Gap is real", "days": [
        {"n":1,"kind":"Profile","format":"Long-form","hook":"You can know exactly what you need and still not be able to do it.","note":"Explain the Access Gap and why knowing isn't the same as having capacity.","cta":"Ask: Does this sound familiar?","text":"You can know exactly what you need to do.\nAnd still not be able to do it.\nAnd I think this is one of the most misunderstood experiences for women who have spent their entire lives being the capable one.\nBecause you're not lacking information.\nYou've read the books.\nYou've done the therapy.\nYou've listened to the podcasts.\nYou can probably explain your patterns better than half the people around you.\nYou KNOW what would help.\nAnd then life happens.\nThe kids need something.\nWork gets overwhelming.\nYour body is exhausted.\nYour brain has 47 tabs open.\nAnd suddenly that thing you absolutely knew you needed?\nYou can't seem to access it.\nSo you do what you've always done.\nYou assume you need more discipline.\nMore consistency.\nA better routine.\nAnother system.\nBut what if that's not actually the problem?\nWhat if there's a gap between what you KNOW and what your body, environment, resources, and capacity will allow you to DO?\nI call that the Access Gap.\nAnd I'm becoming increasingly convinced that closing this gap has very little to do with forcing ourselves harder.\nIt's about understanding what conditions allow us to actually access ourselves.\nBecause maybe the goal isn't becoming a better-performing version of you.\nMaybe it's having more of YOU available to you.\nCurious if this resonates with anyone else.\nHave you ever known exactly what you needed, but couldn't seem to get yourself there?"},
        {"n":2,"kind":"Community","format":"Discussion","hook":"What's something you know helps you, but you struggle to access when life gets loud?","note":"Invite honest, low-pressure responses. Don't prescribe solutions.","cta":"Conversation only"},
        {"n":3,"kind":"Reel","format":"45 sec","hook":"You're not short on self-awareness. You're short on accessible support.","note":"Explain the difference between insight and conditions.","cta":"Follow for more","text":"You know what's really interesting?\nSome of the women who struggle the most to follow through are also the most self-aware people I've ever met.\nThey know their patterns.\nThey know what helps.\nThey know when they're heading toward burnout.\nBut that doesn't mean they can always access what they know.\nAnd I think we've been calling that a discipline problem for way too long.\nI call it the Access Gap.\nThe distance between understanding what you need and having the capacity and support to actually do it.\nWhat if we started addressing THAT instead?"},
        {"n":4,"kind":"Profile","format":"Founder story","hook":"I could carry an enormous amount. But I wasn't always able to feel myself inside my own life.","note":"Share Lauren's lived experience with over-functioning and disconnection.","cta":"Connection only"},
        {"n":5,"kind":"Community","format":"Education","hook":"The problem with another perfect routine.","note":"Explore the mismatch between a routine and fluctuating capacity.","cta":"Ask what routines have felt supportive"},
        {"n":6,"kind":"Profile","format":"Lead magnet","hook":"I made something for the woman who knows what she needs but can't find her way into doing it.","note":"Introduce One Rep of Resonance, the free five-minute experience.","cta":"DM REP","text":"I made something for the woman who's tired of knowing what she needs...\n...and still feeling completely unable to do it.\nIt's called One Rep of Resonance.\nA free five-minute practice to help you stop trying to overhaul your entire life and start exploring what would actually support you right now.\nNot a new morning routine.\nNot a 30-day discipline challenge.\nAnd definitely not another thing to feel guilty about forgetting.\nJust one small opportunity to notice:\n1. What's true for you right now\n2. What capacity you actually have\n3. What might help you access one next step\n4. What changes when you work with yourself instead of against yourself\nBecause I don't think most of us need another 47 things to do.\nSometimes we need one accessible place to begin.\nIf you'd like a copy, send me REP and I'll share it with you.\nNo pressure to do it perfectly.\nThat's kind of the point."},
        {"n":7,"kind":"Live","format":"Training 1","hook":"Why You Know What to Do But Still Can't Do It","note":"Teach the Access Gap, show an everyday example, and guide one small reflection.","cta":"Offer the free practice"}
      ] },
      { "t": "Week 2 · Relief & practical change", "d": "Demonstrate state before discipline", "days": [
        {"n":8,"kind":"Profile","format":"Belief shift","hook":"What if consistency isn't doing the same thing every day?","note":"Offer a definition of consistency that includes stopping and returning.","cta":"Save or reflect"},
        {"n":9,"kind":"Community","format":"Exercise","hook":"Before you make another plan, check what you actually have available.","note":"Guide a simple capacity check, with no personal disclosure required.","cta":"Try one five-minute experiment"},
        {"n":10,"kind":"Reel","format":"30 sec","hook":"Your calendar might be organized for a version of you who doesn't exist every day.","note":"Contrast rigid scheduling with flexibility for different capacities.","cta":"Save this"},
        {"n":11,"kind":"Profile","format":"Long-form","hook":"You bought the planner. You set up the kitchen. You made the schedule. So why didn't it stick?","note":"Show how external solutions can miss underlying conditions.","cta":"Invite discussion","text":"Can we talk about the number of times we've tried to organize ourselves into a completely different life?\nThe new planner.\nThe kitchen reset.\nThe Sunday meal prep.\nThe gym membership.\nThe beautifully organized morning routine.\nAnd honestly?\nA lot of those things are lovely.\nUntil the day you're exhausted.\nOr overwhelmed.\nOr the kids are home.\nOr something completely unexpected happens.\nAnd then the whole damn thing falls apart.\nSo we start over.\nAgain.\nBut here's what I've been thinking about...\nWhat if the problem wasn't that the system failed because YOU failed?\nWhat if the system simply wasn't built for the actual human being who was supposed to use it?\nA human with changing energy.\nChanging responsibilities.\nSensory needs.\nEmotions.\nA nervous system.\nA life.\nWe keep borrowing systems designed for someone else's circumstances and then blaming ourselves when we can't sustain them.\nAnd I want to approach it differently.\nBefore asking, \"How do I make myself do this?\"\nWhat if we asked:\n\"What would need to be true for this to feel accessible?\"\nSometimes the answer isn't a new habit.\nIt's less friction.\nMore support.\nA smaller first step.\nOr permission to choose something entirely different.\nThat's the kind of life architecture I care about.\nNot a perfect system.\nA living one.\nOne that actually has room for you."},
        {"n":12,"kind":"Live","format":"Training 2","hook":"State Before Strategy: Building a Life That Works With Your Capacity","note":"Teach a capacity audit and show how to choose an accessible action.","cta":"DM REP"},
        {"n":13,"kind":"Community","format":"How-to","hook":"A five-minute action that asks less of you, not more.","note":"Demonstrate one small rep and ask what would make it easier.","cta":"Offer the free guide"},
        {"n":14,"kind":"Profile","format":"Reflection","hook":"Maybe progress isn't a streak. Maybe it's how you return to yourself.","note":"Human, reflective post about interrupted progress.","cta":"No pitch"}
      ] },
      { "t": "Week 3 · Self-trust & possibility", "d": "Connect small practices to The Next 40", "days": [
        {"n":15,"kind":"Profile","format":"Problem awareness","hook":"Have you ever felt like you're watching your life instead of living it?","note":"Use Lauren's 'one foot in and one foot out' language.","cta":"Ask for private reflections"},
        {"n":16,"kind":"Community","format":"Discussion","hook":"What are you done performing in the next chapter of your life?","note":"Open a conversation about identities built around responsibility.","cta":"Community discussion"},
        {"n":17,"kind":"Reel","format":"45 sec","hook":"Your next 40 years don't have to be a continuation of the last 40.","note":"Introduce choice, agency and the Next 40 philosophy.","cta":"Share or save","text":"What if the next 40 years of your life didn't have to look anything like the last 40?\nWhat if you didn't have to spend them being the responsible one?\nThe accommodating one?\nThe one who can handle everything?\nWhat if you got to choose?\nNot because you suddenly became a completely different person.\nBut because you started building a life where more of YOU could actually exist.\nThat's what I mean when I talk about The Next 40.\nNot starting over.\nChoosing how you want to live from here."},
        {"n":18,"kind":"Profile","format":"Founder story","hook":"I spent so much time learning how to survive that I had to relearn what it meant to live.","note":"Share Lauren's own change in direction without promising the same outcome to others.","cta":"Connection"},
        {"n":19,"kind":"Live","format":"Training 3","hook":"The Next 40: From Survival-Based Patterns to Intentional Choice","note":"Walk through Arrive → Orient → Resource → Choose → Enter.","cta":"Invite personal reflection"},
        {"n":20,"kind":"Profile","format":"Resource preview","hook":"What would change if you practiced returning to yourself 88 different times?","note":"Introduce the concept behind 88 Reps of Resonance, if ready for release.","cta":"Join the interest list"},
        {"n":21,"kind":"Community","format":"Practical reflection","hook":"What became easier when you stopped asking yourself to do everything?","note":"Invite small examples of supportive changes. Share a genuine personal example.","cta":"No pitch"}
      ] },
      { "t": "Week 4 · Invitation & decision", "d": "Connect the philosophy to a tangible experience of working with Lauren", "days": [
        {"n":22,"kind":"Profile","format":"Invitation","hook":"I've been thinking about what happens after someone realizes they're stuck in the Access Gap.","note":"Introduce the proposed seven-week founders experience and its purpose.","cta":"DM NEXT40 for details"},
        {"n":23,"kind":"Community","format":"FAQ","hook":"What if you've already tried everything?","note":"Explain why Lauren's process is experimental rather than another rigid system.","cta":"Invite questions"},
        {"n":24,"kind":"Reel","format":"30 sec","hook":"I don't want to fix you. I want to help you understand what supports you.","note":"Set clear expectations around agency, collaboration and scope.","cta":"Learn about the approach"},
        {"n":25,"kind":"Profile","format":"Offer story","hook":"What if the next chapter of your life began with having more of yourself available to you?","note":"Show who the cohort is for, what the journey involves and what it is not.","cta":"Express interest","text":"I've been sitting with a question lately.\nWhat happens after a woman realizes she's been living in survival mode for most of her adult life?\nBecause awareness matters.\nBut awareness on its own isn't always enough.\nYou can understand your patterns.\nYou can know what needs to change.\nYou can even imagine an entirely different life.\nAnd still find yourself cycling through the same old ways of coping.\nThat's part of why I'm developing The Stewardship Chamber.\nA seven-week Resonant Living experience for women who are ready to explore a different way of relating to themselves and their lives.\nNot by adding another impossible list of things to accomplish.\nBut by starting with what is true.\nUnderstanding capacity.\nIdentifying the support that's missing.\nCreating small, realistic experiments.\nAnd practicing what it means to choose from a place of self-trust instead of constant self-abandonment.\nThis isn't about me fixing anyone.\nAnd it's not about promising that seven weeks will magically undo decades of experience.\nIt's about creating a supported space where you can explore what actually works for YOU.\nBecause I believe the next chapter of your life deserves more than just a better-managed version of survival.\nIt deserves you.\nMore of you available to you.\nIf you'd like to hear about the founding cohort as the details are finalized, send me NEXT40.\nI'd love to share what I'm creating and hear what kind of support would be meaningful to you."},
        {"n":26,"kind":"Live","format":"Training 4","hook":"More of You Available to You: What Resonant Living Looks Like in Practice","note":"Demonstrate the process and answer questions about the proposed cohort.","cta":"Invite a fit conversation"},
        {"n":27,"kind":"Profile","format":"Behind the scenes","hook":"Here's what actually happens when we stop trying to overhaul everything.","note":"Walk through an illustrative first session: conversation, audit, accessible next action.","cta":"Request program information"},
        {"n":28,"kind":"Community","format":"Reflection","hook":"What have you noticed about your own capacity this month?","note":"Ask the group to recognize one insight or experiment, however small.","cta":"Conversation first"}
      ] },
      { "t": "Days 29–30 · Consolidation", "d": "Recap, learn from feedback and invite the right next step", "days": [
        {"n":29,"kind":"Profile","format":"Objection / fit","hook":"You don't have to be certain, spiritual, neurodivergent or perfectly ready to explore this.","note":"Clarify who is welcome, who isn't a fit and what support can realistically offer.","cta":"Invite genuine questions"},
        {"n":30,"kind":"Profile","format":"Month recap","hook":"If there's one thing I hope you take from this month, it's this: you are not a problem to solve.","note":"Summarize the Access Gap, supportive conditions, one rep and self-trust.","cta":"DM REP or NEXT40"}
      ] }
    ] },
    {"type":"compare","heading":"Five messages to become known for","cols":["Message","What it changes for her"],"rows":[["The Access Gap","“Maybe I don't need another course. Maybe there's a reason I can't access what I already know.”"],["State before discipline","“I don't have to shame myself into consistency.”"],["Scaffolding instead of self-force","“My environment can support my capacity instead of demanding more of it.”"],["Self-trust over self-improvement","“I want to be able to trust myself again, not constantly become someone better.”"],["The Next 40","“I get to choose how the next part of my life feels.”"]]},
    {"type":"stages","heading":"Where the content leads","items":[{"t":"Organic content","d":"Women recognize themselves in Lauren's words"},{"t":"One Rep of Resonance","d":"A free five-minute experience of her approach"},{"t":"88 Reps of Resonance","d":"Optional $17–$27 micro-offer, not a required step"},{"t":"7-Week Founders Cohort","d":"The Stewardship Chamber, an invitation to ongoing support"}]},
    {"type":"copy","heading":"Conversation replies","items":[{"t":"When someone requests One Rep of Resonance","text":"Hey! I'm so glad you reached out.\nHere's One Rep of Resonance, the little five-minute practice I mentioned.\nIt's meant to be something you can experiment with, not another thing to get right.\nI'd be curious what you notice if you give it a try. No pressure to report back though. 💛"},{"t":"When someone shares a struggle","text":"That makes a lot of sense.\nI'm curious about something, if you're comfortable sharing.\nWhen you say you know what you need but struggle to do it, does it feel more like you don't have the energy, don't have the support, or something else entirely?\nI've been exploring how different the answers can be for different people."},{"t":"When someone asks about working with Lauren","text":"Yes! I'm developing a seven-week Resonant Living experience around exactly this.\nThe focus is on understanding your capacity, looking at the conditions in your life, and finding practical ways to make more of yourself accessible.\nI'd love to hear what kind of change you're looking for so we can see whether the approach makes sense for you.\nWould you be open to a conversation about that?"}]},
    {"type":"tags","heading":"What to track each week","items":["Meaningful comments from women who match the avatar","Private conversations started with consent","Requests for One Rep of Resonance","Free-practice feedback","Live training attendance and questions","Founding cohort inquiries","Recurring language, fears and objections"]},
    {"type":"pending","heading":"Still to finalize","text":"Before the cohort is sold, Lauren confirms the details below. No paid-client case studies yet, and the work isn't positioned as treatment for any health condition.","needs":["Cohort price","Delivery format","Support boundaries","Who it's suitable for","How progress is assessed"]}
  ] },

  ads: { s: "planning", blocks: [
    {"type":"pending","heading":"A future phase","text":"Paid advertising will be planned once the organic funnel is running.","needs":["Budget","Offer to promote","Ad creative"]},
    {"type":"text","heading":"Guardrail","body":["Ads follow the brand's ethics: no engineered urgency and no pressing on pain points."]}
  ] },

  "big-picture": { s: "planning", blocks: [
    {"type":"section","heading":"Land-Based Retreat"},
    {"type":"text","heading":"A sanctuary on the land","body":["A retreat built for sensory regulation, deep rest and integration.","A woodland labyrinth ends in private practice chambers, so guests physically walk the descent and the return."]},
    {"type":"section","heading":"Visionary Co-Op"},
    {"type":"text","heading":"A non-competitive network","body":["Aligned practitioners, space designers, somatic workers and artisans refer clients to each other through shared affiliate agreements."]},
    {"type":"section","heading":"Ethical Legacy"},
    {"type":"list","heading":"Commitments","items":[{"t":"Capped salaries","d":"Comfortable, not excessive."},{"t":"Grants and scholarships","d":"Surplus revenue opens access."},{"t":"State funding","d":"Exploring Maine's Section 29 program so cost isn't a barrier."}]},
    {"type":"section","heading":"Adaptive Codex & Vitality Sync"},
    {"type":"lead","text":"Turning the course library into a searchable tool that responds to each person's capacity."},
    {"type":"stages","items":[{"t":"Capture","d":"Months 1 to 12. Log client capacity shifts, friction points and what works during live runs."},{"t":"Vitality Sync","d":"A 30-second mobile check-in rating nervous system state, energy and available time."},{"t":"Access keys","d":"The check-in hands out 1 to 3 targeted practices, so there's no decision fatigue."}]}
  ] }
};

/* Light connections between related pages. Off for now; add pairs like ["research", "messaging"]. */
const LINKS = [];
