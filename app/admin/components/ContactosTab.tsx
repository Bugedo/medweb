'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';
import {
  getContactos,
  updateContactoStatus,
  deleteContacto,
  Contacto,
} from '../../../lib/adminContactService';

interface ContactosTabProps {
  // No props needed for now, but keeping for consistency
}

export default function ContactosTab({}: ContactosTabProps) {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [contactosLoading, setContactosLoading] = useState(false);
  const [contactosError, setContactosError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadContactos = useCallback(async () => {
    setContactosLoading(true);
    try {
      const result = await getContactos(currentPage, 15, search, statusFilter);
      if (result.success && result.data) {
        setContactos(result.data);
        setTotal(result.total || 0);
        setContactosError('');
      } else {
        setContactosError(result.error || 'Error al cargar leads');
      }
    } catch (err) {
      setContactosError('Error al cargar leads');
    } finally {
      setContactosLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    loadContactos();
  }, [loadContactos]);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

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
    if (!confirm('¿Estás seguro de que quieres eliminar este lead?')) return;

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

  return (
    <>
      {/* Filtros y búsqueda para contactos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar leads..."
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
              {contactos.length} de {total} leads
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Leads */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Leads</h3>
        </div>
        <div className="px-6 py-4">
          {contactosLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando leads...</p>
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
              <p className="text-gray-600">No se encontraron leads</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
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
                          <div className="text-sm font-medium text-gray-900">{contacto.nombre}</div>
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
                            title="Eliminar lead"
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

          {/* Paginación */}
          {!contactosLoading && !contactosError && contactos.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage * 15 >= total}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * 15 + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(currentPage * 15, total)}</span> de{' '}
                    <span className="font-medium">{total}</span> leads
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Anterior</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                      Página {currentPage} de {Math.ceil(total / 15)}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage * 15 >= total}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Siguiente</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
