import { useState, useMemo, FormEvent } from 'react';
import { INITIAL_DONORS, INITIAL_DONATIONS } from '../data_sim';
import { DoadorSim, DoacaoSim, SimPage, UsuarioSim } from '../types_sim';
import { 
  Heart, Users, Gift, FileText, Layout, LogOut, Search, PlusCircle, Pencil, Trash2, 
  ArrowLeft, CheckCircle, AlertTriangle, Printer, RotateCcw, User, Eye, ArrowRight,
  Globe, Shield, RefreshCw, Layers
} from 'lucide-react';

export default function WebSimulator() {
  // Estados Locais Simulando o Banco de Dados MySQL
  const [donors, setDonors] = useState<DoadorSim[]>(INITIAL_DONORS);
  const [donations, setDonations] = useState<DoacaoSim[]>(INITIAL_DONATIONS);
  
  // Estado da Sessão PHP
  const [currentUser, setCurrentUser] = useState<UsuarioSim | null>(null);
  
  // Roteador do Simulador
  const [currentPage, setCurrentPage] = useState<SimPage>('login');
  
  // IDs Auxiliares para novos cadastros (Simulação de Auto-increment)
  const [nextDonorId, setNextDonorId] = useState(5);
  const [nextDonationId, setNextDonationId] = useState(6);

  // Estados de Formulário e Edição
  const [editingDonor, setEditingDonor] = useState<DoadorSim | null>(null);
  const [editingDonation, setEditingDonation] = useState<DoacaoSim | null>(null);
  
  // Inputs de Login
  const [loginEmail, setLoginEmail] = useState('admin@admin.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Inputs de Cadastro de Doadores
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorAddress, setDonorAddress] = useState('');
  const [donorError, setDonorError] = useState('');

  // Inputs de Cadastro de Doações
  const [donationDonorId, setDonationDonorId] = useState('');
  const [donationType, setDonationType] = useState('');
  const [donationDesc, setDonationDesc] = useState('');
  const [donationQty, setDonationQty] = useState('');
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [donationError, setDonationError] = useState('');

  // Alertas de Sucesso (Feedback)
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  // Filtros de Pesquisa
  const [searchDonorQuery, setSearchDonorQuery] = useState('');
  const [searchDonationQuery, setSearchDonationQuery] = useState('');
  const [filterDonationType, setFilterDonationType] = useState('');

  // Helper para resetar feedbacks após alguns segundos
  const triggerFeedback = (msg: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage(msg);
    setFeedbackType(type);
    setTimeout(() => {
      setFeedbackMessage('');
    }, 4000);
  };

  // --- LÓGICA DE LOGIN ---
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@admin.com' && loginPassword === 'admin123') {
      setCurrentUser({
        id: 1,
        nome: 'Administrador Institucional',
        email: 'admin@admin.com'
      });
      setLoginError('');
      setCurrentPage('dashboard');
      triggerFeedback('Login efetuado com sucesso! Sessão PHP iniciada.');
    } else {
      setLoginError('E-mail ou senha incorretos. Tente admin@admin.com / admin123.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    triggerFeedback('Sessão encerrada com sucesso (session_destroy).');
  };

  // --- CRUD DOADORES ---
  const handleCreateDonor = (e: FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorPhone) {
      setDonorError('Os campos Nome e Telefone são obrigatórios.');
      return;
    }
    
    const newDonor: DoadorSim = {
      id: nextDonorId,
      nome: donorName,
      telefone: donorPhone,
      email: donorEmail,
      endereco: donorAddress
    };

    setDonors([...donors, newDonor]);
    setNextDonorId(nextDonorId + 1);
    
    // Limpar campos
    setDonorName('');
    setDonorPhone('');
    setDonorEmail('');
    setDonorAddress('');
    setDonorError('');

    setCurrentPage('doadores_listar');
    triggerFeedback('Doador cadastrado com sucesso!');
  };

  const handleSaveEditDonor = (e: FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;
    if (!editingDonor.nome || !editingDonor.telefone) {
      setDonorError('Os campos Nome e Telefone são obrigatórios.');
      return;
    }

    setDonors(donors.map(d => d.id === editingDonor.id ? editingDonor : d));
    setEditingDonor(null);
    setDonorError('');
    setCurrentPage('doadores_listar');
    triggerFeedback('Dados do doador atualizados com sucesso!');
  };

  const handleDeleteDonor = (id: number) => {
    const donorToDelete = donors.find(d => d.id === id);
    if (!donorToDelete) return;
    
    if (confirm(`Tem certeza que deseja excluir o doador "${donorToDelete.nome}"? Isso também removerá suas doações.`)) {
      setDonors(donors.filter(d => d.id !== id));
      // Exclui em cascata todas as doações do doador (Simula ON DELETE CASCADE)
      setDonations(donations.filter(d => d.doadorId !== id));
      triggerFeedback('Doador e todas as suas doações excluídas com sucesso!');
    }
  };

  // --- CRUD DOAÇÕES ---
  const handleCreateDonation = (e: FormEvent) => {
    e.preventDefault();
    if (!donationDonorId || !donationType || !donationQty || !donationDate) {
      setDonationError('Preencha os campos obrigatórios (Doador, Categoria, Quantidade e Data).');
      return;
    }

    const newDonation: DoacaoSim = {
      id: nextDonationId,
      doadorId: parseInt(donationDonorId),
      tipo: donationType,
      descricao: donationDesc,
      quantidade: donationQty,
      dataDoacao: donationDate
    };

    setDonations([...donations, newDonation]);
    setNextDonationId(nextDonationId + 1);

    // Limpar
    setDonationDonorId('');
    setDonationType('');
    setDonationDesc('');
    setDonationQty('');
    setDonationError('');

    setCurrentPage('doacoes_listar');
    triggerFeedback('Doação registrada com sucesso!');
  };

  const handleSaveEditDonation = (e: FormEvent) => {
    e.preventDefault();
    if (!editingDonation) return;
    if (!editingDonation.doadorId || !editingDonation.tipo || !editingDonation.quantidade || !editingDonation.dataDoacao) {
      setDonationError('Preencha os campos obrigatórios.');
      return;
    }

    setDonations(donations.map(d => d.id === editingDonation.id ? editingDonation : d));
    setEditingDonation(null);
    setDonationError('');
    setCurrentPage('doacoes_listar');
    triggerFeedback('Doação editada com sucesso!');
  };

  const handleDeleteDonation = (id: number) => {
    if (confirm('Deseja mesmo excluir o registro desta doação?')) {
      setDonations(donations.filter(d => d.id !== id));
      triggerFeedback('Doação excluída com sucesso!');
    }
  };

  // --- FILTROS & MAPS ---
  const filteredDonors = useMemo(() => {
    return donors.filter(d => 
      d.nome.toLowerCase().includes(searchDonorQuery.toLowerCase()) ||
      d.telefone.includes(searchDonorQuery) ||
      d.email.toLowerCase().includes(searchDonorQuery.toLowerCase())
    );
  }, [donors, searchDonorQuery]);

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const donor = donors.find(dr => dr.id === d.doadorId);
      const matchesSearch = 
        (donor?.nome || '').toLowerCase().includes(searchDonationQuery.toLowerCase()) ||
        d.tipo.toLowerCase().includes(searchDonationQuery.toLowerCase()) ||
        d.descricao.toLowerCase().includes(searchDonationQuery.toLowerCase());
      
      const matchesType = !filterDonationType || d.tipo === filterDonationType;
      
      return matchesSearch && matchesType;
    });
  }, [donations, donors, searchDonationQuery, filterDonationType]);

  // Estatísticas do Dashboard
  const stats = useMemo(() => {
    const totalD = donors.length;
    const totalDoa = donations.length;
    
    // Contagem por Categoria
    const catCounts: { [key: string]: number } = {};
    donations.forEach(d => {
      catCounts[d.tipo] = (catCounts[d.tipo] || 0) + 1;
    });

    const categoriesArray = Object.keys(catCounts).map(cat => ({
      name: cat,
      count: catCounts[cat],
      percent: totalDoa > 0 ? Math.round((catCounts[cat] / totalDoa) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Últimas 5 doações
    const sortedDonations = [...donations].sort((a, b) => b.id - a.id).slice(0, 5);

    return {
      totalD,
      totalDoa,
      categories: categoriesArray,
      recent: sortedDonations
    };
  }, [donors, donations]);

  // URLs simuladas para o navegador
  const getBrowserUrl = () => {
    const base = 'http://localhost/Sistema-Controle-Doacoes/';
    switch (currentPage) {
      case 'login': return `${base}login.php`;
      case 'dashboard': return `${base}dashboard.php`;
      case 'doadores_listar': return `${base}doadores/listar.php`;
      case 'doadores_cadastrar': return `${base}doadores/cadastrar.php`;
      case 'doadores_editar': return `${base}doadores/editar.php?id=${editingDonor?.id || ''}`;
      case 'doacoes_listar': return `${base}doacoes/listar.php`;
      case 'doacoes_cadastrar': return `${base}doacoes/cadastrar.php`;
      case 'doacoes_editar': return `${base}doacoes/editar.php?id=${editingDonation?.id || ''}`;
      case 'relatorios': return `${base}relatorios.php`;
      default: return base;
    }
  };

  // --- COMPONENTE MENU LATERAL SIMULADO ---
  const renderSidebar = () => {
    return (
      <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-full flex-shrink-0">
        {/* Header da Sidebar */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-2">
          <div className="bg-red-500/10 p-1.5 rounded-lg text-red-500">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-bold text-white text-base leading-none block">DoaAmor</span>
            <span className="text-[10px] text-slate-500">Controle de Doações</span>
          </div>
        </div>

        {/* Links do Menu */}
        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Layout className="w-4.5 h-4.5" />
            <span>Painel Inicial</span>
          </button>

          <button
            onClick={() => {
              setSearchDonorQuery('');
              setCurrentPage('doadores_listar');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage.startsWith('doadores') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Doadores</span>
          </button>

          <button
            onClick={() => {
              setSearchDonationQuery('');
              setFilterDonationType('');
              setCurrentPage('doacoes_listar');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage.startsWith('doacoes') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Gift className="w-4.5 h-4.5" />
            <span>Doações</span>
          </button>

          <button
            onClick={() => setCurrentPage('relatorios')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === 'relatorios' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            <span>Relatórios</span>
          </button>
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div className="min-w-0">
                <span className="text-xs text-white font-semibold block truncate">Administrador</span>
                <span className="text-[9px] text-slate-500 block truncate">admin@admin.com</span>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded text-[8px] font-bold">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all justify-center"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>
    );
  };

  // --- RENDERS DAS PÁGINAS INDIVIDUAIS ---

  // 1. LOGIN
  const renderLogin = () => {
    return (
      <div className="flex-1 bg-slate-900 flex items-center justify-center p-6 h-full min-h-[550px]">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8 flex flex-col justify-between">
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-3 border border-blue-100">
                <Heart className="w-10 h-10 fill-current text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">DoaAmor</h2>
              <p className="text-xs text-slate-500 mt-1">Atividade Extensionista II - UNINTER</p>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">E-mail Administrativo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">@</span>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@admin.com"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Senha de Acesso</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </button>
            </form>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-4 text-center text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Análise e Desenvolvimento de Sistemas</span>
          </div>
        </div>
      </div>
    );
  };

  // 2. DASHBOARD
  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between border-l-4 border-l-blue-500">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Total de Doadores</span>
              <h3 className="text-2xl font-bold text-slate-900">{stats.totalD}</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Parceiros cadastrados</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Total de Doações</span>
              <h3 className="text-2xl font-bold text-emerald-600">{stats.totalDoa}</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Entradas registradas</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
              <Gift className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between border-l-4 border-l-amber-500">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Categorias</span>
              <h3 className="text-2xl font-bold text-amber-500">{stats.categories.length}</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Segmentos ativos</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-full text-amber-500">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Campanha Atual</span>
              <h3 className="text-lg font-bold text-red-500">Inverno Solidário</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Arrecadação de agasalhos</span>
            </div>
            <div className="bg-red-50 p-3 rounded-full text-red-500">
              <Heart className="w-6 h-6 fill-current text-red-500" />
            </div>
          </div>
        </div>

        {/* Tabelas e Distribuição */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tabela de Últimas Doações */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 text-sm">Últimas Doações Recebidas</h4>
              <button 
                onClick={() => setCurrentPage('doacoes_listar')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Ver Todas
              </button>
            </div>

            {stats.recent.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhuma doação cadastrada ainda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="pb-2.5">Doador</th>
                      <th className="pb-2.5">Categoria</th>
                      <th className="pb-2.5">Quantidade</th>
                      <th className="pb-2.5">Data Entrada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs">
                    {stats.recent.map((d) => {
                      const donor = donors.find(dr => dr.id === d.doadorId);
                      return (
                        <tr key={d.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-bold text-slate-800">{donor?.nome || 'Doador Excluído'}</td>
                          <td className="py-2.5">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                              {d.tipo}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-600 font-medium">{d.quantidade}</td>
                          <td className="py-2.5 text-slate-400">{d.dataDoacao.split('-').reverse().join('/')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Gráfico / Barras de Categoria */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="font-bold text-slate-800 text-sm mb-4">Volume por Categoria</h4>
            
            {stats.categories.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">Nenhum dado estatístico disponível.</div>
            ) : (
              <div className="space-y-4">
                {stats.categories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                      <span className="text-slate-500 text-[10px]">{cat.count} itens ({cat.percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${cat.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Banner de Atalho Rápido */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="font-bold text-base">Registrar Nova Doação Voluntária</h5>
            <p className="text-xs text-blue-100 mt-1">Adicione itens recebidos de parceiros para consolidar seus relatórios acadêmicos.</p>
          </div>
          <button 
            onClick={() => {
              setDonationError('');
              setCurrentPage('doacoes_cadastrar');
            }}
            className="px-4 py-2 bg-white text-blue-600 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adicionar Doação</span>
          </button>
        </div>
      </div>
    );
  };

  // 3. DOADORES LISTAR
  const renderDoadoresListar = () => {
    return (
      <div className="space-y-6">
        {/* Top bar de listagem */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou e-mail..."
              value={searchDonorQuery}
              onChange={(e) => setSearchDonorQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-800"
            />
          </div>

          <button 
            onClick={() => {
              setDonorError('');
              setCurrentPage('doadores_cadastrar');
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Novo Doador</span>
          </button>
        </div>

        {/* Tabela de Doadores */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filteredDonors.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Nenhum doador cadastrado localizado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="py-3 px-5" style={{ width: '80px' }}>ID</th>
                    <th className="py-3 px-5">Nome Completo</th>
                    <th className="py-3 px-5">Telefone</th>
                    <th className="py-3 px-5">E-mail</th>
                    <th className="py-3 px-5">Endereço Residencial</th>
                    <th className="py-3 px-5 text-center" style={{ width: '130px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredDonors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-5 text-slate-400 font-semibold">#{d.id}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-800">{d.nome}</td>
                      <td className="py-3.5 px-5 text-slate-600">{d.telefone}</td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {d.email ? (
                          <a href={`mailto:${d.email}`} className="text-blue-600 hover:underline">{d.email}</a>
                        ) : (
                          <span className="italic text-slate-400">Não cadastrado</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-slate-400 truncate max-w-xs" title={d.endereco}>
                        {d.endereco || <span className="italic text-slate-300">Sem endereço</span>}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingDonor({ ...d });
                              setDonorError('');
                              setCurrentPage('doadores_editar');
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDonor(d.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Excluir"
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
      </div>
    );
  };

  // 4. DOADORES CADASTRAR
  const renderDoadoresCadastrar = () => {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setCurrentPage('doadores_listar')}
          className="btn-custom text-slate-500 hover:text-slate-800 flex items-center gap-2 text-xs font-semibold mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Doadores</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <span>Cadastrar Novo Doador Voluntário</span>
          </h4>

          {donorError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{donorError}</span>
            </div>
          )}

          <form onSubmit={handleCreateDonor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nome Completo *</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Telefone de Contato *</label>
                <input
                  type="text"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Endereço de E-mail (Opcional)</label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Ex: joao@email.com"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Endereço Completo (Opcional)</label>
              <textarea
                value={donorAddress}
                onChange={(e) => setDonorAddress(e.target.value)}
                placeholder="Rua, número, complemento, bairro, cidade - UF"
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setCurrentPage('doadores_listar')}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs text-slate-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Salvar Doador
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 5. DOADORES EDITAR
  const renderDoadoresEditar = () => {
    if (!editingDonor) return null;
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setCurrentPage('doadores_listar')}
          className="btn-custom text-slate-500 hover:text-slate-800 flex items-center gap-2 text-xs font-semibold mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Doadores</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-600" />
            <span>Editar Informações do Doador #{editingDonor.id}</span>
          </h4>

          {donorError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{donorError}</span>
            </div>
          )}

          <form onSubmit={handleSaveEditDonor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nome Completo *</label>
                <input
                  type="text"
                  value={editingDonor.nome}
                  onChange={(e) => setEditingDonor({ ...editingDonor, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Telefone de Contato *</label>
                <input
                  type="text"
                  value={editingDonor.telefone}
                  onChange={(e) => setEditingDonor({ ...editingDonor, telefone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
              <input
                type="email"
                value={editingDonor.email}
                onChange={(e) => setEditingDonor({ ...editingDonor, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Endereço Completo</label>
              <textarea
                value={editingDonor.endereco}
                onChange={(e) => setEditingDonor({ ...editingDonor, endereco: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setCurrentPage('doadores_listar')}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs text-slate-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 6. DOAÇÕES LISTAR
  const renderDoacoesListar = () => {
    return (
      <div className="space-y-6">
        {/* Filtros de Doações */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
          <div className="relative col-span-1">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por doador, item..."
              value={searchDonationQuery}
              onChange={(e) => setSearchDonationQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="col-span-1">
            <select
              value={filterDonationType}
              onChange={(e) => setFilterDonationType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-800"
            >
              <option value="">Todas as categorias</option>
              <option value="Alimento">Alimento</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Higiene">Higiene</option>
              <option value="Brinquedos">Brinquedos</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setDonationError('');
              setCurrentPage('doacoes_cadastrar');
            }}
            className="col-span-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Nova Doação</span>
          </button>
        </div>

        {/* Tabela de Doações */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filteredDonations.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Nenhuma doação cadastrada localizada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="py-3 px-5" style={{ width: '80px' }}>Cod</th>
                    <th className="py-3 px-5">Doador Voluntário</th>
                    <th className="py-3 px-5">Categoria</th>
                    <th className="py-3 px-5">Descrição/Detalhes</th>
                    <th className="py-3 px-5">Quantidade</th>
                    <th className="py-3 px-5">Data Entrada</th>
                    <th className="py-3 px-5 text-center" style={{ width: '130px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredDonations.map((d) => {
                    const donor = donors.find(dr => dr.id === d.doadorId);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-5 text-slate-400 font-semibold">#{d.id}</td>
                        <td className="py-3.5 px-5 font-bold text-slate-800">{donor?.nome || 'Doador Excluído'}</td>
                        <td className="py-3.5 px-5">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                            {d.tipo}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 truncate max-w-xs">{d.descricao || <span className="italic text-slate-300">Sem descrição</span>}</td>
                        <td className="py-3.5 px-5 font-bold text-slate-700">{d.quantidade}</td>
                        <td className="py-3.5 px-5 text-slate-400">{d.dataDoacao.split('-').reverse().join('/')}</td>
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingDonation({ ...d });
                                setDonationError('');
                                setCurrentPage('doacoes_editar');
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDonation(d.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 7. DOAÇÕES CADASTRAR
  const renderDoacoesCadastrar = () => {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setCurrentPage('doacoes_listar')}
          className="btn-custom text-slate-500 hover:text-slate-800 flex items-center gap-2 text-xs font-semibold mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Doações</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span>Registrar Recebimento de Doação</span>
          </h4>

          {donationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{donationError}</span>
            </div>
          )}

          {donors.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-4 mb-4">
              <p className="font-bold mb-1">Nenhum doador cadastrado!</p>
              <p className="mb-3">Você deve possuir ao menos um doador registrado no sistema para associar uma doação.</p>
              <button 
                type="button"
                onClick={() => setCurrentPage('doadores_cadastrar')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px]"
              >
                Cadastrar Doador Agora
              </button>
            </div>
          )}

          <form onSubmit={handleCreateDonation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Doador Voluntário *</label>
                <select
                  value={donationDonorId}
                  onChange={(e) => setDonationDonorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                  disabled={donors.length === 0}
                >
                  <option value="">-- Selecione o Doador --</option>
                  {donors.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Categoria do Item *</label>
                <select
                  value={donationType}
                  onChange={(e) => setDonationType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                >
                  <option value="">-- Selecione --</option>
                  <option value="Alimento">Alimento</option>
                  <option value="Vestuário">Vestuário</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Brinquedos">Brinquedos</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Quantidade *</label>
                <input
                  type="text"
                  value={donationQty}
                  onChange={(e) => setDonationQty(e.target.value)}
                  placeholder="Ex: 5 cestas, 12 agasalhos, R$ 100,00"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Data da Doação *</label>
                <input
                  type="date"
                  value={donationDate}
                  onChange={(e) => setDonationDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Descrição Detalhada / Observações</label>
              <textarea
                value={donationDesc}
                onChange={(e) => setDonationDesc(e.target.value)}
                placeholder="Insira observações relevantes sobre os itens recebidos..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setCurrentPage('doacoes_listar')}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs text-slate-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                disabled={donors.length === 0}
              >
                Registrar Doação
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 8. DOAÇÕES EDITAR
  const renderDoacoesEditar = () => {
    if (!editingDonation) return null;
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setCurrentPage('doacoes_listar')}
          className="btn-custom text-slate-500 hover:text-slate-800 flex items-center gap-2 text-xs font-semibold mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Doações</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-600" />
            <span>Editar Registro de Doação #{editingDonation.id}</span>
          </h4>

          {donationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{donationError}</span>
            </div>
          )}

          <form onSubmit={handleSaveEditDonation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Doador Voluntário *</label>
                <select
                  value={editingDonation.doadorId}
                  onChange={(e) => setEditingDonation({ ...editingDonation, doadorId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                >
                  <option value="">-- Selecione o Doador --</option>
                  {donors.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Categoria do Item *</label>
                <select
                  value={editingDonation.tipo}
                  onChange={(e) => setEditingDonation({ ...editingDonation, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                >
                  <option value="">-- Selecione --</option>
                  <option value="Alimento">Alimento</option>
                  <option value="Vestuário">Vestuário</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Brinquedos">Brinquedos</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Quantidade *</label>
                <input
                  type="text"
                  value={editingDonation.quantidade}
                  onChange={(e) => setEditingDonation({ ...editingDonation, quantidade: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Data da Doação *</label>
                <input
                  type="date"
                  value={editingDonation.dataDoacao}
                  onChange={(e) => setEditingDonation({ ...editingDonation, dataDoacao: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Descrição Detalhada</label>
              <textarea
                value={editingDonation.descricao}
                onChange={(e) => setEditingDonation({ ...editingDonation, descricao: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 text-slate-850"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setCurrentPage('doacoes_listar')}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs text-slate-500 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 9. RELATÓRIOS
  const renderRelatorios = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <span className="text-slate-500 text-xs font-semibold">Relatório consolidado e pronto para impressão acadêmica.</span>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>
        </div>

        {/* Resumo de Metas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-l-blue-500 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Volume de Arrecadação</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1">{donations.length} doações recebidas</h3>
            <p className="text-[10px] text-slate-500 mt-1">Soma geral de todos os mantimentos, roupas e valores captados da comunidade.</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-l-emerald-500 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Doadores Mobilizados</span>
            <h3 className="text-xl font-bold text-emerald-600 mt-1">{donors.length} voluntários cadastrados</h3>
            <p className="text-[10px] text-slate-500 mt-1">Total de indivíduos ou empresas engajados nas campanhas vigentes.</p>
          </div>
        </div>

        {/* Categoria resumo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-bold text-slate-850 text-sm mb-4">Consolidação por Categoria</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-100">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-4">Categoria de Doação</th>
                  <th className="py-2 px-4 text-center" style={{ width: '150px' }}>Registros</th>
                  <th className="py-2 px-4">Volumes Acumulados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {stats.categories.map(cat => {
                  const matchingItems = donations.filter(d => d.tipo === cat.name).map(d => d.quantidade).join(' | ');
                  return (
                    <tr key={cat.name}>
                      <td className="py-2.5 px-4 font-semibold text-slate-850">{cat.name}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-full font-bold text-[10px] text-slate-600">
                          {cat.count} entrada(s)
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px] truncate max-w-xs" title={matchingItems}>
                        {matchingItems}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lista Analítica Completa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-bold text-slate-850 text-sm mb-4">Relatório Analítico Completo</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-4">Código</th>
                  <th className="py-2 px-4">Doador</th>
                  <th className="py-2 px-4">Categoria</th>
                  <th className="py-2 px-4">Descrição</th>
                  <th className="py-2 px-4">Qtd</th>
                  <th className="py-2 px-4">Data Entrada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {donations.map((d) => {
                  const donor = donors.find(dr => dr.id === d.doadorId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/30">
                      <td className="py-2.5 px-4 text-slate-400">#{d.id}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{donor?.nome || 'Excluído'}</td>
                      <td className="py-2.5 px-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                          {d.tipo}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 truncate max-w-xs">{d.descricao || 'Sem descrição'}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-700">{d.quantidade}</td>
                      <td className="py-2.5 px-4 text-slate-400">{d.dataDoacao.split('-').reverse().join('/')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'login': return renderLogin();
      case 'dashboard': return renderDashboard();
      case 'doadores_listar': return renderDoadoresListar();
      case 'doadores_cadastrar': return renderDoadoresCadastrar();
      case 'doadores_editar': return renderDoadoresEditar();
      case 'doacoes_listar': return renderDoacoesListar();
      case 'doacoes_cadastrar': return renderDoacoesCadastrar();
      case 'doacoes_editar': return renderDoacoesEditar();
      case 'relatorios': return renderRelatorios();
      default: return renderDashboard();
    }
  };

  return (
    <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col h-[700px] font-sans">
      {/* Navegador Mockup Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Bolinhas de janela de navegador */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium ml-2 hidden sm:inline-block">Simulador Web PHP Localhost</span>
        </div>

        {/* Barra de Endereço URL */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="w-full bg-slate-900 border border-slate-750 rounded-xl px-4 py-1.5 flex items-center gap-2 text-xs text-slate-400 font-mono select-all">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{getBrowserUrl()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              // Recarrega o simulador de volta aos dados iniciais
              if (confirm('Deseja reiniciar o banco de dados simulado para o estado inicial? Todos os novos cadastros locais serão limpos.')) {
                setDonors(INITIAL_DONORS);
                setDonations(INITIAL_DONATIONS);
                setNextDonorId(5);
                setNextDonationId(6);
                setCurrentPage('dashboard');
                triggerFeedback('Banco de dados simulado redefinido com sucesso!');
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-750 hover:text-white transition-all"
            title="Reiniciar Banco Simulado"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo Principal do Navegador */}
      <div className="flex-1 flex overflow-hidden bg-slate-50 relative">
        
        {/* Alerta de Feedback Flutuante */}
        {feedbackMessage && (
          <div className="absolute top-4 right-4 z-50 animate-bounce bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 max-w-xs">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Sidebar é visível se estiver logado */}
        {currentUser && currentPage !== 'login' && renderSidebar()}

        {/* Painel do Conteúdo Principal */}
        <main className={`flex-1 overflow-y-auto ${currentUser && currentPage !== 'login' ? 'p-6' : ''}`}>
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}
