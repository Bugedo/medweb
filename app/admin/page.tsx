'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import {
  getContactos,
  updateContactoStatus,
  deleteContacto,
  Contacto,
} from '../../lib/adminContactService';
import { Search, Filter, Trash2, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';

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

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [prefichas, setPrefichas] = useState<Preficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [contactosLoading, setContactosLoading] = useState(false);
  const [contactosError, setContactosError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  // Estado para tabs
  const [activeTab, setActiveTab] = useState<'prefichas' | 'contactos'>('prefichas');

  // Estados para menú desplegable de preficha
  const [expandedPreficha, setExpandedPreficha] = useState<string | null>(null);
  const [editingPreficha, setEditingPreficha] = useState<Preficha | null>(null);

  // Estados para filtros de prefichas
  const [prefichaSearch, setPrefichaSearch] = useState('');
  const [prefichaStatusFilter, setPrefichaStatusFilter] = useState('all');
  const [updatingPreficha, setUpdatingPreficha] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    checkUser();
    loadPrefichas();
  }, []);

  useEffect(() => {
    if (activeTab === 'contactos') {
      loadContactos();
    }
  }, [activeTab, currentPage, search, statusFilter]);

  const checkUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }
    setUser(session.user);
  }, [router]);

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

  const loadContactos = useCallback(async () => {
    setContactosLoading(true);
    try {
      const result = await getContactos(currentPage, 10, search, statusFilter);
      if (result.success && result.data) {
        setContactos(result.data);
        setTotal(result.total || 0);
        setContactosError('');
      } else {
        setContactosError(result.error || 'Error al cargar contactos');
      }
    } catch (err) {
      setContactosError('Error al cargar contactos');
    } finally {
      setContactosLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const result = await updateContactoStatus(id, newStatus as any);
      if (result.success) {
        await loadContactos(); // Recargar la lista
      } else {
        console.error('Error updating status:', result.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contacto?')) return;

    setUpdating(id);
    try {
      const result = await deleteContacto(id);
      if (result.success) {
        await loadContactos(); // Recargar la lista
      } else {
        console.error('Error deleting contacto:', result.error);
      }
    } catch (error) {
      console.error('Error deleting contacto:', error);
    } finally {
      setUpdating(null);
    }
  };

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

  const handleToggleDetails = (prefichaId: string, preficha: Preficha) => {
    if (expandedPreficha === prefichaId) {
      setExpandedPreficha(null);
      setEditingPreficha(null);
    } else {
      setExpandedPreficha(prefichaId);
      setEditingPreficha(preficha);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'not_interested':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'contacted':
        return 'Contactado';
      case 'closed':
        return 'Cliente Cerrado';
      case 'not_interested':
        return 'No Interesado';
      default:
        return status;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  router.push('/admin/login');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('prefichas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prefichas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Prefichas
            </button>
            <button
              onClick={() => setActiveTab('contactos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contactos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📞 Contactos
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'prefichas' ? (
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
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Prefichas
                          </dt>
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
                                (p) =>
                                  new Date(p.created_at).toDateString() ===
                                  new Date().toDateString(),
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
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Esta Semana
                          </dt>
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
                                <p className="text-sm text-gray-500">
                                  {formatDate(preficha.created_at)}
                                </p>
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
          ) : (
            <>
              {/* Filtros y búsqueda para contactos */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Búsqueda */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar contactos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Filtro de status */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pending">Pendiente</option>
                      <option value="contacted">Contactado</option>
                      <option value="closed">Cliente Cerrado</option>
                      <option value="not_interested">No Interesado</option>
                    </select>
                  </div>

                  {/* Contador de resultados */}
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-500">
                      {contactos.length} de {total} contactos
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de Contactos */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Contactos</h3>
                </div>
                <div className="px-6 py-4">
                  {contactosLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Cargando contactos...</p>
                    </div>
                  ) : contactosError ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{contactosError}</p>
                      <button
                        onClick={loadContactos}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Reintentar
                      </button>
                    </div>
                  ) : contactos.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No se encontraron contactos</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contacto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Información
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contactos.map((contacto) => (
                            <tr key={contacto.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {contacto.nombre}
                                  </div>
                                  <div className="text-sm text-gray-500">{contacto.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  <div>📍 {contacto.localidad}</div>
                                  <div>📞 {contacto.telefono}</div>
                                  <div>🆔 {contacto.dni}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contacto.status)}`}
                                >
                                  {getStatusLabel(contacto.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(contacto.created_at).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  {/* Cambiar estado */}
                                  <select
                                    value={contacto.status}
                                    onChange={(e) =>
                                      handleStatusChange(contacto.id, e.target.value)
                                    }
                                    disabled={updating === contacto.id}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="pending">Pendiente</option>
                                    <option value="contacted">Contactado</option>
                                    <option value="closed">Cliente Cerrado</option>
                                    <option value="not_interested">No Interesado</option>
                                  </select>

                                  {/* Eliminar */}
                                  <button
                                    onClick={() => handleDelete(contacto.id)}
                                    disabled={updating === contacto.id}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                    title="Eliminar contacto"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
