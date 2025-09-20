'use client';

import { useState, useEffect } from 'react';
import { savePreficha, PrefichaData } from '../../lib/prefichaService';
import { createBrowserClient } from '@supabase/ssr';

interface Vendor {
  id: string;
  name: string;
  code: string;
}

export default function PrefichaForm() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState({
    // Datos del Cliente
    vendedor: '',
    nombreCliente: '',
    apellidoCliente: '',
    email: '',
    dni: '',
    numeroCelular: '',
    vigenciaCobertura: '',

    // Beneficiario del Seguro de Vida
    beneficiarioApellidoNombres: '',
    beneficiarioDni: '',
    beneficiarioFechaNacimiento: '',

    // Datos del Tercero Pagador
    terceroApellidoNombres: '',
    terceroEmail: '',
    terceroNumeroCelular: '',

    // Información adicional
    origenDato: [] as string[],
    canalAfiliacion: [] as string[],
    plan: '',
    precioLista: '',
    porcentajeDescuento: '',
    cantidadCapitas: '',
    localidadProvincia: '',
    observaciones: '',
    archivoAdjunto: null as File | null,
  });

  // Cargar vendedores al montar el componente
  useEffect(() => {
    const loadVendors = async () => {
      try {
        // Intentar cargar desde la base de datos
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { data, error } = await supabase
          .from('vendors')
          .select('id, name, code')
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.log('Tabla vendors no existe aún, usando vendedores temporales');
          // Usar vendedores temporales si la tabla no existe
          setVendors([
            { id: 'temp-1', name: 'Juan Pérez', code: 'VEN001' },
            { id: 'temp-2', name: 'María González', code: 'VEN002' },
            { id: 'temp-3', name: 'Carlos Rodríguez', code: 'VEN003' },
            { id: 'temp-4', name: 'Ana Martínez', code: 'VEN004' },
            { id: 'temp-5', name: 'Luis Fernández', code: 'VEN005' },
          ]);
        } else {
          setVendors(data || []);
        }
      } catch (error) {
        console.log('Error cargando vendedores, usando temporales:', error);
        // Usar vendedores temporales en caso de error
        setVendors([
          { id: 'temp-1', name: 'Juan Pérez', code: 'VEN001' },
          { id: 'temp-2', name: 'María González', code: 'VEN002' },
          { id: 'temp-3', name: 'Carlos Rodríguez', code: 'VEN003' },
          { id: 'temp-4', name: 'Ana Martínez', code: 'VEN004' },
          { id: 'temp-5', name: 'Luis Fernández', code: 'VEN005' },
        ]);
      }
    };

    loadVendors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...(prev[name as keyof typeof prev] as string[]), value]
        : (prev[name as keyof typeof prev] as string[]).filter((item) => item !== value),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      archivoAdjunto: file,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await savePreficha(formData as PrefichaData);

      if (result.success) {
        setSubmitMessage('✅ Preficha guardada exitosamente!');
        // Reset form
        setFormData({
          vendedor: '',
          nombreCliente: '',
          apellidoCliente: '',
          email: '',
          dni: '',
          numeroCelular: '',
          vigenciaCobertura: '',
          beneficiarioApellidoNombres: '',
          beneficiarioDni: '',
          beneficiarioFechaNacimiento: '',
          terceroApellidoNombres: '',
          terceroEmail: '',
          terceroNumeroCelular: '',
          origenDato: [],
          canalAfiliacion: [],
          plan: '',
          precioLista: '',
          porcentajeDescuento: '',
          cantidadCapitas: '',
          localidadProvincia: '',
          observaciones: '',
          archivoAdjunto: null,
        });
      } else {
        setSubmitMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setSubmitMessage(`❌ Error inesperado: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Formulario de Preficha - Sancor Salud</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Datos del Cliente */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Datos del Cliente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendedor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vendedor"
                    value={formData.vendedor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar vendedor...</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombreCliente"
                    value={formData.nombreCliente}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido del Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellidoCliente"
                    value={formData.apellidoCliente}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                  <input
                    type="number"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nro. de Celular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="numeroCelular"
                    value={formData.numeroCelular}
                    onChange={handleInputChange}
                    placeholder="0351-152698745"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vigencia de la cobertura <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="vigenciaCobertura"
                    value={formData.vigenciaCobertura}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Beneficiario del Seguro de Vida */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Beneficiario del Seguro de Vida
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido y Nombres
                  </label>
                  <input
                    type="text"
                    name="beneficiarioApellidoNombres"
                    value={formData.beneficiarioApellidoNombres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                  <input
                    type="number"
                    name="beneficiarioDni"
                    value={formData.beneficiarioDni}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="beneficiarioFechaNacimiento"
                    value={formData.beneficiarioFechaNacimiento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Datos del Tercero Pagador */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Datos del Tercero Pagador
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido y Nombres
                  </label>
                  <input
                    type="text"
                    name="terceroApellidoNombres"
                    value={formData.terceroApellidoNombres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    name="terceroEmail"
                    value={formData.terceroEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nro. de Celular
                  </label>
                  <input
                    type="tel"
                    name="terceroNumeroCelular"
                    value={formData.terceroNumeroCelular}
                    onChange={handleInputChange}
                    placeholder="0351-152698745"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Información adicional */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Información adicional
              </h2>

              <div className="space-y-6">
                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origen del dato
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="origenDato"
                          value="Dato propio"
                          checked={formData.origenDato.includes('Dato propio')}
                          onChange={handleCheckboxChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Dato propio</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="origenDato"
                          value="Dato derivado"
                          checked={formData.origenDato.includes('Dato derivado')}
                          onChange={handleCheckboxChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Dato derivado</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canal de afiliación
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="canalAfiliacion"
                          value="Voluntario"
                          checked={formData.canalAfiliacion.includes('Voluntario')}
                          onChange={handleCheckboxChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Voluntario</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="canalAfiliacion"
                          value="Monotributo"
                          checked={formData.canalAfiliacion.includes('Monotributo')}
                          onChange={handleCheckboxChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Monotributo</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="canalAfiliacion"
                          value="Recibo de Sueldo"
                          checked={formData.canalAfiliacion.includes('Recibo de Sueldo')}
                          onChange={handleCheckboxChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Recibo de Sueldo</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Campos de información */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="plan"
                      value={formData.plan}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio de lista <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="precioLista"
                      value={formData.precioLista}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      % de Descuento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="porcentajeDescuento"
                      value={formData.porcentajeDescuento}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad de Capitas
                    </label>
                    <input
                      type="text"
                      name="cantidadCapitas"
                      value={formData.cantidadCapitas}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localidad y Provincia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="localidadProvincia"
                      value={formData.localidadProvincia}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Extras */}
            <section className="pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Extras
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Ingrese observaciones adicionales..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjuntar archivo
                  </label>
                  <input
                    type="file"
                    name="archivoAdjunto"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceptados: PDF, DOC, DOCX</p>
                </div>
              </div>
            </section>

            {/* Mensaje de estado */}
            {submitMessage && (
              <div
                className={`p-4 rounded-md ${
                  submitMessage.includes('✅')
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Botón de envío */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`font-medium py-3 px-8 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
