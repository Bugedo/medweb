'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import PrefichasTab from './components/PrefichasTab';
import ContactosTab from './components/ContactosTab';
import VendedoresTab from './components/VendedoresTab';

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estado para tabs
  const [activeTab, setActiveTab] = useState<'prefichas' | 'contactos' | 'vendedores'>('prefichas');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }
    setUser(session.user);
    setLoading(false);
  }, [router, supabase]);

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
            <button
              onClick={() => setActiveTab('vendedores')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vendedores'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Vendedores
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'prefichas' ? (
            <PrefichasTab supabase={supabase} />
          ) : activeTab === 'contactos' ? (
            <ContactosTab />
          ) : activeTab === 'vendedores' ? (
            <VendedoresTab supabase={supabase} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
