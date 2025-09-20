'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

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

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    code: '',
    is_active: true,
  });
  const router = useRouter();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const { data, error } = await supabase.from('vendors').select('*').order('name');

      if (error) {
        console.log('Tabla vendors no existe aún, usando vendedores temporales');
        // Usar vendedores temporales si la tabla no existe
        setVendors([
          { id: 'temp-1', name: 'Juan Pérez', email: 'juan.perez@sancor.com', phone: '0351-1234567', code: 'VEN001', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 'temp-2', name: 'María González', email: 'maria.gonzalez@sancor.com', phone: '0351-2345678', code: 'VEN002', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 'temp-3', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@sancor.com', phone: '0351-3456789', code: 'VEN003', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 'temp-4', name: 'Ana Martínez', email: 'ana.martinez@sancor.com', phone: '0351-4567890', code: 'VEN004', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 'temp-5', name: 'Luis Fernández', email: 'luis.fernandez@sancor.com', phone: '0351-5678901', code: 'VEN005', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ]);
      } else {
        setVendors(data || []);
      }
    } catch (error) {
      console.log('Error cargando vendedores, usando temporales:', error);
      // Usar vendedores temporales en caso de error
      setVendors([
        { id: 'temp-1', name: 'Juan Pérez', email: 'juan.perez@sancor.com', phone: '0351-1234567', code: 'VEN001', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'temp-2', name: 'María González', email: 'maria.gonzalez@sancor.com', phone: '0351-2345678', code: 'VEN002', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'temp-3', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@sancor.com', phone: '0351-3456789', code: 'VEN003', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'temp-4', name: 'Ana Martínez', email: 'ana.martinez@sancor.com', phone: '0351-4567890', code: 'VEN004', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'temp-5', name: 'Luis Fernández', email: 'luis.fernandez@sancor.com', phone: '0351-5678901', code: 'VEN005', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si estamos usando vendedores temporales, mostrar mensaje
    if (vendors.length > 0 && vendors[0].id.startsWith('temp-')) {
      alert('Los vendedores temporales no se pueden modificar. Aplica la migración de la base de datos para habilitar la gestión completa.');
      return;
    }

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

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
      loadVendors();
    } catch (error) {
      console.error('Error guardando vendedor:', error);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    // Si estamos usando vendedores temporales, mostrar mensaje
    if (vendor.id.startsWith('temp-')) {
      alert('Los vendedores temporales no se pueden modificar. Aplica la migración de la base de datos para habilitar la gestión completa.');
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
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const { error } = await supabase.from('vendors').delete().eq('id', id);

      if (error) throw error;
      loadVendors();
    } catch (error) {
      console.error('Error eliminando vendedor:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vendedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Vendedores</h1>
            <p className="mt-2 text-gray-600">Administra los vendedores del sistema</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ← Volver
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingVendor(null);
                setFormData({ name: '', email: '', phone: '', code: '', is_active: true });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Nuevo Vendedor
            </button>
          </div>
        </div>

        {/* Formulario de vendedor */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
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

        {/* Lista de vendedores */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Vendedores ({vendors.length})</h2>
          </div>
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
                {vendors.map((vendor) => (
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
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
