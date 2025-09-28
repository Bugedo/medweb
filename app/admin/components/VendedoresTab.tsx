'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VendedoresTabProps {
  supabase: any;
}

export default function VendedoresTab({ supabase }: VendedoresTabProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    code: '',
    is_active: true,
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('vendors').select('*').order('name');

      if (error) {
        console.log('Tabla vendors no existe aún, usando vendedores temporales');
        // Usar vendedores temporales si la tabla no existe
        setVendors([
          {
            id: 'temp-1',
            name: 'Juan Pérez',
            email: 'juan.perez@sancor.com',
            phone: '0351-1234567',
            code: 'VEN001',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'temp-2',
            name: 'María González',
            email: 'maria.gonzalez@sancor.com',
            phone: '0351-2345678',
            code: 'VEN002',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'temp-3',
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@sancor.com',
            phone: '0351-3456789',
            code: 'VEN003',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'temp-4',
            name: 'Ana Martínez',
            email: 'ana.martinez@sancor.com',
            phone: '0351-4567890',
            code: 'VEN004',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'temp-5',
            name: 'Luis Fernández',
            email: 'luis.fernandez@sancor.com',
            phone: '0351-5678901',
            code: 'VEN005',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } else {
        setVendors(data || []);
      }
      setError('');
    } catch (err) {
      console.log('Error cargando vendedores, usando temporales:', err);
      // Usar vendedores temporales en caso de error
      setVendors([
        {
          id: 'temp-1',
          name: 'Juan Pérez',
          email: 'juan.perez@sancor.com',
          phone: '0351-1234567',
          code: 'VEN001',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'temp-2',
          name: 'María González',
          email: 'maria.gonzalez@sancor.com',
          phone: '0351-2345678',
          code: 'VEN002',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'temp-3',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@sancor.com',
          phone: '0351-3456789',
          code: 'VEN003',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'temp-4',
          name: 'Ana Martínez',
          email: 'ana.martinez@sancor.com',
          phone: '0351-4567890',
          code: 'VEN004',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'temp-5',
          name: 'Luis Fernández',
          email: 'luis.fernandez@sancor.com',
          phone: '0351-5678901',
          code: 'VEN005',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      setError('');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si estamos usando vendedores temporales, mostrar mensaje
    if (vendors.length > 0 && vendors[0].id.startsWith('temp-')) {
      alert(
        'Los vendedores temporales no se pueden modificar. Aplica la migración de la base de datos para habilitar la gestión completa.',
      );
      return;
    }

    try {
      if (editingVendor) {
        // Actualizar vendedor existente
        const { error } = await supabase
          .from('vendors')
          .update(formData)
          .eq('id', editingVendor.id);

        if (error) throw error;
      } else {
        // Crear nuevo vendedor
        const { error } = await supabase.from('vendors').insert(formData);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingVendor(null);
      setFormData({ name: '', email: '', phone: '', code: '', is_active: true });
      await loadVendors();
    } catch (error) {
      console.error('Error guardando vendedor:', error);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    // Si estamos usando vendedores temporales, mostrar mensaje
    if (vendor.id.startsWith('temp-')) {
      alert(
        'Los vendedores temporales no se pueden modificar. Aplica la migración de la base de datos para habilitar la gestión completa.',
      );
      return;
    }

    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      code: vendor.code,
      is_active: vendor.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vendedor?')) return;

    try {
      const { error } = await supabase.from('vendors').delete().eq('id', id);

      if (error) throw error;
      await loadVendors();
    } catch (error) {
      console.error('Error eliminando vendedor:', error);
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      !search ||
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase()) ||
      vendor.code.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vendedores...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards para Vendedores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Vendedores</dt>
                  <dd className="text-lg font-medium text-gray-900">{vendors.length}</dd>
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
                  <span className="text-white text-sm font-bold">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Activos</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {vendors.filter((v) => v.is_active).length}
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
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">❌</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inactivos</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {vendors.filter((v) => !v.is_active).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda para vendedores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar vendedores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botón para agregar vendedor */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingVendor(null);
                setFormData({ name: '', email: '', phone: '', code: '', is_active: true });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Nuevo Vendedor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de vendedor */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingVendor ? 'Editar Vendedor' : 'Nuevo Vendedor'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Activo</span>
              </label>
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingVendor ? 'Actualizar' : 'Crear'} Vendedor
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingVendor(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Vendedores */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Vendedores ({vendors.length})</h3>
        </div>
        <div className="px-6 py-4">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadVendors}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron vendedores</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{vendor.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vendor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vendor.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vendor.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {vendor.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(vendor)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(vendor.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
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
  );
}
