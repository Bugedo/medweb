'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Import sections
import HeroSection from './components/sections/HeroSection';
import WhyChooseSancorSection from './components/sections/WhyChooseSancorSection';
import HowItWorksSection from './components/sections/HowItWorksSection';
import ContactFormSection from './components/sections/ContactFormSection';
import { heroSlides } from './components/sections/data';

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
      setSubmitMessage('Por favor ingresá un email válido.');
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

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(
          '¡Gracias por contactarnos! Un asesor se comunicará contigo a la brevedad.',
        );
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

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Hero Section */}
      <HeroSection currentSlide={currentSlide} />

      {/* Why Choose Sancor Section */}
      <WhyChooseSancorSection visibleElements={visibleElements} />

      {/* How it Works Section */}
      <HowItWorksSection visibleElements={visibleElements} />

      {/* Contact Form Section */}
      <ContactFormSection
        visibleElements={visibleElements}
        contactData={contactData}
        handleContactInputChange={handleContactInputChange}
        handleContactSubmit={handleContactSubmit}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        submitMessage={submitMessage}
      />

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

