'use client';

import React from 'react';
import Image from 'next/image';
import { steps } from './data';

interface HowItWorksSectionProps {
  visibleElements: Set<string>;
}

export default function HowItWorksSection({ visibleElements }: HowItWorksSectionProps) {
  return (
    <section className="py-20 relative overflow-hidden z-10 bg-white w-full">
      <div
        id="how-it-works"
        data-scroll-animation
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-fade-in-up ${visibleElements.has('how-it-works') ? 'visible' : ''}`}
      >
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-black" style={{ color: '#0c369c' }}>
            ¿Cómo funciona?
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-8 max-w-3xl mx-auto">
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
    </section>
  );
}
