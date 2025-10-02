import React from 'react';

interface PlansSectionProps {
  visibleElements: Set<string>;
}

const plans = [
  {
    name: 'Plan 1000',
    features: [
      'Amplia Cartilla de Prestadores.',
      'Cobertura en todo el País.',
      'Medicamentos y Anticonceptivos sin vademécum (todas las marcas comerciales).',
      'Cobertura en Ortodoncia al 100% (prestadores seleccionados).',
    ],
  },
  {
    name: 'Plan 1500',
    features: [
      'Cobertura Nacional y en Países Limítrofes.',
      'Mayor red de Prestadores.',
      'Cirugía Refractiva al 50%.',
      'Habitación Individual en Internación.',
    ],
  },
  {
    name: 'Plan 3000',
    features: [
      'Plan Abierto, con Reintegros.',
      'Ortodoncia hasta los 30 años.',
      'Cobertura Nacional e Internacional.',
      'Prestadores de Primer Nivel en todo el País.',
    ],
  },
];

export default function PlansSection({ visibleElements }: PlansSectionProps) {
  return (
    <section
      id="planes"
      data-scroll-animation
      className="py-20 relative z-10"
      style={{
        background: 'linear-gradient(135deg, #0c369c 0%, #0066cc 50%, #0c369c 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            visibleElements.has('planes') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Planes SanCor Salud</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Recibí la mejor atención con nuestros planes
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-1000 hover:scale-105 ${
                visibleElements.has('planes')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Plan Name */}
              <div className="mb-6 text-center pb-6 border-b-2 border-blue-100">
                <h3 className="text-3xl font-bold text-blue-900">{plan.name}</h3>
              </div>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          className={`mt-12 text-center transition-all duration-1000 ${
            visibleElements.has('planes') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '450ms' }}
        >
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
            COTIZAR AHORA
          </button>
        </div>
      </div>
    </section>
  );
}
