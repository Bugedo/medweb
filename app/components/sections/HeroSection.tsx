'use client';

import React from 'react';
import Image from 'next/image';
import { heroSlides } from './data';

interface HeroSectionProps {
  currentSlide: number;
}

export default function HeroSection({ currentSlide }: HeroSectionProps) {
  return (
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
                {'subtitle2' in heroSlides[currentSlide] && heroSlides[currentSlide].subtitle2 && (
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
                {'subtitle2' in heroSlides[currentSlide] && heroSlides[currentSlide].subtitle2 && (
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
  );
}
