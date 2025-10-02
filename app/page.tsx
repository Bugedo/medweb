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
  Video,
  CreditCard,
  Settings,
  Glasses,
  Phone,
  Smile,
} from 'lucide-react';

interface ContactData {
  nombre: string;
  localidad: string;
  telefono: string;
  email: string;
  observaciones: string;
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
    telefono: '',
    email: '',
    observaciones: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Contact form handlers
  const handleContactInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
      !contactData.telefono.trim()
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
          telefono: '',
          email: '',
          observaciones: '',
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
      title: '50% DE DESCUENTO EN TODOS LOS PLANES',
      subtitle: '',
      image: '/images/hero/heronuevafamilia.jpg',
      isPromo: true,
      subtitle2: '',
    },
    {
      id: 2,
      title: 'Más de 200.000',
      title2: 'profesionales',
      subtitle: 'La red médica más amplia del país',
      subtitle2: '',
      image: '/images/hero/hero4.jpg',
      isSpecial: true,
    },
    {
      id: 3,
      title: 'EMERGENCIAS',
      title2: 'CUBIERTAS',
      subtitle: '24/7',
      subtitle2: 'Tranquilidad total para tu familia',
      image: '/images/hero/hero2.jpg',
      isEmergency: true,
    },
    {
      id: 4,
      title: 'Planes',
      title2: 'Empresariales',
      title3: 'para tu equipo',
      subtitle: 'Protegemos a tus empleados',
      subtitle2: '',
      image: '/images/hero/hero1.jpg',
      isCorporate: true,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Nosotros te contactamos',
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
    }, 7000);
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

      {/* Header con logo Sancor */}
      <header
        className="w-full relative z-30"
        style={{ background: 'linear-gradient(to right, #0c369c 0%, #0c369c 100%)' }}
      >
        <div className="flex items-center justify-center">
          <Image
            src="/images/sancorblue2.jpg"
            alt="Sancor Salud"
            width={500}
            height={200}
            className="h-32 md:h-40 w-auto block"
            priority
          />
        </div>
      </header>

      {/* Hero Section - Full Screen Carousel */}
      <section className="relative h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] overflow-hidden z-10">
        {/* Background Images - Full Screen con crossfade */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={`slide-${index}`}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: index === currentSlide ? 1 : 0,
                zIndex: index === currentSlide ? 1 : 0,
              }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={`object-cover md:scale-100 ${
                  slide.image.includes('hero1')
                    ? 'scale-110 object-[center_50%] md:object-[center_35%]'
                    : slide.image.includes('hero2')
                      ? 'scale-125 object-[60%_15%] md:scale-100 md:object-[60%_30%]'
                      : slide.image.includes('heronuevafamilia')
                        ? 'scale-110 object-[60%_40%] md:scale-90 md:object-[60%_60%]'
                        : 'scale-110'
                }`}
                style={{
                  objectPosition: slide.image.includes('hero4')
                    ? 'center 20%'
                    : slide.image.includes('hero2')
                      ? undefined
                      : slide.image.includes('heronuevafamilia')
                        ? undefined
                        : slide.image.includes('hero1')
                          ? undefined
                          : 'center center',
                }}
                priority={index === 0}
              />
              {/* Blue Overlay */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(12, 54, 156, 0.35)' }}
              ></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div
          className={`relative h-full flex justify-center z-10 ${
            heroSlides[currentSlide].isPromo || heroSlides[currentSlide].isCorporate
              ? 'items-start md:items-center pt-12 md:pt-0'
              : 'items-center'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {heroSlides[currentSlide].isPromo ? (
              /* Layout especial para promoción */
              <div
                key={`promo-${currentSlide}`}
                className="flex justify-center md:justify-start w-full"
              >
                {/* Toda la oferta - en la columna izquierda */}
                <div className="flex flex-col items-start animate-fade-in-up mb-6 md:w-1/3 md:min-w-fit">
                  {/* Caja 50% DE DESCUENTO */}
                  <div
                    className="inline-block px-6 py-4 shadow-2xl rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <span
                      className="text-3xl md:text-4xl xl:text-5xl font-black whitespace-nowrap"
                      style={{
                        color: '#0c369c',
                      }}
                    >
                      50% DE DESCUENTO
                    </span>
                  </div>

                  {/* Fila con "en todos nuestros planes" y "+" */}
                  <div className="flex items-center gap-0">
                    {/* Caja en todos nuestros planes */}
                    <div
                      className="inline-block px-5 py-3 shadow-lg rounded-2xl"
                      style={{
                        backgroundColor: '#0c369c',
                      }}
                    >
                      <span
                        className="text-xl md:text-2xl xl:text-3xl font-bold whitespace-nowrap"
                        style={{
                          color: '#FFFFFF',
                        }}
                      >
                        en todos nuestros planes
                      </span>
                    </div>

                    {/* Caja + pegada */}
                    <div
                      className="inline-block px-5 py-3 shadow-lg rounded-2xl"
                      style={{
                        backgroundColor: '#00A86B',
                      }}
                    >
                      <span
                        className="text-xl md:text-2xl xl:text-3xl font-bold whitespace-nowrap"
                        style={{
                          color: '#FFFFFF',
                        }}
                      >
                        +
                      </span>
                    </div>
                  </div>

                  {/* Segunda oferta: VALOR DEL PLAN CONGELADO + X 1 AÑO orientada a la derecha */}
                  <div className="flex flex-col items-end self-stretch">
                    {/* Caja VALOR DEL PLAN CONGELADO */}
                    <div
                      className="inline-block px-4 py-2 shadow-2xl rounded-2xl"
                      style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <span
                        className="text-xl md:text-2xl xl:text-3xl font-black whitespace-nowrap"
                        style={{
                          color: '#0c369c',
                        }}
                      >
                        VALOR DEL PLAN CONGELADO
                      </span>
                    </div>

                    {/* Caja X 1 AÑO - pegada debajo con su propio ancho */}
                    <div
                      className="inline-block px-3 py-2 shadow-lg rounded-2xl"
                      style={{
                        backgroundColor: '#0c369c',
                      }}
                    >
                      <span
                        className="text-base md:text-lg xl:text-xl font-bold whitespace-nowrap"
                        style={{
                          color: '#FFFFFF',
                        }}
                      >
                        X 1 AÑO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : heroSlides[currentSlide].isSpecial ? (
              /* Layout especial para slides con title2 */
              <div
                key={`special-${currentSlide}`}
                className="flex flex-col items-center md:items-start"
              >
                <div className="flex flex-col items-start animate-fade-in-up gap-0">
                  {/* Título principal con caja blanca */}
                  <div
                    className="inline-block px-6 py-4 shadow-2xl rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <span
                      key={`title-${currentSlide}`}
                      className="text-3xl md:text-4xl xl:text-5xl font-black"
                      style={{
                        color: '#0c369c',
                      }}
                    >
                      {heroSlides[currentSlide].title}
                    </span>
                  </div>

                  {/* Segunda parte del título con caja azul y más pequeño */}
                  {heroSlides[currentSlide].title2 && (
                    <div
                      className="inline-block px-5 py-3 shadow-lg rounded-2xl"
                      style={{
                        backgroundColor: '#0c369c',
                      }}
                    >
                      <span
                        className="text-2xl md:text-3xl xl:text-4xl font-bold"
                        style={{
                          color: '#FFFFFF',
                        }}
                      >
                        {heroSlides[currentSlide].title2}
                      </span>
                    </div>
                  )}

                  {/* Grupo de subtítulos orientados a la derecha - limitado al ancho del título */}
                  <div className="flex flex-col items-end gap-0 w-full">
                    {/* Primer subtítulo con caja verde */}
                    {heroSlides[currentSlide].subtitle && (
                      <div
                        className="px-4 py-2 shadow-lg rounded-2xl"
                        style={{
                          backgroundColor: '#00A86B',
                          maxWidth: '100%',
                        }}
                      >
                        <span
                          key={`subtitle-${currentSlide}`}
                          className="text-base md:text-lg xl:text-xl font-semibold"
                          style={{
                            color: '#FFFFFF',
                          }}
                        >
                          {heroSlides[currentSlide].subtitle}
                        </span>
                      </div>
                    )}

                    {/* Segundo subtítulo con caja azul */}
                    {'subtitle2' in heroSlides[currentSlide] &&
                      heroSlides[currentSlide].subtitle2 && (
                        <div
                          className="px-4 py-2 shadow-lg rounded-2xl"
                          style={{
                            backgroundColor: '#0c369c',
                            maxWidth: '100%',
                          }}
                        >
                          <span
                            className="text-base md:text-lg xl:text-xl font-semibold"
                            style={{
                              color: '#FFFFFF',
                            }}
                          >
                            {heroSlides[currentSlide].subtitle2}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ) : heroSlides[currentSlide].isEmergency ? (
              /* Layout especial para emergencias */
              <div
                key={`emergency-${currentSlide}`}
                className="flex flex-col items-center md:items-start"
              >
                <div className="flex flex-col items-start animate-fade-in-up gap-0 w-full md:w-auto">
                  {/* Caja única con EMERGENCIAS y CUBIERTAS apiladas */}
                  <div
                    className="inline-block px-6 py-4 shadow-2xl rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span
                        className="text-3xl md:text-4xl xl:text-5xl font-black"
                        style={{
                          color: '#0c369c',
                        }}
                      >
                        {heroSlides[currentSlide].title}
                      </span>
                      {heroSlides[currentSlide].title2 && (
                        <span
                          className="text-3xl md:text-4xl xl:text-5xl font-black"
                          style={{
                            color: '#0c369c',
                          }}
                        >
                          {heroSlides[currentSlide].title2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 24/7 con caja verde debajo, alineado a la derecha del contenedor */}
                  <div className="flex justify-end w-full">
                    {heroSlides[currentSlide].subtitle && (
                      <div
                        className="inline-block px-6 py-4 shadow-2xl rounded-2xl"
                        style={{
                          backgroundColor: '#00A86B',
                        }}
                      >
                        <span
                          className="text-4xl md:text-5xl xl:text-6xl font-black"
                          style={{
                            color: '#FFFFFF',
                          }}
                        >
                          {heroSlides[currentSlide].subtitle}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subtítulo con caja azul */}
                  {'subtitle2' in heroSlides[currentSlide] &&
                    heroSlides[currentSlide].subtitle2 && (
                      <div
                        className="inline-block px-5 py-3 shadow-lg rounded-2xl max-w-2xl"
                        style={{
                          backgroundColor: '#0c369c',
                        }}
                      >
                        <span
                          className="text-lg md:text-xl xl:text-2xl font-semibold"
                          style={{
                            color: '#FFFFFF',
                          }}
                        >
                          {heroSlides[currentSlide].subtitle2}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            ) : heroSlides[currentSlide].isCorporate ? (
              /* Layout especial para planes empresariales */
              <div
                key={`corporate-${currentSlide}`}
                className="flex flex-col items-center md:items-start"
              >
                <div className="flex flex-col items-start animate-fade-in-up gap-0 w-full md:w-auto">
                  {/* Caja blanca con Planes y Empresariales */}
                  <div
                    className="inline-block px-6 py-4 shadow-2xl rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span
                        className="text-3xl md:text-4xl xl:text-5xl font-black"
                        style={{
                          color: '#0c369c',
                        }}
                      >
                        {heroSlides[currentSlide].title}
                      </span>
                      {heroSlides[currentSlide].title2 && (
                        <span
                          className="text-3xl md:text-4xl xl:text-5xl font-black"
                          style={{
                            color: '#0c369c',
                          }}
                        >
                          {heroSlides[currentSlide].title2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* "para tu equipo" con caja verde orientada a la derecha */}
                  <div className="flex justify-end w-full">
                    {'title3' in heroSlides[currentSlide] && heroSlides[currentSlide].title3 && (
                      <div
                        className="inline-block px-5 py-3 shadow-lg rounded-2xl"
                        style={{
                          backgroundColor: '#00A86B',
                        }}
                      >
                        <span
                          className="text-2xl md:text-3xl xl:text-4xl font-bold"
                          style={{
                            color: '#FFFFFF',
                          }}
                        >
                          {heroSlides[currentSlide].title3}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subtítulo con caja azul */}
                  {heroSlides[currentSlide].subtitle && (
                    <div
                      className="inline-block px-5 py-3 shadow-lg rounded-2xl max-w-2xl"
                      style={{
                        backgroundColor: '#0c369c',
                      }}
                    >
                      <span
                        className="text-lg md:text-xl xl:text-2xl font-semibold"
                        style={{
                          color: '#FFFFFF',
                        }}
                      >
                        {heroSlides[currentSlide].subtitle}
                      </span>
                    </div>
                  )}

                  {/* Segundo subtítulo con caja blanca */}
                  {'subtitle2' in heroSlides[currentSlide] &&
                    heroSlides[currentSlide].subtitle2 && (
                      <div
                        className="inline-block px-5 py-3 shadow-lg rounded-2xl max-w-2xl"
                        style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <span
                          className="text-lg md:text-xl xl:text-2xl font-semibold"
                          style={{
                            color: '#0c369c',
                          }}
                        >
                          {heroSlides[currentSlide].subtitle2}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              /* Layout estilizado para otros slides */
              <div
                key={`default-${currentSlide}`}
                className="flex flex-col items-center md:items-start"
              >
                <div className="flex flex-col items-start animate-fade-in-up gap-4">
                  {/* Título con caja estilizada */}
                  <div
                    className="inline-block px-6 py-4 shadow-2xl rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <span
                      key={`title-${currentSlide}`}
                      className="text-3xl md:text-4xl xl:text-5xl font-black"
                      style={{
                        color: '#0c369c',
                      }}
                    >
                      {heroSlides[currentSlide].title}
                    </span>
                  </div>

                  {/* Subtítulo con caja estilizada */}
                  {heroSlides[currentSlide].subtitle && (
                    <div
                      className="inline-block px-5 py-3 shadow-lg rounded-2xl max-w-2xl"
                      style={{
                        backgroundColor: '#0c369c',
                      }}
                    >
                      <span
                        key={`subtitle-${currentSlide}`}
                        className="text-lg md:text-xl xl:text-2xl font-semibold"
                        style={{
                          color: '#FFFFFF',
                        }}
                      >
                        {heroSlides[currentSlide].subtitle}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón al fondo del hero - siempre centrado */}
        <div className="absolute bottom-8 left-1/2 z-50 cta-bounce">
          <button
            onClick={() => {
              document.getElementById('contact-form')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              backgroundColor: '#00A86B',
              color: '#FFFFFF',
              border: '3px solid #FFFFFF',
            }}
          >
            QUIERO ASOCIARME
          </button>
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
            {/* Título estilizado con cajas */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div
                className="inline-block px-8 py-4 shadow-2xl rounded-2xl"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <h2 className="text-3xl md:text-4xl font-black" style={{ color: '#0c369c' }}>
                  ¿Por qué elegir SanCor Salud?
                </h2>
              </div>
            </div>
          </div>
          {/* Layout: Big box + 4 small boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Big Box - Left side with 800.000 destacado + 3 razones */}
            <div className="group relative">
              <div
                className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                style={{ borderColor: '#00A86B' }}
              >
                {/* 800.000 afiliados destacado arriba */}
                <div className="text-center mb-8">
                  <div
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: '#0c369c' }}>
                    800.000
                  </h3>
                  <p
                    className="text-2xl md:text-3xl font-semibold mb-4 px-4"
                    style={{ color: '#0c369c' }}
                  >
                    afiliados en todo el país
                  </p>
                  <div
                    className="w-20 h-1 rounded-full mx-auto"
                    style={{ backgroundColor: '#0c369c' }}
                  ></div>
                </div>

                {/* 2 razones adicionales en grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                  {/* Afiliación flexible */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
                      style={{ backgroundColor: '#0c369c' }}
                    >
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-xl md:text-2xl font-bold mb-2"
                        style={{ color: '#0c369c' }}
                      >
                        Afiliación flexible
                      </h4>
                      <p className="text-base md:text-lg" style={{ color: '#0c369c' }}>
                        Monotributo, empleado o particular
                      </p>
                    </div>
                  </div>

                  {/* App Mobile */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
                      style={{ backgroundColor: '#0c369c' }}
                    >
                      <Smartphone className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-xl md:text-2xl font-bold mb-2"
                        style={{ color: '#0c369c' }}
                      >
                        App Mobile
                      </h4>
                      <p className="text-base md:text-lg" style={{ color: '#0c369c' }}>
                        Gestioná todo desde tu celular
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Small Boxes - Right side in 2x2 grid (Benefits) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Beneficio 1: Consultas médicas virtuales */}
              <div className="group relative">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Video className="w-12 h-12 text-white" />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-bold leading-tight px-2"
                    style={{ color: '#0c369c' }}
                  >
                    Consultas médicas virtuales
                  </h3>
                </div>
              </div>

              {/* Beneficio 2: Red de centros médicos */}
              <div className="group relative">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Hospital className="w-12 h-12 text-white" />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-bold leading-tight px-2"
                    style={{ color: '#0c369c' }}
                  >
                    +5.000 centros médicos
                  </h3>
                </div>
              </div>

              {/* Beneficio 3: Descuentos en óptica */}
              <div className="group relative">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Glasses className="w-12 h-12 text-white" />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-bold leading-tight px-2"
                    style={{ color: '#0c369c' }}
                  >
                    Descuentos en óptica
                  </h3>
                </div>
              </div>

              {/* Beneficio 4: Ortodoncia cubierta hasta los 30 */}
              <div className="group relative">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Smile className="w-12 h-12 text-white" />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-bold leading-tight px-2"
                    style={{ color: '#0c369c' }}
                  >
                    Ortodoncia cubierta hasta los 30 años
                  </h3>
                </div>
              </div>
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
          {/* Single box containing title and all 3 steps */}
          <div className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-100 rounded-2xl p-8 md:p-12 shadow-xl max-w-3xl mx-auto">
            {/* Título */}
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-black" style={{ color: '#0c369c' }}>
                ¿Cómo funciona?
              </h2>
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="group flex items-center justify-center gap-6">
                  {/* SVG Icon with number badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 rounded-full group-hover:from-sky-200 group-hover:to-sky-300 transition-all duration-300">
                      <Image
                        src={step.icon}
                        alt={`${step.title} icon`}
                        width={80}
                        height={80}
                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                      />
                    </div>
                    {/* Number badge on SVG border */}
                    <div
                      className="absolute -top-2 -right-2 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                      style={{ backgroundColor: '#0c369c' }}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 text-center">
                    <h3 className="text-2xl md:text-4xl font-black" style={{ color: '#0c369c' }}>
                      {step.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
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
          <form
            onSubmit={handleContactSubmit}
            className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300"
            style={{ borderColor: '#00A86B' }}
          >
            {/* Título y Subtítulo dentro del formulario */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#0c369c' }}>
                Dejanos tus datos
              </h2>
              <p
                className="text-base md:text-lg font-semibold max-w-2xl mx-auto"
                style={{ color: '#0c369c' }}
              >
                Uno de nuestros asesores se pondrá en contacto para ayudarte a encontrar la
                cobertura médica que mejor se adapte a vos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre y Apellido */}
              <div className="md:col-span-2">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#0c369c' }}
                >
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={contactData.nombre}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  style={{ color: '#0c369c' }}
                  placeholder="Ingresá tu nombre completo"
                />
              </div>

              {/* Localidad */}
              <div>
                <label
                  htmlFor="localidad"
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#0c369c' }}
                >
                  Localidad *
                </label>
                <input
                  type="text"
                  id="localidad"
                  name="localidad"
                  value={contactData.localidad}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  style={{ color: '#0c369c' }}
                  placeholder="Ciudad, Provincia"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#0c369c' }}
                >
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={contactData.telefono}
                  onChange={handleContactInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  style={{ color: '#0c369c' }}
                  placeholder="+54 11 1234-5678"
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#0c369c' }}
                >
                  Correo electrónico (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleContactInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  style={{ color: '#0c369c' }}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div className="mt-6">
              <label
                htmlFor="observaciones"
                className="block text-sm font-medium mb-2"
                style={{ color: '#0c369c' }}
              >
                Observaciones (opcional)
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={contactData.observaciones}
                onChange={handleContactInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
                style={{ color: '#0c369c' }}
                placeholder="Dejanos cualquier comentario o consulta adicional..."
              ></textarea>
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

      {/* SECCIÓN DE PRUEBA - ADORNOS DECORATIVOS */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0c369c' }}>
            Prueba de Adornos Decorativos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Opción 1: Círculos flotantes */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full opacity-20"
                  style={{ backgroundColor: '#0c369c' }}
                ></div>
                <div
                  className="absolute bottom-[-30px] right-[-30px] w-32 h-32 rounded-full opacity-20"
                  style={{ backgroundColor: '#00A86B' }}
                ></div>
                <div
                  className="absolute top-1/2 right-10 w-20 h-20 rounded-full opacity-10"
                  style={{ backgroundColor: '#0c369c' }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 1: Círculos Flotantes
                </p>
              </div>
            </div>

            {/* Opción 2: Ondas suaves */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute bottom-0 left-0 w-full h-24 opacity-10"
                  style={{ backgroundColor: '#0c369c', clipPath: 'ellipse(150% 100% at 50% 100%)' }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-full h-32 opacity-10"
                  style={{ backgroundColor: '#00A86B', clipPath: 'ellipse(120% 80% at 30% 100%)' }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 2: Ondas Suaves
                </p>
              </div>
            </div>

            {/* Opción 3: Círculos con blur */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: '#0c369c' }}
                ></div>
                <div
                  className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: '#00A86B' }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 3: Blur Gradiente
                </p>
              </div>
            </div>

            {/* Opción 4: Puntos decorativos */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full opacity-10"
                    style={{
                      backgroundColor: i % 2 === 0 ? '#0c369c' : '#00A86B',
                      width: `${Math.random() * 20 + 10}px`,
                      height: `${Math.random() * 20 + 10}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  ></div>
                ))}
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 4: Puntos Random
                </p>
              </div>
            </div>

            {/* Opción 5: Rayas diagonales */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(12, 54, 156, 0.05) 20px, rgba(12, 54, 156, 0.05) 40px)',
                  }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 5: Rayas Diagonales
                </p>
              </div>
            </div>

            {/* Opción 6: Círculos concéntricos */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div
                  className="absolute w-32 h-32 rounded-full border-4 opacity-10"
                  style={{ borderColor: '#0c369c' }}
                ></div>
                <div
                  className="absolute w-48 h-48 rounded-full border-4 opacity-10"
                  style={{ borderColor: '#00A86B' }}
                ></div>
                <div
                  className="absolute w-64 h-64 rounded-full border-4 opacity-10"
                  style={{ borderColor: '#0c369c' }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 6: Círculos Concéntricos
                </p>
              </div>
            </div>

            {/* Opción 7: Gradiente radial */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, rgba(12, 54, 156, 0.15), transparent 50%)',
                  }}
                ></div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 70% 70%, rgba(0, 168, 107, 0.15), transparent 50%)',
                  }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 7: Gradiente Radial
                </p>
              </div>
            </div>

            {/* Opción 8: Formas geométricas */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute top-[-30px] right-[-30px] w-32 h-32 opacity-10 rotate-45"
                  style={{ backgroundColor: '#0c369c' }}
                ></div>
                <div
                  className="absolute bottom-[-40px] left-[-40px] w-40 h-40 rounded-full opacity-10"
                  style={{ backgroundColor: '#00A86B' }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/4 w-24 h-24 opacity-10"
                  style={{
                    backgroundColor: '#0c369c',
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 8: Formas Geométricas
                </p>
              </div>
            </div>

            {/* Opción 9: Burbujas animadas */}
            <div
              className="relative h-64 bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: '#00A86B' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute top-10 left-10 w-16 h-16 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: '#0c369c' }}
                ></div>
                <div
                  className="absolute top-24 right-16 w-12 h-12 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: '#00A86B', animationDelay: '0.5s' }}
                ></div>
                <div
                  className="absolute bottom-16 left-20 w-20 h-20 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: '#0c369c', animationDelay: '1s' }}
                ></div>
                <div
                  className="absolute bottom-10 right-10 w-14 h-14 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: '#00A86B', animationDelay: '1.5s' }}
                ></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-lg font-semibold" style={{ color: '#0c369c' }}>
                  Opción 9: Burbujas Animadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Footer */}
      <div className="py-6 relative z-50" style={{ backgroundColor: '#0033a0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/images/sancorblue2.jpg"
                alt="SanCor Salud"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
            </div>

            {/* Legal Text */}
            <div className="flex-1">
              <p className="text-xs text-white leading-relaxed">
                ASOCIACIÓN MUTUAL SANCOR SALUD inscripta en el Registro Nacional de Entidades de
                Medicina Prepaga (R.N.E.M.P.) bajo el número 1137. Superintendencia de Servicios de
                Salud - Órgano de Control de Obras Sociales y Entidades de Medicina Prepaga -
                0800-222-SALUD (72583) - www.sssalud.gob.ar
                <br />
                25 de mayo 201. Sunchales, Santa Fe, Argentina.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-3 border-t border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Powered by */}
          <div className="text-center">
            <p className="text-sky-700 text-xs">
              Powered by{' '}
              <a
                href="https://www.developingbridges.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-sky-900 transition-colors underline"
              >
                Developing Bridges
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
