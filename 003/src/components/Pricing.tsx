import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Checkout } from './Checkout';
import { 
  Check, 
  Sparkles, 
  Mail, 
  HardDrive, 
  Video, 
  Calendar, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowRightLeft, 
  ChevronRight, 
  Info,
  Laptop,
  Globe,
  Layers,
  Zap,
  Download,
  Code,
  Cpu,
  RefreshCw,
  Bookmark,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Pricing: React.FC = () => {
  const { books, user, subscribeToBook, triggerSync, addNotification } = useApp();
  const [isAnnual, setIsAnnual] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Trial / subscription checkout modal states
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);
  
  // Interactive highlighted plan
  const [activePlan, setActivePlan] = useState<string>('silver');

  // Bottom lead signup form states
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 12 sandbox-powered feature capsules to represent living pdf strengths
  const sandboxFeatures = [
    { name: 'Live Sandbox', icon: Code, bg: 'bg-[#1a73e8]/10 text-[#1a73e8] dark:bg-blue-950/40 dark:text-blue-400' },
    { name: 'Offline Mode', icon: Laptop, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { name: 'AI Summarist', icon: Sparkles, bg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400' },
    { name: 'Hot Reload', icon: RefreshCw, bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' },
    { name: 'PDF Export', icon: Download, bg: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' },
    { name: 'Diff Viewer', icon: ArrowRightLeft, bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' },
    { name: 'Sandbox Nodes', icon: Cpu, bg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400' },
    { name: 'Revision Feed', icon: Layers, bg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400' },
    { name: 'Annotations', icon: Globe, bg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400' },
    { name: 'Bookmarking', icon: Bookmark, bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-450' },
    { name: 'Collaboration', icon: Mail, bg: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400' },
    { name: 'Vault Auth', icon: ShieldCheck, bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300' },
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free Previewer',
      priceMonthly: 0,
      priceAnnual: 0,
      subtext: 'Free lifetime access',
      description: 'Standard access includes:',
      isPopular: false,
      isOneTime: false,
      features: [
        'Read first 6 pages of any book',
        'Standard layout formatting editor',
        'Interactive code sample sandbox preview',
        'Offline standalone application storage',
        'Basic community annotation logs'
      ]
    },
    {
      id: 'bronze',
      name: 'Bronze Reader',
      priceMonthly: 4.99,
      priceAnnual: 4.99,
      subtext: 'one-time fee per book',
      description: 'Core Bronze features:',
      isPopular: false,
      isOneTime: true,
      features: [
        'Lifetime access to current v4.0 book content',
        'Offline standalone application storage',
        'Standard layout formatting engine',
        'Integrated bookmarks & index logs',
        'Fully unlocked pages for target notebook'
      ]
    },
    {
      id: 'silver',
      name: 'Silver Developer',
      priceMonthly: 12.90,
      priceAnnual: 9.90,
      subtext: 'per user / quarter',
      description: 'All Core Bronze, and:',
      isPopular: true,
      isOneTime: false,
      features: [
        'Platform-Wide subscription access option',
        'Weekly live-code revision updates',
        'Direct sandbox compilation nodes',
        'Interactive code sample playground',
        'Priority offline cache (high bandwidth)',
        'Local CSS and hot reloading compiler'
      ]
    },
    {
      id: 'gold',
      name: 'Gold Infinite Developer',
      priceMonthly: 24.99,
      priceAnnual: 19.99,
      subtext: 'per user / year',
      description: 'All Silver Developer, and:',
      isPopular: false,
      isOneTime: false,
      features: [
        'All catalog books fully unlocked',
        'Instant live authors review logs',
        'Smart Gemini content summaries',
        'Full vector source and PDF exporting',
        '1-on-1 author feedback channel loop',
        'Priority access to pre-market trial books'
      ]
    }
  ];

  const faqs = [
    {
      question: "What is a \"Living PDF\" and how does it work?",
      answer: "A Living PDF is an interactive document format that embeds a live standalone application playground directly inside the book chapters. Instead of reading boring static code blocks, you can compile, edit, and experiment with reactive code blocks in real time inside a fully unified browser sandbox container."
    },
    {
      question: "Can I read my living PDFs offline?",
      answer: "Yes, absolutely! Our advanced offline-first engine caches both the book metadata, index structures, and local sandbox packages. You can compile code, edit playgrounds, and bookmark chapters on a plane or train with zero network overhead."
    },
    {
      question: "What is the difference between Bronze, Silver, and Gold tiers?",
      answer: "Bronze provides a standard static one-time buy for a single book. Silver turns your book learning into a reactive stream with quarterly updates, direct sandbox compiling node configurations, and hot-reload preview loops. Gold is our ultimate platform-wide pass: unlocking all catalog books, full vector source PDF exports, smart Gemini content summaries, and a direct review channel with active authors."
    },
    {
      question: "Is there a free trial period for subscriber tiers?",
      answer: "Yes. Every Silver and Gold subscription includes an unrestricted 14-day trial period where you can sample deep-dive chapters, toggle auto-reload nodes, and test advanced code layouts before final billing begins."
    },
    {
      question: "How can I export my annotations and compiled samples?",
      answer: "With a Gold pass, you can export playground code blocks directly to source files on your computer, print/save the entire formatted book layout to a vector-grade target PDF file, or link your GitHub account to sync bookmarks effortlessly."
    },
    {
      question: "How frequent are author code upgrades?",
      answer: "Our publishers and authors push hotfixes and version revisions whenever technology guidelines shift (like when Elena revised the React 19 deep dive when Server Action guidelines became official). These update automatically to your client as soon as you sign online."
    },
    {
      question: "Can I purchase multiple books at once?",
      answer: "Yes! While Bronze licenses individual books, choosing Silver or Gold platform passes immediately unlocks all books inside our catalog, ensuring you can learn everything from Tailwind v4 to Clean Architecture without buying books separate."
    }
  ];

  const handleStartTrial = (planId: string, planName: string) => {
    if (planId === 'free') {
      books.forEach(b => subscribeToBook(b.id, 'free'));
      addNotification('global', 'Free Sandbox Active', 'You now have access to free sandbox previews.');
      triggerSync();
      return;
    }
    setSelectedPlanId(planId);
    setSelectedPlanName(planName);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormFirstName('');
      setFormLastName('');
      setFormEmail('');
      setFormPhone('');
    }, 4000);
  };

  if (selectedPlanId) {
    return (
      <Checkout 
        planId={selectedPlanId} 
        planName={selectedPlanName || 'Plan'} 
        onCancel={() => setSelectedPlanId(null)} 
      />
    );
  }

  return (
    <div className="animate-fade-in font-sans selection:bg-blue-200/50">
      
      {/* 1. HERO HEADER AREA IN OUTFIT FONT */}
      <div className="text-center py-10 md:py-14 max-w-4xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] font-outfit">
          Find the right plan for your <br className="hidden md:inline" />
          learning. Try a free preview of every PDF before you purchase.
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-outfit font-normal">
          Choose the Living PDFs subscription or license tier that fits your growth.
        </p>

        {/* 2. RECONCILED ANNUAL/MONTHLY TOGGLE SWITCH */}
        <div className="pt-6 flex items-center justify-center gap-3">
          <span className={`text-[13px] font-medium transition-colors ${!isAnnual ? 'text-zinc-850 dark:text-white font-semibold' : 'text-zinc-400'}`}>
            Quarterly / Single
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-zinc-950 cursor-pointer"
            aria-label="Toggle annual commitment pricing"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-[13px] font-medium transition-colors ${isAnnual ? 'text-zinc-850 dark:text-white font-semibold' : 'text-zinc-400'}`}>
              Annual Commitment
            </span>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
              Save 25%
            </span>
          </div>
        </div>
      </div>

      {/* 3. PRICING GRID (Workspace-inspired structure with customized rounded-3xl corners) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-1">
        {plans.map((plan) => {
          let currentPriceNum = isAnnual && plan.priceMonthly > 0 ? plan.priceMonthly * 0.75 : plan.priceMonthly;
          let currentPrice = currentPriceNum > 0 ? currentPriceNum.toFixed(2) : currentPriceNum;
          
          return (
            <div
              key={plan.id}
              onClick={() => setActivePlan(plan.id)}
              className={`relative flex flex-col justify-between cursor-pointer bg-white dark:bg-zinc-950 transition-all duration-350 rounded-[32px] p-7 md:p-8 text-left ${
                activePlan === plan.id 
                  ? 'border-[2px] border-[#1a73e8] dark:border-blue-500 shadow-xl shadow-blue-500/5 scale-100 md:scale-[1.02] z-10' 
                  : 'border-[2px] border-zinc-200 dark:border-zinc-850 shadow-sm hover:shadow-md hover:border-[#1a73e8] dark:hover:border-blue-500 hover:shadow-blue-500/5'
              }`}
            >
              {/* Features representation minibar */}
              <div className="flex gap-1.5 pb-5 items-center">
                <Code className="h-3.5 w-3.5 text-blue-500" />
                <Laptop className="h-3.5 w-3.5 text-emerald-500" />
                <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
                <Layers className="h-3.5 w-3.5 text-amber-500" />
                <Download className="h-3.5 w-3.5 text-red-500" />
              </div>

              <div>
                {/* Product/Tier Name */}
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-outfit mb-2">
                  {plan.name}
                </h3>

                {/* Pricing values (recalculated on commitment state change) */}
                <div className="min-h-[85px] py-2">
                  {plan.id === 'free' ? (
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1.5 text-zinc-900 dark:text-white">
                        <span className="text-3xl md:text-4.5xl font-extrabold tracking-tight font-outfit">
                          $0
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-normal pt-1">
                        Free tier <br />
                        No commitment required
                      </p>
                    </div>
                  ) : plan.isOneTime ? (
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1.5 text-zinc-900 dark:text-white">
                        <span className="text-3xl md:text-4.5xl font-extrabold tracking-tight font-outfit">
                          ${currentPrice}
                        </span>
                        <span className="text-xs text-zinc-450 dark:text-zinc-500">
                          USD
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-normal pt-1">
                        One-time fee <br />
                        Forever yours per book
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1.5 text-zinc-900 dark:text-white">
                        <span className="text-3xl md:text-4.5xl font-extrabold tracking-tight font-outfit">
                          ${currentPrice}
                        </span>
                        <span className="text-xs text-zinc-450 dark:text-zinc-500">
                          USD
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-sans pt-1">
                        {plan.id === 'silver' ? 'per quarter' : 'per year'} <br />
                        {isAnnual ? 'with 1-year commitment' : 'billed quarter-to-quarter'}
                      </p>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTON (solid primary color for featured tier, simple outline for others) */}
                <div className="py-2.5">
                  <button
                    onClick={() => handleStartTrial(plan.id, plan.name)}
                    className={`w-full py-3.5 px-5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      activePlan === plan.id
                        ? 'bg-[#1a73e8] text-white hover:bg-blue-700 shadow-md shadow-blue-500/10'
                        : 'border border-[#1a73e8] text-[#1a73e8] hover:bg-[#1a73e8]/5 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/5'
                    }`}
                  >
                    {plan.id === 'free' ? 'Try Free Sandbox' : plan.isOneTime ? 'Buy Bronze Pass' : 'Start Free Trial'}
                  </button>
                </div>

                {/* Subtext description header */}
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-300 font-outfit tracking-wide mt-6 mb-4">
                  {plan.description}
                </p>

                {/* Features bulletins checkmarked lists */}
                <ul className="space-y-3.5">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs select-none">
                      <Check className="h-4 w-4 stroke-[2.5] text-[#1a73e8] dark:text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans font-normal">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* SYSTEM/TERMS FINE FOOTNOTES */}
      <div className="max-w-7xl mx-auto px-2 mt-8 text-left text-[10px] text-zinc-400 dark:text-zinc-500 space-y-2 leading-relaxed font-sans pb-16 border-b border-zinc-150 dark:border-zinc-850">
        <p>
          * Bronze Reader licenses are charged per single target book title, and include unlimited static client storage but do not include monthly code-revisions or smart Generative translations. Users are restricted to local platform memory limits.
        </p>
        <p>
          * Silver and Gold subscriptions utilize pooled container nodes with an estimated bandwidth allocation of 5 GB cached package downloads. To secure custom server allocation, priority sandbox reloading speeds, or enterprise deployment channels, please speak with our Helpdesk network center.
        </p>
      </div>

      {/* 4. GOOGLE WORKSPACE INCLUDED APPLICATIONS BAR - MAPS DIRECTLY TO ACTIVE LIVING PDF INGREDIENTS */}
      <div className="max-w-6xl mx-auto my-12 py-12 px-6 md:px-10 text-center space-y-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-[32px] shadow-sm">
        <h3 className="text-2xl font-bold font-outfit text-zinc-800 dark:text-zinc-200">
          All the tools you need and a few more we think you'll love.
        </h3>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-5 px-3">
          {sandboxFeatures.map((app) => (
            <div key={app.name} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`p-4 rounded-2xl ${app.bg} shadow-sm group-hover:scale-105 duration-250 transition-all flex items-center justify-center`}>
                <app.icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 font-sans tracking-wide">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MIGRATE WITH CONFIDENCE BAR */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 dark:from-zinc-950 dark:to-blue-950/10 border border-zinc-200 dark:border-zinc-900 rounded-[32px] p-8 md:p-10 max-w-5xl mx-auto my-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
        <div className="space-y-4 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#1a73e8] dark:text-blue-400">
            <ArrowRightLeft className="h-3 w-3" /> External Code Importer
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold font-outfit text-zinc-900 dark:text-white tracking-tight leading-tight">
            Migrate your static books with confidence
          </h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
            Securely import your highlights, annotated notes, local PDF assets, or custom GitHub repositories straight into the active sandbox player. Our automated ingestion tools translate code snippets, configure workspace packages, and guarantee a smooth migration that is instantly runnable.
          </p>
          <button 
            onClick={() => handleStartTrial('bronze', 'Bronze Reader')}
            className="text-xs font-bold text-[#1a73e8] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Explore Sandbox Ingestors <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="relative w-full md:w-80 h-48 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-lg flex items-center justify-center overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10" />
          <div className="scale-110 relative flex flex-col items-center text-center space-y-2">
            <div className="p-3 w-14 h-14 bg-gradient-to-tr from-blue-650 to-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 py-1 px-3 border border-emerald-250 dark:border-emerald-900/40 rounded-full font-bold">
              Secure Sandbox Sanding
            </span>
          </div>
        </div>
      </div>

      {/* 6. "FIND THE ANSWERS THAT YOU NEED" SECTION (Two column layout with FAQs left, help cards right) */}
      <div className="py-16 border-t border-zinc-150 dark:border-zinc-850 max-w-7xl mx-auto px-2">
        <div className="mb-12 text-left">
          <h3 className="text-2xl md:text-3.5xl font-extrabold font-outfit text-zinc-900 dark:text-white tracking-tight">
            Find the answers that you need.
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Accordion FAQs) - occupy 2 spans */}
          <div className="lg:col-span-2 space-y-4 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-zinc-205 dark:border-zinc-850 pb-4 transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left py-3 flex items-center justify-between gap-4 font-sans cursor-pointer focus:outline-none group"
                  >
                    <span className="text-[13.5px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[#1a73e8] dark:group-hover:text-blue-400 transition-colors duration-150">
                      {faq.question}
                    </span>
                    <span className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 shrink-0">
                      {isOpen ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[12.5px] text-zinc-550 dark:text-zinc-450 leading-relaxed font-sans pt-1 pb-3 pr-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column (Special Resources helper widgets) - occupy 1 span */}
          <div className="space-y-6">
            
            {/* Widget 1: Explore Learning Center */}
            <div className="bg-stone-50/60 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 text-left space-y-4 shadow-sm">
              <h4 className="text-sm font-bold text-zinc-850 dark:text-white font-outfit uppercase tracking-wider">
                Explore Learning Center
              </h4>
              <p className="text-xs text-zinc-550 dark:text-zinc-450 leading-relaxed font-sans">
                Browse sandbox guides, syntax cheat sheets, hotkey workflows, and compile logs crafted to help active terminal programmers start seamlessly.
              </p>
              <button
                onClick={() => handleStartTrial('free', 'Free Sandbox Pass')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a73e8] dark:text-blue-400 hover:underline cursor-pointer"
              >
                See resources <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Widget 2: Get Live Help */}
            <div className="bg-blue-50/10 dark:bg-blue-950/5 border border-blue-200/40 dark:border-blue-900/30 rounded-3xl p-6 text-left space-y-4 shadow-sm">
              <h4 className="text-sm font-bold text-zinc-850 dark:text-white font-outfit uppercase tracking-wider">
                Get Author Backing
              </h4>
              <p className="text-xs text-zinc-550 dark:text-zinc-450 leading-relaxed font-sans">
                Sync live with our package maintainers, ask questions in the public annotation threads, or file code request improvements instantly from the reader.
              </p>
              <button
                onClick={() => handleStartTrial('gold', 'Gold Infinite Pass')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a73e8] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Reach Authors <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 7. TRIAL LEAD SIGNUP AND NEWSLETTER FORM BLOCK (Matches screenshot design) */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 dark:from-zinc-950 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-[36px] p-8 md:p-12 max-w-7xl mx-auto my-14 grid grid-cols-1 lg:grid-cols-2 gap-10 text-left items-center">
        
        <div className="space-y-4">
          <span className="bg-blue-100 text-[#1a73e8] dark:bg-blue-950/50 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Ready to learn?
          </span>
          <h3 className="text-3xl md:text-4xl font-extrabold font-outfit text-zinc-900 dark:text-white tracking-tight leading-tight">
            Sign up for sandbox features, live-chapters, and updates
          </h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
            Stay updated with new release announcements, beta code examples, security patches, early-access previews, and free tools compiled straight for your screen.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-350">
              <Check className="h-4 w-4 text-emerald-500 stroke-[3]" /> Unrestricted release news
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-350">
              <Check className="h-4 w-4 text-emerald-500 stroke-[3]" /> Weekly hotfixes log feed
            </div>
          </div>
        </div>

        <div>
          {formSubmitted ? (
            <div className="group bg-white dark:bg-[#1c1c1f]/50 border-[2px] border-zinc-200/80 dark:border-zinc-850 p-8 rounded-[28px] text-center space-y-4 shadow-lg hover:shadow-xl hover:border-[#1a73e8] dark:hover:border-blue-500 hover:shadow-blue-500/5 hover:bg-white/95 dark:hover:bg-[#202024]/85 transition-all duration-300 animate-fade-in">
              <div className="p-3 w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto flex items-center justify-center">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
              <h4 className="text-lg font-bold font-outfit text-zinc-900 dark:text-white">
                You're on our developer updates feed!
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal max-w-sm mx-auto font-sans">
                We will email you at <span className="font-semibold text-zinc-850 dark:text-zinc-200">{formEmail || 'your email'}</span> with future code updates and living-chapter drops.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="group bg-white dark:bg-[#1c1c1f]/50 border-[2px] border-zinc-200/80 dark:border-zinc-850 p-6 md:p-8 rounded-[28px] shadow-lg hover:shadow-xl hover:border-[#1a73e8] dark:hover:border-blue-500 hover:shadow-blue-500/5 hover:bg-white/95 dark:hover:bg-[#202024]/85 transition-all duration-300 space-y-4 font-sansSB">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label htmlFor="p_first_name" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">First Name</label>
                  <input
                    id="p_first_name"
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-zinc-900 dark:text-white shadow-sm"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label htmlFor="p_last_name" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Last Name</label>
                  <input
                    id="p_last_name"
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-zinc-900 dark:text-white shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label htmlFor="p_email" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Developer Email</label>
                <input
                  id="p_email"
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-zinc-900 dark:text-white shadow-sm"
                />
              </div>

              <div className="space-y-1 text-left">
                <label htmlFor="p_phone" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Contact Number</label>
                <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                  <span className="bg-stone-50 dark:bg-zinc-900 text-xs px-3 py-3 border-r border-zinc-200 dark:border-zinc-800 flex items-center text-zinc-500 font-sans">
                    🇺🇸 +1
                  </span>
                  <input
                    id="p_phone"
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(201) 555-0123"
                    className="w-full text-xs p-3 outline-none focus:outline-none dark:bg-zinc-900 bg-white text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1a73e8] hover:bg-blue-700 text-white font-semibold text-xs rounded-full shadow-md uppercase tracking-wider cursor-pointer active:scale-[0.98] transition-all"
                >
                  Continue
                </button>
              </div>

              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center font-sans">
                By submitting this request, you agree that Living PDFs or Elena-Anthony authors may email updates or sandbox recommendations.
              </p>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};
