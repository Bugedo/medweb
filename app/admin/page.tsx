'use client';

import { useState, useEffect } from 'react';
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
  datos_cliente: {
    vendedor: string;
    nombre_cliente: string;
    apellido_cliente: string;
    email: string;
    numero_celular: string;
  }[];
  informacion_adicional: {
    plan: string;
    precio_lista: string;
    localidad_provincia: string;
  }[];
}

export default function AdminPanel() {
  const [prefichas, setPrefichas] = useState<Preficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Estados para contactos
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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const router = useRouter();

  useEffect(() => {
    checkUser();
    loadPrefichas();
  }, []);

  useEffect(() => {
    if (activeTab === 'contactos') {
      loadContactos();
    }
  }, [activeTab, currentPage, search, statusFilter]);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }
    setUser(session.user);
  };

  const loadPrefichas = async () => {
    try {
      const { data, error } = await supabase
        .from('prefichas')
        .select(
          `
          id,
          created_at,
          datos_cliente (
            vendedor,
            nombre_cliente,
            apellido_cliente,
            email,
            numero_celular
          ),
          informacion_adicional (
            plan,
            precio_lista,
            localidad_provincia
          )
        `,
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrefichas(data || []);
    } catch (error) {
      console.error('Error loading prefichas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContactos = async () => {
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
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const result = await updateContactoStatus(id, newStatus as any);
      if (result.success) {
        await loadContactos(); // Recargar la lista
      } else {
        alert(result.error || 'Error al actualizar status');
      }
    } catch (err) {
      alert('Error al actualizar status');
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
        alert(result.error || 'Error al eliminar contacto');
      }
    } catch (err) {
      alert('Error al eliminar contacto');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Sancor Salud - Gestión</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin/vendors')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                👥 Gestión de Vendedores
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
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

              {/* Prefichas Table */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Prefichas Recientes
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Listado de todas las prefichas enviadas
                  </p>
                </div>

                {prefichas.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No hay prefichas registradas</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {prefichas.map((preficha) => (
                      <li key={preficha.id}>
                        <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-medium text-sm">
                                      {preficha.datos_cliente[0]?.nombre_cliente?.charAt(0) || '?'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {preficha.datos_cliente[0]?.nombre_cliente}{' '}
                                    {preficha.datos_cliente[0]?.apellido_cliente}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {preficha.datos_cliente[0]?.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {preficha.informacion_adicional[0]?.plan}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {preficha.informacion_adicional[0]?.localidad_provincia}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  {formatDate(preficha.created_at)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Vendedor: {preficha.datos_cliente[0]?.vendedor}
                                </p>
                              </div>
                              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                                Ver Detalles
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
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
                      placeholder="Buscar por nombre, email, teléfono..."
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

                  {/* Contador */}
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-600">
                      {total} contacto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabla de contactos */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {contactosLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando contactos...</span>
                  </div>
                ) : contactosError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600">{contactosError}</p>
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
                                  onChange={(e) => handleStatusChange(contacto.id, e.target.value)}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
