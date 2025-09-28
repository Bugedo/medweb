'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Building2, Heart, Map, Trophy, Hospital, Shield, Smartphone } from 'lucide-react';
import Header from './components/Header';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const heroSlides = [
    {
      id: 1,
      title: 'Cuidamos lo que más amás',
      subtitle: 'Tu familia merece la cobertura que mejor se adapta a vos',
      image: '/images/hero/hero1.jpg',
    },
    {
      id: 2,
      title: 'Protección 24/7',
      subtitle: 'Emergencias médicas cubiertas las 24 horas, todos los días',
      image: '/images/hero/hero2.jpg',
    },
    {
      id: 3,
      title: 'Sin Carencias',
      subtitle: 'Acceso inmediato a todos los servicios médicos',
      image: '/images/hero/hero3.jpg',
    },
    {
      id: 4,
      title: 'Cobertura Nacional',
      subtitle: 'Atención médica en todo el país con la red más amplia',
      image: '/images/hero/hero4.jpg',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Cotizá tu plan',
      description: 'Completá el formulario con tus datos y necesidades en menos de 5 minutos',
    },
    {
      number: '02',
      title: 'Elegí tu cobertura',
      description: 'Seleccioná el plan que mejor se adapte a tu familia y presupuesto',
    },
    {
      number: '03',
      title: 'Disfrutá la tranquilidad',
      description: 'Activá tu cobertura al instante y protegé a tu familia desde el primer día',
    },
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Mamá de 2 hijos',
      content:
        'Desde que tengo la cobertura, mi familia está tranquila. La atención es excelente y nunca tuvimos problemas.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Empresario',
      content:
        'El proceso fue súper fácil y rápido. En 24 horas ya tenía mi cobertura activa. Totalmente recomendable.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Docente',
      content:
        'La app es genial, puedo gestionar todo desde mi teléfono. La atención al cliente es de primera.',
      rating: 5,
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
    <div className="min-h-screen bg-white text-sky-600">
      {/* Header */}
      <Header />

      {/* Hero Section - Full Screen Carousel */}
      <section className="relative h-[calc(100vh-5rem)] overflow-hidden">
        {/* Fixed Background */}
        <div className="absolute inset-0 hero-background">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="hero-bg-shape hero-bg-shape-1"></div>
            <div className="hero-bg-shape hero-bg-shape-2"></div>
            <div className="hero-bg-shape hero-bg-shape-3"></div>
            <div className="hero-bg-shape hero-bg-shape-4"></div>
            <div className="hero-bg-shape hero-bg-shape-5"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout (centered) */}
            <div className="block lg:hidden text-center">
              <div className="mb-8">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    {/* Elementos decorativos orgánicos en los vértices */}
                    <div className="hero-decorative-blob hero-decorative-blob-1"></div>
                    <div className="hero-decorative-blob hero-decorative-blob-2"></div>
                    <div className="hero-decorative-blob hero-decorative-blob-3"></div>
                    <div className="hero-decorative-blob hero-decorative-blob-4"></div>

                    {/* Imagen principal con transición */}
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={`image-${currentSlide}`}
                        src={heroSlides[currentSlide].image}
                        alt={heroSlides[currentSlide].title}
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
                  {/* Elementos decorativos orgánicos en los vértices */}
                  <div className="hero-decorative-blob hero-decorative-blob-1"></div>
                  <div className="hero-decorative-blob hero-decorative-blob-2"></div>
                  <div className="hero-decorative-blob hero-decorative-blob-3"></div>
                  <div className="hero-decorative-blob hero-decorative-blob-4"></div>

                  {/* Imagen principal con transición */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={`image-${currentSlide}`}
                      src={heroSlides[currentSlide].image}
                      alt={heroSlides[currentSlide].title}
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
              <Link
                href="/preficha"
                className="cta-button inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cotizá tu prepaga ideal
              </Link>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-600 mb-4">
              ¿Por qué elegir Sancor?
            </h2>
            <p className="text-xl text-sky-500 max-w-3xl mx-auto">
              Sancor Salud es la prepaga más confiable del país, con más de 25 años de experiencia
              cuidando a las familias argentinas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sancor Benefit 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <Trophy className="w-12 h-12 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-600 mb-3">Líder del mercado</h3>
              <p className="text-sky-500">
                Más de 1.200.000 afiliados confían en nosotros en todo el país
              </p>
            </div>

            {/* Sancor Benefit 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <Hospital className="w-12 h-12 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-600 mb-3">Red propia</h3>
              <p className="text-sky-500">
                Más de 50 centros médicos propios y 15.000 prestadores en todo el país
              </p>
            </div>

            {/* Sancor Benefit 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-600 mb-3">Cobertura total</h3>
              <p className="text-sky-500">
                Emergencias 24/7, internación, cirugías y especialidades completas
              </p>
            </div>

            {/* Sancor Benefit 4 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <Smartphone className="w-12 h-12 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-600 mb-3">App móvil</h3>
              <p className="text-sky-500">
                Gestioná tu cobertura, turnos y consultas desde tu celular
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-600 mb-4">Cómo funciona</h2>
            <p className="text-xl text-sky-500 max-w-3xl mx-auto">
              En solo 3 pasos simples, tenés la cobertura que tu familia necesita
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-sky-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-sky-600 mb-3">{step.title}</h3>
                <p className="text-sky-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-600 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-sky-500 max-w-3xl mx-auto">
              Miles de familias ya confían en nosotros para cuidar su salud
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sky-500 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sky-600">{testimonial.name}</p>
                  <p className="text-sky-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-600 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-sky-500">
              Resolvemos las dudas más comunes sobre nuestros planes
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-sky-600">{faq.question}</h3>
                    <span
                      className={`text-2xl transition-transform duration-200 ${openFaq === index ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-sky-500">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sky-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para proteger a tu familia?
          </h2>
          <p className="text-xl mb-8 text-sky-100">
            Cotizá tu plan ideal en menos de 5 minutos y empezá a disfrutar la tranquilidad
          </p>
          <Link
            href="/preficha"
            className="inline-block bg-white text-sky-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-50 transition-colors duration-300 shadow-lg"
          >
            Cotizá Ahora - Es Gratis
          </Link>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-600 mb-4">Dejanos tus datos</h2>
            <p className="text-xl text-sky-500 max-w-2xl mx-auto">
              Uno de nuestros asesores se pondrá en contacto para ayudarte a encontrar la cobertura
              médica que mejor se adapte a vos.
            </p>
          </div>

          <form className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre y Apellido */}
              <div className="md:col-span-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Ingresá tu nombre completo"
                />
              </div>

              {/* Localidad */}
              <div>
                <label htmlFor="localidad" className="block text-sm font-medium text-gray-700 mb-2">
                  Localidad *
                </label>
                <input
                  type="text"
                  id="localidad"
                  name="localidad"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Ciudad, Provincia"
                />
              </div>

              {/* DNI */}
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                  DNI *
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="12345678"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Cobertura de interés */}
              <div className="md:col-span-2">
                <label htmlFor="cobertura" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué cobertura te interesa? (opcional)
                </label>
                <select
                  id="cobertura"
                  name="cobertura"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                >
                  <option value="">Seleccioná una opción</option>
                  <option value="sancor">Sancor</option>
                  <option value="avalian">Avalian</option>
                  <option value="galeno">Galeno</option>
                  <option value="premedic">Premedic</option>
                  <option value="prevencion">Prevención</option>
                  <option value="otro">Otra</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="cta-button px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Sancor Salud</h3>
              <p className="text-sky-200 mb-4">
                La cobertura médica que tu familia necesita, con la confianza que merece.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Planes</h4>
              <ul className="space-y-2 text-sky-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Plan Básico
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Plan Familiar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Plan Premium
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Atención</h4>
              <ul className="space-y-2 text-sky-200">
                <li>📞 0800-123-4567</li>
                <li>📧 info@sancorsalud.com</li>
                <li>🕒 Lun a Vie 8:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-sky-200 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-sky-200 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-sky-200 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-sky-600 mt-12 pt-8 text-center text-sky-200">
            <p>&copy; 2024 Sancor Salud. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
