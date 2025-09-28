'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Building2,
  Heart,
  Map,
  Trophy,
  Hospital,
  Shield,
  Smartphone,
  Facebook,
  Instagram,
} from 'lucide-react';
import Header from './components/Header';

interface ContactData {
  nombre: string;
  localidad: string;
  dni: string;
  telefono: string;
  email: string;
}

// Hook para animaciones de scroll
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    const elements = document.querySelectorAll('[data-scroll-animation]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleElements;
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const visibleElements = useScrollAnimation();

  // Contact form state
  const [contactData, setContactData] = useState<ContactData>({
    nombre: '',
    localidad: '',
    dni: '',
    telefono: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Contact form handlers
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Validación básica en el frontend
    if (
      !contactData.nombre.trim() ||
      !contactData.localidad.trim() ||
      !contactData.dni.trim() ||
      !contactData.telefono.trim() ||
      !contactData.email.trim()
    ) {
      setSubmitStatus('error');
      setSubmitMessage('Todos los campos son requeridos.');
      setIsSubmitting(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      setSubmitStatus('error');
      setSubmitMessage('Por favor ingresa un email válido.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '¡Gracias! Nos pondremos en contacto contigo pronto.');
        setContactData({
          nombre: '',
          localidad: '',
          dni: '',
          telefono: '',
          email: '',
        });
      } else {
        setSubmitStatus('error');
        if (response.status === 429) {
          setSubmitMessage(
            'Demasiadas solicitudes. Por favor espera un momento antes de intentar nuevamente.',
          );
        } else {
          setSubmitMessage(result.error || 'Error al enviar el formulario. Intenta nuevamente.');
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Error de conexión. Verifica tu internet e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const heroSlides = [
    {
      id: 1,
      title: 'Planes para toda la familia',
      subtitle:
        'Cobertura completa para vos y tus seres queridos. Protección médica integral para cada miembro de tu familia.',
      image: '/images/hero/hero3.jpg',
    },
    {
      id: 2,
      title: 'Más de 200.000 profesionales',
      subtitle:
        'La red médica más amplia del país. Especialistas de todas las áreas disponibles para tu familia.',
      image: '/images/hero/hero4.jpg',
    },
    {
      id: 3,
      title: 'Emergencias cubiertas 24/7',
      subtitle:
        'Tranquilidad total para tu familia. Emergencias médicas resueltas al instante, sin esperas ni complicaciones.',
      image: '/images/hero/hero2.jpg',
    },
    {
      id: 4,
      title: 'Planes empresariales para tu equipo',
      subtitle:
        'Cobertura médica integral para empresas. Protege a tus empleados con los mejores planes corporativos del mercado.',
      image: '/images/hero/hero1.jpg',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Cotizá tu plan',
      description:
        'Completá nuestro formulario en segundos y recibí una cotización personalizada al instante. Sin compromisos, sin esperas.',
      icon: '/images/benefits/1.svg',
    },
    {
      number: '02',
      title: 'Elegí tu cobertura perfecta',
      description:
        'Compará planes diseñados para tu familia y presupuesto. Nuestros asesores te ayudan a elegir la mejor opción.',
      icon: '/images/benefits/2.svg',
    },
    {
      number: '03',
      title: 'Disfrutá la tranquilidad total',
      description:
        'Activá tu cobertura inmediatamente y accedé a la red médica más amplia del país. Tu familia protegida desde el día uno.',
      icon: '/images/benefits/3.svg',
    },
  ];

  const faqs = [
    {
      question: '¿Cuánto tiempo tarda la activación?',
      answer:
        'Tu cobertura se activa inmediatamente después de la firma digital. No hay períodos de carencia para consultas médicas.',
    },
    {
      question: '¿Puedo cambiar de plan después?',
      answer:
        'Sí, podés cambiar de plan en cualquier momento. Te ayudamos a encontrar la mejor opción según tus necesidades.',
    },
    {
      question: '¿Qué documentación necesito?',
      answer:
        'Solo necesitás tu DNI y comprobante de ingresos. Todo el proceso es 100% digital y sin papeleo.',
    },
    {
      question: '¿Hay cobertura en todo el país?',
      answer:
        'Sí, tenemos la red más amplia de prestadores en todo el territorio nacional. Encontrá atención cerca de tu casa.',
    },
    {
      question: '¿Qué pasa si me mudo?',
      answer:
        'Tu cobertura te acompaña a cualquier parte del país. Solo tenés que actualizar tu dirección en la app.',
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  return (
    <div className="min-h-screen text-white hero-background">
      {/* Header */}
      <Header />

      {/* Global Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="hero-bg-shape hero-bg-shape-5"></div>
        <div className="hero-bg-shape hero-bg-shape-6"></div>
        <div className="hero-bg-shape hero-bg-shape-7"></div>
        <div className="hero-bg-shape hero-bg-shape-8"></div>
        <div className="hero-bg-shape hero-bg-shape-9"></div>
        <div className="hero-bg-shape hero-bg-shape-10"></div>
        <div className="hero-bg-shape hero-bg-shape-11"></div>
        <div className="hero-bg-shape hero-bg-shape-12"></div>
        <div className="hero-bg-shape hero-bg-shape-13"></div>
        <div className="hero-bg-shape hero-bg-shape-14"></div>
        <div className="hero-bg-shape hero-bg-shape-15"></div>
        <div className="hero-bg-shape hero-bg-shape-16"></div>
        <div className="hero-bg-shape hero-bg-shape-17"></div>
        <div className="hero-bg-shape hero-bg-shape-18"></div>
        <div className="hero-bg-shape hero-bg-shape-19"></div>
        <div className="hero-bg-shape hero-bg-shape-20"></div>
      </div>

      {/* Hero Section - Full Screen Carousel */}
      <section className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden z-10">
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout (centered) */}
            <div className="block lg:hidden text-center">
              <div className="mb-8">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    {/* Imagen principal con transición */}
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        key={`image-${currentSlide}`}
                        src={heroSlides[currentSlide].image}
                        alt={heroSlides[currentSlide].title}
                        width={320}
                        height={320}
                        className="w-full h-full object-cover hero-image-super-oval relative z-10 hero-image-fade"
                        style={{
                          WebkitMaskImage:
                            'radial-gradient(ellipse 100% 70% at center, black 0%, black 55%, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.1) 98%, transparent 100%)',
                          maskImage:
                            'radial-gradient(ellipse 100% 70% at center, black 0%, black 55%, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.1) 98%, transparent 100%)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Título con animación */}
                <h1
                  key={`title-${currentSlide}`}
                  className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white animate-fade-in-up"
                >
                  {heroSlides[currentSlide].title}
                </h1>

                {/* Subtítulo con animación */}
                <p
                  key={`subtitle-${currentSlide}`}
                  className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in-up"
                >
                  {heroSlides[currentSlide].subtitle}
                </p>
              </div>
            </div>

            {/* Desktop Layout (text left, image right) */}
            <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-12">
              {/* Text Content - Left Side */}
              <div className="flex-1 lg:max-w-2xl">
                {/* Título con animación */}
                <h1
                  key={`title-${currentSlide}`}
                  className="text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-6 leading-tight text-white animate-fade-in-up text-left"
                >
                  {heroSlides[currentSlide].title}
                </h1>

                {/* Subtítulo con animación */}
                <p
                  key={`subtitle-${currentSlide}`}
                  className="text-xl xl:text-2xl 2xl:text-3xl mb-8 text-blue-100 animate-fade-in-up text-left"
                >
                  {heroSlides[currentSlide].subtitle}
                </p>
              </div>

              {/* Image Content - Right Side */}
              <div className="flex-1 lg:max-w-lg xl:max-w-xl">
                <div className="relative w-full h-96 xl:h-[28rem] 2xl:h-[32rem]">
                  {/* Imagen principal con transición */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      key={`image-${currentSlide}`}
                      src={heroSlides[currentSlide].image}
                      alt={heroSlides[currentSlide].title}
                      width={512}
                      height={512}
                      className="w-full h-full object-cover hero-image-super-oval relative z-10 hero-image-fade"
                      style={{
                        WebkitMaskImage:
                          'radial-gradient(ellipse 100% 70% at center, black 0%, black 55%, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.1) 98%, transparent 100%)',
                        maskImage:
                          'radial-gradient(ellipse 100% 70% at center, black 0%, black 55%, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.1) 98%, transparent 100%)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button - Centered for all layouts */}
            <div className="text-center mt-8 lg:mt-12 relative z-50">
              <button
                onClick={() => {
                  document.getElementById('contact-form')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
                className="cta-button inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cotizá tu prepaga
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
            isAnimating ? 'opacity-50 pointer-events-none' : ''
          }`}
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
            isAnimating ? 'opacity-50 pointer-events-none' : ''
          }`}
          aria-label="Siguiente slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-blue-300 scale-125'
                  : 'bg-blue-300/50 hover:bg-blue-300/75'
              } ${isAnimating ? 'pointer-events-none' : ''}`}
              aria-label={`Ir al slide ${index + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Sancor Section */}
      <section className="py-20 relative overflow-hidden z-10">
        <div
          id="why-choose-sancor"
          data-scroll-animation
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-fade-in-up ${visibleElements.has('why-choose-sancor') ? 'visible' : ''}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Por qué elegir Sancor?
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Sancor Salud es la prepaga más confiable del país, con más de 25 años de experiencia
              cuidando a las familias argentinas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sancor Benefit 1 */}
            <div className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-sky-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <Trophy className="w-12 h-12 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">Líder del mercado</h3>
              <p className="text-sky-700">
                Más de 1.200.000 afiliados confían en nosotros en todo el país
              </p>
            </div>

            {/* Sancor Benefit 2 */}
            <div className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-sky-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <Hospital className="w-12 h-12 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">Red propia</h3>
              <p className="text-sky-700">
                Red de centros médicos propios y prestadores en todo el país
              </p>
            </div>

            {/* Sancor Benefit 3 */}
            <div className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-sky-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">Cobertura total</h3>
              <p className="text-sky-700">
                Emergencias 24/7, internación, cirugías y especialidades completas
              </p>
            </div>

            {/* Sancor Benefit 4 */}
            <div className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-sky-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <Smartphone className="w-12 h-12 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">App móvil</h3>
              <p className="text-sky-700">
                Gestioná tu cobertura, turnos y consultas desde tu celular
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 relative overflow-hidden z-10">
        <div
          id="how-it-works"
          data-scroll-animation
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-fade-in-up ${visibleElements.has('how-it-works') ? 'visible' : ''}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cómo funciona</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              En solo 3 pasos simples, tenés la cobertura que tu familia necesita
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Card Container */}
                <div className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-sky-200 transition-all duration-300 transform hover:-translate-y-2">
                  {/* SVG Icon - Más grande */}
                  <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 rounded-full group-hover:from-sky-200 group-hover:to-sky-300 transition-all duration-300">
                    <Image
                      src={step.icon}
                      alt={`${step.title} icon`}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  {/* Número con diseño mejorado */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    {step.number}
                  </div>

                  {/* Contenido */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-sky-700 group-hover:text-sky-800 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sky-700 leading-relaxed text-base">{step.description}</p>
                  </div>

                  {/* Decorative element */}
                  <div className="mt-6 w-16 h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full mx-auto group-hover:w-20 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative overflow-hidden z-10">
        <div
          id="faq-section"
          data-scroll-animation
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-fade-in-up ${visibleElements.has('faq-section') ? 'visible' : ''}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-blue-200">
              Resolvemos las dudas más comunes sobre nuestros planes
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl shadow-lg hover:shadow-xl hover:border-sky-200 transition-all duration-300"
              >
                <button
                  className="w-full text-left p-6 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-sky-700">{faq.question}</h3>
                    <span
                      className={`text-2xl transition-transform duration-200 ${openFaq === index ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-sky-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 relative overflow-hidden z-10">
        <div
          id="contact-form-section"
          data-scroll-animation
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-fade-in-up ${visibleElements.has('contact-form-section') ? 'visible' : ''}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dejanos tus datos</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Uno de nuestros asesores se pondrá en contacto para ayudarte a encontrar la cobertura
              médica que mejor se adapte a vos.
            </p>
          </div>

          <form
            onSubmit={handleContactSubmit}
            className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-sky-200 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre y Apellido */}
              <div className="md:col-span-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-sky-700 mb-2">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={contactData.nombre}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-sky-700"
                  placeholder="Ingresá tu nombre completo"
                />
              </div>

              {/* Localidad */}
              <div>
                <label htmlFor="localidad" className="block text-sm font-medium text-sky-700 mb-2">
                  Localidad *
                </label>
                <input
                  type="text"
                  id="localidad"
                  name="localidad"
                  value={contactData.localidad}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-sky-700"
                  placeholder="Ciudad, Provincia"
                />
              </div>

              {/* DNI */}
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-sky-700 mb-2">
                  DNI *
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={contactData.dni}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-sky-700"
                  placeholder="12345678"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-sky-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={contactData.telefono}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-sky-700"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-sky-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-sky-700"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Status Message */}
            {submitStatus !== 'idle' && (
              <div
                className={`mt-6 p-4 rounded-lg text-center ${
                  submitStatus === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`cta-button px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Logos */}
            <div className="space-y-6">
              <div>
                <Image
                  src="/images/prepagaargentina.png"
                  alt="Prepaga Argentina"
                  width={200}
                  height={64}
                  className="h-16 w-auto"
                />
              </div>
              <div>
                <Image
                  src="/images/sancor.png"
                  alt="Sancor Salud"
                  width={120}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-sky-700">Contacto</h4>
              <ul className="space-y-2 text-sky-700">
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  +54 351 381 7823
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🕒</span>
                  Lun a Vie 8:00 - 18:00
                </li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-sky-700">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-sky-600 hover:text-sky-800 transition-colors">
                  <Facebook className="w-8 h-8" />
                </a>
                <a href="#" className="text-sky-600 hover:text-sky-800 transition-colors">
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 mt-8 pt-4 text-center">
            <p className="text-sky-700">
              © 2025 Prepaga Argentina. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
