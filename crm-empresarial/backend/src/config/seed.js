const sequelize = require('./database');
const { Customer, Deal, Task } = require('../models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso!');

    const customers = await Customer.bulkCreate([
      { name: 'João Silva', email: 'joao@empresa.com', phone: '(11) 99999-1111', company: 'Tech Solutions', position: 'CEO', status: 'active', tags: ['vip', 'importante'] },
      { name: 'Maria Santos', email: 'maria@inovacao.com', phone: '(11) 99999-2222', company: 'Inovação Ltda', position: 'Diretora', status: 'active', tags: ['parceiro'] },
      { name: 'Pedro Oliveira', email: 'pedro@startup.com', phone: '(11) 99999-3333', company: 'StartUp BR', position: 'Fundador', status: 'lead', tags: ['startup'] },
      { name: 'Ana Costa', email: 'ana@consultoria.com', phone: '(11) 99999-4444', company: 'Consultoria Pro', position: 'Sócia', status: 'active', tags: ['recorrente'] },
      { name: 'Carlos Ferreira', email: 'carlos@industria.com', phone: '(11) 99999-5555', company: 'Indústria Forte', position: 'Gerente', status: 'inactive', tags: [] },
    ]);
    console.log('Clientes cadastrados!');

    const deals = await Deal.bulkCreate([
      { title: 'Implementação de Sistema', customerId: customers[0].id, value: 50000, stage: 'proposal', probability: 60, expectedCloseDate: '2026-06-01' },
      { title: 'Consultoria Mensal', customerId: customers[1].id, value: 15000, stage: 'negotiation', probability: 75, expectedCloseDate: '2026-05-20' },
      { title: 'Desenvolvimento App', customerId: customers[2].id, value: 80000, stage: 'qualified', probability: 40, expectedCloseDate: '2026-07-15' },
      { title: 'Treinamento Equipe', customerId: customers[3].id, value: 12000, stage: 'won', probability: 100, expectedCloseDate: '2026-05-10' },
      { title: 'Upgrade de Sistema', customerId: customers[0].id, value: 25000, stage: 'prospect', probability: 20, expectedCloseDate: '2026-08-01' },
    ]);
    console.log('Negócios cadastrados!');

    await Task.bulkCreate([
      { title: 'Ligar para confirmar proposta', description: 'Entrar em contato para tirar dúvidas', dueDate: '2026-05-07 10:00:00', priority: 'high', status: 'pending', type: 'call', customerId: customers[0].id },
      { title: 'Enviar documentação', description: 'Enviar contrato e documentos', dueDate: '2026-05-08 14:00:00', priority: 'medium', status: 'pending', type: 'email', customerId: customers[1].id },
      { title: 'Reunião de kickoff', description: 'Apresentação inicial do projeto', dueDate: '2026-05-09 15:00:00', priority: 'high', status: 'pending', type: 'meeting', dealId: deals[2].id },
      { title: 'Follow-up pós venda', description: 'Acompanhar satisfação do cliente', dueDate: '2026-05-15 11:00:00', priority: 'low', status: 'pending', type: 'followup', customerId: customers[3].id },
      { title: 'Apresentação comercial', description: 'Apresentar nova proposta', dueDate: '2026-05-06 16:00:00', priority: 'high', status: 'completed', type: 'meeting', dealId: deals[1].id },
    ]);
    console.log('Tarefas cadastradas!');

    console.log('\n✅ Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
};

seedDatabase();
