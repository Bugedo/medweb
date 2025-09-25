'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const benefits = [
    {
      icon: '🏥',
      title: 'Cobertura Nacional',
      description: 'Atención médica en todo el país con la red más amplia de prestadores',
    },
    {
      icon: '⚡',
      title: 'Sin Carencias',
      description: 'Acceso inmediato a todos los servicios sin períodos de espera',
    },
    {
      icon: '👨‍⚕️',
      title: 'Médicos de Cabecera',
      description: 'Atención personalizada con profesionales de confianza',
    },
    {
      icon: '📱',
      title: 'App Móvil',
      description: 'Gestioná tu cobertura desde cualquier lugar, las 24 horas',
    },
    {
      icon: '💰',
      title: 'Precios Accesibles',
      description: 'Planes flexibles que se adaptan a tu presupuesto familiar',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Cotizá tu plan',
      description: 'Completá el formulario con tus datos y necesidades',
    },
    {
      number: '02',
      title: 'Recibí tu propuesta',
      description: 'Te enviamos las mejores opciones personalizadas',
    },
    {
      number: '03',
      title: 'Elegí tu plan',
      description: 'Seleccioná la cobertura que mejor se adapte a vos',
    },
    {
      number: '04',
      title: 'Firmá digitalmente',
      description: 'Proceso 100% online, sin papeleo ni esperas',
    },
    {
      number: '05',
      title: 'Activá tu cobertura',
      description: 'Empezá a usar tu plan desde el primer día',
    },
    {
      number: '06',
      title: 'Disfrutá la tranquilidad',
      description: 'Tu familia protegida con la mejor atención médica',
    },
  ];

  const plans = [
    {
      name: 'Básico',
      price: '$15.000',
      period: '/mes',
      features: [
        'Consultas médicas ilimitadas',
        'Estudios de laboratorio',
        'Emergencias 24/7',
        'Farmacia con descuentos',
      ],
      popular: false,
    },
    {
      name: 'Familiar',
      price: '$25.000',
      period: '/mes',
      features: [
        'Todo lo del plan Básico',
        'Odontología incluida',
        'Psicología y nutrición',
        'Medicina preventiva',
        'App móvil premium',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: '$35.000',
      period: '/mes',
      features: [
        'Todo lo del plan Familiar',
        'Medicina prepaga completa',
        'Cirugías sin copago',
        'Medicina estética',
        'Asistencia internacional',
      ],
      popular: false,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Cuidamos lo que más amás
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Tu familia merece la cobertura que mejor se adapta a vos
              </p>
              <Link
                href="/preficha"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg"
              >
                Cotizá tu prepaga ideal
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-2xl font-semibold mb-2">Familia Protegida</h3>
                  <p className="text-blue-100">
                    La tranquilidad de saber que tu familia está cuidada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos la mejor cobertura médica con beneficios únicos que se adaptan a tu vida
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En solo 6 pasos simples, tenés la cobertura que tu familia necesita
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestros Planes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elegí el plan que mejor se adapte a las necesidades de tu familia
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/preficha"
                  className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Elegir Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
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
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <span
                      className={`text-2xl transition-transform duration-200 ${openFaq === index ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para proteger a tu familia?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Cotizá tu plan ideal en menos de 5 minutos y empezá a disfrutar la tranquilidad
          </p>
          <Link
            href="/preficha"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg"
          >
            Cotizá Ahora - Es Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Sancor Salud</h3>
              <p className="text-gray-400 mb-4">
                La cobertura médica que tu familia necesita, con la confianza que merece.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Planes</h4>
              <ul className="space-y-2 text-gray-400">
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
              <ul className="space-y-2 text-gray-400">
                <li>📞 0800-123-4567</li>
                <li>📧 info@sancorsalud.com</li>
                <li>🕒 Lun a Vie 8:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sancor Salud. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
