import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { Users, Briefcase, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getDashboard();
        setData(response.data);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  if (!data) {
    return <div className="text-red-600">Erro ao carregar dados</div>;
  }

  const stats = [
    {
      title: 'Total de Clientes',
      value: data.customers.total,
      icon: Users,
      color: 'bg-blue-500',
      subtext: `${data.customers.active} ativos, ${data.customers.leads} leads`,
    },
    {
      title: 'Negócios',
      value: data.deals.total,
      icon: Briefcase,
      color: 'bg-green-500',
      subtext: `${data.deals.won} ganhos`,
    },
    {
      title: 'Tarefas Pendentes',
      value: data.tasks.pending,
      icon: CheckCircle,
      color: 'bg-yellow-500',
      subtext: `${data.tasks.overdue} atrasadas`,
    },
    {
      title: 'Valor em Pipeline',
      value: `R$ ${data.deals.pipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      subtext: `Ganhos: R$ ${data.deals.wonValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
  ];

  const chartData = data.dealsByStage.map(item => ({
    stage: item.stage,
    count: parseInt(item.count),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Negócios Recentes</h3>
          <div className="space-y-3">
            {data.recentDeals.map((deal) => (
              <div key={deal.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{deal.title}</p>
                  <p className="text-sm text-gray-600">{deal.customer?.name}</p>
                </div>
                <span className="text-green-600 font-semibold">
                  R$ {parseFloat(deal.value).toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximas Tarefas</h3>
          <div className="space-y-3">
            {data.upcomingTasks.map((task) => (
              <div key={task.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    {task.customer?.name || task.deal?.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pipeline de Vendas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
