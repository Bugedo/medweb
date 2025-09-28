'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Search, Filter } from 'lucide-react';

interface Preficha {
  id: string;
  created_at: string;
  updated_at: string;
  vendor_id: string | null;
  status: 'pending' | 'completed';

  // Datos del cliente
  vendedor: string;
  nombre_cliente: string;
  apellido_cliente: string;
  email: string;
  dni: string;
  numero_celular: string;
  vigencia_cobertura: string;

  // Beneficiario del seguro de vida
  beneficiario_apellido_nombres: string;
  beneficiario_dni: string;
  beneficiario_fecha_nacimiento: string;

  // Tercero pagador
  tercero_apellido_nombres: string;
  tercero_email: string;
  tercero_numero_celular: string;

  // Información adicional
  origen_dato: string[];
  canal_afiliacion: string[];
  plan: string;
  precio_lista: string;
  porcentaje_descuento: string;
  cantidad_capitas: string;
  localidad_provincia: string;
  observaciones: string;
  archivo_adjunto: string;
}

interface PrefichasTabProps {
  supabase: any;
}

export default function PrefichasTab({ supabase }: PrefichasTabProps) {
  const [prefichas, setPrefichas] = useState<Preficha[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para menú desplegable de preficha
  const [expandedPreficha, setExpandedPreficha] = useState<string | null>(null);
  const [editingPreficha, setEditingPreficha] = useState<Preficha | null>(null);

  // Estados para filtros de prefichas
  const [prefichaSearch, setPrefichaSearch] = useState('');
  const [prefichaStatusFilter, setPrefichaStatusFilter] = useState('all');
  const [updatingPreficha, setUpdatingPreficha] = useState<string | null>(null);

  const loadPrefichas = useCallback(async () => {
    try {
      console.log('🔄 Cargando prefichas desde la DB...');
      const { data, error } = await supabase
        .from('prefichas')
        .select(
          `
          id,
          created_at,
          updated_at,
          vendor_id,
          status,
          vendedor,
          nombre_cliente,
          apellido_cliente,
          email,
          dni,
          numero_celular,
          vigencia_cobertura,
          beneficiario_apellido_nombres,
          beneficiario_dni,
          beneficiario_fecha_nacimiento,
          tercero_apellido_nombres,
          tercero_email,
          tercero_numero_celular,
          origen_dato,
          canal_afiliacion,
          plan,
          precio_lista,
          porcentaje_descuento,
          cantidad_capitas,
          localidad_provincia,
          observaciones,
          archivo_adjunto
        `,
        )
        .order('created_at', { ascending: false });

      console.log('📊 Respuesta de carga de prefichas:', { data, error });

      if (error) {
        console.error('❌ Error al cargar prefichas:', error);
        return;
      }

      console.log('✅ Prefichas cargadas:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📋 Status de las prefichas:');
        data.forEach((preficha, index) => {
          console.log(
            `  ${index + 1}. ID: ${preficha.id} - Status: ${preficha.status} - Cliente: ${preficha.nombre_cliente} ${preficha.apellido_cliente}`,
          );
        });
      }

      setPrefichas(data || []);
    } catch (error) {
      console.error('❌ Error loading prefichas:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const handlePrefichaStatusChange = async (
    prefichaId: string,
    newStatus: 'pending' | 'completed',
  ) => {
    console.log('🔄 Iniciando cambio de status:', { prefichaId, newStatus });
    setUpdatingPreficha(prefichaId);

    try {
      console.log('📡 Enviando request a la DB...');
      const { data, error } = await supabase
        .from('prefichas')
        .update({ status: newStatus })
        .eq('id', prefichaId)
        .select();

      console.log('📊 Respuesta de la DB:', { data, error });

      if (error) {
        console.error('❌ Error al actualizar status:', error);
        return;
      }

      console.log('✅ DB actualizada correctamente, actualizando estado local...');

      // Actualizar el estado local
      setPrefichas((prevPrefichas) =>
        prevPrefichas.map((preficha) =>
          preficha.id === prefichaId ? { ...preficha, status: newStatus } : preficha,
        ),
      );

      console.log('🎉 Status actualizado correctamente en la DB y estado local');
    } catch (error) {
      console.error('❌ Error al cambiar status:', error);
    } finally {
      setUpdatingPreficha(null);
    }
  };

  useEffect(() => {
    loadPrefichas();
  }, [loadPrefichas]);

  const handleToggleDetails = (prefichaId: string, preficha: Preficha) => {
    if (expandedPreficha === prefichaId) {
      setExpandedPreficha(null);
      setEditingPreficha(null);
    } else {
      setExpandedPreficha(prefichaId);
      setEditingPreficha(preficha);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredPrefichas = prefichas.filter((preficha) => {
    // Filtro por status
    const matchesStatus =
      prefichaStatusFilter === 'all' ||
      (prefichaStatusFilter === 'pending' && preficha.status === 'pending') ||
      (prefichaStatusFilter === 'completed' && preficha.status === 'completed');

    // Filtro por búsqueda (nombre, email, vendedor, plan)
    const matchesSearch =
      !prefichaSearch ||
      preficha.nombre_cliente?.toLowerCase().includes(prefichaSearch.toLowerCase()) ||
      preficha.apellido_cliente?.toLowerCase().includes(prefichaSearch.toLowerCase()) ||
      preficha.email?.toLowerCase().includes(prefichaSearch.toLowerCase()) ||
      preficha.vendedor?.toLowerCase().includes(prefichaSearch.toLowerCase()) ||
      preficha.plan?.toLowerCase().includes(prefichaSearch.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando prefichas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Prefichas</dt>
                  <dd className="text-lg font-medium text-gray-900">{prefichas.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hoy</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      prefichas.filter(
                        (p) => new Date(p.created_at).toDateString() === new Date().toDateString(),
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Esta Semana</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      prefichas.filter((p) => {
                        const prefichaDate = new Date(p.created_at);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return prefichaDate >= weekAgo;
                      }).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda para prefichas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, vendedor, plan..."
              value={prefichaSearch}
              onChange={(e) => setPrefichaSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro de status */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={prefichaStatusFilter}
              onChange={(e) => setPrefichaStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              {filteredPrefichas.length} de {prefichas.length} prefichas
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Prefichas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Prefichas</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredPrefichas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron prefichas</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredPrefichas.map((preficha) => (
                <li key={preficha.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {preficha.id?.charAt(0) || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {preficha.nombre_cliente} {preficha.apellido_cliente}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {preficha.email} • {preficha.plan}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      {/* Vendedor */}
                      <div className="text-center min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Vendedor
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {preficha.vendedor}
                        </p>
                      </div>

                      {/* Plan */}
                      <div className="text-center min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Plan
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {preficha.plan}
                        </p>
                      </div>

                      {/* Localidad */}
                      <div className="text-center min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Localidad
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {preficha.localidad_provincia}
                        </p>
                      </div>

                      {/* Fecha */}
                      <div className="text-center min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Fecha
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(preficha.created_at)}</p>
                      </div>

                      {/* Status */}
                      <div className="text-center min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Status
                        </p>
                        <div className="flex items-center justify-center space-x-2">
                          <select
                            value={preficha.status}
                            onChange={(e) =>
                              handlePrefichaStatusChange(
                                preficha.id,
                                e.target.value as 'pending' | 'completed',
                              )
                            }
                            disabled={updatingPreficha === preficha.id}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="completed">Completada</option>
                          </select>
                          {updatingPreficha === preficha.id && (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleDetails(preficha.id, preficha)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        {expandedPreficha === preficha.id ? 'Ocultar' : 'Ver Detalles'}
                      </button>
                    </div>
                  </div>

                  {/* Detalles expandidos */}
                  {expandedPreficha === preficha.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Datos del Cliente
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                              </label>
                              <input
                                type="text"
                                value={preficha.nombre_cliente || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido
                              </label>
                              <input
                                type="text"
                                value={preficha.apellido_cliente || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="text"
                                value={preficha.email || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                DNI
                              </label>
                              <input
                                type="text"
                                value={preficha.dni || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                              </label>
                              <input
                                type="text"
                                value={preficha.numero_celular || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vigencia de Cobertura
                              </label>
                              <input
                                type="text"
                                value={preficha.vigencia_cobertura || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Información del Plan
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendedor
                              </label>
                              <input
                                type="text"
                                value={preficha.vendedor || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Plan
                              </label>
                              <input
                                type="text"
                                value={preficha.plan || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio Lista
                              </label>
                              <input
                                type="text"
                                value={preficha.precio_lista || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Porcentaje Descuento
                              </label>
                              <input
                                type="text"
                                value={preficha.porcentaje_descuento || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cantidad de Capitas
                              </label>
                              <input
                                type="text"
                                value={preficha.cantidad_capitas || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Localidad y Provincia
                              </label>
                              <input
                                type="text"
                                value={preficha.localidad_provincia || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Beneficiario del Seguro de Vida */}
                      {preficha.beneficiario_apellido_nombres && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Beneficiario del Seguro de Vida
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido y Nombres
                              </label>
                              <input
                                type="text"
                                value={preficha.beneficiario_apellido_nombres || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                DNI
                              </label>
                              <input
                                type="text"
                                value={preficha.beneficiario_dni || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Nacimiento
                              </label>
                              <input
                                type="text"
                                value={preficha.beneficiario_fecha_nacimiento || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tercero Pagador */}
                      {preficha.tercero_apellido_nombres && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Tercero Pagador
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido y Nombres
                              </label>
                              <input
                                type="text"
                                value={preficha.tercero_apellido_nombres || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="text"
                                value={preficha.tercero_email || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                              </label>
                              <input
                                type="text"
                                value={preficha.tercero_numero_celular || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Observaciones */}
                      {preficha.observaciones && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Observaciones
                          </h4>
                          <textarea
                            value={preficha.observaciones}
                            readOnly
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setExpandedPreficha(null);
                            setEditingPreficha(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
