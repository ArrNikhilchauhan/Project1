import { useState, useEffect, FormEvent } from 'react';
import { 
  ShoppingBag, 
  Baby, 
  UserCheck, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Play, 
  CheckCircle2, 
  X, 
  Phone, 
  ArrowRight, 
  HelpCircle, 
  Send, 
  Calendar, 
  Sparkles, 
  Clock, 
  Plus, 
  Award, 
  ShieldAlert, 
  Compass, 
  ThumbsUp, 
  MessageSquare,
  Activity,
  Menu,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { servicesData, marketsData, assistantsPool, faqsData } from './mockData';
import { Booking, Service, Assistant } from './types';

// Brand colour token — official Diblo Pink from requirement document
const BRAND = '#E75480';
const BRAND_DARK = '#c93f6a';

export default function App() {
  // Navigation & View state: 'home' | 'services' | 'about' | 'booking' | 'tracking' | 'partner'
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'about' | 'booking' | 'tracking' | 'partner'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom states for interactive features
  const [selectedService, setSelectedService] = useState<Service>(servicesData[0]);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [emailWaitlist, setEmailWaitlist] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  
  // Multi-step booking states
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingMarketId, setBookingMarketId] = useState(marketsData[0].id);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState<number>(3);
  const [bookingRequirements, setBookingRequirements] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Active booking persistence
  const [activeBooking, setActiveBooking] = useState<Booking | null>(() => {
    const saved = localStorage.getItem('diblo_active_booking');
    return saved ? JSON.parse(saved) : null;
  });

  // Booking history ledger
  const [bookingHistory, setBookingHistory] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('diblo_booking_history');
    return saved ? JSON.parse(saved) : [];
  });

  // State inside live assistant simulation
  const [simulatedBags, setSimulatedBags] = useState<string[]>(['H&M Bag (Red Shoes)', 'Zara Shopping Bag (L)', 'Ethnic Wear Box']);
  const [newBagInput, setNewBagInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    { sender: 'assistant', text: 'Hello! I have en route to rendezvous point near Market Gate 2. I have my pink diblo uniform on.', time: '10:15 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [feedbackInput, setFeedbackInput] = useState('');

  // Persists states
  useEffect(() => {
    if (activeBooking) {
      localStorage.setItem('diblo_active_booking', JSON.stringify(activeBooking));
    } else {
      localStorage.removeItem('diblo_active_booking');
    }
  }, [activeBooking]);

  useEffect(() => {
    localStorage.setItem('diblo_booking_history', JSON.stringify(bookingHistory));
  }, [bookingHistory]);

  // Hook to simulate live en-route assistant progress
  useEffect(() => {
    if (activeBooking && activeBooking.status === 'pending') {
      const timer = setTimeout(() => {
        const assignedAssistant = assistantsPool[Math.floor(Math.random() * assistantsPool.length)];
        setActiveBooking(prev => prev ? {
          ...prev,
          status: 'assigned',
          assistant: assignedAssistant
        } : null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeBooking]);

  // Trigger scroll to top upon page navigation
  const navigateTo = (tab: 'home' | 'services' | 'about' | 'booking' | 'tracking' | 'partner') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Pre-fill booking form with selected service
  const handleSelectServiceDirectly = (service: Service) => {
    setSelectedService(service);
    navigateTo('booking');
  };

  // Waitlist form handler
  const handleJoinWaitlist = (e: FormEvent) => {
    e.preventDefault();
    if (!emailWaitlist) return;
    setWaitlistSuccess(true);
    setTimeout(() => {
      setWaitlistSuccess(false);
      setEmailWaitlist('');
    }, 4000);
  };

  // Calculate live costs based on selection
  const calculatedCost = selectedService.pricePerHour * bookingDuration;

  // Handles booking — builds WhatsApp message with all details and opens WhatsApp
  const handleCreateBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) {
      alert('Please fill out your name and phone number to continue.');
      return;
    }

    const selectedMarketObj = marketsData.find(m => m.id === bookingMarketId) || marketsData[0];
    const dateDisplay = bookingDate || 'As soon as possible';
    const timeDisplay = bookingTime || 'Flexible';

    // Build a clean, structured WhatsApp message
    const message = [
      '🙏 *New Booking Request — Diblo*',
      '',
      '👤 *Customer Details*',
      `• Name: ${bookingName}`,
      `• Phone: ${bookingPhone}`,
      bookingEmail ? `• Email: ${bookingEmail}` : null,
      '',
      '📋 *Service Details*',
      `• Service: ${selectedService.name}`,
      `• Market / Location: ${selectedMarketObj.name}`,
      `• Date: ${dateDisplay}`,
      `• Time: ${timeDisplay}`,
      `• Duration: ${bookingDuration} Hour${bookingDuration > 1 ? 's' : ''}`,
      `• Estimated Cost: ₹${calculatedCost}`,
      '',
      bookingRequirements ? `📝 *Special Requirements*\n${bookingRequirements}` : null,
      '',
      '✅ Please confirm my booking. Thank you!'
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = `https://wa.me/918291919829?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Show success state and reset form
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingName('');
      setBookingPhone('');
      setBookingEmail('');
      setBookingDate('');
      setBookingTime('');
      setBookingRequirements('');
      setBookingDuration(3);
    }, 5000);
  };

  // Add bag to live list
  const handleAddBag = () => {
    if (!newBagInput.trim()) return;
    setSimulatedBags(prev => [...prev, newBagInput.trim()]);
    setNewBagInput('');
    // Insert en-route chat update
    const curTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, {
      sender: 'assistant',
      text: `Bag updated successfully! Recorded: "${newBagInput.trim()}". Safe in my custody.`,
      time: curTime
    }]);
  };

  // User chat simulation replies
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    const curTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: curTime }]);
    setChatInput('');

    // Trigger funny automated helpful response from assigned assistant
    setTimeout(() => {
      let replyText = "Received! I am keeping active focus on this. I will look out for you.";
      if (userMsg.toLowerCase().includes('where')) {
        replyText = "I am currently standing near the central sweets shop corner. Look out for my neon-pink diblo tee!";
      } else if (userMsg.toLowerCase().includes('gate') || userMsg.toLowerCase().includes('entry')) {
        replyText = `Understood! Proceeding straight to the entryway. I will stand next to the security desks.`;
      } else if (userMsg.toLowerCase().includes('bag') || userMsg.toLowerCase().includes('secure')) {
        replyText = "All your bags are safely locked in my high-visibility diblo parcel pack. No worries!";
      } else if (userMsg.toLowerCase().includes('water') || userMsg.toLowerCase().includes('umbrella')) {
        replyText = "Absolutely, I have clean hydration flask and full umbrella ready to shield you!";
      }
      setChatMessages(prev => [...prev, { sender: 'assistant', text: replyText, time: curTime }]);
    }, 1500);
  };

  // End active session and save to history
  const handleEndSession = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    if (!activeBooking) return;
    
    const finalizedBooking: Booking = {
      ...activeBooking,
      status: 'completed'
    };

    setBookingHistory(prev => [finalizedBooking, ...prev]);
    setActiveBooking(null);
    setShowRatingModal(false);
    navigateTo('home');
  };

  const handleCancelSession = () => {
    if (window.confirm('Do you wish to cancel this shopping support mission?')) {
      if (activeBooking) {
        const cancelledBooking: Booking = {
          ...activeBooking,
          status: 'cancelled'
        };
        setBookingHistory(prev => [cancelledBooking, ...prev]);
      }
      setActiveBooking(null);
      navigateTo('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#E75480] text-white flex flex-col font-sans selection:bg-[#c93f6a] selection:text-white">
      
      {/* Sticky Top Navigation Bar */}
      <nav id="navbar-top" className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-10">
            {/* Logo */}
            <button onClick={() => navigateTo('home')} className="cursor-pointer hover:opacity-90 transition-opacity">
              <img src="/assets/logo.jpeg" alt="Diblo" className="h-10 object-contain rounded" />
            </button>
            
            {/* Navigation links */}
            <div className="hidden md:flex gap-8 items-center">
              <button 
                onClick={() => navigateTo('home')} 
                className={`font-semibold tracking-wide text-sm transition-all duration-200 cursor-pointer ${activeTab === 'home' ? 'text-[#E75480] border-b-2 border-[#E75480] pb-1' : 'text-slate-700 hover:text-[#E75480]'}`}>
                Home
              </button>
              <button 
                onClick={() => navigateTo('services')} 
                className={`font-semibold tracking-wide text-sm transition-all duration-200 cursor-pointer ${activeTab === 'services' ? 'text-[#E75480] border-b-2 border-[#E75480] pb-1' : 'text-slate-700 hover:text-[#E75480]'}`}>
                Services
              </button>
              <button 
                onClick={() => navigateTo('about')} 
                className={`font-semibold tracking-wide text-sm transition-all duration-200 cursor-pointer ${activeTab === 'about' ? 'text-[#E75480] border-b-2 border-[#E75480] pb-1' : 'text-slate-700 hover:text-[#E75480]'}`}>
                About Us
              </button>
              <button 
                onClick={() => navigateTo('booking')} 
                className={`font-semibold tracking-wide text-sm transition-all duration-200 cursor-pointer ${activeTab === 'booking' ? 'text-[#E75480] border-b-2 border-[#E75480] pb-1' : 'text-slate-700 hover:text-[#E75480]'}`}>
                Booking
              </button>
              <button 
                onClick={() => navigateTo('partner')} 
                className={`font-semibold tracking-wide text-sm transition-all duration-200 cursor-pointer ${activeTab === 'partner' ? 'text-[#E75480] border-b-2 border-[#E75480] pb-1' : 'text-slate-700 hover:text-[#E75480]'}`}>
                Join as Partner
              </button>
              {activeBooking && (
                <button 
                  onClick={() => navigateTo('tracking')} 
                  className="font-bold tracking-wide text-sm text-[#E75480] hover:text-rose-700 flex items-center gap-1.5 animate-pulse cursor-pointer">
                  <Activity size={14} /> Live Mission
                </button>
              )}
            </div>
          </div>

          {/* Call to action & Mobile menu trigger */}
          <div className="flex items-center gap-4">
            {/* <a 
              href="https://wa.me/918291919829?text=Hello%20Diblo%2C%20I%20would%20like%20to%20book%20an%20assistant."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-full font-bold text-sm transition-all cursor-pointer">
              <MessageCircle size={15} /> WhatsApp
            </a> */}
            <button 
              onClick={() => navigateTo('booking')} 
              className="bg-[#E75480] hover:bg-[#c93f6a] text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm transition-all cursor-pointer transform hover:scale-[1.03] active:scale-100">
              Book Now
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 text-slate-700 hover:bg-rose-50 rounded-full"
              title="Menu">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-rose-100 px-6 py-4 flex flex-col gap-4 shadow-lg">
              <button onClick={() => navigateTo('home')} className={`text-left font-bold tracking-wide text-sm uppercase py-2 ${activeTab === 'home' ? 'text-[#E75480]' : 'text-slate-700'}`}>Home</button>
              <button onClick={() => navigateTo('services')} className={`text-left font-bold tracking-wide text-sm uppercase py-2 ${activeTab === 'services' ? 'text-[#E75480]' : 'text-slate-700'}`}>Services</button>
              <button onClick={() => navigateTo('about')} className={`text-left font-bold tracking-wide text-sm uppercase py-2 ${activeTab === 'about' ? 'text-[#E75480]' : 'text-slate-700'}`}>About Us</button>
              <button onClick={() => navigateTo('booking')} className={`text-left font-bold tracking-wide text-sm uppercase py-2 ${activeTab === 'booking' ? 'text-[#E75480]' : 'text-slate-700'}`}>Booking Form</button>
              <button onClick={() => { navigateTo('partner'); setMobileMenuOpen(false); }} className={`text-left font-bold tracking-wide text-sm uppercase py-2 ${activeTab === 'partner' ? 'text-[#E75480]' : 'text-slate-700'}`}>Join as Partner</button>
              <a href="https://wa.me/918291919829?text=Hello%20Diblo%2C%20I%20would%20like%20to%20book%20an%20assistant." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#25D366] font-bold text-sm py-2">
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
              {activeBooking && (
                <button onClick={() => navigateTo('tracking')} className="text-left font-bold tracking-wide text-sm uppercase py-2 text-[#E75480] flex items-center gap-1 animate-pulse">
                  <Activity size={14} /> Track Active Mission
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Container */}
      <main className="flex-grow">
        
        {/* VIEW: HOME */}
        {activeTab === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="pb-20">
            
            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Visual Title */}
                <div className="z-10 text-center lg:text-left">
                  <span className="inline-block px-4 py-2 mb-6 rounded-full border border-white/40 bg-white/20 text-white font-bold text-sm tracking-wide">
                    ✨ Jahan Zarurat, Wahan Diblo
                  </span>
                  <h1 className="font-display text-5xl sm:text-6xl md:text-6xl font-black text-white tracking-tight mb-8 leading-tight">
                    Your Trusted <br/>
                    <span className="text-white/80">Urban Assistant.</span>
                  </h1>
                  <p className="text-base md:text-xl text-white/90 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    Professional assistance for shopping, senior citizens, and everyday tasks across <span className="text-white font-semibold underline decoration-white/40">Mumbai</span>. Verified, trained, and always on time.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button 
                      onClick={() => navigateTo('booking')} 
                      className="px-8 py-4 bg-white hover:bg-rose-50 text-[#E75480] rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer shadow-lg shadow-pink-900/20">
                      Book an Assistant
                    </button>
                    <button 
                      onClick={() => setHowItWorksOpen(true)}
                      className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                      <Play className="fill-current text-white" size={14} /> How It Works
                    </button>
                  </div>
                </div>

                {/* Cover Image of Sunil */}
                <div className="relative order-first lg:order-last">
                  <div className="relative z-10 rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:scale-[1.01] transition-transform duration-500">
                    <img 
                      alt="Friendly diblo shopping assistant Sunil Kumar" 
                      className="w-full h-[380px] sm:h-[480px] object-cover object-top" 
                      src="/assets/police_verification.jpeg"
                    />
                    {/* Floating pill badge */}
                    <div className="absolute bottom-6 right-6 bg-white p-5 rounded-2xl max-w-[260px] shadow-xl border border-rose-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#E75480]"><CheckCircle2 size={14} /></span>
                        <span className="font-bold uppercase tracking-wider text-xs text-slate-800">POLICE VERIFIED CREW</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-normal">All Diblo assistants are Police Verified, Aadhaar checked & uniformed professionals.</p>
                    </div>
                  </div>
                  
                  {/* Backdrop glowing decorations */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl z-0"></div>
                  <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl z-0"></div>
                </div>

              </div>
            </section>

            {/* Featured Badges Section */}
            <section className="bg-white py-16 border-y border-rose-100 relative z-20">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Badge 1 */}
                  <div className="p-6 flex flex-col items-center text-center border-r last:border-r-0 border-rose-50 md:border-r-slate-100">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-[#E75480] flex items-center justify-center mb-4 border border-rose-100">
                      <UserCheck size={22} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-sm text-slate-800 mb-2">Verified Staff</h3>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">100% Police & Aadhaar verified assistants</p>
                  </div>

                  {/* Badge 2 */}
                  <div className="p-6 flex flex-col items-center text-center border-r last:border-r-0 border-rose-50 md:border-r-slate-100">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-[#E75480] flex items-center justify-center mb-4 border border-rose-100">
                      <Zap size={22} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-sm text-slate-800 mb-2">Quick Booking</h3>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">Book online or via WhatsApp in under 60 seconds</p>
                  </div>

                  {/* Badge 3 */}
                  <div className="p-6 flex flex-col items-center text-center border-r last:border-r-0 border-rose-50 md:border-r-slate-100">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-[#E75480] flex items-center justify-center mb-4 border border-rose-100">
                      <ShieldCheck size={22} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-sm text-slate-800 mb-2">Insured Service</h3>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">Full protection coverage for all items up to ₹15,000</p>
                  </div>

                  {/* Badge 4 */}
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-[#E75480] flex items-center justify-center mb-4 border border-rose-100">
                      <MapPin size={22} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-sm text-slate-800 mb-2">Mumbai Ready</h3>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">Active across top Mumbai markets & neighbourhoods</p>
                  </div>

                </div>
              </div>
            </section>

            {/* "What is Diblo?" Block - Pink background, white text */}
            <section className="py-24">
              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Grid of feature tiles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 flex flex-col items-center text-center hover:bg-white/30 transition-all">
                    <div className="w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center mb-4">
                      <UserCheck size={18} />
                    </div>
                    <span className="font-bold uppercase tracking-wide text-xs text-white">Vetted Experts</span>
                    <span className="text-xs text-white/80 mt-1">Comprehensive identity clearance</span>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 flex flex-col items-center text-center hover:bg-white/30 transition-all mt-4">
                    <div className="w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center mb-4">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="font-bold uppercase tracking-wide text-xs text-white">Insured Travel</span>
                    <span className="text-xs text-white/80 mt-1">Full logistical safety protocols</span>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 flex flex-col items-center text-center hover:bg-white/30 transition-all">
                    <div className="w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center mb-4">
                      <Clock size={18} />
                    </div>
                    <span className="font-bold uppercase tracking-wide text-xs text-white">On-Demand</span>
                    <span className="text-xs text-white/80 mt-1">Flexible hourly engagements</span>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 flex flex-col items-center text-center hover:bg-white/30 transition-all mt-4">
                    <div className="w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center mb-4">
                      <MapPin size={18} />
                    </div>
                    <span className="font-bold uppercase tracking-wide text-xs text-white">Direct GPS</span>
                    <span className="text-xs text-white/80 mt-1">Interactive status panel updates</span>
                  </div>
                </div>

                {/* About copy details */}
                <div className="space-y-6">
                  <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-white">
                    What is <span className="text-white/80">Diblo</span>?
                  </h2>
                  <p className="text-white/90 leading-relaxed">
                    diblo is India's first on-demand shopping support collective. We bridge the gap between parcel volume and consumer convenience, returning luxury and absolute spatial freedom to the physical retail experience.
                  </p>
                  <p className="text-white/90 leading-relaxed">
                    Whether you are exploring designer bridal couture in <span className="text-white font-semibold">Dadar Market</span>, custom fabrics in <span className="text-white font-semibold">Linking Road, Bandra</span>, or historical treasures in <span className="text-white font-semibold">Colaba</span>, our trained companions carry the physical load so you can focus on curation.
                  </p>

                  <ul className="space-y-4 pt-4 border-t border-white/20">
                    <li className="flex items-start gap-3">
                      <span className="text-white mt-1"><CheckCircle2 size={16} /></span>
                      <span className="text-white/90 text-sm">Fully vetted, background-cleared specialists with hospitality training.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-white mt-1"><CheckCircle2 size={16} /></span>
                      <span className="text-white/90 text-sm">Flexible dynamic reservation matching per hour or entire session.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </section>

            {/* Simple Pricing & Services list */}
            <section className="py-24">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                
                <div className="text-center mb-20">
                  <span className="text-white/80 font-bold tracking-widest uppercase text-sm mb-3 block">RATES &amp; SERVICES</span>
                  <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
                    Simple, Transparent <span className="text-white/80">Pricing</span>
                  </h2>
                  <p className="text-white/90 max-w-2xl mx-auto font-normal text-base">No hidden charges, no surprises. Select the package that works best for you and book in minutes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  
                  {/* Service 1: Shopping Assistant */}
                  <div className="bg-white rounded-3xl border border-white/30 overflow-hidden shadow-md transition-all duration-300 flex flex-col group hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        alt="Shopping Assistant helping with bags" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src="/assets/shopping_assistance.jpeg"
                      />
                      <div className="absolute top-4 left-4 bg-[#E75480] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Most Popular
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Shopping Assistant</h3>
                      <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed font-normal">
                        Bag carrying, queue help, market navigation &amp; umbrella support at Mumbai's top markets.
                      </p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-black text-[#E75480]">₹299</span>
                        <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">/ hour</span>
                      </div>
                      <button 
                        onClick={() => handleSelectServiceDirectly(servicesData[0])}
                        className="w-full py-3.5 rounded-2xl bg-[#E75480] hover:bg-[#c93f6a] text-white font-bold uppercase tracking-widest text-sm transition-all cursor-pointer text-center">
                        Book Now
                      </button>
                    </div>
                  </div>

                  {/* Service 2: Senior Citizen Assistant */}
                  <div className="bg-white rounded-3xl border border-white/30 overflow-hidden shadow-md transition-all duration-300 flex flex-col group hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        alt="Senior citizen care assistant" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src="/assets/senioer_citizen.jpeg"
                      />
                      <div className="absolute top-4 left-4 bg-[#E75480] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Elder Care
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Senior Citizen Care</h3>
                      <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed font-normal">
                        Trusted support for seniors — shopping, hospital visits, pharmacy &amp; companionship.
                      </p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-black text-[#E75480]">₹349</span>
                        <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">/ hour</span>
                      </div>
                      <button 
                        onClick={() => handleSelectServiceDirectly(servicesData[1])}
                        className="w-full py-3.5 rounded-2xl bg-[#E75480] hover:bg-[#c93f6a] text-white font-bold uppercase tracking-widest text-sm transition-all cursor-pointer text-center">
                        Book Now
                      </button>
                    </div>
                  </div>

                  {/* Service 3: Personal Task */}
                  <div className="bg-white rounded-3xl border border-white/30 overflow-hidden shadow-md transition-all duration-300 flex flex-col group hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        alt="Personal task assistant" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src="/assets/personal_errand.jpeg"
                      />
                      <div className="absolute top-4 left-4 bg-[#E75480] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Task Pro
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Personal Task</h3>
                      <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed font-normal">
                        Queue standing, courier, document submission, government office visits & bill payments.
                      </p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-black text-[#E75480]">₹299</span>
                        <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">/ task</span>
                      </div>
                      <button 
                        onClick={() => handleSelectServiceDirectly(servicesData[2])}
                        className="w-full py-3.5 rounded-2xl bg-[#E75480] hover:bg-[#c93f6a] text-white font-bold uppercase tracking-widest text-sm transition-all cursor-pointer text-center">
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* The diblo Difference creed block */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                  <div className="relative z-10 max-w-4xl">
                    <h2 className="font-display text-4xl font-black text-white mb-12">
                      Why Choose <span className="text-white/80">Diblo</span>?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white/15 p-6 rounded-2xl border border-white/20">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-4">
                          <ShoppingBag size={22} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Mumbai Market Experts</h3>
                        <p className="text-sm text-white/80 leading-relaxed">Our assistants know every lane, vendor, and shortcut in Mumbai's top markets so you don't have to.</p>
                      </div>

                      <div className="bg-white/15 p-6 rounded-2xl border border-white/20">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-4">
                          <Award size={22} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Trained Professionals</h3>
                        <p className="text-sm text-white/80 leading-relaxed">Every associate goes through rigorous hospitality training, etiquette coaching, and safety certifications.</p>
                      </div>

                      <div className="bg-white/15 p-6 rounded-2xl border border-white/20">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-4">
                          <ShieldCheck size={22} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">24x7 Support</h3>
                        <p className="text-sm text-white/80 leading-relaxed">Round-the-clock booking support, live GPS tracking, and tamper-sealed parcel security at all times.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats / Trust section */}
            <section className="py-16 bg-[#E75480]">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                  <div>
                    <div className="text-4xl font-black mb-1">100%</div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-white/80">Verified Assistants</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-1">1000+</div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-white/80">Service Hours</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-1">500+</div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-white/80">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-1">24×7</div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-white/80">Booking Support</div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="bg-white border border-rose-100 rounded-3xl p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                      Book Your <span className="text-[#E75480]">Diblo Assistant</span> Today
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg mb-8 max-w-xl font-normal leading-relaxed">
                      Experience stress-free shopping, senior care, and task services across Mumbai. Verified professionals, transparent pricing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => navigateTo('booking')}
                        className="px-8 py-4 bg-[#E75480] hover:bg-[#c93f6a] text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer shadow-lg shadow-pink-200">
                        Book Online Now
                      </button>
                      <a 
                        href="https://wa.me/918291919829?text=Hello%20Diblo%2C%20I%20would%20like%20to%20book%20an%20assistant."
                        target="_blank" rel="noopener noreferrer"
                        className="px-8 py-4 bg-[#25D366] hover:bg-[#1da851] text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                        <MessageCircle size={16} /> WhatsApp Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </motion.div>
        )}
        {/* VIEW: SERVICES */}
        {activeTab === 'services' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="pb-20 max-w-7xl mx-auto px-6 md:px-12 pt-12">
            
            {/* Header */}
            <div className="mb-16">
              <span className="text-white font-bold tracking-widest uppercase text-xs mb-3 block">
                ⭐ Elevating Retail Logistics
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
                Experience Luxury <span className="text-white/80">Hands-Free.</span>
              </h1>
              <p className="text-white/90 max-w-2xl text-base">
                At <span className="font-semibold text-white">diblo</span>, we redefine your marketplace stroll. From bulk bridal lifting to custom stroller assistance, we protect your shopping peace.
              </p>
            </div>

            {/* Service Cover with live metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
              <div className="lg:col-span-6 relative animate-fade-in">
                <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-xl">
                  <img 
                    alt="Active market assistance carrying" 
                    className="w-full h-[400px] object-cover object-center"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx85glMqhzuMyWwvzFcvTDABTRcuZxU1fNovWDfqPtIqiIS4LBNpqqNDFUYYjGoFimhtyx_CSZFKElaps-4FwnaarnRX_pA1fntBYxRZk59OUa31lhDPRPeshQZ1Kzm6-vKGGXj_nmmSUVc0tUL-yvRznN6udMfti3yAWQmfcCyl5ugty0PRTckLjXZSIXlFH-eYFU4qXHkZL6lKG5XkUFRxZQO96BZWOdy5p_8DQ1Str5eO5ShbDltftrs4laPH_aISriRno7rUZ7" 
                  />
                </div>
                {/* Micro capsule badge */}
                <div className="absolute -bottom-6 -left-6 bg-slate-900 p-5 rounded-2xl border border-slate-800 max-w-[260px] shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#b60055] text-white flex items-center justify-center font-bold text-sm rounded-full">
                      4.9
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] tracking-wider uppercase text-white">Top Rated Support</h4>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5">Assigned companions match high rating metrics over thousands of strolls.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 space-y-6">
                <h2 className="font-display text-2xl md:text-3xl font-black text-white">Our Signature Support Packages</h2>
                <p className="text-white/90 leading-relaxed text-sm">
                  We deploy professionals specifically matched to your trip purpose. Whether you require standard bag holding, multi-hour luxury escorting, or accessory stroller aid, we have you fully cataloged.
                </p>
                <div className="p-6 bg-white/15 border border-white/20 rounded-2xl">
                  <h4 className="font-bold text-white mb-1 flex items-center gap-1.5 text-xs tracking-wider uppercase">
                    <Sparkles size={14} className="text-white" /> Dynamic Real-time Updates
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed mt-2">
                    Track the exact volume of bags logged in your helper's hand directly through your live mobile browser dashboard widget. Safe, simple, and transparent.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Grid layout of services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              
              {/* Box 1 - White card on pink */}
              <div className="bg-white border border-white/20 p-8 rounded-3xl flex flex-col hover:shadow-xl shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-[#E75480] flex items-center justify-center font-bold mb-6">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Bag Carrying</h3>
                <p className="text-slate-600 text-xs mb-6 flex-grow">
                  Standard bag handling across the market corners. Let our specialists carry the physical loads while you stroll in absolute lightness.
                </p>
                <div className="mt-8 pt-4 border-t border-rose-100 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-black text-[#E75480]">₹79</span>
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider"> / hour</span>
                  </div>
                  <button 
                    onClick={() => handleSelectServiceDirectly(servicesData[0])}
                    className="px-4 py-2 bg-[#E75480] hover:bg-[#c93f6a] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Box 2: Premium Shopping Support */}
              <div className="bg-[#b60055] border border-rose-400/35 p-8 rounded-3xl flex flex-col transition-all duration-300 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="w-12 h-12 rounded-full bg-white text-[#b60055] flex items-center justify-center font-extrabold mb-6">
                  <Compass size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Shopping Support</h3>
                <p className="text-white/80 text-xs mb-6 flex-grow font-light">
                  An enhanced log assistant including wholesale store finder guidance, premium queue management, and secure umbrella holdings for your full group trip.
                </p>
                <div className="mt-8 pt-4 border-t border-rose-400/35 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-extrabold text-white">₹149</span>
                    <span className="text-rose-100 text-[10px] uppercase font-semibold"> / session</span>
                  </div>
                  <button 
                    onClick={() => handleSelectServiceDirectly(servicesData[2])}
                    className="px-4 py-2 bg-white text-[#b60055] hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider rounded-full cursor-pointer">
                    Popular Choice
                  </button>
                </div>
              </div>

              {/* Box 3 - White card on pink */}
              <div className="bg-white border border-white/20 p-8 rounded-3xl flex flex-col hover:shadow-xl shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-[#E75480] flex items-center justify-center font-bold mb-6">
                  <Baby size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Add-on Assistance</h3>
                <p className="text-slate-600 text-xs mb-6 flex-grow">
                  Special care assistance specifically customized to manage premium prams, baby carry packs, or senior hydration flasks smoothly.
                </p>
                <div className="mt-8 pt-4 border-t border-rose-100 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-black text-[#E75480]">₹129</span>
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider"> / hour</span>
                  </div>
                  <button 
                    onClick={() => handleSelectServiceDirectly(servicesData[1])}
                    className="px-4 py-2 bg-[#E75480] hover:bg-[#c93f6a] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer">
                    Select Plus
                  </button>
                </div>
              </div>

            </div>

            {/* Coming Soon Teaser Banner */}
            <div className="relative w-full rounded-3xl overflow-hidden group mb-24 border border-rose-100 bg-slate-950 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10"></div>
              <img 
                alt="Coming soon premium shop" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8rAfI7Zt4SiHqFy8M-goLyQsEVIkUzl0Iq8Vw_4NOjsFdMFgigSIBc8McwTKaPhP3CheiQxJp3btOW4lu0xMExZVLmZcACfxe2ELdOcd77Pey1OwCn08XmabooKeBPr7EusKulnCRITSjkFVj8usrpYAgYSZjEgVhmdk6VsiYceYCG-a6bf46HCQmGf2xBPBdebWsdCjd__fflWbiHCMB6T37adlQVIYl6vD7YNmfXNHqYgcVRrADA0LJKrC3ADCzc-q53mgK4Fgl"
              />
              
              <div className="relative z-20 px-8 py-16 sm:p-20 max-w-2xl flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-[#b60055]/40 backdrop-blur-md border border-rose-300 px-4 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-6 w-fit animate-pulse">
                  <Sparkles size={12} /> Coming Soon
                </div>
                <h2 className="text-white font-display text-4xl font-extrabold mb-4 leading-tight">
                  diblo <span className="text-rose-450">Elite</span> Lounge
                </h2>
                <p className="text-white/70 text-xs sm:text-sm mb-8 leading-relaxed font-light">
                  A bespoke, white-glove experience featuring professional styling consults, curated boutique routing, premium skip-the-line checkouts, and luxury store door transfers. Elevate your status with diblo Elite.
                </p>
                
                {/* Waitlist form */}
                <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter email for priority waitlist" 
                    value={emailWaitlist}
                    onChange={(e) => setEmailWaitlist(e.target.value)}
                    className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-400 placeholder-white/50"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-[#b60055] hover:bg-rose-700 text-white px-6 py-3 rounded-2xl font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer shrink-0">
                    Join Waitlist
                  </button>
                </form>

                {waitlistSuccess && (
                  <p className="text-emerald-400 text-xs font-semibold mt-3 animate-bounce">
                    ✓ Success! You have been prioritized for diblo Elite VIP beta launch!
                  </p>
                )}
              </div>
            </div>
            {/* Partner Hiring Teaser Banner */}
            <div className="relative w-full rounded-3xl overflow-hidden mb-24 border border-rose-100 bg-[#E75480] shadow-xl flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 md:w-2/3 text-left">
                <h2 className="text-white font-display text-3xl font-extrabold mb-3">
                  Want to work with <span className="text-slate-900">Diblo</span>?
                </h2>
                <p className="text-white/90 text-sm md:text-base font-light mb-6 md:mb-0 max-w-lg">
                  We are hiring verified local assistants in Mumbai. Enjoy flexible timings, daily payouts, and a great work environment. No prior experience needed.
                </p>
              </div>
              <div className="relative z-10 md:w-1/3 flex md:justify-end w-full">
                <button 
                  onClick={() => navigateTo('partner')}
                  className="w-full md:w-auto bg-white text-[#E75480] hover:bg-rose-50 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-pink-900/20 whitespace-nowrap cursor-pointer">
                  Join as Partner
                </button>
              </div>
            </div>

            {/* The diblo Standard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-3xl font-black mb-8 text-white">
                  The <span className="text-white/80">diblo</span> Standard
                </h2>
                <div className="space-y-8">
                  {/* Item 1 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0">
                      <UserCheck size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-sm uppercase tracking-wider">Vetted Professionals</h4>
                      <p className="text-white/80 text-xs font-light">Every en-route assistant undergoes detailed criminal, reference, and biometrics verification checks.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-sm uppercase tracking-wider">Real-time Coordination</h4>
                      <p className="text-white/80 text-xs font-light">Active real-time map GPS tracking and a live assistant chat widget to rendezvous with zero tension.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-sm uppercase tracking-wider">Transparent Pricing</h4>
                      <p className="text-white/80 text-xs font-light">No surge fees, secret commissions, or surprise extras. Pay strictly for simulated hourly support logs.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert quote card box */}
              <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <span className="text-rose-100 font-display text-8xl absolute -top-8 -left-2 select-none font-serif">“</span>
                  <img 
                    alt="Expert young assistance" 
                    className="w-32 h-32 rounded-full mx-auto object-cover border border-rose-100 mb-6" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFlGqg1DtZHWNDPJaWSqDnpf52WfyE120dfszrQRzk_GfI8SPruSN-KPs3Xc6g8_2Tg784ESQ4a5uBO93OWFHQhMan6Q7aSyJICYo9MwvjRYnN1lp8pn58nVElsIiDUo3x7QQfmSIIpXfkfb5c8QmWYKyTAbpj8xpIGgrdMuABSS1HUIUeOzV51pLf6U-7pvgMh_McAAsPoZtvtzpkTuo-3U6SiPLatRj5X0LXRQjkGUxU6DC_ct53grD_LxgCQy9B0ZvVI-UkO6pi"
                  />
                  <h3 className="font-bold text-slate-950 text-sm uppercase tracking-widest">EXPERT SERVICES UNIT</h3>
                  <p className="text-slate-500 text-xs mt-1">Full-Time Vetted Specialists</p>
                  <p className="text-slate-600 mt-4 max-w-sm mx-auto italic font-light text-xs text-center leading-relaxed font-normal">
                    "Our coordinates are fully mapped to ease your walk. We hold all bag tags safely so you can evaluate colors and size fits without fatigue."
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW: ABOUT US */}
        {activeTab === 'about' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="pb-20">
            
            {/* Hero */}
            <section className="pt-12 pb-20 max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="text-white font-bold tracking-widest uppercase text-xs mb-4 block">
                    ❤ DIBLO MISSION
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl font-black mb-6 text-white leading-tight">
                    We build trust through <span className="text-white/80">every action</span>.
                  </h1>
                  <p className="text-white/90 text-base mb-8 leading-relaxed font-light">
                    At <span className="font-semibold text-white">diblo</span>, we believe that physical marketplace support should be elegant, incredibly safe, and reliable. Our mission is to provide outstanding customer support while setting gold standards for safety and hospitality.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-2 rounded-full">
                      <UserCheck size={16} className="text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wide">100% Verified Crew</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-2 rounded-full">
                      <ShieldCheck size={16} className="text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wide">Captain Supervised</span>
                    </div>
                  </div>
                </div>

                {/* Corporate Team Photo */}
                <div>
                  <div className="p-1 border border-rose-100 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform shadow-xl">
                    <img 
                      alt="Diblo corporate crew in magenta premium apparel" 
                      className="w-full h-[320px] object-cover rounded-3xl" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhHgis7tJNqHMj90Y8yvNmCW79BHHVPnv29pObTLptvgYPzMX7rnhHxYUzL3l3zYQXsi_IgrwRDya_cSimvMSTXlVIorkf68EJyn_btggSqGNvIJSblkI4K4KC3UxXxnGQ2gbp561D-d899A14W8gfEZ1OkeiM6v3gv5wnqIuQ4ewOo-5PHoiIxxHdORHV264Hktct4EZGQYX_wqKpC9rJ-FMqGPRp6mbSJxuFPvIiL4Kg3AQMP_vY6nO6e7fpSy01aOU4EszZt85A"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Our Story and vision dual images block */}
            <section className="py-20 bg-slate-50 border-t border-b border-rose-100/40">
              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Graphics story column */}
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    alt="Two diblo sync tablet in office" 
                    className="w-full h-64 sm:h-80 object-cover rounded-3xl border border-slate-200 shadow-md" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTDc-9BfUBKLNMjOahD2qPfzsuUEhb-3UrZeNTH6Y79PYVBD4ic6zN45yDFdSd2IL86Fz6FDc0tZJCpXvejxHi71O7MAEdQ-giLwf0CXQ0N5GqWXHP17SAEFwewsiBU6N2GYhAgaaW9oUHHiGomwnNSnSi-5NBIigfQuLevSr6ouIFCx1vQx0ikqLNmnYE3FQnmFsDypnpEpD7pXKymK7sNYRJq7lQA6HknQ8YCyzA1juaie8Iyhf-YQybKB3pb8hpl0bgGdRGj1aX"
                  />
                  <img 
                    alt="Empathetic assistance showing digital tech mobile support to elderly" 
                    className="w-full h-64 sm:h-80 object-cover rounded-3xl border border-slate-200 shadow-md -translate-y-4" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvROF7OPFeoNMR4chtNr84hqgP5qp47GEJR7h6ADgzJziHcj6IKlVMOdOOPlsv-wg3yXr4aLxHepQXveL9Nq9O-fgbk9ByVWhXIBNgFneaG1GW6TYG_E8JBSGQ1231wqpmNTZsjxr22UHEFjfVJ9Nzc2nEKwlfAQrfhgvuQUTO8-yKZdohp2sBHKu0fH4BUMHpgh7C_98U8El-TPrxvua3_rrLpphSLGuqPQSXnnVbNNqJFjobU1h66_Ik6T6Nls6egUuoPFhWNLND"
                  />
                </div>

                {/* Copy Text */}
                <div>
                  <h2 className="font-display text-3xl font-black text-slate-900 mb-6">
                    Our Story &amp; <span className="text-[#b60055]">Vision</span>
                  </h2>
                  <div className="space-y-4 text-slate-600 font-light text-xs sm:text-sm leading-relaxed">
                    <p>
                      diblo started with a very human observation: while digital delivery was moving incredibly fast, matching offline human logistics with reliable trust remained an unsolved riddle. We saw families struggle with bulk heavy bags, elders feeling fatigued, and mothers carrying bulky strollers amidst market lanes.
                    </p>
                    <p>
                      We reimagined shopping assistance from the bedrock up. We ditched unstable third-party gig networks, staffing instead certified full-time employee partners with living-wage packages and corporate safety standards.
                    </p>
                    <p>
                      Our vision is to form a safe, beautiful offline platform layer across India's shopping markets, making walkabouts a fully accessible, zero-fatigue high-end stroll. Every pink polo represents ultimate safety and hospitality.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Bento Grid: Safety Above All */}
            <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
              <div className="text-center mb-16">
                <h2 className="font-display text-4xl font-black mb-4 text-slate-900">
                  Safety <span className="text-[#b60055]">Above</span> All
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm font-light">
                  We do not simply promise safe assistance. We hard-engineer it into each level of on-ground marketplace operations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-[#b60055] rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#b60055] mb-2">Police Verified</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Every assistant undergoes comprehensive third-party national criminal record verification and address validation before on-ground induction.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-[#b60055] rounded-full flex items-center justify-center mb-6">
                    <UserCheck size={24} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#b60055] mb-2">ID-Verified</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    We utilize digital biometric locks and government ID confirmation to guarantee your en-route helper is precisely who the dashboard shows.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-[#b60055] rounded-full flex items-center justify-center mb-6">
                    <Award size={24} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#b60055] mb-2">Captain Supervised</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    All crew operates under command monitoring. Regional captains provide live support, umbrella parcels, and instant swap-outs if needed.
                  </p>
                </div>

              </div>
            </section>

            {/* "What Makes Us Different" with scanner helper */}
            <section className="py-20 bg-slate-50 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Lists with icons */}
                <div>
                  <h2 className="font-display text-3xl font-black text-slate-900 mb-8">
                    What Makes Us <span className="text-[#b60055]">Different</span>
                  </h2>
                  <div className="space-y-6">
                    
                    {/* Item 1 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 text-[#b60055] flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#b60055] uppercase tracking-wider mb-1">Human-First Protocol</h4>
                        <p className="text-slate-600 font-light text-xs sm:text-sm">
                          Unlike predatory gig apps, our crew partners are permanent full-time employees with healthcare and living-wage protection. This guarantees genuine care.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 text-[#b60055] flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#b60055] uppercase tracking-wider mb-1">Standardized Excellence</h4>
                        <p className="text-slate-600 font-light text-xs sm:text-sm">
                          From our custom high-visibility apparel to our secure tamper proof trunk barcodes, everything runs to systematic, elite hospitality guidelines.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 text-[#b60055] flex items-center justify-center font-bold text-xs shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#b60055] uppercase tracking-wider mb-1">24/7 Live Support Command</h4>
                        <p className="text-slate-600 font-light text-xs sm:text-sm">
                          Every walking checkpoint stays verified via active telemetry. You can add instruction, call, or review logs instantly from your panel.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Scanner Assistant Cover */}
                <div className="relative">
                  <div className="p-1 border border-rose-100 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform">
                    <img 
                      alt="Male diblo assistant portrait holding logistic scanner" 
                      className="w-full h-[460px] object-cover rounded-3xl" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyOe45TfI6U0NbM-77b1u7NA4THelvDMc24S5ExPTHjCOq0PEC-wXZfQ3SQE0e1gceVR0uR8ctgqyFIJNdoRgIyL_jyCkuLGhcr7LP9oMvVXp1I5csTJNYclr2Th85vmElrhav16NExbl7CVTgv5EC0XL3ZltSMrspU1WeAj-GPMHqVnq6hQ2ibq7myEEZ6m7z-nc0POUKKhhQsknMInYky2kCGCJn36rtMNFnFcDSBg6w8dvur5-gEJHiLKymizirQCendkdvB7iB"
                    />
                  </div>
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-rose-100/10 rounded-full blur-2xl"></div>
                </div>

              </div>
            </section>

            {/* CTA */}
            <section className="py-16 max-w-7xl mx-auto px-6 md:px-12">
              <div className="bg-white border border-rose-100 rounded-3xl p-10 md:p-16 text-center text-slate-800 relative overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-xl mx-auto">
                  <h2 className="font-display text-3xl font-black mb-4 text-slate-900">
                    Experience the <span className="text-[#b60055]">diblo</span> Difference
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-light mb-8 leading-relaxed">
                    Ready to stroll hand-free under the care of verified, polite corporate assistance? Reserve your partner in under 60 seconds.
                  </p>
                  <button 
                    onClick={() => navigateTo('booking')}
                    className="bg-[#b60055] hover:bg-rose-700 text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer hover:shadow-lg">
                    Book Your First Support Session
                  </button>
                </div>
              </div>
            </section>

          </motion.div>
        )}

        {/* VIEW: JOIN AS PARTNER */}
        {activeTab === 'partner' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pb-20">

            {/* Hero Banner */}
            <section className="relative bg-slate-900 py-24 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E75480]/30 via-slate-900 to-slate-950" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#E75480]/10 rounded-full blur-3xl" />
              <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
                <span className="inline-block px-5 py-2 mb-6 rounded-full border border-[#E75480]/40 bg-[#E75480]/10 text-[#E75480] font-bold text-sm tracking-widest uppercase">
                  💼 We're Hiring Partners
                </span>
                <h1 className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                  Become a <span className="text-[#E75480]">Diblo</span> Assistant
                </h1>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed font-normal mb-10">
                  Join Mumbai's fastest-growing urban assistance platform. Work flexible hours, earn well, and make a real difference in people's daily lives.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
                    <span className="text-[#E75480]"><CheckCircle2 size={16} /></span>
                    <span className="text-white text-sm font-semibold">Flexible Timings</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
                    <span className="text-[#E75480]"><CheckCircle2 size={16} /></span>
                    <span className="text-white text-sm font-semibold">Daily/Weekly Payouts</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
                    <span className="text-[#E75480]"><CheckCircle2 size={16} /></span>
                    <span className="text-white text-sm font-semibold">Free Uniform & Training</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
                    <span className="text-[#E75480]"><CheckCircle2 size={16} /></span>
                    <span className="text-white text-sm font-semibold">No Experience Needed</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-[#FCFBF9]">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-14">
                  <h2 className="font-display text-4xl font-black text-slate-900 mb-4">
                    Why Partner with <span className="text-[#E75480]">Diblo</span>?
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto text-base font-normal">We believe our partners deserve the best. Here's what you get when you join the Diblo family.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                  <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm hover:shadow-md hover:border-[#E75480]/30 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E75480] mb-5">
                      <Clock size={26} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Flexible Working Hours</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Work morning, afternoon, or weekend slots — you choose your own schedule. Perfect for part-time or full-time earners.</p>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm hover:shadow-md hover:border-[#E75480]/30 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E75480] mb-5">
                      <Award size={26} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Free Training & Uniform</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">We provide complete on-ground training, a smart Diblo uniform, and all equipment at no cost to you.</p>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm hover:shadow-md hover:border-[#E75480]/30 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E75480] mb-5">
                      <Zap size={26} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Daily / Weekly Payouts</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Get paid quickly and reliably. Earnings are settled daily or weekly directly to your bank or UPI account.</p>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm hover:shadow-md hover:border-[#E75480]/30 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E75480] mb-5">
                      <ShieldCheck size={26} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Safety & Insurance</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">All partners are covered under Diblo's partner insurance policy. Your safety is our priority, on and off the field.</p>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm hover:shadow-md hover:border-[#E75480]/30 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E75480] mb-5">
                      <ThumbsUp size={26} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Respectful Work Culture</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">We treat every partner with dignity and respect. Diblo has a zero-tolerance policy for abuse or mistreatment of staff.</p>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm hover:shadow-md hover:border-[#E75480]/30 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E75480] mb-5">
                      <MapPin size={26} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Work Near Your Area</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">We match partners to markets close to their home location — Dadar, Crawford, Linking Road, Colaba, and more.</p>
                  </div>

                </div>
              </div>
            </section>

            {/* How It Works for Partners */}
            <section className="py-20 bg-white border-y border-rose-100">
              <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                <h2 className="font-display text-4xl font-black text-slate-900 mb-4">
                  How the <span className="text-[#E75480]">Process Works</span>
                </h2>
                <p className="text-slate-600 text-base mb-14 font-normal">From application to your first assignment, here's what to expect.</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  {[
                    { step: '01', title: 'Fill the Form', desc: 'Submit your details via the Google Form below. Takes just 3 minutes.' },
                    { step: '02', title: 'We Call You', desc: 'Our team reviews your application and calls you within 24–48 hours.' },
                    { step: '03', title: 'Verification', desc: 'Quick Aadhaar & police verification. We handle the paperwork.' },
                    { step: '04', title: 'Start Earning', desc: 'Attend a short training and get assigned to your first market slot.' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#E75480] text-white font-black text-xl flex items-center justify-center mb-4 shadow-lg shadow-pink-200">{step}</div>
                      <h4 className="font-bold text-base text-slate-900 mb-2">{title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Google Form Embed Section */}
            <section className="py-20 bg-[#FCFBF9]">
              <div className="max-w-4xl mx-auto px-6 md:px-12">
                <div className="text-center mb-10">
                  <span className="inline-block px-4 py-2 mb-4 rounded-full border border-rose-200 bg-rose-50 text-[#E75480] font-bold text-sm tracking-wide">
                    📋 Partner Application Form
                  </span>
                  <h2 className="font-display text-4xl font-black text-slate-900 mb-3">
                    Apply to <span className="text-[#E75480]">Join Diblo</span>
                  </h2>
                  <p className="text-slate-600 text-base max-w-xl mx-auto font-normal">
                    Fill in your details below. Our team will review your application and get back to you within 24–48 hours.
                  </p>
                </div>

                {/* Google Form iframe embed */}
                <div className="bg-white rounded-3xl border border-rose-100 shadow-lg overflow-hidden">
                  <div className="bg-[#E75480] px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Send size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-base">Diblo Partner Application</p>
                        <p className="text-white/70 text-xs">Verified & processed within 24–48 hours</p>
                      </div>
                    </div>
                    <a
                      href="https://forms.gle/YOUR_GOOGLE_FORM_ID"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-[#E75480] font-bold text-sm px-4 py-2 rounded-full hover:bg-rose-50 transition-all flex items-center gap-1.5">
                      <ArrowRight size={14} /> Open in New Tab
                    </a>
                  </div>
                  <iframe
                    src="https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/viewform?embedded=true"
                    width="100%"
                    height="900"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    title="Diblo Partner Application Form"
                    className="block w-full"
                    style={{ minHeight: '900px' }}
                  >
                    Loading form…
                  </iframe>
                </div>

                {/* Alt: WhatsApp Apply */}
                <div className="mt-8 text-center">
                  <p className="text-slate-500 text-sm mb-4">Prefer to apply directly on WhatsApp?</p>
                  <a
                    href="https://wa.me/918291919829?text=Hello%20Diblo%2C%20I%20would%20like%20to%20join%20as%20a%20partner%20assistant.%20Please%20guide%20me%20on%20the%20next%20steps."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-green-200">
                    <MessageCircle size={18} /> Apply via WhatsApp
                  </a>
                </div>
              </div>
            </section>

          </motion.div>
        )}

        {/* VIEW: BOOKING FORM & ACTIVE VIEW */}
        {activeTab === 'booking' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="pb-20 max-w-7xl mx-auto px-6 md:px-12 pt-12">
            
            {/* Header */}
            <div className="mb-12">
              <span className="text-white font-bold tracking-widest uppercase text-sm mb-3 block">
                ✦ BOOK YOUR ASSISTANT
              </span>
              <h1 className="font-display text-4xl font-black text-white mb-3">
                Book Your <span className="text-white/80">Diblo Assistant</span>
              </h1>
              <p className="text-white/90 max-w-2xl text-base font-normal">
                Reserve a verified assistant across Mumbai — Dadar, Crawford Market, Linking Road &amp; more. Fill in the details below and we'll match you instantly.
              </p>
            </div>

            {/* Multi-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Form Input Section */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-rose-100 p-8 shadow-sm relative">
                
                {/* Form header */}
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
                  <span className="p-1.5 bg-rose-50 border border-rose-100 text-[#b60055] rounded-lg"><Calendar size={16} /></span>
                  Reservation Details
                </h2>

                <form onSubmit={handleCreateBooking} className="space-y-6">
                  
                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name <span className="text-[#E75480]">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Priya Sharma"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E75480]/40 text-slate-800 text-sm placeholder:text-slate-400/60 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Phone Number <span className="text-[#E75480]">*</span></label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 98XXX XXXXX"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E75480]/40 text-slate-800 text-sm placeholder:text-slate-400/60 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input 
                      type="email" 
                      placeholder="yourname@email.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E75480]/40 text-slate-800 text-sm placeholder:text-slate-400/60 transition-all"
                    />
                  </div>

                  {/* Market Location and Booking Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Market / Location <span className="text-[#E75480]">*</span></label>
                      <select 
                        value={bookingMarketId}
                        onChange={(e) => setBookingMarketId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E75480]/40 text-slate-800 text-sm cursor-pointer">
                        {marketsData.map(m => (
                          <option key={m.id} value={m.id} className="bg-white">{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Preferred Date</label>
                      <input 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E75480]/40 text-slate-800 text-sm cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Time field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Preferred Time</label>
                    <input 
                      type="time" 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E75480]/40 text-slate-800 text-sm cursor-pointer"
                    />
                  </div>

                  {/* Service Package selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Service Package <span className="text-[#E75480]">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {servicesData.map(s => (
                        <div 
                          key={s.id}
                          onClick={() => setSelectedService(s)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${selectedService.id === s.id ? 'border-[#E75480] bg-rose-50/40 shadow-sm' : 'border-rose-100/50 hover:border-[#E75480]/30 bg-white'}`}>
                          <div>
                            <span className="font-bold text-sm text-slate-800 block">{s.name}</span>
                            <span className="text-xs text-slate-500 leading-relaxed block mt-1">{s.description.substring(0, 55)}...</span>
                          </div>
                          <div className="mt-3 pt-2 border-t border-rose-100/40 flex justify-between items-center">
                            <span className="text-sm font-bold text-[#E75480]">₹{s.pricePerHour}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-wider">/{s.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                      <span className="text-sm font-black text-[#E75480]">{bookingDuration} Hour{bookingDuration > 1 ? 's' : ''}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={bookingDuration}
                      onChange={(e) => setBookingDuration(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-rose-100 rounded-full appearance-none cursor-pointer accent-[#E75480]"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1 hr (Quick)</span>
                      <span>5 hrs (Standard)</span>
                      <span>10 hrs (Full Day)</span>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Special Requirements <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <textarea 
                      rows={3}
                      value={bookingRequirements}
                      placeholder="e.g. Need wheelchair assistance, senior citizen care, heavy bag support, baby pram handling..."
                      onChange={(e) => setBookingRequirements(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E75480]/40 text-slate-800 text-sm placeholder:text-slate-400/60 transition-all resize-none"
                    />
                  </div>

                  {/* Estimated Cost Panel */}
                  <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Estimated Total</span>
                      <span className="text-sm text-slate-600 block mt-0.5">₹{selectedService.pricePerHour} × {bookingDuration} hour{bookingDuration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#E75480]">₹{calculatedCost}</span>
                      <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider mt-0.5">Approx. Cost</span>
                    </div>
                  </div>

                  {/* Success Banner */}
                  {bookingSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                      <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-800 text-sm">Booking sent to WhatsApp! 🎉</p>
                        <p className="text-xs text-emerald-700 mt-0.5">Our team will confirm your booking shortly. Please keep WhatsApp open.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Submission Button */}
                  <button 
type="submit"
                    className="w-full py-4 bg-[#E75480] hover:bg-[#c93f6a] text-white font-bold rounded-2xl text-base tracking-wider uppercase hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-3 shadow-lg shadow-pink-200">
                    <MessageCircle size={20} />
                    Book via WhatsApp
                  </button>
                  <p className="text-center text-xs text-slate-400">Tapping above will open WhatsApp with your details pre-filled. Our team confirms within minutes.</p>

                </form>

              </div>

              {/* Sidebar Information Section */}
              <div className="lg:col-span-5 space-y-6">

                {/* How it works after booking */}
                <div className="bg-[#E75480] rounded-3xl p-6 text-white shadow-lg">
                  <h3 className="font-bold text-base uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MessageCircle size={18} /> What Happens Next?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm shrink-0">1</div>
                      <p className="text-sm text-white/90">You tap <strong>"Book via WhatsApp"</strong> — your details are sent pre-filled to our team.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm shrink-0">2</div>
                      <p className="text-sm text-white/90">Our team confirms your booking within <strong>minutes</strong> on WhatsApp.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm shrink-0">3</div>
                      <p className="text-sm text-white/90">Your verified <strong>Diblo Assistant</strong> meets you at the selected market on time.</p>
                    </div>
                  </div>
                </div>

                {/* Available Market Hubs */}
                <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="text-[#E75480]"><Compass size={16} /></span>
                    Active Mumbai Markets
                  </h2>
                  <div className="space-y-4">
                    {marketsData.map(m => (
                      <div 
                        key={m.id} 
                        className={`group p-3 rounded-2xl border flex items-center gap-4 transition-all ${bookingMarketId === m.id ? 'border-rose-300 bg-rose-50/40' : 'border-rose-100/40 hover:bg-rose-50/10'}`}>
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-rose-100">
                          <img alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={m.image} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{m.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-light">{m.description.substring(0, 55)}...</p>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 text-[8px] text-[#b60055] font-bold mt-2 uppercase tracking-widest border border-rose-100/50">
                            {m.statusText}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Widget */}
                <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-sm relative h-56 group p-1">
                  <img 
                    alt="Mumbai city map GPS location routes" 
                    className="w-full h-full object-cover transition-transform duration-500 rounded-2xl" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCenLugEMCXEr1BJUsxCuy-DrJcZzrUDBm1FHAL4xq8vNAIi07odRVr-zNf9O0YJCWeOZkGn63gguTMiraqAQoeWOtGmrtKChPvEKJrm7tM_nSkdZQDGaBsuejud7kDxW4Xf4A311BKNqhS_ECevwyBCPKK-g2DLoEbWKsupOneiyYxSwCKiW_Qj70XWJSb8OCoMZUX75xCK7ib68F2m4g-IL0FvY2y2EBzTo9s7We9lQeRsI-rAsyVAzO-dTQKZkfFQBAsXqpisFnn" 
                  />
                  <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 bg-[#E75480] text-white font-bold text-sm uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                      <MapPin size={14} /> Mumbai Markets Active
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick help FAQs */}
            <section className="mt-20 border-t border-rose-100 pt-16">
              <h2 className="font-display text-3xl font-black mb-10 text-slate-900">
                Quick Help <span className="text-[#b60055]">FAQs</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqsData.map((f, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm relative hover:border-[#b60055]/30 transition-colors">
                    <h3 className="font-bold text-[#b60055] mb-2 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wider">
                      <HelpCircle size={14} /> {f.question}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>

          </motion.div>
        )}

        {/* VIEW: LIVE ASSISTANT TRACKING ACTIVE HUB */}
        {activeTab === 'tracking' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="pb-20 max-w-7xl mx-auto px-6 md:px-12 pt-12">
            
            {/* Active alert flag */}
            <div className="bg-white border border-rose-100 p-4 rounded-3xl mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="bg-[#b60055] text-white p-2 rounded-full animate-ping inline-block absolute shrink-0">
                  <Activity size={16} />
                </span>
                <span className="bg-[#b60055] text-white p-2 rounded-full shrink-0 relative">
                  <Activity size={16} />
                </span>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Active shopping mission en-route</h4>
                  <p className="text-[10px] text-slate-500 font-light mt-0.5">Live coordinates synced with regional captains. Keep this page open while you walk.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelSession}
                  className="px-3.5 py-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-[#b60055] rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer">
                  Cancel Run
                </button>
                <button 
                  onClick={handleEndSession}
                  className="px-3.5 py-1.5 bg-[#b60055] hover:bg-rose-700 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer">
                  Mark Completed
                </button>
              </div>
            </div>

            {/* Tracking Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* L: Status and Chats feedback */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Interactive Status Indicator and Timeline progress */}
                <div className="bg-white rounded-3xl border border-rose-100 p-6 md:p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">ID Code & Location</span>
                      <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 mt-1">{activeBooking?.id || 'DB-Active'} • {activeBooking?.marketName}</h2>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[#b60055] text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        {activeBooking?.status === 'pending' ? 'Assigning...' : 'Live escorting'}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal timeline */}
                  <div className="relative pt-4 pb-2">
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-rose-100 -translate-y-1/2 z-0"></div>
                    {/* Progress Fill bar */}
                    <div className={`absolute top-1/2 left-0 h-[1px] bg-[#b60055] -translate-y-1/2 z-0 transition-all duration-1000 ${activeBooking?.status === 'pending' ? 'w-1/4' : 'w-3/4'}`}></div>
                    
                    <div className="relative z-10 flex justify-between">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#b60055] text-white flex items-center justify-center font-bold text-xs shadow">
                          1
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-wide">Requested</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow transition-colors duration-500 ${activeBooking?.status !== 'pending' ? 'bg-[#b60055] text-white' : 'bg-white border border-rose-100 text-slate-400'}`}>
                          2
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-wide">Matched</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-white border border-[#b60055] text-[#b60055] flex items-center justify-center font-bold text-xs shadow animate-pulse">
                          3
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-wide">Escorting</span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-white border border-rose-100 text-slate-300 flex items-center justify-center font-bold text-xs shadow">
                          4
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-wide">Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Assistant Live Chat component */}
                <div className="bg-white rounded-3xl border border-rose-100 shadow-sm flex flex-col h-[400px] overflow-hidden">
                  {/* Chat header */}
                  <div className="px-6 py-4 border-b border-rose-100 flex items-center gap-3 bg-rose-50/30">
                    <div className="relative">
                      <img 
                        alt="Sunil Assistant chat" 
                        className="w-10 h-10 rounded-full object-cover border border-rose-100" 
                        src={activeBooking?.assistant?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFlGqg1DtZHWNDPJaWSqDnpf52WfyE120dfszrQRzk_GfI8SPruSN-KPs3Xc6g8_2Tg784ESQ4a5uBO93OWFHQhMan6Q7aSyJICYo9MwvjRYnN1lp8pn58nVElsIiDUo3x7QQfmSIIpXfkfb5c8QmWYKyTAbpj8xpIGgrdMuABSS1HUIUeOzV51pLf6U-7pvgMh_McAAsPoZtvtzpkTuo-3U6SiPLatRj5X0LXRQjkGUxU6DC_ct53grD_LxgCQy9B0ZvVI-UkO6pi'} 
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border border-white rounded-full"></span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{activeBooking?.assistant?.name || 'Vetted Assistant (Matching)'}</h4>
                      <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                        ● Direct secure link with diblo partner
                      </p>
                    </div>
                  </div>

                  {/* Chat logs */}
                  <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                    {chatMessages.map((m, idx) => (
                      <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl text-xs max-w-sm shadow-sm ${m.sender === 'user' ? 'bg-[#b60055] text-white font-medium rounded-tr-none' : 'bg-white border border-rose-100 text-slate-700 font-light rounded-tl-none'}`}>
                          {m.text}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 font-light">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Message Input form bar */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-rose-100 flex gap-2 bg-white">
                    <input 
                      type="text" 
                      placeholder="Type instruction (e.g. 'Meet at gate 3')" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-grow px-4 py-2.5 bg-slate-50 border border-rose-100 rounded-full focus:outline-none focus:ring-1 focus:ring-[#b60055] text-xs text-slate-800 placeholder:text-slate-400/60 transition-all font-light"
                    />
                    <button 
                      type="submit" 
                      className="bg-[#b60055] hover:bg-rose-700 text-white w-10 rounded-full flex items-center justify-center cursor-pointer font-bold">
                      <Send size={14} />
                    </button>
                  </form>
                </div>

              </div>

              {/* R: Assistant profile and parcel custody widget */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Assistant profile summary */}
                <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm text-center relative overflow-hidden">
                  
                  {activeBooking?.assistant ? (
                    <div className="relative z-10">
                      <img 
                        alt="Assigned expert avatar" 
                        className="w-24 h-24 rounded-full mx-auto object-cover border border-rose-100 shadow mb-4" 
                        src={activeBooking.assistant.avatar} 
                      />
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{activeBooking.assistant.name}</h3>
                      <div className="flex justify-center items-center gap-1.5 text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{activeBooking.assistant.rating} rating</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{activeBooking.assistant.tripsCount} walks completed</span>
                      </div>
                      <p className="text-slate-600 italic mt-3 text-xs leading-relaxed font-light">
                        "{activeBooking.assistant.quote}"
                      </p>
                      
                      <div className="mt-6 pt-5 border-t border-rose-100 flex justify-center gap-4">
                        <a 
                          href={`tel:${activeBooking.assistant.phone}`}
                          className="flex items-center gap-2 bg-[#b60055] hover:bg-rose-700 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">
                          <Phone size={12} /> Call Helper
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#b60055] flex items-center justify-center mx-auto mb-4 animate-spin border-t-transparent">
                        
                      </div>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-slate-800">Matching Assistant...</h3>
                      <p className="text-[10px] text-slate-400 mt-2 max-w-xs mx-auto font-light leading-relaxed">Connecting with premium verified carrying professionals in Lajpat / Sarojini row.</p>
                    </div>
                  )}
                </div>

                {/* Custody list of shop bags */}
                <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                    <span className="text-[#b60055]"><ShoppingBag size={14} /></span>
                    Bags &amp; Parcels in Custody
                  </h3>
                  
                  {/* Bag list */}
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {simulatedBags.map((bag, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-rose-100/50">
                        <span className="text-xs text-slate-700 font-light flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-[#b60055]" /> {bag}
                        </span>
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 uppercase font-bold tracking-widest">
                          Secured
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add bag input */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add new bag (e.g. 'Zara pink box')" 
                      value={newBagInput}
                      onChange={(e) => setNewBagInput(e.target.value)}
                      className="flex-grow px-3 py-2 bg-slate-50 border border-rose-100 rounded-full focus:outline-none focus:ring-1 focus:ring-[#b60055] text-xs text-slate-800 placeholder:text-slate-400/60 font-light"
                    />
                    <button 
                      onClick={handleAddBag}
                      className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-[#b60055] px-3 rounded-full text-xs font-bold cursor-pointer flex items-center justify-center"
                      title="Add Bag">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Standard choice help */}
                <div className="bg-rose-50/40 border border-rose-100 p-4 rounded-3xl">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-[#b60055] mb-1 flex items-center gap-1">
                    <ShieldAlert size={14} /> Full Log Transit Insurance
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                    All items in our custody are protected under diblo priority insurance up to ₹15,000 against weather, theft, or wear checkouts.
                  </p>
                </div>

               </div>

            </div>

          </motion.div>
        )}

      </main>

      {/* Footer Section */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo brand */}
          <div className="space-y-4">
            <img src="/assets/logo.jpeg" alt="Diblo Logo" className="h-10 object-contain rounded" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-normal">
              Mumbai's trusted on-demand human assistance platform — shopping, senior care & personal tasks. Jahan Zarurat, Wahan Diblo.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://wa.me/918291919829?text=Hello%20Diblo%2C%20I%20would%20like%20to%20book%20an%20assistant." target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#1da851] transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a href="tel:+918291919829"
                className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-600 transition-colors">
                <Phone size={14} /> Call Us
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-[#E75480] mb-4 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-normal">
              <li><button onClick={() => navigateTo('about')} className="hover:text-[#E75480] cursor-pointer transition-colors">About Us</button></li>
              <li><button onClick={() => navigateTo('about')} className="hover:text-[#E75480] cursor-pointer transition-colors">Safety Protocols</button></li>
              <li><a href="#navbar-top" className="hover:text-[#E75480] cursor-pointer transition-colors">Careers</a></li>
              <li><a href="tel:+918291919829" className="hover:text-[#E75480] cursor-pointer transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-[#E75480] mb-4 text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-normal">
              <li><button onClick={() => { setSelectedService(servicesData[0]); navigateTo('booking'); }} className="hover:text-[#E75480] cursor-pointer transition-colors">Shopping Assistant</button></li>
              <li><button onClick={() => { setSelectedService(servicesData[1]); navigateTo('booking'); }} className="hover:text-[#E75480] cursor-pointer transition-colors">Senior Citizen Care</button></li>
              <li><button onClick={() => { setSelectedService(servicesData[2]); navigateTo('booking'); }} className="hover:text-[#E75480] cursor-pointer transition-colors">Personal Task Assistant</button></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-bold text-[#E75480] mb-4 text-sm uppercase tracking-widest">Mumbai Markets</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-normal">
              <li><span>Dadar Market</span></li>
              <li><span>Bhuleshwar Market</span></li>
              <li><span>Crawford Market</span></li>
              <li><span>Linking Road, Bandra</span></li>
              <li><span>Colaba Causeway</span></li>
            </ul>
          </div>

        </div>

        {/* Ledger History List */}
        {bookingHistory.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-slate-800">
            <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Your Completed Sessions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookingHistory.map((h, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="font-bold text-white text-sm block">{h.marketName}</span>
                    <span className="text-xs text-slate-400 mt-1 block">{h.serviceName} • {h.durationHours} hrs</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold block mb-1 uppercase tracking-wider ${h.status === 'completed' ? 'bg-rose-900/40 text-[#E75480] border border-rose-800' : 'bg-slate-700 text-slate-400'}`}>
                      {h.status}
                    </span>
                    <span className="font-bold text-[#E75480] text-sm">₹{h.totalCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-slate-800 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2026 Diblo Assist Technologies. All rights reserved.</p>
          <p className="text-slate-500 text-sm">📍 Mumbai, Maharashtra, India</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918291919829?text=Hello%20Diblo%2C%20I%20would%20like%20to%20book%20an%20assistant."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat with us on WhatsApp"
        aria-label="Chat on WhatsApp">
        <MessageCircle size={28} color="white" />
      </a>

      {/* POPUP MODAL: Interactive video/instruction layout */}
      <AnimatePresence>
        {howItWorksOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              className="bg-[#121212] border border-white/10 rounded-none max-w-lg w-full p-6 md:p-8 relative overflow-hidden shadow-2xl">
              
              <button 
                onClick={() => setHowItWorksOpen(false)} 
                className="absolute top-4 right-4 text-white/40 hover:text-[#D16D4B] hover:bg-white/5 p-1 rounded-none cursor-pointer"
                title="Close dialog">
                <X size={20} />
              </button>

              <h2 className="text-xl font-display font-light uppercase tracking-tight text-[#F4F1EA] mb-3 flex items-center gap-1.5">
                <Sparkles className="fill-[#D16D4B] text-[#D16D4B]" size={18} /> How <span className="font-serif italic text-[#D16D4B] lowercase">diblo</span> Works
              </h2>
              <p className="text-xs text-[#F4F1EA]/60 mb-6 leading-relaxed font-light">
                Secure your verified, professional companion with a single-click walkthrough:
              </p>

              {/* Steps list */}
              <div className="space-y-4 mb-8">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-none bg-white/5 border border-white/10 text-[#D16D4B] flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#D16D4B] text-xs uppercase tracking-wider mb-0.5">Submit Reservation Detail</h4>
                    <p className="text-[11px] text-[#F4F1EA]/50 font-light leading-relaxed">Pick Lajpat or Sarojini, key in duration, and select standard or stroller carry packages.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-none bg-white/5 border border-white/10 text-[#D16D4B] flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#D16D4B] text-xs uppercase tracking-wider mb-0.5">Rendezvous Instantly</h4>
                    <p className="text-[11px] text-[#F4F1EA]/50 font-light leading-relaxed">Your assistant meets you at the selected market gate entrance. GPS is matched automatically.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-none bg-white/5 border border-white/10 text-[#D16D4B] flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#D16D4B] text-xs uppercase tracking-wider mb-0.5">Shop Hands-Free</h4>
                    <p className="text-[11px] text-[#F4F1EA]/50 font-light leading-relaxed">Your assistant strolls adjacent holding all parcels safely locked under full-log transit insurance protection.</p>
                  </div>
                </div>
              </div>

              {/* Close CTAs */}
              <div className="flex gap-3">
                <button 
                  onClick={() => { setHowItWorksOpen(false); navigateTo('booking'); }}
                  className="flex-grow py-3 bg-[#D16D4B] text-black rounded-none font-bold hover:bg-[#b05333] tracking-widest uppercase transition-colors cursor-pointer text-center text-xs">
                  Book Your Partner Now
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL: Rating Feedback Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              className="bg-[#121212] border border-white/10 rounded-none max-w-md w-full p-8 text-center relative shadow-2xl">
              
              <div className="relative w-16 h-16 mx-auto mb-6 bg-white/5 border border-white/10 text-[#D16D4B] flex items-center justify-center">
                <Star size={28} className="fill-current" />
              </div>

              <h2 className="text-lg font-display font-light uppercase tracking-tight text-[#F4F1EA] mb-2">Rate Your Support Session</h2>
              <p className="text-xs text-[#F4F1EA]/50 mb-6 font-light leading-relaxed">Your real-time evaluation is directly utilized by regional captains to preserve five-star guidelines.</p>

              {/* Stars selection row */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((sVal) => (
                  <button 
                    key={sVal} 
                    onClick={() => setRatingInput(sVal)}
                    className="p-1 focus:outline-none"
                    title={`Rate ${sVal} star`}>
                    <Star 
                      size={28} 
                      className={`cursor-pointer transition-colors ${ratingInput >= sVal ? 'text-[#D16D4B] fill-current' : 'text-white/10'}`} 
                    />
                  </button>
                ))}
              </div>

              {/* Feedback text */}
              <textarea 
                rows={3}
                placeholder="Share your experience (e.g. 'Sunil was helpful and polite carrying heavy boxes!')"
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#161616] border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-[#D16D4B] text-xs text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 transition-all font-light resize-none mb-6"
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-[#F4F1EA]/60 font-bold rounded-none text-xs uppercase tracking-widest transition-colors cursor-pointer">
                  Dismiss
                </button>
                <button 
                  onClick={handleSubmitRating}
                  className="flex-1 py-3 bg-[#D16D4B] hover:bg-[#b05333] text-black font-bold rounded-none text-xs uppercase tracking-widest transition-colors cursor-pointer">
                  Submit Feedback
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
