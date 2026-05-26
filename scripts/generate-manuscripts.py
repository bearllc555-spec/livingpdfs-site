#!/usr/bin/env python3
"""Generate LivingPDFs manuscript JSON files."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "assets" / "content"
COVERS = ROOT / "assets" / "covers"


def block(heading, pages, *paragraphs):
    return {"heading": heading, "pages": pages, "paragraphs": list(paragraphs)}


def distribute_pages(total, count, early_target):
    """Assign 2-4 pages per block; first blocks hit ~20% preview budget."""
    base = [3] * count
    s = sum(base)
    i = 0
    while s < total:
        base[i % count] = min(4, base[i % count] + 1)
        s = sum(base)
        i += 1
    while s > total:
        for j in range(count - 1, -1, -1):
            if base[j] > 2 and s > total:
                base[j] -= 1
                s -= 1
    # Boost early blocks if preview target not met
    used = 0
    idx = 0
    while idx < count and used < early_target:
        used += base[idx]
        idx += 1
    while used < early_target and idx < count:
        if base[idx - 1] < 4:
            base[idx - 1] += 1
            used += 1
        else:
            idx += 1
            if idx <= count:
                used += base[idx - 1] if idx <= count else 0
            break
    return base


def make_guide(slug, title, category, total_pages, section, blocks_data):
    pages = distribute_pages(total_pages, len(blocks_data), max(1, round(total_pages * 0.2)))
    blocks = []
    for i, (heading, paras) in enumerate(blocks_data):
        blocks.append(block(heading, pages[i], *paras))
    return {
        "slug": slug,
        "title": title,
        "cover": f"/assets/covers/{slug}.svg",
        "category": category,
        "totalPages": total_pages,
        "currentSection": section,
        "blocks": blocks,
    }


def p(*sentences):
    return " ".join(sentences)


GUIDES = []

# 1. micro-saas
GUIDES.append(make_guide(
    "micro-saas",
    "50 AI Micro-SaaS Ideas You Can Build With LLMs",
    "AI · SaaS · Living · Ultimate",
    51,
    "Chapter 1 · The Micro-SaaS Opportunity",
    [
        ("Why micro-SaaS beats big startup bets now", [
            p("Micro-SaaS products solve one painful workflow for one buyer persona and charge monthly for the fix.", "You do not need venture capital, a large team, or eighteen months of runway to validate demand.", "Large language models collapsed the cost of building features that used to require specialized ML teams.", "A solo operator with Claude, a payment link, and a landing page can ship a useful tool in weeks—not quarters."),
            p("The winning pattern is narrow scope, recurring revenue, and distribution through communities where the pain is already loud.", "Plumbers, agencies, recruiters, and ecommerce operators pay for tools that save hours they bill at higher rates.", "Your first version should do one job exceptionally well rather than ten jobs adequately.", "Revenue proof matters more than feature count when you are choosing which idea to pursue."),
        ]),
        ("The LLM advantage: what changed in 2024–2026", [
            p("Before LLMs, custom text generation, classification, and extraction required APIs, fine-tuning, or brittle regex.", "Today you can chain prompts, retrieval, and simple UI to deliver outcomes buyers already pay freelancers to produce.", "The moat is not the model—it is workflow integration, trust, and distribution in a vertical niche.", "Competitors can copy prompts; they cannot copy your customer relationships and onboarding speed."),
            p("Focus on tasks with clear inputs and outputs: proposals, audits, listings, summaries, compliance checks, and report drafts.", "Buyers pay when the output is near publish-ready and the tool saves visible labor.", "Always disclose AI assistance where it affects trust or regulated industries.", "Build human review steps into v1 instead of promising fully autonomous magic."),
        ]),
        ("How to score ideas before you write code", [
            p("Use a simple scorecard: pain frequency, willingness to pay, reachable audience, and build complexity.", "Ideas that touch money—sales, compliance, hiring, ads—convert faster than novelty tools.", "Ask whether the buyer already spends on a workaround: spreadsheets, VAs, or agency retainers.", "If the workaround costs more than your planned price, you have a wedge."),
            p("Run five discovery calls before building; offer to pre-sell a founding-member plan at a discount.", "Pre-sales eliminate the fantasy of demand and fund your first month of hosting.", "Reject ideas where the buyer cannot name the last time the problem cost them money or time.", "The Ultimate tier worksheet in this guide includes a printable scoring matrix and call script."),
        ]),
        ("Distribution: where your first 100 customers hide", [
            p("Micro-SaaS distribution is rarely SEO at launch; it is communities, partnerships, and outbound.", "Find Facebook groups, Slack workspaces, subreddits, and trade associations where your persona already asks for help.", "Offer free audits or templates that naturally lead to your paid product.", "One agency partner reselling your tool to ten clients beats a thousand anonymous signups."),
            p("Record short Loom demos showing before/after workflows using real (anonymized) data.", "Pin case studies with numbers: hours saved, error reduction, or revenue lifted—not vague praise.", "Referral credits and white-label options accelerate B2B micro-SaaS without ad spend.", "Track channel ROI weekly; double down on the one channel that produces paid conversions."),
        ]),
        ("Pricing psychology for $29–$299/month tools", [
            p("Price against the labor you replace, not against your hosting bill.", "A tool that saves five billable hours monthly can justify $99–$199 for professional buyers.", "Offer annual plans with two months free to improve cash flow and reduce churn.", "Use three tiers: solo, team, and agency—with clear seat and usage limits."),
            p("Founding-member pricing creates urgency without fake countdown timers.", "Raise prices after ten paying customers once onboarding is documented.", "Free trials should require a credit card or a sales call for high-trust verticals.", "Ultimate buyers get a pricing calculator spreadsheet tied to vertical benchmarks."),
        ]),
        ("Tech stack for solo builders", [
            p("Keep the stack boring: Next.js or static HTML front end, Supabase or SQLite for data, Stripe for billing.", "Use Claude or GPT APIs behind server-side routes—never expose keys in the browser.", "Queue long jobs with simple cron or serverless functions; show progress in the UI.", "Log prompts and outputs for debugging; redact PII in logs."),
            p("Start without multi-tenant complexity if you can invoice manually for the first five clients.", "Add auth and teams when repeat purchases appear, not before.", "Use feature flags to ship quietly to beta users.", "Document deploy steps so you can fix production issues from your phone."),
        ]),
        ("Category 1: Proposal and document generators", [
            p("Agencies, consultants, and contractors rewrite similar proposals weekly.", "Build vertical proposal builders: web design, HVAC, legal intake, or grant applications.", "Pull answers from a short questionnaire; output branded PDF and editable doc.", "Charge $49–$149/month per seat or per organization."),
            p("Add a library of winning sections users can remix.", "Integrate e-signature handoff to PandaDoc or native PDF export.", "Upsell human review for an extra fee if you have domain expertise.", "These products win on speed and consistency, not on perfect prose."),
        ]),
        ("Category 2: Audit and scorecard tools", [
            p("SEO, accessibility, ad account, and security audits are repetitive checklists with narrative summaries.", "Ingest a URL or export file; return prioritized fixes with severity labels.", "Agencies white-label audits as lead magnets; charge them $199+/month for unlimited runs.", "Refresh audits monthly to justify subscription over one-time reports."),
            p("Show competitor benchmarks when data is available.", "Include export to Slack or email for client delivery.", "Never claim guaranteed ranking or compliance outcomes—show evidence and recommendations.", "Ultimate tier includes audit prompt packs and client delivery email templates."),
        ]),
        ("Category 3: Listing and catalog optimizers", [
            p("Ecommerce and marketplace sellers need titles, bullets, and tags at scale.", "Connect Shopify, Amazon SP-API, or CSV upload; batch-generate optimized listings.", "Charge by SKU tier: $39 for 100 SKUs, $99 for 1,000.", "Human approval queue prevents brand-voice drift."),
            p("Store brand voice examples and banned phrases per account.", "Track performance deltas where APIs allow—click-through, conversion, return rate.", "Partner with ecommerce coaches who teach listing optimization.", "Seasonal spikes (Q4) are predictable; run annual prep campaigns."),
        ]),
        ("Category 4: Internal knowledge and SOP bots", [
            p("Teams drown in Notion pages nobody reads.", "Build a Q&A layer over their docs with citations and update suggestions.", "Sell to ops-heavy businesses: franchises, clinics, property managers.", "Price per location or per seat with setup fee for ingestion."),
            p("Weekly digest of stale docs and conflicting answers increases stickiness.", "SOC-sensitive buyers need private deployment options—charge for it.", "Start with one vertical SOP pack you pre-load to reduce time-to-value.", "Retention hinges on accurate citations, not clever chat personality."),
        ]),
        ("Category 5: Compliance and checklist assistants", [
            p("Regulated niches pay for checklists: OSHA, HIPAA-adjacent workflows, franchise ops, food safety.", "Never provide legal advice; generate drafts for human review with disclaimers.", "Partner with consultants who sign off on outputs.", "Monthly subscription plus per-location fee scales revenue."),
            p("Timestamped audit logs matter for buyers who face inspections.", "Mobile-friendly checklists beat desktop-only SaaS in field industries.", "Localization and state-specific variants create upsell paths.", "Reference Ultimate sealed chapter for compliance disclaimer language."),
        ]),
        ("Category 6: Recruiting and hiring workflow tools", [
            p("Screening summaries, job ad variants, and structured interview kits save HR hours.", "Sell to boutique staffing firms and fast-growing startups without full ATS budgets.", "Integrate with Greenhouse or Workable via webhook when ready.", "Charge per active role or per hire pipeline."),
            p("Bias and fairness review steps belong in the workflow—not as afterthoughts.", "Provide scorecards hiring managers actually fill out.", "Agencies resell white-label screening to clients.", "Track time-to-fill improvements in case studies."),
        ]),
        ("Category 7: Customer support copilots", [
            p("Small SaaS teams want draft replies grounded in help docs and past tickets.", "Connect Zendesk or Intercom; suggest replies with sources.", "Price by ticket volume tier.", "Human send button keeps quality high and liability lower."),
            p("Measure deflection and first-response time for ROI stories.", "Escalation rules for angry or legal keywords are mandatory.", "Offer onboarding where you ingest their docs for a setup fee.", "Support leaders buy outcomes, not tokens."),
        ]),
        ("Category 8: Financial and ops reporting narrators", [
            p("Founders stare at Stripe and ad dashboards without narrative.", "Pull metrics weekly; generate plain-English summaries and anomaly flags.", "Sell to ecommerce operators and agency owners.", "Higher price point ($149–$399) when tied to revenue decisions."),
            p("Connect QuickBooks or Xero in v2 for richer context.", "Alert on margin compression, refund spikes, or CAC creep.", "Executive summary email every Monday becomes habit-forming.", "Do not present forecasts as guarantees—frame as scenarios."),
        ]),
        ("Category 9: Local service business tools", [
            p("HVAC, plumbing, roofing, and cleaning companies need estimates, follow-ups, and review requests.", "Build mobile-first flows tied to job types and seasonal offers.", "Sell through trade groups and supplier co-marketing.", "Per-truck or per-tech pricing aligns with how they think."),
            p("Integrate with ServiceTitan or Jobber when you have traction.", "Photo-to-estimate helpers are high wow-factor demos.", "Review generation after job completion drives referrals for your product.", "Keep language plain; avoid Silicon Valley jargon on sales calls."),
        ]),
        ("Category 10: Creator and newsletter ops", [
            p("Creators need repurposing: newsletter to threads, show notes, sponsor pitches.", "Charge $29–$79/month with usage caps on minutes or words processed.", "Partner with podcast hosts and Substacks in your niche.", "Brand voice training from five sample posts improves retention."),
            p("Calendar integration for publish reminders increases daily active use.", "Sponsor CRM lite tracks inbound and outbound pitches.", "Never scrape platforms against terms of service.", "Show time saved per published piece in the dashboard."),
        ]),
        ("Validation sprint: 14 days from idea to paid pilot", [
            p("Day 1–3: interviews and pre-sale offer.", "Day 4–7: clickable prototype or wizard-of-oz service delivery.", "Day 8–10: manual fulfillment with AI backend hidden.", "Day 11–14: automate the highest-friction step and invoice pilot customers."),
            p("Two paying pilots beat fifty free users for learning.", "Document every objection; it becomes your FAQ and sales script.", "Kill ideas that cannot close pilots in fourteen days unless strategic.", "Ultimate tier includes a day-by-day checklist and pilot agreement template."),
        ]),
        ("Launch checklist and first revenue milestones", [
            p("Ship privacy policy, terms, status page, and support email before public launch.", "Set up Stripe tax settings and basic bookkeeping categories.", "Target $1k MRR as proof of repeatable motion—not as a finish line.", "Raise prices or narrow niche when support burden exceeds capacity."),
            p("Collect video testimonials after the second successful month.", "Build a public roadmap to reduce churn from uncertainty.", "Schedule quarterly content updates to this LivingPDF as tools evolve.", "Your moat compounds when customers embed your tool in their weekly rhythm."),
        ]),
    ],
))

# 2. lazy-man-ai
GUIDES.append(make_guide(
    "lazy-man-ai",
    "The Lazy Man's Way to Get Rich Using AI",
    "AI · Income · Living · Ultimate",
    70,
    "Chapter 1 · Leverage Over Hustle",
    [
        ("The lazy principle: maximum output, minimum motion", [
            p("Getting rich with AI is not about working eighteen-hour days—it is about stacking leverage.", "Leverage means systems that produce value while you sleep, delegate, or focus on high-ticket decisions.", "Lazy operators automate repetition, productize expertise once, and sell outcomes—not hours.", "If a task does not increase revenue, retention, or asset value, it belongs in a workflow or the trash."),
            p("Wealthy laziness is strategic: you eliminate low-yield work first, then add AI where judgment is cheap.", "Busy founders confuse motion with progress; lazy founders measure dollars per hour of attention.", "This guide rejects guru promises of overnight millions.", "It teaches repeatable plays that compound when you refuse to do grunt work twice."),
        ]),
        ("The three leverage stacks", [
            p("Stack one is productized services: fixed scope, fixed price, AI-assisted delivery.", "Stack two is digital products: guides, templates, and micro-tools with near-zero marginal cost.", "Stack three is equity in small assets: niche sites, micro-SaaS, or revenue shares with operators you enable.", "Most readers should start with stack one because cash arrives fastest and funds the others."),
            p("Rotate effort monthly: sell, then systematize, then delegate.", "Never add a fourth stack until one produces predictable monthly profit.", "Lazy wealth is sequential, not simultaneous chaos.", "Track which stack returns the highest profit per minute of your involvement."),
        ]),
        ("Choosing a lane that pays without fame", [
            p("Boring B2B problems pay better than viral consumer apps for unknown operators.", "Pick buyers who already spend: agencies, clinics, trades, ecommerce brands, professional services.", "Avoid markets where the buyer has no budget and infinite free alternatives.", "Your lane should allow you to reuse the same delivery playbook across clients."),
            p("Write a one-page ICP: industry, role, pain, budget, and buying trigger.", "If you cannot name three companies that would pay this month, pick a new lane.", "Lazy operators niche down until outreach feels like helping friends.", "Ultimate tier includes ICP interview scripts and a lane comparison matrix."),
        ]),
        ("The 4-hour weekly sales rhythm", [
            p("Spend two hours on outbound or partner outreach, one hour on follow-up, one hour on proposals.", "Use AI to personalize first lines and summarize prospect sites—never send obvious bulk spam.", "Batch creation on Monday, send Tuesday–Thursday, follow up Friday.", "Protect the rest of the week for delivery and system building."),
            p("One closed deal per month at $2k–$5k beats ten unpaid projects.", "Track conversion by message variant; kill what does not reply.", "Referrals are the laziest lead source—ask after every successful delivery.", "Do not hide behind content creation instead of conversations."),
        ]),
        ("Productized offers that AI makes cheap to deliver", [
            p("Examples: monthly SEO content packs, email campaign builds, landing page in 48 hours, automation audits.", "Fixed scope prevents scope creep that destroys lazy margins.", "Publish a menu with prices; let buyers self-select.", "Delivery SOPs live in Notion with Claude prompts embedded per step."),
            p("Charge setup plus retainer when ongoing tweaks are inevitable.", "Use templates for kickoff emails, intake forms, and delivery walkthroughs.", "Record Loom handoffs instead of live meetings when possible.", "Raise prices when utilization exceeds eighty percent for four weeks."),
        ]),
        ("Automation without becoming a full-time engineer", [
            p("Use Make, Zapier, or n8n for glue between tools you already pay for.", "Claude generates JSON for scenarios; you import and test with sample data.", "Automate client reporting, invoice reminders, and content scheduling before exotic workflows.", "Every automation must have a failure alert to your phone."),
            p("Document automations so a VA can fix broken nodes.", "Charge clients for automation builds as one-time projects with maintenance retainers.", "Do not automate broken processes—fix the process first.", "Ultimate sealed chapter includes five import-ready scenario templates."),
        ]),
        ("Hiring humans lazily: VAs and specialists", [
            p("Hire when repetitive tasks exceed six hours weekly at rates below your effective hourly target.", "Start with ten hours weekly Philippines or Eastern Europe VAs for research, formatting, and QA.", "Give SOP videos and checklists; measure output, not online hours.", "Specialists—designers, editors—on project basis beat premature full-time hires."),
            p("Use AI to draft SOPs from your Loom transcripts.", "Never delegate client strategy until delivery is documented.", "Pay slightly above market to reduce turnover—the lazy tax on retraining is real.", "Build a bench of two backups per role."),
        ]),
        ("Digital products as sleep income", [
            p("Convert your best SOPs into LivingPDFs, Notion templates, or prompt packs.", "Price low enough for impulse ($29–$79) but bundle for higher AOV.", "One email sequence and one landing page can sell for years with occasional updates.", "Products validate ideas that may become services or SaaS later."),
            p("Launch to your existing client list first—they trust you already.", "Use Gumroad or Stripe Payment Links; avoid custom cart projects.", "Update products when tools change; LivingPDF buyers expect editions.", "Lazy launches reuse the same webinar script with new examples."),
        ]),
        ("Micro-SaaS as the lazy endgame", [
            p("Once you deliver the same AI workflow ten times manually, productize it.", "Start with concierge onboarding; automate onboarding later.", "Micro-SaaS churn hurts less when acquisition is content and partner driven.", "Sell small—$3k–$20k ARR exits to lifestyle buyers if you document cleanly."),
            p("Keep code surface area tiny; prefer integrations over features.", "Use support macros and in-app guides to reduce tickets.", "Annual billing improves lazy cash flow.", "See the companion Micro-SaaS guide for fifty idea patterns."),
        ]),
        ("Money models: cash now vs assets later", [
            p("Services fund life and experiments; products and SaaS build saleable assets.", "Allocate profit: fifty percent operations, thirty percent growth, twenty percent asset bets.", "Reinvest in tools that save time, not vanity branding.", "Track net worth quarterly, not just revenue."),
            p("Avoid debt for speculative AI projects at pre-revenue stage.", "Partnership revenue shares can replace hiring for sales-heavy niches.", "Lazy operators say no to custom work that does not fit the menu.", "Wealth is retained earnings plus asset value, not Instagram revenue screenshots."),
        ]),
        ("Risk and ethics without killing momentum", [
            p("Disclose AI use where trust matters; never forge credentials or reviews.", "Contracts should define scope, revision rounds, and data handling.", "Do not scrape or spam; short-term wins create long-term bans and chargebacks.", "Insurance and LLC formation matter once monthly revenue exceeds comfortable thresholds."),
            p("Lazy compliance beats frantic legal cleanup later.", "Keep client data out of public model training when contracts require it.", "Ultimate tier includes a plain-English client agreement template.", "Ethical sales still close—buyers want honesty about what AI does and does not do."),
        ]),
        ("The anti-hustle weekly calendar", [
            p("Monday: sales batch and pipeline review.", "Tuesday–Wednesday: delivery blocks with notifications off.", "Thursday: automation and SOP improvements.", "Friday: finance, referrals, and one learning hour."),
            p("Weekends optional: lazy operators protect recovery to avoid stupid mistakes.", "Say no to meetings without agendas.", "Use async video instead of sync when possible.", "If the calendar fills with calls, pricing is too low or scope too wide."),
        ]),
        ("Compounding: what rich laziness looks like in year two", [
            p("Year one: one offer, ten clients, documented delivery.", "Year two: productized upsells, one VA, first digital product or micro-SaaS beta.", "Revenue per hour worked should rise each quarter.", "If it falls, you accepted wrong clients or skipped automation."),
            p("Build an email list from day one—even B2B buyers read useful newsletters.", "Partnerships multiply reach without content treadmill.", "Sell less often to better buyers as reputation compounds.", "Lazy wealth is quiet, recurring, and boring from the outside."),
        ]),
        ("Failure modes lazy operators avoid", [
            p("Tool hopping every week destroys depth.", "Free work for exposure pays nothing.", "Building in public without selling is a hobby.", "Underpricing to win leads trains bad clients."),
            p("Over-automation before product-market fit hides feedback.", "Ignoring churn reasons repeats mistakes.", "Copying gurus without your ICP wastes ad spend.", "Quit bad niches fast; lazy persistence is for working systems only."),
        ]),
        ("Your 30-day lazy launch plan", [
            p("Week 1: pick lane, publish offer page, list fifty prospects.", "Week 2: ten conversations, two proposals, one pilot.", "Week 3: deliver pilot, collect testimonial, tighten SOP.", "Week 4: raise price ten percent, send ten more outbounds."),
            p("Do not launch a podcast first.", "Do not rebuild the website third time.", "Ship the offer ugly; refine from buyer questions.", "Ultimate worksheet breaks each day into ninety-minute blocks."),
        ]),
        ("Sealed Ultimate resources", [
            p("Full client agreement, proposal templates, and VA hiring pack ship in the Ultimate tier.", "Automation import files for Make and n8n cover reporting, onboarding, and invoice nudges.", "Pricing calculator maps your target income to required clients and hours.", "Update this LivingPDF when your stack changes—we revise with the market."),
        ]),
    ],
))

# 3. claude-freelancer
GUIDES.append(make_guide(
    "claude-freelancer",
    "The Claude Freelancer Playbook: Land Clients on Upwork & Fiverr",
    "AI · Freelance · Living · Ultimate",
    58,
    "Chapter 1 · Profile That Converts",
    [
        ("Why Claude freelancers win on marketplaces now", [
            p("Buyers on Upwork and Fiverr want speed, clarity, and outcomes—not credentials from 2019.", "Claude accelerates research, drafts, and revisions so you deliver faster without cutting quality.", "Freelancers who productize AI-assisted offers beat generalists bidding on vague 'virtual assistant' jobs.", "Your edge is a narrow niche plus a visible process, not the lowest hourly rate."),
            p("Marketplaces reward response time and job success score; AI helps you respond with substance in minutes.", "Never misrepresent work as purely human when buyers ask directly.", "Position as an operator who uses professional tools—like designers use Figma.", "This playbook focuses on ethical positioning that still wins proposals."),
        ]),
        ("Pick a monetizable niche in 48 hours", [
            p("Choose services tied to revenue: landing pages, email sequences, ad copy, SEO briefs, proposal writing.", "Avoid overcrowded 'article writing' unless you verticalize hard—e.g., med spa blog posts only.", "Validate by searching Upwork job feeds for weekly post volume and average budgets.", "If median budgets are under $15/hour, niche deeper or move upmarket."),
            p("Create three sample deliverables in your niche before applying.", "Samples beat certificates for marketplace buyers.", "Ultimate tier includes niche picker worksheet and budget scanner checklist.", "Rename your niche as an outcome: 'Booking-Page Copy for Coaches' not 'Writing'."),
        ]),
        ("Upwork profile architecture that ranks", [
            p("Title: outcome + niche + tool signal, under seventy characters.", "Overview first line states who you help and measurable result—not your life story.", "Portfolio: three projects with problem, approach, outcome, and tools used.", "Skills: match job post tags exactly; add Claude-assisted workflow as a specialty."),
            p("Video introduction optional but lifts trust for high-ticket services.", "Set rate slightly above beginner tier to filter tire-kickers; offer milestone pricing on first jobs.", "Availability badge on during peak buyer hours in your target timezone.", "Refresh profile when you shift niche—stale profiles attract wrong jobs."),
        ]),
        ("Fiverr gig stacking without chaos", [
            p("One account, three gigs maximum at launch—all variants of the same core offer.", "Basic tier: small scope with clear word or page limits.", "Standard: faster delivery plus one revision round structured in the description.", "Premium: strategy call or extra asset—keeps AOV high."),
            p("FAQ answers objections: revisions, AI use, confidentiality, turnaround.", "Gig images show deliverable snippets, not stock robots.", "Request buyer requirements that feed Claude prompts automatically via your intake form.", "Upsell custom offers to repeat buyers outside Fiverr fee on allowed channels per platform rules."),
        ]),
        ("Proposal formula that beats 50 applicants", [
            p("Line 1: mirror their goal in their words from the job post.", "Line 2: one relevant win with number or timeframe.", "Line 3: three-bullet plan for their project specifically.", "Line 4: clarifying question showing you read details.", "Line 5: proposed milestone and start date."),
            p("Keep under 180 words; buyers skim on mobile.", "Attach one tailored sample—not generic portfolio.", "Use Claude to draft, then edit voice to sound human and specific.", "Ultimate tier ships ten proposal templates by job type."),
        ]),
        ("Pricing and milestones that protect margin", [
            p("Never bid hourly on fixed-scope jobs without caps.", "Break projects into discovery, draft, revision, and handoff milestones.", "Charge 30–50% upfront on new relationships.", "Raise rates after five perfect reviews, not before you have proof."),
            p("Track effective hourly rate per project; quit jobs projecting under target.", "Rush fees are standard—publish them.", "Include revision limits in writing to prevent endless tweaks.", "Overdelivery on first job earns reviews; overdelivery forever burns you out."),
        ]),
        ("Delivery workflow: Claude behind the curtain", [
            p("Intake form → Claude research brief → outline approval → draft → human edit → QA checklist → delivery Loom.", "Store prompts per service in a private library.", "Run plagiarism and fact checks on claims; add citations for research-heavy work.", "Brand voice docs from clients improve output faster than ad hoc instructions."),
            p("Deliver in client-preferred format: Google Doc with suggestions, Webflow, or PDF.", "Include a short walkthrough video; reduces revision requests.", "Log time per phase to refine quotes.", "Never send raw Claude output without editing—quality is your brand."),
        ]),
        ("Reviews, JSS, and repeat business", [
            p("Ask for feedback at delivery while experience is fresh.", "Fix issues before requesting public reviews.", "On Upwork, Job Success Score rewards on-time, on-budget completions—decline bad-fit jobs.", "Offer retainers to happy clients: monthly content, email, or landing page updates."),
            p("Retainer revenue stabilizes income better than chasing new jobs.", "Send monthly check-in with one improvement idea—lazy upsell.", "Bad clients: refund small amounts to exit cleanly if needed.", "Protect score; it is your marketplace SEO."),
        ]),
        ("Escaping the race to the bottom", [
            p("Move clients off-platform only when contracts and platform rules allow.", "Build email list from delivery communications where permitted.", "Productize into fixed packages on your site with Stripe.", "Raise prices on new buyers while grandfathering loyal clients briefly."),
            p("Specialization beats generalization within six months.", "Partner with agencies needing white-label capacity.", "Say no to free tests and spec work.", "Your goal is fewer clients paying more, not maximum gig count."),
        ]),
        ("Compliance, confidentiality, and AI disclosure", [
            p("Read platform AI policies quarterly—they change.", "Use business accounts with data controls when client NDAs require.", "Do not feed client secrets into public chats without permission.", "Disclose AI assistance if asked; emphasize human review and accountability."),
            p("Contracts for direct clients clarify IP ownership and revision limits.", "Keep backups of deliverables and approvals.", "Ultimate tier includes freelancer contract snippet and disclosure lines.", "Ethics protect long careers; shortcuts cost accounts."),
        ]),
        ("Tools stack under $100/month", [
            p("Claude Pro or Team, Grammarly optional, Loom, Notion, Calendly, Stripe or PayPal.", "Canva for gig images; Figma for web deliverables.", "Optional: Surfer or Clearscope for SEO gigs.", "Avoid expensive tool stacks before $3k monthly earnings."),
            p("Track ROI per tool monthly.", "Free trials should not auto-renew unnoticed.", "Use password manager for client access.", "Automate invoices and payment reminders."),
        ]),
        ("Weekly operating rhythm", [
            p("Monday: proposals and pipeline.", "Tuesday–Thursday: delivery.", "Friday: admin, reviews, portfolio updates.", "Daily: thirty-minute response window during buyer peak hours."),
            p("Batch similar jobs for prompt reuse.", "Cap concurrent projects to protect deadlines.", "Template client updates to reduce anxiety emails.", "Lazy freelancers schedule deep work blocks."),
        ]),
        ("Scaling without hiring prematurely", [
            p("First hire: editor or VA for formatting and research.", "You keep strategy, client comms, and final QA.", "Document prompts and checklists before delegating.", "Pay per deliverable initially, not hourly ambiguity."),
            p("Agency model optional: you sell, contractors deliver under your SOP.", "Maintain quality spot checks on every deliverable.", "Fire contractors who skip checklists once.", "Scale revenue before scale headcount."),
        ]),
        ("Case patterns that close", [
            p("Coach landing page: 48-hour turnaround, 18% opt-in lift claimed only with client permission.", "Shopify email flow: three emails, $2k project, repeat monthly.", "B2B LinkedIn content: four posts weekly retainer.", "Use anonymized metrics in portfolio when NDAs apply."),
            p("Pattern-match new jobs to past wins in proposals.", "Screenshots of client praise in portfolio.", "Before/after copy swaps beat abstract claims.", "Ultimate tier includes case study layout templates."),
        ]),
        ("When to leave marketplaces entirely", [
            p("Signals: 60%+ income from direct clients, waitlist, referrals.", "Build simple site with three packages and booking link.", "Keep marketplace for overflow or proof only.", "Direct clients pay more and respect boundaries better."),
            p("Transition over three months; do not burn bridges.", "Export testimonials and case studies first.", "Email list is the escape hatch.", "Marketplaces were training wheels, not the destination."),
        ]),
        ("90-day launch checklist", [
            p("Days 1–14: niche, samples, profile live.", "Days 15–45: fifty proposals, five jobs, five stars.", "Days 46–90: raise rates, pitch retainers, one direct client.", "Track metrics weekly in a simple spreadsheet."),
            p("Adjust niche if reply rate under ten percent after fifty tailored proposals.", "Do not change niche weekly—give data time.", "Ultimate worksheet maps daily actions.", "Consistency beats talent on marketplaces."),
        ]),
    ],
))

# 4. ai-automation-agency
GUIDES.append(make_guide(
    "ai-automation-agency",
    "Start an AI Automation Agency With n8n, Make & Claude",
    "AI · Automation · Living · Ultimate",
    64,
    "Chapter 1 · Agency Model Basics",
    [
        ("What an AI automation agency actually sells", [
            p("You sell time back and error reduction—not 'AI' or 'zapier lines'.", "Buyers are ops managers, agency owners, and founders drowning in manual handoffs between tools.", "Deliverables are working scenarios, documentation, monitoring, and training—not slide decks.", "Recurring maintenance retainers often exceed build fees within six months."),
            p("Position as implementation partner, not chatbot reseller.", "Start with one vertical where you understand the workflow: ecommerce, agencies, clinics, or property.", "Case studies use hours saved and failure rates, not model names.", "This model fits operators who like systems more than creative writing."),
        ]),
        ("Choosing n8n vs Make vs Zapier", [
            p("Make: fastest visual builds, great for SMB marketing stacks.", "n8n: self-host option, complex branching, developer-friendly.", "Zapier: buyer name recognition, higher per-task cost, easy approvals in enterprises.", "Pick one primary; learn second later to fit client IT constraints."),
            p("Claude drafts scenario logic and error handling checklists.", "Always prototype with sandbox credentials.", "Document which platform each client uses in your CRM.", "Ultimate tier includes platform decision tree and migration notes."),
        ]),
        ("Packaged offers that sell in discovery calls", [
            p("Automation Audit: map stack, find ten hours/month savings, fixed fee $500–$1500.", "Quick Win Build: one high-impact flow in two weeks, $1500–$3500.", "Ops Transformation: five flows plus training, $8k–$25k.", "Maintenance: $500–$2000/month for monitoring and tweaks."),
            p("Never open-ended hourly without cap.", "Sell outcomes: 'Abandoned cart SMS within five minutes' not 'Make scenario'.", "Bundle training call in every build.", "Record Loom library for client admins."),
        ]),
        ("Discovery: the workflow interview", [
            p("Ask: trigger, steps, tools, exceptions, volume, and who owns maintenance.", "Shadow one employee for an hour if allowed—gold for accurate builds.", "Quantify current time and error cost.", "Identify manual steps that require judgment vs pure transfer."),
            p("Only automate stable processes; flag broken SOPs first.", "Claude transcribes call notes into build specs.", "Send written spec for sign-off before build starts.", "Scope creep dies at the spec."),
        ]),
        ("Architecture patterns that survive production", [
            p("Idempotent triggers: handle duplicate webhooks gracefully.", "Error branches notify Slack and email with payload snippets.", "Dead letter queues or retry with backoff for API limits.", "Secrets in environment variables, never hardcoded in nodes."),
            p("Log run IDs for support tickets.", "Version scenarios before edits.", "Staging vs production workspaces when client budget allows.", "Ultimate sealed chapter includes error handler templates for each platform."),
        ]),
        ("Claude in the build process", [
            p("Generate node mappings from plain-English specs.", "Draft JSON for HTTP nodes and regex parsers.", "Write client-facing SOPs from scenario exports.", "Summarize API docs when integrating obscure tools."),
            p("Human tests every path including failure.", "Do not trust generated regex without sample data validation.", "Keep prompt library per integration.", "Claude speeds build; you own reliability."),
        ]),
        ("High-demand automation recipes", [
            p("Lead routing: form → CRM → Slack → assign → calendar.", "Invoice chase: overdue Stripe → personalized email sequence → task for AR.", "Content pipeline: Notion approval → schedule → analytics digest.", "Support triage: ticket tags → priority queue → draft reply for agent."),
            p("Sell recipes vertically customized.", "Reuse core patterns; customize field maps per client.", "Track build time per recipe to refine pricing.", "Publish anonymized flow diagrams in marketing."),
        ]),
        ("Security and data handling", [
            p("Minimize PII in logs and AI prompts.", "Use OAuth over API keys when available.", "Document data retention and deletion on offboarding.", "Enterprise clients may require DPA and subprocessor list."),
            p("Never paste production customer lists into public models.", "Role-based access in client tools.", "Annual security review of your own stack.", "Compliance wins enterprise retainers."),
        ]),
        ("Pricing builds and retainers profitably", [
            p("Target 50%+ gross margin on builds: estimate hours × internal rate × 2–3 markup.", "Maintenance priced at 15–25% of build fee monthly minimum.", "Charge for emergency fixes outside SLA.", "Discovery credited toward build when they proceed."),
            p("Track scope changes with change orders.", "Deposits before work starts.", "Fire clients who bypass process repeatedly.", "Profit funds better monitoring tools."),
        ]),
        ("Delivery and handoff that reduces support pain", [
            p("Deliver: live scenario, Loom walkthrough, written SOP, error playbook, contact sheet.", "Train two client admins, not just the champion.", "Thirty-day hypercare included; then retainer.", "Tag your agency in case study if allowed."),
            p("Handoff checklist signed by client.", "Export backups to client-owned accounts.", "Set expectations on API changes breaking flows.", "Proactive monitoring prevents angry emails."),
        ]),
        ("Sales without cold-calling strangers daily", [
            p("Partner with CRM consultants, web agencies, and bookkeepers serving same ICP.", "Offer rev share on referrals.", "Speak at niche Slack communities with live teardown of one workflow.", "LinkedIn posts showing before/after stack diagrams."),
            p("One partner sending three clients beats cold outreach grind.", "Case study PDF for leave-behind.", "Do not discount first project below margin to 'get logo'.", "Logo only matters if testimonial follows."),
        ]),
        ("Hiring and subcontracting", [
            p("First subcontractor: senior Make/n8n builder under your QA.", "You keep discovery, client comms, architecture.", "Pay per delivered scenario with test criteria.", "Build bench before you are at capacity."),
            p("Internal wiki of integrations and quirks.", "Weekly scenario review meeting.", "Never let subs talk to clients without you until proven.", "Scale builds, not meetings."),
        ]),
        ("Monitoring and SLAs", [
            p("Uptime monitors on critical zaps with SMS alert.", "Weekly run count dashboard.", "Monthly report: successes, failures, time saved estimate.", "SLA tiers: 24h vs 4h response on retainer level."),
            p("Failures are retention opportunities when handled fast.", "Root cause notes prevent repeat issues.", "Charge for new integrations outside retainer scope.", "Transparency builds trust."),
        ]),
        ("Productizing into vertical kits", [
            p("Package 'Agency Lead Router' or 'Clinic Intake Automation' as fixed SKUs.", "Faster sales, predictable delivery.", "Customize 20%, reuse 80%.", "Eventually micro-SaaS if clients want self-serve."),
            p("Vertical kits become your marketing moat.", "Update kits when APIs change—LivingPDF editions help here.", "Ultimate tier includes three full kit specs.", "Productization is how agencies become lazy-rich."),
        ]),
        ("Legal and contracts", [
            p("MSA covers IP, confidentiality, limitation of liability, and API third-party risk.", "Statement of work per project with acceptance criteria.", "Client responsible for tool subscriptions unless you resell.", "Clarify you are not legal/compliance advisor for regulated flows."),
            p("Ultimate template pack included.", "Insurance when revenue supports.", "Offboard cleanly with credential revocation checklist.", "Professional ops attract professional clients."),
        ]),
        ("First 90 days: zero to three retainer clients", [
            p("Month 1: pick vertical, build three demo flows, ten partner conversations.", "Month 2: two paid audits, one quick win build.", "Month 3: convert one to retainer, document everything.", "Revenue goal realistic: $8k–$15k closed in ninety days for focused operators—not guaranteed."),
            p("Reinvest in monitoring and templates.", "Say no to unrelated builds.", "Ask every happy client for two referrals.", "Agency success is retention, not logo count."),
        ]),
    ],
))

# 5. ai-seo
GUIDES.append(make_guide(
    "ai-seo",
    "AI SEO for Google, ChatGPT & Perplexity",
    "AI · SEO · Living · Ultimate",
    72,
    "Chapter 1 · Search in the AI Era",
    [
        ("How search split into three channels", [
            p("Classic Google SEO still drives commercial intent traffic for most niches.", "AI answer engines—ChatGPT, Perplexity, Gemini—surface brands cited in authoritative content.", "Social and video act as discovery layers feeding branded search.", "Winning strategy covers all three without copying the same page everywhere."),
            p("AI SEO is not tricks; it is clarity, structure, citations, and entity consistency.", "Google's helpful content standards and AI Overviews reward genuine expertise.", "Track referrals from AI tools in analytics where UTM patterns allow.", "This guide avoids guaranteed ranking claims."),
        ]),
        ("Entity and brand foundation", [
            p("Consistent NAP, about pages, founder bios, and schema markup build trust signals.", "Create a canonical facts sheet: what you do, for whom, pricing range, locations, credentials.", "LLMs ingest public web; contradictions across profiles confuse models and humans.", "Link out to primary sources; cite statistics with dates."),
            p("Register brand on relevant directories without spam.", "Use Organization and FAQ schema where appropriate.", "Ultimate tier includes entity audit checklist.", "Brand search volume is a lagging indicator of marketing success."),
        ]),
        ("Keyword strategy with AI assistants", [
            p("Use Claude to cluster keywords by intent: informational, commercial, transactional.", "Prioritize topics where you can add original insight—not rewrites of page one.", "Map one primary intent per URL; avoid cannibalization.", "Include question variants people ask AI assistants aloud."),
            p("Search volume tools still matter; AI expands long-tail discovery.", "Build topical clusters with hub and spoke architecture.", "Refresh declining pages before creating new ones.", "Track rank and click-through monthly."),
        ]),
        ("Content briefs that humans and models trust", [
            p("Brief includes: intent, audience, angle, outline, sources to cite, internal links, CTA.", "Require primary research, examples, or data—not generic filler.", "Add 'proof elements': screenshots, quotes, mini case studies.", "Claude drafts briefs; strategist approves before writing."),
            p("Word count follows intent, not arbitrary targets.", "Medical, legal, financial content needs expert review.", "Ultimate tier ships brief templates for ten verticals.", "Brief quality predicts publish quality."),
        ]),
        ("Writing for Google helpful content", [
            p("Lead with answer-first summaries for busy readers.", "Use descriptive headings, short paragraphs, and tables for comparisons.", "Update publish and modified dates when materially refreshed.", "Avoid scaled low-value pages targeting zip codes without local proof."),
            p("E-E-A-T: show experience with real projects and author bios.", "Disclose AI assistance if your editorial policy requires.", "Human edit every draft for voice and accuracy.", "Remove pages that never earned impressions after twelve months."),
        ]),
        ("Optimizing for AI citations (GEO basics)", [
            p("Clear definitions and concise bullet answers increase extractability.", "Statistics with named sources get cited more often in AI summaries.", "Build pages that answer 'best X for Y' with criteria, not affiliate fluff alone.", "Digital PR and reputable mentions feed authority to models indirectly."),
            p("Monitor brand mentions in Perplexity and ChatGPT manually monthly.", "Publish original research, surveys, or tools when possible.", "Structured data helps parsers; plain language helps models.", "No one controls exact AI answers—optimize probability of inclusion."),
        ]),
        ("Technical SEO non-negotiables", [
            p("Core Web Vitals, mobile usability, clean indexation, XML sitemap, robots sanity.", "Fix broken internal links and redirect chains.", "Canonical tags on duplicate paths.", "Log file review quarterly on large sites."),
            p("JavaScript rendering issues still hurt; test fetch and render.", "Use hreflang only when you truly localize.", "Claude helps interpret Screaming Frog exports.", "Technical debt blocks content ROI."),
        ]),
        ("Internal linking and site architecture", [
            p("Hub pages link to spokes with descriptive anchors.", "Automate suggestions with rules, not random plugins.", "Breadcrumbs and HTML sitemap for humans.", "Limit depth to important money pages."),
            p("Orphan pages get no love from Google or editors.", "Refresh anchor text when titles change.", "AI can suggest links; human verifies relevance.", "Architecture reflects business priorities."),
        ]),
        ("Link building without spam", [
            p("Digital PR, guest expertise, partnerships, and tools earn links.", "Avoid paid link schemes that risk manual actions.", "Harbor outreach templates personalized per journalist.", "Local sponsorships and trade associations work for service businesses."),
            p("Track link quality over quantity.", "Reclaim unlinked brand mentions.", "Ultimate tier includes outreach scripts.", "Links support authority; content supports relevance."),
        ]),
        ("Local SEO and service businesses", [
            p("Google Business Profile completeness, categories, services, photos, reviews.", "Location pages only where you truly serve; unique content each.", "Review generation ethics: ask happy customers, never fake.", "Local schema and embedded maps where helpful."),
            p("Respond to reviews professionally.", "Track local pack rankings and call clicks.", "AI chat may pull local data from aggregators—keep them consistent.", "Local still prints money for trades."),
        ]),
        ("Ecommerce SEO specifics", [
            p("Faceted navigation control, unique product descriptions, review content.", "Category pages carry commercial intent; products carry transactional.", "Avoid thin duplicate manufacturer copy.", "Structured product data for rich results where eligible."),
            p("Content guides support categories without keyword stuffing.", "Monitor out-of-stock and discontinued URL handling.", "AI assists variant descriptions at scale with human QA.", "Speed and trust badges affect conversion, not just rank."),
        ]),
        ("Measurement and reporting", [
            p("Dashboard: organic sessions, conversions, rank clusters, index coverage, Core Web Vitals.", "Separate brand vs non-brand.", "Track assisted conversions in multi-touch models when possible.", "Report insights and actions, not vanity metrics alone."),
            p("Claude drafts client narratives from Looker or GA4 exports.", "Set expectations on algorithm volatility.", "Monthly test one hypothesis.", "SEO is compounding, not weekly lottery."),
        ]),
        ("AI-assisted workflows for agencies", [
            p("Brief → draft → edit → QA → publish → internal link → monitor.", "Editors enforce style guide; AI does not.", "Charge retainers by page tier and vertical difficulty.", "Productize audits as entry offer."),
            p("Capacity planning: pages per editor per week.", "Margin comes from process, not cheaper writers alone.", "White-label reporting templates save hours.", "Agency differentiation is strategy and proof."),
        ]),
        ("Avoiding penalties and brand damage", [
            p("No cloaking, hidden text, or scaled doorway pages.", "Disclose sponsored content.", "YMYL topics demand higher scrutiny.", "Recoveries take months—prevention cheaper."),
            p("Keep changelog of major site changes.", "Backup before migrations.", "Ultimate tier includes pre-launch SEO QA list.", "Short-term hacks long-term pain."),
        ]),
        ("Future-proofing your SEO practice", [
            p("Learn analytics, CRO, and content strategy—not just keywords.", "Build email and community so algorithm shifts hurt less.", "Test AI referral traffic quarterly.", "Update skills as search interfaces change."),
            p("LivingPDF editions track platform shifts.", "Clients pay for adaptability.", "Operators who merge SEO with business outcomes retain accounts.", "Your job is visible demand, not rank trophies."),
        ]),
        ("90-day execution roadmap", [
            p("Days 1–30: audit, quick technical fixes, priority briefs.", "Days 31–60: publish cluster one, internal links, outreach start.", "Days 61–90: refresh underperformers, report wins, plan cluster two.", "Adjust based on data, not hype threads."),
            p("One vertical case study beats ten generic tips.", "Ultimate worksheets cover weekly tasks.", "Consistency outlasts algorithm panic.", "Ship improvements weekly."),
        ]),
    ],
))

# 6. ai-email-agency
GUIDES.append(make_guide(
    "ai-email-agency",
    "The AI Email Marketing Agency Blueprint",
    "AI · Email · Living · Ultimate",
    56,
    "Chapter 1 · Agency Positioning",
    [
        ("Why email agencies still print cash", [
            p("Email drives highest ROI among owned channels when lists are healthy and offers fit.", "Brands pay retainers because email is recurring, measurable, and tied directly to revenue.", "AI accelerates copy variants, subject lines, and segmentation ideas—not strategy or brand judgment.", "Small agencies with tight processes beat bloated firms on speed and price for SMB clients."),
            p("You sell revenue reliability, not 'newsletters'.", "Pick B2C ecommerce, info products, or B2B SaaS—not all three at launch.", "Case studies show lift in click rate, revenue per send, or recovery flows.", "This blueprint assumes you will human-edit every send."),
        ]),
        ("Ideal client profile and red flags", [
            p("Good fit: $500k–$10M revenue, existing list 5k+, product-market fit, willing to approve fast.", "Red flags: no list, illegal offers, endless stakeholders, refusal to share metrics.", "Charge setup fee when migrating ESP or cleaning list.", "Fire clients who blame email for broken offers."),
            p("Ultimate tier includes ICP scorecard and discovery call script.", "Vertical focus simplifies template reuse.", "Ask for Klaviyo or Shopify access in discovery.", "Without data access, you fly blind."),
        ]),
        ("Offer stack: audit, flows, campaigns, retainers", [
            p("Audit: deliverability, flow gaps, segment health, $750–$2500.", "Flow build: welcome, cart, browse, post-purchase, winback.", "Campaign calendar: 4–8 sends monthly.", "Retainer bundles flows maintenance plus campaigns."),
            p("Price retainers $1500–$8000 based on list size and send volume.", "Scope revisions and approval SLAs in contract.", "Upsell SMS later; master email first.", "Clear packages reduce sales friction."),
        ]),
        ("ESP mastery: Klaviyo-first playbook", [
            p("Klaviyo dominates ecommerce; learn segments, flows, campaigns, benchmarks.", "Deliverability basics: authentication, list hygiene, sunset policies.", "Use native integrations before custom code.", "Clone best-practice flows then customize copy and timing."),
            p("Document naming conventions for segments and flows.", "Test on real accounts, not sandbox only.", "Alternative: ActiveCampaign for B2B, HubSpot for larger sales-led.", "Pick primary ESP per vertical."),
        ]),
        ("Claude workflows for copy at scale", [
            p("Brand voice doc: tone, banned words, example emails, product naming rules.", "Prompt per email type: promo, story, educational, transactional.", "Generate three subject lines and preheaders per send.", "Human selects and edits; never bulk-send raw output."),
            p("Store winning emails as few-shot examples in prompts.", "Compliance review for claims, discounts, and regulated products.", "Ultimate tier includes prompt library and QA checklist.", "Speed without voice consistency churns clients."),
        ]),
        ("Flow architecture that recovers revenue", [
            p("Welcome series: social proof, education, first purchase incentive—not all discounts.", "Abandoned cart: three touches with objection handling.", "Post-purchase: cross-sell, review ask, replenishment timing.", "Winback before sunset on inactive profiles."),
            p("Measure flow revenue in ESP attribution.", "A/B test one variable at a time.", "Do not over-mail; frequency caps matter.", "Flows work while you sleep—build them first."),
        ]),
        ("Campaign calendar rhythm", [
            p("Monthly themes aligned to product launches, seasons, and content.", "Mix promo, value, and community emails.", "Brief each send: goal, segment, CTA, proof points.", "Batch production weekly; schedule ahead."),
            p("Hold back inventory for flash needs.", "Coordinate with paid social to avoid message conflict.", "Report campaign ROI in weekly snapshot.", "Predictable calendar reduces client anxiety."),
        ]),
        ("Segmentation that beats batch-and-blast", [
            p("RFM for ecommerce: recency, frequency, monetary.", "Engagement tiers: 30/60/90 day opens and clicks.", "VIP and at-risk segments get different offers.", "Suppress non-engaged before big sends."),
            p("Claude suggests segment names and rules; you validate in ESP.", "Smaller relevant sends beat huge irrelevant blasts.", "Sunset unengaged to protect deliverability.", "Segmentation is where retainers prove value."),
        ]),
        ("Design and dev without bottlenecks", [
            p("Use proven modular blocks in ESP; custom HTML only when needed.", "Mobile-first preview mandatory.", "Image alt text and plain-text versions for accessibility.", "Link and coupon QA checklist before schedule."),
            p("Template library per vertical speeds production.", "Canva for quick graphics; brand kits from clients.", "Do not chase animated gimmicks that hurt load time.", "Simple emails often win."),
        ]),
        ("Deliverability operations", [
            p("Monitor bounce, spam complaint, and unsubscribe rates weekly.", "Authenticate SPF, DKIM, DMARC.", "Warm new domains and IPs carefully.", "Never buy lists."),
            p("Deliverability crises need immediate send pauses and root cause.", "Partner with deliverability consultant for enterprise.", "Document list growth sources.", "Inbox placement is foundation."),
        ]),
        ("Reporting clients understand", [
            p("Weekly: sends, revenue attributed, flow performance, list growth.", "Monthly: trends, tests learned, next month plan.", "Use charts sparingly; lead with sentences.", "Claude drafts narrative from ESP exports."),
            p("Tie email to business goals, not open rate alone.", "Set benchmarks by vertical.", "Bad weeks happen—explain context.", "Transparency retains retainers."),
        ]),
        ("Sales and retention", [
            p("Lead with audit or flow teardown Loom for prospects.", "Case studies with permissioned numbers.", "Ask for quarterly business reviews.", "Raise retainer when list or revenue grows."),
            p("Churn signals: slow approvals, blame culture, metric hiding.", "Save at-risk accounts with test plans.", "Referrals from Shopify partners and CMO communities.", "Retention beats new sales cost."),
        ]),
        ("Team and delegation", [
            p("Roles: strategist (you), copy editor, ESP tech, designer part-time.", "SOPs for every flow and campaign type.", "QA second pair of eyes on links and segments.", "Hire when utilization sustained above eighty percent."),
            p("Offshore editors work with strong voice docs.", "Never delegate strategy day one.", "Ultimate tier includes role RACI matrix.", "Agency scale is process."),
        ]),
        ("Compliance and consent", [
            p("CAN-SPAM, GDPR, CASL basics in every contract.", "Clear unsubscribe and physical address.", "Consent records for EU subscribers.", "Honest subject lines."),
            p("Regulated industries need legal review.", "Ultimate includes compliance checklist.", "Violations kill agencies fast.", "Ethical list growth only."),
        ]),
        ("First 60 days launch plan", [
            p("Weeks 1–2: niche, samples, one free teardown for portfolio.", "Weeks 3–6: two paid audits, one flow build.", "Weeks 7–8: convert to retainer, refine SOP.", "Target one to three retainer clients—not guaranteed income."),
            p("Document every build.", "Productize audit deck.", "Partner with ecommerce dev shops.", "Email agency success is measured in client LTV."),
        ]),
    ],
))

# 7. landing-pages-48h
GUIDES.append(make_guide(
    "landing-pages-48h",
    "Done-for-You Landing Pages With Claude in 48 Hours",
    "AI · Web · Living · Ultimate",
    48,
    "Chapter 1 · The 48-Hour Offer",
    [
        ("Productized landing pages as a cash offer", [
            p("Businesses pay $800–$3500 for a focused page that converts—not a six-week website project.", "Forty-eight hours forces scope discipline: one offer, one CTA, one audience.", "Claude accelerates copy, wireframe notes, and component code; you provide taste and QA.", "Repeatable process beats custom agency theater for SMB buyers."),
            p("Sell on speed, clarity, and conversion structure—not unlimited revisions.", "This offer pairs with ads, launches, and lead magnets.", "Clear intake prevents scope creep.", "Ultimate tier includes intake form and contract templates."),
        ]),
        ("Intake that feeds Claude and design", [
            p("Collect: offer, audience, proof, objections, brand assets, competitor URLs, CTA destination.", "Ask for one primary metric: opt-in, call booking, or purchase.", "Deadline for client inputs: six hours after payment or clock pauses.", "Missing assets trigger stock layout defaults documented upfront."),
            p("Claude summarizes intake into creative brief.", "Client approves brief before build starts.", "Change requests after build begin bill hourly.", "Good intake is half the battle."),
        ]),
        ("Hour-by-hour production timeline", [
            p("Hours 0–4: brief, outline, wireframe in Figma or paper.", "Hours 4–12: copy draft, hero, sections, FAQ, footer legal.", "Hours 12–24: build in Webflow, Framer, or HTML/Tailwind.", "Hours 24–36: mobile QA, speed check, form test.", "Hours 36–48: client review, one revision round, launch."),
            p("Parallelize copy and build when using component libraries.", "Never skip form and analytics testing.", "Buffer two hours for DNS or embed issues.", "Ultimate tier includes minute-by-minute checklist."),
        ]),
        ("Copy frameworks that convert", [
            p("Hero: outcome headline, subhead clarifying who it's for, primary CTA, trust strip.", "Problem-agitate-solve for body sections.", "Proof: testimonials, logos, numbers with permission.", "FAQ handles top three objections."),
            p("Claude drafts; you tighten for specificity.", "Avoid vague 'transform your business' headlines.", "One CTA above fold; secondary CTA optional below.", "Read copy aloud before ship."),
        ]),
        ("Design system for speed", [
            p("Three hero layouts, two pricing blocks, one testimonial grid—reuse across clients.", "Mercury-clean or client brand tokens if supplied.", "Inter or client font; high contrast; accessible focus states.", "No custom illustration unless pre-negotiated."),
            p("Component library in Webflow or React saves hours.", "Dark mode optional, not default.", "Mobile-first spacing scale.", "Consistency looks professional fast."),
        ]),
        ("Building with Claude Code and static stacks", [
            p("Claude generates semantic HTML/Tailwind sections from approved copy.", "Split into components: hero, features, social proof, CTA, FAQ.", "Validate HTML, run Lighthouse, fix accessibility issues.", "Deploy to Cloudflare Pages or client host."),
            p("Keep JS minimal: analytics, form handler, smooth scroll optional.", "No heavy frameworks for single pages.", "Version in Git for rollback.", "Handoff includes repo or Webflow duplicate."),
        ]),
        ("Forms, tracking, and compliance", [
            p("Connect Formspree, Tally, or native CRM embed.", "Test submission to client inbox and CRM.", "GA4 or Plausible events on CTA clicks.", "Cookie notice if EU traffic expected."),
            p("Privacy link and terms stub required.", "GDPR consent on forms when needed.", "Document what data is collected.", "Broken forms destroy trust instantly."),
        ]),
        ("Speed and Core Web Vitals", [
            p("Optimize images: WebP, correct dimensions, lazy below fold.", "Minimize third-party scripts.", "Target LCP under 2.5s on mobile.", "Use CDN default on modern hosts."),
            p("Claude suggests perf fixes from Lighthouse JSON.", "Do not ship 5MB hero videos by default.", "Speed is part of conversion.", "Clients feel quality in load time."),
        ]),
        ("Revision policy and upsells", [
            p("One consolidated revision round within forty-eight hours of draft delivery.", "Additional rounds: packaged or hourly.", "Upsell: thank-you page, A/B variant, email welcome sequence.", "Maintenance retainer for copy swaps monthly."),
            p("Upsells at delivery when client is happiest.", "Document upsell menu on invoice.", "Never unlimited revisions.", "Margins live in boundaries."),
        ]),
        ("Pricing tiers", [
            p("Starter: template-heavy, $800–$1200, 48h.", "Standard: custom sections, $1500–$2200.", "Premium: strategy call, A/B hero, $2500–$3500.", "Rush fee for 24h when slot available."),
            p("Deposit fifty percent; balance before DNS swap.", "Charge more for regulated copy review needs.", "Raise prices after ten ships.", "Price on value to their launch, not your hours."),
        ]),
        ("Sales channels", [
            p("Twitter/LinkedIn before-after posts.", "Partner with ad agencies needing fast LPs.", "Upwork/Fiverr for volume, direct for margin.", "Productized page on your site with Stripe checkout."),
            p("Show turnaround clock in marketing.", "Video walkthrough of sample page.", "Collect three video testimonials fast.", "Speed is your hook."),
        ]),
        ("Quality checklist before handoff", [
            p("Links, forms, mobile, accessibility, meta tags, OG image, favicon, 404 not applicable.", "Spellcheck and brand name consistency.", "Client admin access documented.", "Loom walkthrough recorded."),
            p("Ultimate tier includes printable QA PDF.", "Screenshot archive for portfolio.", "Ask permission for case study.", "Checklist prevents refunds."),
        ]),
        ("Common failure modes", [
            p("Bad intake, missing logos, client ghosting mid-build.", "Scope creep on 'small tweaks'.", "Hosting access delays.", "Fix with contracts and pauses."),
            p("Never start without payment and brief approval.", "Fire nightmare clients early.", "Template fallback when assets missing.", "Process protects sanity."),
        ]),
        ("Scaling to small team", [
            p("Copy specialist plus builder plus QA reviewer.", "You sell and final approve.", "Same 48h clock with staggered slots.", "Max concurrent projects = team size minus one buffer."),
            p("SOP videos for each role.", "Shared component library.", "Agency becomes machine.", "Productized offers scale humans."),
        ]),
        ("30-day launch to first ten pages", [
            p("Week 1: build three portfolio samples in niches you target.", "Week 2: publish offer, outreach to fifty prospects.", "Week 3: close three, ship three, collect proof.", "Week 4: raise price ten percent, add one partner channel."),
            p("Track effective hourly rate.", "Kill niches with slow payers.", "LivingPDF updates with new stack tricks.", "Ship beats perfect."),
        ]),
    ],
))

# 8. ai-lead-gen
GUIDES.append(make_guide(
    "ai-lead-gen",
    "AI Lead Generation Systems That Book Sales Calls",
    "AI · Leads · Living · Ultimate",
    60,
    "Chapter 1 · Systems Not Spam",
    [
        ("Define a lead gen system", [
            p("A system is trigger → enrichment → personalized outreach → booking → nurture → measurement.", "Random cold blasts are not systems; they burn domains and reputation.", "AI assists research, copy, and scoring—not bypassing consent laws.", "Goal is qualified calls on calendar, not vanity reply rates."),
            p("B2B service businesses and high-ticket coaches fit best.", "Productize for one ICP before expanding.", "Track cost per booked call and close rate.", "Ultimate tier includes system diagram worksheet."),
        ]),
        ("ICP and offer-market fit", [
            p("Document firmographics, triggers, pain, budget, and decision maker.", "Offer must solve expensive problem: revenue, cost, risk, time.", "If close rate under fifteen percent, fix offer or ICP before more volume.", "Interview five recent buyers to extract language."),
            p("Claude synthesizes call notes into messaging doc.", "Avoid targeting 'everyone with a website'.", "Vertical focus improves reply quality.", "Tight ICP beats huge lists."),
        ]),
        ("Data sources and enrichment", [
            p("Use Apollo, Clay, LinkedIn Sales Nav, or niche directories ethically.", "Enrich with tech stack, hiring signals, funding, content topics.", "Verify emails; bounce rates kill deliverability.", "Do not scrape against platform ToS."),
            p("Build lists in tiers: dream, fit, experiment.", "Refresh data quarterly; people change jobs.", "Ultimate includes enrichment prompt templates.", "Garbage in, garbage out."),
        ]),
        ("Scoring leads with AI", [
            p("Score on fit, intent, and reachability.", "Claude reads company site and recent news for one-line relevance.", "Auto-skip industries you cannot serve.", "Human reviews top tier before send."),
            p("Scoring reduces wasted sends.", "Log why leads qualified or disqualified.", "Improve model rules weekly.", "Quality lists shrink but convert."),
        ]),
        ("Outbound channels that still work", [
            p("Email primary for scale; LinkedIn for high-touch; calls for hot inbound.", "Multi-touch sequences over fourteen days.", "Each touch adds value: insight, audit, case snippet—not 'just checking in'.", "Warm calls booked via clear CTA link."),
            p("One channel mastered before adding others.", "Domain warmup for new email infrastructure.", "LinkedIn manual sends only—no banned automation.", "Compliance first."),
        ]),
        ("Copy that earns replies", [
            p("Subject: specific to them, under seven words when possible.", "Opening: observation about their business.", "Body: problem hypothesis, micro proof, low-friction CTA.", "Ask one question or offer one useful asset."),
            p("Claude drafts variants; you personalize first line manually.", "Never fake mutual connections or meetings.", "A/B test subjects on small batches.", "Reply handling SOP within two hours."),
        ]),
        ("Booking infrastructure", [
            p("Calendly or Cal.com with qualifying questions.", "Round-robin for teams.", "SMS reminder reduces no-shows.", "CRM stage updates on book."),
            p("Hide calendar link until reply interest.", "Two time options in email sometimes beat link.", "Track show rate, not just books.", "No-show follow-up sequence."),
        ]),
        ("Inbound magnets and AI-assisted content", [
            p("Audit, calculator, or checklist lead magnets aligned to ICP.", "Landing page plus thank-you book CTA.", "Claude helps draft magnet and follow-up emails.", "Retarget site visitors with ethical pixels."),
            p("Magnets feed outbound retargeting.", "Quality magnet beats generic ebook.", "Promote in niche communities without spam.", "Measure magnet-to-call conversion."),
        ]),
        ("Nurture for not-yet-ready leads", [
            p("Monthly value email for non-responders who opted in.", "Case studies and teardown content.", "Stop after sunset period.", "Re-engage campaigns quarterly."),
            p("Nurture protects long sales cycles.", "Segment by objection from replies.", "Claude drafts newsletter; you add original insight.", "Do not nurture people who unsubscribed."),
        ]),
        ("Handoff to sales", [
            p("SDR qualifies on book; AE takes qualified.", "Brief card: company, pain, assets viewed, personalization notes.", "Recording optional with consent.", "SLA: contact within five minutes for inbound hot leads."),
            p("Bad handoff wastes gen spend.", "Feedback loop from sales to gen weekly.", "Disqualify criteria documented.", "RevOps mindset for small teams."),
        ]),
        ("Metrics dashboard", [
            p("Emails sent, deliverability, reply rate, positive reply rate, meetings booked, show rate, pipeline, closed won.", "Cost per meeting and CAC payback.", "Channel comparison monthly.", "Kill sequences that underperform median."),
            p("Claude narrates weekly report.", "Share wins with team.", "Avoid optimizing reply rate alone—optimize revenue.", "Data beats gut."),
        ]),
        ("Compliance and reputation", [
            p("CAN-SPAM, GDPR, CASL compliance.", "One-click unsubscribe.", "Honor do-not-contact immediately.", "Rotate domains responsibly; never spoof."),
            p("Ultimate includes compliance checklist.", "Legal for regulated industries.", "Reputation takes years to rebuild.", "Ethical gen compounds."),
        ]),
        ("Tool stack", [
            p("CRM: HubSpot or Pipedrive.", "Sequencing: Instantly, Smartlead, or Apollo sequences.", "Enrichment: Clay workflows.", "Claude for research and copy drafting."),
            p("Keep stack under few tools.", "Integrate before adding new shiny app.", "Document API keys securely.", "Automate reporting last."),
        ]),
        ("Building productized lead gen for clients", [
            p("Sell packaged '500 touches/month plus booking infra setup'.", "Charge setup plus monthly management.", "Report meetings booked transparently.", "Do not guarantee closed deals."),
            p("White-label for agencies with your SOP.", "Case studies require client permission.", "Raise prices when show rates prove out.", "Client success is your retention."),
        ]),
        ("90-day implementation plan", [
            p("Month 1: ICP, list build, sequence v1, booking flow.", "Month 2: send, measure, iterate copy and scoring.", "Month 3: add inbound magnet, nurture, hire VA for research.", "Targets vary—focus on learning speed."),
            p("Ultimate worksheets break weekly tasks.", "One vertical, one offer, one sequence first.", "Scale volume only after positive reply rate healthy.", "Systems beat heroics."),
        ]),
    ],
))

# 9. claude-code-operators
GUIDES.append(make_guide(
    "claude-code-operators",
    "Claude Code for Operators Who Bill Clients (Not Developers)",
    "AI · Delivery · Living · Ultimate",
    62,
    "Chapter 1 · Operator Mindset",
    [
        ("Who this guide is for", [
            p("You sell landing pages, automations, dashboards, or retainers—but you are not a career software engineer.", "Claude Code lets you ship client work by describing outcomes and reviewing diffs.", "Your value is client communication, scope control, and quality bar—not typing syntax from memory.", "This guide teaches billing-safe workflows, not computer science degrees."),
            p("Developers may use these patterns too; focus here is speed to invoice.", "Always test before handoff.", "Never bill for work you cannot maintain lightly.", "Ultimate tier includes client-safe prompt packs."),
        ]),
        ("Setup: repo, Claude Code, and guardrails", [
            p("One Git repo per client project or monorepo with client folders.", "Use .env for secrets; never commit keys.", "Branch per feature; main stays deployable.", "Claude Code reads project context from CLAUDE.md you maintain."),
            p("CLAUDE.md states stack, deploy command, style rules, and off-limits files.", "Run locally before push.", "Backup client sites before big edits.", "Guardrails prevent expensive mistakes."),
        ]),
        ("Writing CLAUDE.md that saves hours", [
            p("Include: project purpose, tech stack, npm commands, deploy target, design tokens, test checklist.", "List what Claude must not change: analytics IDs, payment keys, legal pages.", "Link to brand assets folder.", "Update after every client style decision."),
            p("Good CLAUDE.md reduces wrong guesses.", "Share sanitized template between projects.", "Ultimate tier includes three vertical CLAUDE.md templates.", "Operators maintain specs; Claude executes."),
        ]),
        ("The describe-diff-test loop", [
            p("Describe outcome in one paragraph with acceptance criteria.", "Review diff hunks; reject unrelated changes.", "Run dev server; click critical paths.", "Commit with client-readable message."),
            p("Small tasks per prompt beat giant rewrites.", "Rollback with Git when needed.", "Screenshot before/after for client updates.", "Loop is your daily rhythm."),
        ]),
        ("Landing page delivery pattern", [
            p("Start from static HTML/Tailwind or client Webflow export.", "Prompt section-by-section: hero, proof, FAQ, CTA.", "Run Lighthouse; prompt fixes for accessibility and perf.", "Deploy preview URL for client approval."),
            p("One revision round in scope.", "Form test mandatory.", "Handoff Loom plus repo access.", "48-hour offers live here."),
        ]),
        ("Automation and scripts without fear", [
            p("Claude Code writes Node or Python scripts for CSV transforms, API glue, cron jobs.", "Run on sample data first.", "Log errors clearly for client handoff.", "Document how to rerun in README."),
            p("Prefer serverless on client-approved hosts.", "Idempotent scripts survive retries.", "Charge setup plus maintenance.", "Scripts are billable products."),
        ]),
        ("WordPress and Webflow boundaries", [
            p("For WordPress, limit to theme child edits and custom blocks—not core hacks.", "Webflow: export when client needs code hosting elsewhere.", "Document CMS edit instructions for client marketers.", "Avoid plugin soup."),
            p("Know when to say no to fragile stacks.", "Charge discovery to audit existing mess.", "Claude helps read unfamiliar PHP within limits.", "Sustainable beats clever."),
        ]),
        ("Client communication templates", [
            p("Daily async update: done, next, blockers.", "Preview link with password if needed.", "Change order template for scope additions.", "Post-launch support window dates in writing."),
            p("Never surprise client with big unreviewed changes.", "Translate technical fixes to business language.", "Ultimate includes email templates.", "Communication retains clients."),
        ]),
        ("Pricing operator work", [
            p("Fixed price for defined acceptance criteria.", "Hourly only with cap and weekly report.", "Retainer for small ongoing tweaks.", "Rush fees standard."),
            p("Track effective hourly rate per project.", "Raise after portfolio proof.", "Do not underbid learning curve—pad first projects.", "Value price against their launch revenue."),
        ]),
        ("QA checklist operators use", [
            p("Mobile, forms, links, SEO meta, OG tags, 404, legal links, analytics firing.", "Cross-browser spot check.", "Copy spellcheck.", "Client brand colors and fonts matched."),
            p("Ultimate printable QA list included.", "Automate visual regression later; manual first.", "QA is non-billable overhead—price it in.", "One bug on launch hurts referrals."),
        ]),
        ("Security and client data", [
            p("Separate client credentials in password manager.", "Use least-privilege API keys.", "Delete local copies after offboard when contract requires.", "NDA defaults for access to their systems."),
            p("Do not paste client secrets into prompts on consumer accounts if policy forbids.", "Team plans with data controls when scaling.", "Incident response: notify client fast.", "Trust is the product."),
        ]),
        ("When to subcontract dev work", [
            p("Subcontract deep backend, mobile apps, or legacy refactors.", "You PM, QA, and client comms.", "Mark up subcontractor fees transparently or white-label.", "Never subcontract without test plan."),
            p("Build bench before emergency.", "Review subs' Git hygiene.", "Operators scale via network.", "Say no to risky stacks early."),
        ]),
        ("Building reusable starter kits", [
            p("Cloudflare Pages static starter with contact modal, analytics hook, version label.", "Tailwind config matching Mercury-clean.", "Clone per client; customize in hours.", "Starters increase margin."),
            p("Document starter in internal wiki.", "Update starters quarterly.", "Ultimate tier includes starter zip spec.", "Reuse is lazy profit."),
        ]),
        ("From operator to productized agency", [
            p("Same delivery three times → productize with checklist and fixed price.", "Hire second operator with your CLAUDE.md and starters.", "Sales becomes bottleneck—partner referrals.", "Micro-SaaS optional later."),
            p("Measure utilization and margin monthly.", "Fire low-margin clients.", "LivingPDF tracks tool updates.", "Operators win on throughput and trust."),
        ]),
        ("30-day skill ramp", [
            p("Week 1: setup Git, Claude Code, one practice landing page.", "Week 2: ship for friend or nonprofit portfolio piece.", "Week 3: paid client at friendly price.", "Week 4: raise price, document starter kit."),
            p("Daily two-hour practice minimum.", "Join operator communities for stack tips.", "Ship publicly (with permission).", "Billing starts before you feel ready."),
        ]),
    ],
))

# 10. ai-content-engine
GUIDES.append(make_guide(
    "ai-content-engine",
    "The AI Content Engine: 50 Posts per Client per Month",
    "AI · Content · Living · Ultimate",
    68,
    "Chapter 1 · Engine Architecture",
    [
        ("What fifty posts actually means", [
            p("Fifty pieces includes short posts, threads, carousels, and newsletters—not fifty long essays.", "Breakdown example: twenty LinkedIn, twelve Twitter/X, eight Instagram carousels, six newsletter sections, four blog snippets.", "Clients buy presence and pipeline support, not literary awards.", "Engine means templated stages, not one-off inspiration."),
            p("Clear content mix in contract prevents scope fights.", "Adjust mix by platform where ICP actually lives.", "Quality bar: on-brand, accurate, useful—not generic AI slop.", "Ultimate tier includes mix calculator spreadsheet."),
        ]),
        ("Client onboarding and brand voice capture", [
            p("Collect: ICP, offers, proof, banned topics, tone samples, competitors, compliance limits.", "Interview thirty minutes; Claude transcribes voice guide.", "Approve voice doc before first batch.", "Refresh voice doc quarterly."),
            p("Without voice guide, editors drown.", "Store approved phrases and off-limits claims.", "Regulated clients need legal review step.", "Onboarding is one-time productized fee."),
        ]),
        ("The five-stage production line", [
            p("Stage 1: monthly theme calendar aligned to business goals.", "Stage 2: briefs per piece with hook, angle, CTA.", "Stage 3: AI draft batch.", "Stage 4: human edit and fact check.", "Stage 5: schedule, engage protocol, report."),
            p("Each stage has owner and SLA.", "Bottleneck visibility weekly.", "Do not skip edit stage.", "Engine throughput measured in published pieces, not drafts."),
        ]),
        ("Calendar planning with Claude", [
            p("Input product launches, events, seasons, case studies.", "Claude proposes four weekly themes with hooks.", "Client approves calendar in one sitting.", "Lock calendar before production week."),
            p("Leave slack slots for reactive news in client's industry.", "Evergreen content fills gaps.", "Repurpose hero content across formats.", "Calendar reduces daily chaos."),
        ]),
        ("Prompt library by format", [
            p("Separate prompts for LinkedIn story posts, contrarian takes, carousels, threads, email teasers.", "Include voice doc excerpt and examples in every prompt.", "Require hook under 120 characters where platform limits.", "CTA variants: comment, DM, link, book call."),
            p("Version prompts; retire weak performers.", "Ultimate sealed chapter ships full prompt library.", "Never change every variable at once when testing.", "Prompts are IP—protect them."),
        ]),
        ("Batch production days", [
            p("Monday: finalize briefs.", "Tuesday: generate drafts in batches of ten.", "Wednesday–Thursday: editor pass.", "Friday: schedule next two weeks.", "Engagement blocks daily fifteen minutes per client."),
            p("Batching beats context switching.", "Editors work from shared checklist.", "Track time per piece to refine pricing.", "Fifty pieces needs team, not solo heroics."),
        ]),
        ("Editorial QA standards", [
            p("Remove AI tells: vague claims, repetitive structure, fake statistics.", "Verify facts and product details.", "Enforce hook clarity in first two lines.", "Brand voice score subjective but documented with examples."),
            p("Second pair reviews compliance-sensitive clients.", "Reject pieces that could embarrass client.", "Build swipe file of approved posts.", "QA protects retention."),
        ]),
        ("Visual and carousel pipeline", [
            p("Canva templates with locked brand kits.", "Claude drafts slide copy; designer layouts.", "Export sizes per platform.", "Alt text and accessible contrast."),
            p("Carousels drive engagement on LinkedIn and Instagram.", "Reuse data visuals from client reports when allowed.", "Do not overload slides with text.", "Visual SOP separate from text SOP."),
        ]),
        ("Scheduling and tooling", [
            p("Buffer, Hootsuite, or native schedulers per client preference.", "UTM discipline for links.", "Timezone awareness for global brands.", "Backup queue if API fails."),
            p("Document login and approval flows.", "Never post without client approval until trust established.", "Auto-publish only after thirty days clean record.", "Tooling is boring; reliability wins."),
        ]),
        ("Engagement protocol", [
            p("Client or agency replies to comments within four business hours.", "Pre-draft thoughtful replies for common questions.", "Escalate negative comments to client fast.", "Engagement boosts reach more than post count alone."),
            p("Claude suggests reply drafts; human sends.", "Do not argue in comments.", "Track leads from DMs.", "Engagement is part of service, not extra."),
        ]),
        ("Repurposing one pillar into many", [
            p("One long blog or webinar becomes ten micro-posts.", "Claude extracts quotes, stats, myths, tips.", "Map repurposing in calendar to reduce net-new burden.", "Pillar content needs client expert input."),
            p("Original insight required—pure rehash fails.", "Credit internal experts by name when possible.", "Video clips if client supplies footage.", "Repurposing protects margin at fifty posts."),
        ]),
        ("Compliance for regulated niches", [
            p("Finance, health, legal need review gates.", "No guaranteed outcomes in copy.", "Archive approvals.", "Disclaimers where required."),
            p("Slow compliance means charge more.", "Ultimate includes review checklist.", "AI does not replace legal.", "One violation ends retainers."),
        ]),
        ("Pricing fifty-post retainers", [
            p("Tier by mix complexity and review depth: $2500–$8000/month typical for B2B.", "Setup fee for voice and templates.", "Overage pricing for extra pieces.", "Annual prepay discount optional."),
            p("Margin requires editors offshore/onshore mix.", "Track cost per piece.", "Raise when utilization maxed.", "Do not sell fifty posts solo without team."),
        ]),
        ("Reporting and retention", [
            p("Monthly: pieces published, top posts, impressions where available, leads influenced.", "Qualitative wins from sales team.", "Next month plan.", "Claude drafts report from analytics exports."),
            p("Clients renew when pipeline feels fed.", "Fix underperformance with format tests.", "Churn if client hides results.", "Transparency beats vanity metrics."),
        ]),
        ("Team roles", [
            p("Strategist, calendar owner, AI operator, senior editor, designer part-time, account lead.", "RACI in Ultimate tier.", "Hire editors before sales if delivery shaky.", "SOP videos mandatory."),
            p("Freelance bench for surge.", "Quality drops if you only hire cheapest.", "Weekly production meeting thirty minutes.", "Team makes fifty posts real."),
        ]),
        ("Scaling to multiple clients", [
            p("Max clients per pod: three to five depending on mix.", "Shared prompt library verticalized.", "Separate voice docs per client.", "Never cross-contaminate accounts."),
            p("Productize vertical packs: SaaS founders, agencies, coaches.", "Referral program for clients.", "LivingPDF updates with platform algorithm notes.", "Engine scales with process, not luck."),
        ]),
        ("90-day build-out plan", [
            p("Month 1: one client pilot, voice doc, calendar, twenty posts shipped.", "Month 2: refine SOP, hit forty posts, hire editor.", "Month 3: second client, fifty posts each, reporting automated.", "Outcomes depend on sales and team—not guaranteed."),
            p("Ultimate worksheets detail weekly milestones.", "Pilot pricing lower; standard pricing after proof.", "Document everything during pilot.", "Engine becomes sellable asset."),
        ]),
    ],
))

COVER_SPECS = [
    ("lazy-man-ai", "THE LAZY", "MAN'S WAY", "GET RICH WITH AI"),
    ("claude-freelancer", "CLAUDE", "FREELANCER", "UPWORK & FIVERR"),
    ("ai-automation-agency", "AI AUTO", "AGENCY", "n8n · MAKE · CLAUDE"),
    ("ai-seo", "AI SEO", "GOOGLE", "CHATGPT · PERPLEXITY"),
    ("ai-email-agency", "AI EMAIL", "AGENCY", "MARKETING BLUEPRINT"),
    ("landing-pages-48h", "LANDING", "PAGES", "CLAUDE IN 48 HOURS"),
    ("ai-lead-gen", "AI LEAD GEN", "SYSTEMS", "BOOK SALES CALLS"),
    ("claude-code-operators", "CLAUDE CODE", "OPERATORS", "BILL CLIENTS"),
    ("ai-content-engine", "CONTENT", "ENGINE", "50 POSTS / MONTH"),
]


def svg_cover(slug, line1, line2, line3):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="72" height="104" viewBox="0 0 72 104">
  <rect width="72" height="104" fill="#0c1222"/>
  <rect x="6" y="10" width="60" height="84" fill="#1e293b"/>
  <text x="36" y="32" fill="#38bdf8" font-family="sans-serif" font-size="5" font-weight="700" text-anchor="middle">{line1}</text>
  <text x="36" y="42" fill="#f6f1e8" font-family="Georgia, serif" font-size="6.5" font-weight="700" text-anchor="middle">{line2}</text>
  <text x="36" y="52" fill="#f6f1e8" font-family="Georgia, serif" font-size="6.5" font-weight="700" text-anchor="middle">{line3.split()[0] if " " in line3 else line3}</text>
  <text x="36" y="64" fill="#94a3b8" font-family="sans-serif" font-size="4.5" text-anchor="middle">{line3 if len(line3) > 12 else line3.upper()}</text>
  <rect x="14" y="72" width="8" height="8" rx="1" fill="#38bdf8" opacity="0.7"/>
  <rect x="24" y="72" width="8" height="8" rx="1" fill="#6366f1" opacity="0.6"/>
  <rect x="34" y="72" width="8" height="8" rx="1" fill="#38bdf8" opacity="0.5"/>
  <rect x="44" y="72" width="8" height="8" rx="1" fill="#6366f1" opacity="0.4"/>
  <text x="36" y="92" fill="#64748b" font-family="sans-serif" font-size="4.5" text-anchor="middle">LivingPDFs</text>
</svg>'''


def svg_cover_v2(slug, accent, title_lines, subtitle):
    """Better layout matching micro-saas style."""
    t1, t2 = title_lines[0], title_lines[1] if len(title_lines) > 1 else ""
    t3 = title_lines[2] if len(title_lines) > 2 else ""
    lines = []
    y = 42
    for t in title_lines[:3]:
        if t:
            lines.append(f'  <text x="36" y="{y}" fill="#f6f1e8" font-family="Georgia, serif" font-size="6.5" font-weight="700" text-anchor="middle">{t}</text>')
            y += 10
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="72" height="104" viewBox="0 0 72 104">
  <rect width="72" height="104" fill="#0c1222"/>
  <rect x="6" y="10" width="60" height="84" fill="#1e293b"/>
  <text x="36" y="28" fill="#38bdf8" font-family="sans-serif" font-size="5" font-weight="700" text-anchor="middle">{accent}</text>
{chr(10).join(lines)}
  <text x="36" y="66" fill="#94a3b8" font-family="sans-serif" font-size="4" text-anchor="middle">{subtitle}</text>
  <rect x="14" y="72" width="8" height="8" rx="1" fill="#38bdf8" opacity="0.7"/>
  <rect x="24" y="72" width="8" height="8" rx="1" fill="#6366f1" opacity="0.6"/>
  <rect x="34" y="72" width="8" height="8" rx="1" fill="#38bdf8" opacity="0.5"/>
  <rect x="44" y="72" width="8" height="8" rx="1" fill="#6366f1" opacity="0.4"/>
  <text x="36" y="92" fill="#64748b" font-family="sans-serif" font-size="4.5" text-anchor="middle">LivingPDFs</text>
</svg>'''


COVER_DATA = {
    "lazy-man-ai": ("AI INCOME", ["LAZY", "MAN'S WAY"], "GET RICH WITH AI"),
    "claude-freelancer": ("FREELANCE", ["CLAUDE", "PLAYBOOK"], "UPWORK & FIVERR"),
    "ai-automation-agency": ("AI AUTO", ["AUTOMATION", "AGENCY"], "n8n · MAKE · CLAUDE"),
    "ai-seo": ("AI SEO", ["GOOGLE &", "ANSWER ENGINES"], "CHATGPT · PERPLEXITY"),
    "ai-email-agency": ("AI EMAIL", ["MARKETING", "AGENCY"], "RETAINER BLUEPRINT"),
    "landing-pages-48h": ("48 HOURS", ["LANDING", "PAGES"], "DONE WITH CLAUDE"),
    "ai-lead-gen": ("AI LEADS", ["BOOK SALES", "CALLS"], "GENERATION SYSTEMS"),
    "claude-code-operators": ("CLAUDE CODE", ["OPERATORS", "WHO BILL"], "NOT DEVELOPERS"),
    "ai-content-engine": ("CONTENT", ["50 POSTS", "PER CLIENT"], "MONTHLY ENGINE"),
}


def main():
    CONTENT.mkdir(parents=True, exist_ok=True)
    COVERS.mkdir(parents=True, exist_ok=True)

    created_json = []
    for guide in GUIDES:
        path = CONTENT / f"{guide['slug']}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(guide, f, indent=2, ensure_ascii=False)
            f.write("\n")
        created_json.append(path.name)
        blocks = len(guide["blocks"])
        pages_sum = sum(b["pages"] for b in guide["blocks"])
        early = sum(b["pages"] for b in guide["blocks"][:4])
        target = max(1, round(guide["totalPages"] * 0.2))
        print(f"{guide['slug']}: {blocks} blocks, pages sum {pages_sum}, early4={early} (target ~{target})")

    created_covers = []
    for slug, (accent, titles, sub) in COVER_DATA.items():
        if slug == "micro-saas":
            continue
        path = COVERS / f"{slug}.svg"
        path.write_text(svg_cover_v2(slug, accent, titles, sub), encoding="utf-8")
        created_covers.append(path.name)

    print("\nJSON:", ", ".join(created_json))
    print("Covers:", ", ".join(created_covers))


if __name__ == "__main__":
    main()

