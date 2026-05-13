import { useEffect, useState } from 'react';
import { dealAPI, customerAPI } from '../services/api';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

const stages = [
  { value: 'prospect', label: 'Prospect', color: 'bg-gray-100' },
  { value: 'qualified', label: 'Qualificado', color: 'bg-blue-100' },
  { value: 'proposal', label: 'Proposta', color: 'bg-yellow-100' },
  { value: 'negotiation', label: 'Negociação', color: 'bg-orange-100' },
  { value: 'won', label: 'Ganho', color: 'bg-green-100' },
  { value: 'lost', label: 'Perdido', color: 'bg-red-100' },
];

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    value: '',
    stage: 'prospect',
    probability: 10,
    expectedCloseDate: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchDeals = async () => {
    try {
      const response = await dealAPI.getAll();
      setDeals(response.data);
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

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, value: parseFloat(formData.value) };
      
      if (editingId) {
        await dealAPI.update(editingId, data);
      } else {
        await dealAPI.create(data);
      }
      
      setShowModal(false);
      setFormData({ title: '', customerId: '', value: '', stage: 'prospect', probability: 10, expectedCloseDate: '', description: '' });
      setEditingId(null);
      fetchDeals();
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (deal) => {
    setFormData({
      title: deal.title,
      customerId: deal.customerId,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate || '',
      description: deal.description || '',
    });
    setEditingId(deal.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await dealAPI.delete(id);
        fetchDeals();
      } catch (error) {
        alert('Erro ao excluir');
      }
    }
  };

  const updateStage = async (id, stage) => {
    try {
      await dealAPI.update(id, { stage });
      fetchDeals();
    } catch (error) {
      alert('Erro ao atualizar');
    }
  };

  const getStageColor = (stage) => {
    const stageData = stages.find(s => s.value === stage);
    return stageData?.color || 'bg-gray-100';
  };

  const totalValue = deals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);
  const wonValue = deals.filter(d => d.stage === 'won').reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Negócios</h2>
          <p className="text-gray-600 mt-1">
            Total: {deals.length} | Valor em Pipeline: R$ {totalValue.toLocaleString('pt-BR')} | 
            Ganhos: R$ {wonValue.toLocaleString('pt-BR')}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', customerId: '', value: '', stage: 'prospect', probability: 10, expectedCloseDate: '', description: '' });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Negócio
        </button>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage.value);
          const stageValue = stageDeals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);

          return (
            <div key={stage.value} className={`${stage.color} rounded-lg p-4`}>
              <h3 className="font-semibold text-gray-800 mb-2">{stage.label}</h3>
              <p className="text-2xl font-bold">{stageDeals.length}</p>
              <p className="text-sm text-gray-600">R$ {stageValue.toLocaleString('pt-BR')}</p>
              
              <div className="mt-4 space-y-2">
                {stageDeals.map(deal => (
                  <div key={deal.id} className="bg-white rounded p-2 shadow text-xs">
                    <p className="font-medium truncate">{deal.title}</p>
                    <p className="text-gray-600 truncate">{deal.customer?.name}</p>
                    <p className="text-green-600 font-semibold">R$ {parseFloat(deal.value).toLocaleString('pt-BR')}</p>
                    <div className="flex justify-between mt-1">
                      <button onClick={() => handleEdit(deal)} className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(deal.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Negócio' : 'Novo Negócio'}
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
                <label className="block text-sm font-medium text-gray-700">Cliente *</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor *</label>
                <input
                  type="number"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estágio</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {stages.map(stage => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Probabilidade (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Fechamento</label>
                <input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
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
