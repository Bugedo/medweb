'use client';

import React, { useRef, useEffect } from 'react';
import {
  Plus,
  Users,
  Video,
  Hospital,
  Glasses,
  Smile,
  Smartphone,
  Shield,
  Map,
  Pill,
  CheckCircle,
} from 'lucide-react';

interface WhyChooseSancorSectionProps {
  visibleElements: Set<string>;
}

export default function WhyChooseSancorSection({ visibleElements }: WhyChooseSancorSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!containerRef.current) return;

    const scrollSpeed = 0.8; // pixels per frame (más bajo = más lento)
    let animationFrameId: number;

    const scroll = () => {
      if (!containerRef.current) return;

      containerRef.current.scrollLeft += scrollSpeed;

      // Reset when reaches halfway (for infinite loop effect)
      const maxScroll = containerRef.current.scrollWidth / 2;
      if (containerRef.current.scrollLeft >= maxScroll) {
        containerRef.current.scrollLeft = 0;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section className="py-20 relative overflow-hidden z-10">
      <div
        id="why-choose-sancor"
        data-scroll-animation
        className={`max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative scroll-fade-in-up ${visibleElements.has('why-choose-sancor') ? 'visible' : ''}`}
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

        {/* 2 Boxes Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Box Principal 1: 800.000 afiliados */}
          <div className="group relative">
            <div
              className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
              style={{ borderColor: '#00A86B' }}
            >
              <div
                className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full transition-all duration-300"
                style={{ backgroundColor: '#0c369c' }}
              >
                <Plus className="w-16 h-16 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: '#0c369c' }}>
                800.000
              </h3>
              <p className="text-2xl md:text-3xl font-semibold px-4" style={{ color: '#0c369c' }}>
                afiliados en todo el país
              </p>
            </div>
          </div>

          {/* Box Principal 2: Afiliación Flexible */}
          <div className="group relative">
            <div
              className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
              style={{ borderColor: '#00A86B' }}
            >
              <div
                className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full transition-all duration-300"
                style={{ backgroundColor: '#0c369c' }}
              >
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c369c' }}>
                Afiliación Flexible
              </h3>
              <p className="text-lg md:text-xl px-4" style={{ color: '#0c369c' }}>
                Podés sumarte con recibo de sueldo, siendo monotributista o particular
              </p>
            </div>
          </div>
        </div>

        {/* Carrusel de Beneficios Secundarios */}
        {/* Desktop: Una sola fila con scroll */}
        <div className="hidden md:block">
          <div
            ref={containerRef}
            className="relative overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {/* Duplicamos los items para efecto infinito */}
              {[...Array(2)].map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {/* Consultas médicas virtuales */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Video className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        Consultas médicas virtuales
                      </h3>
                    </div>
                  </div>

                  {/* Red de centros médicos */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Hospital className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        +5.000 centros médicos
                      </h3>
                    </div>
                  </div>

                  {/* Descuentos en óptica */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Glasses className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        Descuentos en óptica
                      </h3>
                    </div>
                  </div>

                  {/* Ortodoncia cubierta */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Smile className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        Ortodoncia de 18/35 años con plan GEN
                      </h3>
                    </div>
                  </div>

                  {/* App Mobile */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Smartphone className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        App Mobile
                      </h3>
                    </div>
                  </div>

                  {/* Emergencias 24/7 */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Shield className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        Emergencias 24/7
                      </h3>
                    </div>
                  </div>

                  {/* Cobertura Nacional */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Map className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        Cobertura en todo el país
                      </h3>
                    </div>
                  </div>

                  {/* Descuentos en Farmacias */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <Pill className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        Descuentos en farmacias
                      </h3>
                    </div>
                  </div>

                  {/* Sin Coseguros */}
                  <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 group">
                    <div
                      className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                      style={{ borderColor: '#00A86B' }}
                    >
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#0c369c' }}
                      >
                        <CheckCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold leading-tight"
                        style={{ color: '#0c369c' }}
                      >
                        Sin coseguros
                      </h3>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Dos filas con scroll horizontal */}
        <div className="md:hidden space-y-4">
          <style jsx>{`
            @keyframes slideRightToLeft {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% + 100vw - 1rem));
              }
            }
            @keyframes slideLeftToRight {
              0% {
                transform: translateX(calc(-100% + 100vw - 1rem));
              }
              100% {
                transform: translateX(0);
              }
            }
            .animate-row-1 {
              animation: slideRightToLeft 15s ease-in-out infinite alternate;
            }
            .animate-row-2 {
              animation: slideLeftToRight 15s ease-in-out infinite alternate;
            }
          `}</style>

          {/* Primera fila - Derecha a Izquierda */}
          <div className="overflow-hidden">
            <div className="flex gap-3 animate-row-1" style={{ width: 'max-content' }}>
              {/* Consultas médicas virtuales */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    Consultas médicas virtuales
                  </h3>
                </div>
              </div>

              {/* +5.000 centros médicos */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Hospital className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    +5.000 centros médicos
                  </h3>
                </div>
              </div>

              {/* Descuentos en óptica */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Glasses className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    Descuentos en óptica
                  </h3>
                </div>
              </div>

              {/* Ortodoncia */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Smile className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    Ortodoncia de 18/35 años con plan GEN
                  </h3>
                </div>
              </div>

              {/* App Mobile */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    App Mobile
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Segunda fila - Izquierda a Derecha */}
          <div className="overflow-hidden">
            <div className="flex gap-3 animate-row-2" style={{ width: 'max-content' }}>
              {/* Emergencias 24/7 */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    Emergencias 24/7
                  </h3>
                </div>
              </div>

              {/* Cobertura Nacional */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Map className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    Cobertura en todo el país
                  </h3>
                </div>
              </div>

              {/* Descuentos en Farmacias */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <Pill className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    Descuentos en farmacias
                  </h3>
                </div>
              </div>

              {/* Sin Coseguros */}
              <div className="flex-shrink-0 w-44">
                <div
                  className="bg-gradient-to-br from-white to-sky-50 border-2 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center"
                  style={{ borderColor: '#00A86B' }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0c369c' }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: '#0c369c' }}>
                    Sin coseguros
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
