'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const router = useRouter();

  useEffect(() => {
    checkUser();
    loadPrefichas();
  }, []);

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
              <p className="text-gray-600">Sancor Salud - Gestión de Prefichas</p>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
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
                              new Date(p.created_at).toDateString() === new Date().toDateString(),
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

          {/* Prefichas Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Prefichas Recientes</h3>
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
        </div>
      </main>
    </div>
  );
}
