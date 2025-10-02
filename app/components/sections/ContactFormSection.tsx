'use client';

import React from 'react';

interface ContactData {
  nombre: string;
  localidad: string;
  telefono: string;
  email: string;
  observaciones: string;
}

interface ContactFormSectionProps {
  visibleElements: Set<string>;
  contactData: ContactData;
  handleContactInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleContactSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  submitMessage: string;
}

export default function ContactFormSection({
  visibleElements,
  contactData,
  handleContactInputChange,
  handleContactSubmit,
  isSubmitting,
  submitStatus,
  submitMessage,
}: ContactFormSectionProps) {
  return (
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
              Uno de nuestros asesores se pondrá en contacto para ayudarte a encontrar la cobertura
              médica que mejor se adapte a vos.
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
  );
}
