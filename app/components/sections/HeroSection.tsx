'use client';

import React from 'react';
import Image from 'next/image';
import { heroSlides } from './data';

interface HeroSectionProps {
  currentSlide: number;
}

export default function HeroSection({ currentSlide }: HeroSectionProps) {
  const segment = heroSlides[currentSlide].title2 || '';
  const isGenW = segment.toLowerCase().includes('genw');
  const isGenXt = segment.toLowerCase().includes('gen xt');

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
          <div
            key={`benefits-${currentSlide}`}
            className="flex justify-center md:justify-start w-full animate-fade-in-up"
          >
            <div className="hero-benefits-panel w-full max-w-2xl md:max-w-3xl">
              <div className="flex items-end gap-3 flex-wrap">
                <h2 className="text-white font-semibold text-4xl md:text-6xl leading-none tracking-tight">
                  {heroSlides[currentSlide].title}
                </h2>
                {segment && (
                  <>
                    {isGenW ? (
                      <span className="hero-segment-inline">
                        <span className="hero-segment-genw">GenW</span>
                        <span className="hero-segment-age">18-35</span>
                      </span>
                    ) : isGenXt ? (
                      <span className="hero-segment-pill">
                        <span className="hero-segment-genxt">GEN XT</span>
                        <span className="hero-segment-pill-age">36-45</span>
                      </span>
                    ) : (
                      <span className="hero-segment-badge">{segment}</span>
                    )}
                  </>
                )}
              </div>

              {heroSlides[currentSlide].subtitle && (
                <p className="text-white/95 font-semibold text-base md:text-xl mt-3">
                  {heroSlides[currentSlide].subtitle}
                </p>
              )}

              <div className="hero-crawl-viewport mt-4 md:mt-6">
                <ul className="hero-crawl-list">
                  {Array.isArray(heroSlides[currentSlide].items) &&
                    heroSlides[currentSlide].items.map((item: string, index: number) => (
                      <li key={`${currentSlide}-item-${index}`} className="hero-crawl-item">
                        <span className="hero-check-dot">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>

            </div>
          </div>
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
