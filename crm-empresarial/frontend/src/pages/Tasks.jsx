import { useEffect, useState } from 'react';
import { taskAPI, customerAPI, dealAPI } from '../services/api';
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const priorities = [
  { value: 'low', label: 'Baixa', color: 'bg-blue-100 text-blue-600' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-600' },
  { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-600' },
];

const types = [
  { value: 'call', label: 'Ligação' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'followup', label: 'Acompanhamento' },
  { value: 'other', label: 'Outro' },
];

const statuses = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending',
    type: 'other',
    customerId: '',
    dealId: '',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await taskAPI.getAll(params);
      setTasks(response.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await dealAPI.getAll();
      setDeals(response.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCustomers();
    fetchDeals();
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        customerId: formData.customerId ? parseInt(formData.customerId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        dueDate: new Date(formData.dueDate).toISOString(),
      };
      
      if (editingId) {
        await taskAPI.update(editingId, data);
      } else {
        await taskAPI.create(data);
      }
      
      setShowModal(false);
      setFormData({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], priority: 'medium', status: 'pending', type: 'other', customerId: '', dealId: '' });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate.split('T')[0],
      priority: task.priority,
      status: task.status,
      type: task.type,
      customerId: task.customerId?.toString() || '',
      dealId: task.dealId?.toString() || '',
    });
    setEditingId(task.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await taskAPI.delete(id);
        fetchTasks();
      } catch (error) {
        alert('Erro ao excluir');
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      await taskAPI.update(id, { status: 'completed' });
      fetchTasks();
    } catch (error) {
      alert('Erro ao concluir');
    }
  };

  const isOverdue = (task) => {
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status !== 'completed').length;
  const overdue = tasks.filter(t => isOverdue(t)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Tarefas</h2>
          <p className="text-gray-600 mt-1">
            Total: {tasks.length} | Pendentes: {pending} | Concluídas: {completed} | 
            <span className={overdue > 0 ? 'text-red-600' : ''}> Atrasadas: {overdue}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], priority: 'medium', status: 'pending', type: 'other', customerId: '', dealId: '' });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Tarefa
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'Todas' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhuma tarefa encontrada</div>
        ) : (
          tasks.map((task) => {
            const priorityData = priorities.find(p => p.value === task.priority);
            const typeData = types.find(t => t.value === task.type);
            const overdue = isOverdue(task);

            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow p-4 ${
                  task.status === 'completed' ? 'opacity-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      {typeData && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {typeData.label}
                        </span>
                      )}
                      {overdue && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                      {task.customer && <span>Cliente: {task.customer.name}</span>}
                      {task.deal && <span>Negócio: {task.deal.title}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${priorityData?.color}`}>
                      {priorityData?.label}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      task.status === 'completed' ? 'bg-green-100 text-green-600' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      task.status === 'cancelled' ? 'bg-gray-100 text-gray-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {task.status === 'completed' ? 'Concluída' :
                       task.status === 'in_progress' ? 'Em Andamento' :
                       task.status === 'cancelled' ? 'Cancelada' :
                       'Pendente'}
                    </span>
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Concluir"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Vencimento *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {types.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nenhum</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Negócio</label>
                  <select
                    value={formData.dealId}
                    onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nenhum</option>
                    {deals.map(deal => (
                      <option key={deal.id} value={deal.id}>{deal.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
