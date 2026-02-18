import { Hammer, Users, MapPin, Phone, Mail, Clock, Award, Shield, TrendingUp, Package, Wrench, ChevronRight, Star, Layers, Lock, Leaf, Send, FileText, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [quoteData, setQuoteData] = useState({ name: '', email: '', phone: '', projectDetails: '', honeypot: '' });
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMessage('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: newsletterEmail }]);

      if (error) {
        if (error.code === '23505') {
          setNewsletterMessage('This email is already subscribed.');
        } else {
          setNewsletterMessage('Error subscribing. Please try again.');
        }
      } else {
        setNewsletterMessage('Thank you for subscribing!');
        setNewsletterEmail('');
      }
    } catch {
      setNewsletterMessage('Error subscribing. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const validateQuoteForm = (): string | null => {
    if (!quoteData.name.trim() || quoteData.name.trim().length < 3) {
      return 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(quoteData.email)) {
      return 'Please enter a valid email address';
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phoneRegex.test(quoteData.phone)) {
      return 'Please enter a valid phone number';
    }

    if (!quoteData.projectDetails.trim() || quoteData.projectDetails.trim().length < 10) {
      return 'Project details must be at least 10 characters/words';
    }

    if (quoteData.honeypot) {
      return 'Invalid form submission';
    }

    return null;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);
    setQuoteMessage('');

    const validationError = validateQuoteForm();
    if (validationError) {
      setQuoteMessage(validationError);
      setQuoteLoading(false);
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteData.name,
          email: quoteData.email,
          phone: quoteData.phone,
          projectDetails: quoteData.projectDetails,
          honeypot: quoteData.honeypot
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await supabase
          .from('quote_requests')
          .insert([{
            name: quoteData.name,
            email: quoteData.email,
            phone: quoteData.phone,
            project_details: quoteData.projectDetails
          }]);

        setQuoteMessage('Thank you, your quote request has been sent. We\'ll contact you shortly.');
        setQuoteData({ name: '', email: '', phone: '', projectDetails: '', honeypot: '' });
      } else {
        setQuoteMessage(result.message || 'Error submitting quote request. Please try again.');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      setQuoteMessage('Error submitting quote request. Please try again.');
    } finally {
      setQuoteLoading(false);
    }
  };

  const branches = [
    { name: 'Dwarsloop', region: 'Mpumalanga' },
    { name: 'Dayizenza', region: 'Mpumalanga' },
    { name: 'Elukwatini', region: 'Mpumalanga' },
    { name: 'Kwamhlanga', region: 'Mpumalanga' },
    { name: 'Numbi', region: 'Mpumalanga' }
  ];


  const products = [
    { icon: Hammer, name: 'Building Materials', items: 'Cement, Bricks, Sand, Aggregates', image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { icon: Wrench, name: 'Tools & Equipment', items: 'Power Tools, Hand Tools, Safety Gear', image: 'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { icon: Package, name: 'Plumbing Essentials', items: 'Fixings, Fasteners, Adhesives', image: 'https://media.istockphoto.com/id/869658498/photo/plumbing-tools-and-accessories-on-wooden-table-top-view.jpg?s=612x612&w=0&k=20&c=ED8G5fG89rIxvaHKR8DFAKuQywWrLSIw0np-6dGmEsU=' },
    { icon: Shield, name: 'Roofing & Cladding', items: 'IBR Sheets, Ceiling, Insulation', image: 'https://media.istockphoto.com/id/510206115/photo/corrugated-sheets-of-metal.webp?a=1&b=1&s=612x612&w=0&k=20&c=7Tzt_pWi7pIUFhuSn0RDBIi2D_nPJ3jWVEAzf8q94Yg=' },
    { icon: Layers, name: 'Flooring & Finishes', items: 'Tiles, Paint, Varnish, Sealers', image: 'https://media.istockphoto.com/id/1297516234/photo/ceramic-tiles-installation.jpg?s=612x612&w=0&k=20&c=JP4-GFDDgSUL3na-xt-LN3iGGfYTviGZh4NEaX92vhM=' },
    { icon: Package, name: 'Doors & Fittings', items: 'Wooden Doors, Metal Frames, Hardware', image: 'https://media.istockphoto.com/id/1265555577/photo/window-selection.jpg?s=612x612&w=is&k=20&c=70_BVZZy9zwWnEMRkL2rFcP1jc9GDihLegHt4xVF9Rc=' },
    { icon: Lock, name: 'Security', items: 'Locks, Hinges, Padlocks, Chains', image: 'https://images.unsplash.com/photo-1754414266760-f21ba503ce9f?q=80&w=1697&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  
    { icon: Leaf, name: 'Garden & Decoration', items: 'Landscaping, Pavers, Outdoor Accessories', image: 'https://www.istockphoto.com/vector/vector-wheelbarrow-with-garden-accessories-gm528915710-93144885' }
  ];

  const trustedBrands = [
    { name: 'INCGO', logo: 'https://seeklogo.com/free-vector-logos/ingco' },
    { name: 'MAMBA CEMENT', logo: 'https://images.pexels.com/photos/3681881/pexels-photo-3681881.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'LIN TANK', logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'MEDAL PAINT', logo: 'https://medalpaints.co.za/wp-content/uploads/2025/01/paint-stroke-medal.webp' },
    { name: 'GOLDEN CHOICE PAINTS', logo: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'DURAM PAINT', logo: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'EUREKA', logo: 'https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'ACADEMY BRUSHWARE', logo: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'POWAFIX', logo: 'https://www.powafix.co.za/wp-content/uploads/2020/02/Powafix-logo2x_216.png' },
    { name: 'PPC CEMENT', logo: 'https://www.ppc.africa/media/sbebd0rr/ppc-horizontal-logo.svg' },
    { name: 'AFRISASM CEMENT', logo: 'https://www.afrisam.co.za/wp-content/themes/afrisam/assets/svg/main-logo.svg' }
  ];

  const stats = [
    { number: '20+', label: 'Years Experience' },
    { number: '5', label: 'Branch Locations' },
    { number: 'Convinience', label: 'Happy Customers' },
    { number: 'Support Available', label: 'Experienced staff' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/30 shadow-lg backdrop-blur-sm' : 'bg-transparent'} px-4 py-4`}>
        <nav className={`container mx-auto px-6 py-3 rounded-2xl transition-all duration-300 ${scrolled ? 'bg-white/40 border border-gray-200/50 backdrop-blur-md' : 'bg-white/5 backdrop-blur-md border border-white/10'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/images.jpg" alt="KNK Builders Logo" className="h-16 w-auto transition-all" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about us" className={`transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}>About</a>
              <a href="#services" className={`transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}>Services</a>
              <a href="#locations" className={`transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}>Locations</a>
              <button className={`relative transition-colors hover:text-orange-500 ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <a href="#contact" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105">
                Contact Us
              </a>
            </div>
          </div>
        </nav>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-slate-900/60"></div>
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "100px 100px"}}></div>
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(255,255,255,.02) 100px, rgba(255,255,255,.02) 200px)"}}></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full mix-blend-screen blur-3xl opacity-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Award className="h-5 w-5 text-orange-400" />
                <span className="text-sm font-semibold">Trusted Since 2004 • 20 Years of Excellence</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Trusted Hardware
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Building Partner
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Serving contractors, businesses, and homeowners across Mpumalanga with premium building materials and exceptional service
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#contact" className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2">
                <span>Get a qoute</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#locations" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border-2 border-white/30">
                Find a Branch
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/30 hover:border-orange-300/50 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/10 group-hover:to-orange-600/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-orange-300 mb-2 group-hover:text-orange-200 transition-colors">{stat.number}</div>
                    <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">About KNK Builders</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Two Decades of Building Excellence
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Since 2004, KNK Builders has been Mpumalanga's premier supplier of quality hardware materials and building supplies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: Award,
                  title: 'Reliable',
                  desc: 'Dependable service you can trust, with consistent quality and delivery',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: TrendingUp,
                  title: 'Competitive Pricing',
                  desc: 'Best value for money without compromising on quality',
                  color: 'from-orange-500 to-orange-600'
                },
                {
                  icon: Package,
                  title: 'Retail & Wholesale',
                  desc: 'Flexible options for individual customers and bulk orders',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: Hammer,
                  title: 'Huge Stock Range',
                  desc: 'Extensive selection of premium building materials and supplies',
                  color: 'from-red-500 to-red-600'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className={`inline-block p-4 rounded-xl bg-gradient-to-br ${item.color} mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.01) 35px, rgba(0,0,0,.01) 70px)"}}></div>
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-orange-200/15 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">Who We Serve</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              SERVING ALL YOUR BUILDING NEEDS!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From DIY enthusiasts, Regular Customer, to contractor we provide tailored solutions for every customer
            </p>
          </div>


          <div className="max-w-7xl mx-auto mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Spend less, and Save more!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
              {products.map((product, index) => {
                const isFeatured = index === 0 || index === 4;
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:border-orange-200 ${
                      isFeatured ? 'lg:row-span-2 lg:col-span-2' : ''
                    } transform hover:-translate-y-1`}
                  >
                    <div className={`${isFeatured ? 'h-64' : 'h-40'} overflow-hidden bg-gray-200 relative`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className={`${isFeatured ? 'p-8' : 'p-6'}`}>
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <product.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className={`font-bold text-gray-900 mb-2 ${isFeatured ? 'text-2xl' : 'text-lg'}`}>{product.name}</h4>
                      <p className={`text-gray-600 ${isFeatured ? 'text-base' : 'text-sm'}`}>{product.items}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Trusted Brands We Work With</h3>
              <p className="text-lg text-gray-600">Quality products from the industry's most reliable manufacturers</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {trustedBrands.map((brand, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-500 border border-gray-100 hover:border-orange-200 flex flex-col items-center justify-center min-h-36 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/10 transition-all duration-500"></div>
                  <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-300">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-14 w-14 object-contain mx-auto mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <p className="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">{brand.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="locations" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">Our Locations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Conveniently Located Across Mpumalanga
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit any of our 5 branches for expert advice and quality building materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-orange-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{branch.name}</h3>
                  <p className="text-orange-600 font-semibold mb-6">{branch.region}</p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                      <Clock className="h-4 w-4 mr-3 text-orange-500" />
                      <span>Mon - Fri: 7:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                      <Clock className="h-4 w-4 mr-3 text-orange-500" />
                      <span>Sat: 7:00 AM - 1:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="group relative bg-gradient-to-br from-orange-500 via-orange-550 to-orange-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Users className="h-14 w-14 mb-6 opacity-90 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
                <p className="mb-8 opacity-95 leading-relaxed">Our friendly team is ready to assist you at any location</p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center bg-white text-orange-600 p-3 rounded-full font-semibold hover:bg-orange-50 transition-all shadow-lg hover:scale-110 w-12 h-12"
                >
                  <Phone className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "100px 100px"}}></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full mix-blend-screen blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen blur-3xl opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Thabo Maseko',
                role: 'Construction Contractor',
                text: 'Best supplier in Mpumalanga. Quality and service unmatched.',
                rating: 5
              },
              {
                name: 'Sarah van der Merwe',
                role: 'Business Owner',
                text: 'Great credit terms and bulk pricing. Professional service.',
                rating: 5
              },
              {
                name: 'John Sithole',
                role: 'Homeowner',
                text: 'Friendly, knowledgeable staff. Helped complete my project under budget!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/30 hover:border-orange-300/50 transition-all duration-500 hover:bg-white/20 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex mb-3 gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-orange-300 fill-current" />
                    ))}
                  </div>
                  <p className="text-base mb-4 text-blue-50 leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="pt-3 border-t border-white/20">
                    <div className="font-bold text-base text-white">{testimonial.name}</div>
                    <div className="text-blue-200 text-xs font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(circle, rgba(0,0,0,.02) 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>
        <div className="absolute top-20 left-0 w-80 h-80 bg-blue-200/30 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-orange-200/20 rounded-full mix-blend-multiply blur-3xl opacity-15"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">Get In Touch</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-gray-600">
                Contact us today for expert advice and competitive pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Phone,
                  title: 'Call Us',
                  info: '+27 64 539 1832',
                  subinfo: 'Mon - Fri, 8AM - 5PM',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: Mail,
                  title: 'Email Us',
                  info: 'knkbuildersmarketing@gmail.com',
                  subinfo: 'We reply within 24 hours',
                  color: 'from-orange-500 to-orange-600'
                },
                {
                  icon: MapPin,
                  title: 'Visit Us',
                  info: '5 Locations',
                  subinfo: 'Across Mpumalanga',
                  color: 'from-green-500 to-green-600'
                }
              ].map((contact, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className={`inline-block p-4 rounded-xl bg-gradient-to-br ${contact.color} mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <contact.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{contact.title}</h3>
                    <p className="text-lg text-gray-700 font-semibold mb-2">{contact.info}</p>
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{contact.subinfo}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <FileText className="h-8 w-8" />
                Get a Free Quote
              </h3>
              <p className="text-xl mb-8 text-blue-100 text-center">
                Tell us about your project and we'll provide a personalized quote
              </p>
              <form onSubmit={handleQuoteSubmit} className="space-y-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={quoteData.honeypot}
                  onChange={(e) => setQuoteData({ ...quoteData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={quoteData.name}
                    onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                    className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={quoteData.email}
                    onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                    className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={quoteData.phone}
                  onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
                  required
                />
                <textarea
                  placeholder="Describe your qoute/project..."
                  value={quoteData.projectDetails}
                  onChange={(e) => setQuoteData({ ...quoteData, projectDetails: e.target.value })}
                  rows={4}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={quoteLoading}
                  className="w-full bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {quoteLoading ? 'Submitting...' : 'Send Quote'}
                </button>
                {quoteMessage && (
                  <p className={`text-center text-sm ${quoteMessage.includes('Thank you') || quoteMessage.includes('successfully') ? 'text-green-300' : 'text-orange-300'}`}>
                    {quoteMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-br from-orange-500 via-orange-550 to-orange-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(circle, rgba(255,255,255,.1) 2px, transparent 2px)", backgroundSize: "20px 20px"}}></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Stay Updated with Tips & Deals
              </h2>
              <p className="text-xl text-orange-100">
                Subscribe to our newsletter for exclusive offers, building tips, and project inspiration
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Subscribe
              </button>
            </form>

            {newsletterMessage && (
              <p className={`text-center mt-4 text-sm ${newsletterMessage.includes('Thank you') || newsletterMessage.includes('already') ? 'text-green-200' : 'text-orange-200'}`}>
                {newsletterMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="relative bg-gradient-to-br from-slate-950 to-gray-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "100px 100px"}}></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full mix-blend-screen blur-3xl opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <img src="/images.jpg" alt="KNK Builders Logo" className="h-20 w-auto mb-4" />
                <p className="text-gray-400 leading-relaxed">
                  Your trusted partner for quality hardware materials and building supplies across Mpumalanga, South Africa.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="text-orange-500">→</span> About Us</a></li>
                <li><a href="#services" className="hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="text-orange-500">→</span> Services</a></li>
                <li><a href="#locations" className="hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="text-orange-500">→</span> Locations</a></li>
                <li><a href="#contact" className="hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="text-orange-500">→</span> Contact us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Our Branches</h4>
              <ul className="space-y-2 text-gray-400">
                {branches.map((branch, index) => (
                  <li key={index} className="flex items-center space-x-2 hover:text-orange-400 transition-colors duration-300 cursor-pointer">
                    <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span>{branch.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} KNK Builders. All rights reserved. | Mpumalanga, South Africa</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
