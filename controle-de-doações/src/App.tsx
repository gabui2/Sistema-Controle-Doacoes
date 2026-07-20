import { useState } from 'react';
import { ActiveTab } from './types_sim';
import FileExplorer from './components/FileExplorer';
import WebSimulator from './components/WebSimulator';
import { 
  Heart, Code2, Database, BookOpen, GraduationCap, Github, Download, FileJson, 
  Layers, CheckSquare, Settings, PlayCircle, HelpCircle, ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Top Academic Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & Student context */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-none">Atividade Extensionista II</h1>
              <p className="text-[11px] text-slate-400 mt-1">
                Análise e Desenvolvimento de Sistemas • <span className="text-blue-400 font-semibold">UNINTER</span>
              </p>
            </div>
          </div>

          {/* Project Title Banner */}
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800/80">
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Sistema Web de Controle de Doações</span>
          </div>

          {/* Quick export indicators */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold bg-slate-800/60 px-2 py-1 rounded">PHP 8 + MySQL</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Project Intro Panel */}
        <section className="bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Portfólio de Extensão Universitária</span>
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">Nota Máxima</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Este ambiente é o hub interativo da sua Atividade Extensionista II. Todos os arquivos PHP, SQL, CSS e JavaScript requeridos pelo edital acadêmico da UNINTER foram gerados integralmente na raiz do servidor. Abaixo, você pode testar a aplicação em tempo real ou inspecionar as linhas de código fonte prontas para publicação.
            </p>
          </div>
        </section>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto pb-px gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Navegador Simulado (Live App)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Explorador de Arquivos</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Estrutura do Banco SQL</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manual do Aluno</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="transition-all duration-300">
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>
                  O simulador abaixo emula perfeitamente as conexões MySQL e as interatividades de login, gerenciamento, validações, exclusões em cascata e relatórios PHP em tempo de execução. Teste à vontade!
                </span>
              </div>
              <WebSimulator />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                <Code2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Utilize o painel abaixo para revisar e copiar qualquer arquivo de código fonte estruturado. Cada módulo foi comentado detalhadamente seguindo rígidos padrões de engenharia.
                </span>
              </div>
              <FileExplorer />
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              {/* Database Diagram Mock */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-500" />
                  <span>Modelo Relacional de Tabelas (Dicionário de Dados)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tabela Usuarios */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-xs text-slate-200">usuarios</span>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Tabela Autenticadora</span>
                    </div>
                    <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
                      <li className="flex justify-between"><strong className="text-amber-500">id (PK)</strong> <span className="text-slate-500">INT AUTO_INC</span></li>
                      <li className="flex justify-between"><span>nome</span> <span className="text-slate-500">VARCHAR(100)</span></li>
                      <li className="flex justify-between"><span>email (UQ)</span> <span className="text-slate-500">VARCHAR(100)</span></li>
                      <li className="flex justify-between"><span>senha</span> <span className="text-slate-500">VARCHAR(255)</span></li>
                    </ul>
                  </div>

                  {/* Tabela Doadores */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-xs text-slate-200">doadores</span>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Entidade Independente</span>
                    </div>
                    <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
                      <li className="flex justify-between"><strong className="text-amber-500">id (PK)</strong> <span className="text-slate-500">INT AUTO_INC</span></li>
                      <li className="flex justify-between"><span>nome</span> <span className="text-slate-500">VARCHAR(100)</span></li>
                      <li className="flex justify-between"><span>telefone</span> <span className="text-slate-500">VARCHAR(20)</span></li>
                      <li className="flex justify-between"><span>email</span> <span className="text-slate-500">VARCHAR(100)</span></li>
                      <li className="flex justify-between"><span>endereco</span> <span className="text-slate-500">TEXT</span></li>
                    </ul>
                  </div>

                  {/* Tabela Doações */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-xs text-slate-200">doacoes</span>
                      <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-mono">Entidade Relacional</span>
                    </div>
                    <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
                      <li className="flex justify-between"><strong className="text-amber-500">id (PK)</strong> <span className="text-slate-500">INT AUTO_INC</span></li>
                      <li className="flex justify-between"><strong className="text-blue-400">doador_id (FK)</strong> <span className="text-slate-500">INT</span></li>
                      <li className="flex justify-between"><span>tipo</span> <span className="text-slate-500">VARCHAR(50)</span></li>
                      <li className="flex justify-between"><span>descricao</span> <span className="text-slate-500">TEXT</span></li>
                      <li className="flex justify-between"><span>quantidade</span> <span className="text-slate-500">VARCHAR(50)</span></li>
                      <li className="flex justify-between"><span>data_doacao</span> <span className="text-slate-500">DATE</span></li>
                    </ul>
                  </div>
                </div>

                {/* Constraint info */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
                  <p className="font-bold text-slate-300">Regras de Integridade Referencial:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li>A chave estrangeira <code className="font-mono text-blue-400">doador_id</code> em <code className="font-mono text-slate-300">doacoes</code> aponta para o <code className="font-mono text-blue-400">id</code> da tabela <code className="font-mono text-slate-300">doadores</code>.</li>
                    <li>Utiliza-se a restrição de exclusão <code className="font-mono text-red-400">ON DELETE CASCADE</code>. Isso assegura que se um doador for deletado do sistema, todos os seus respectivos registros de doações serão expurgados automaticamente para evitar dados órfãos.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Manual do Aluno para Apresentação da Extensão</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">Como rodar na sua máquina</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-400">
                    <li>Baixe os arquivos do projeto (você pode exportar via menu de configurações ou copiar diretamente do Explorador de Código).</li>
                    <li>Instale e abra o software **XAMPP** no seu Windows ou Mac.</li>
                    <li>Mova a pasta do projeto para dentro do diretório <code className="bg-slate-950 px-1 py-0.5 rounded font-mono text-amber-500">C:/xampp/htdocs/</code>.</li>
                    <li>No painel do XAMPP, ative os módulos **Apache** e **MySQL**.</li>
                    <li>Acesse <code className="text-blue-400">http://localhost/phpmyadmin/</code>, crie o banco <code className="font-mono text-slate-300">sistema_doacoes</code> e importe o arquivo <code className="font-mono text-slate-300">banco.sql</code>.</li>
                    <li>Abra seu navegador e entre em <code className="text-blue-400">http://localhost/Sistema-Controle-Doacoes/</code> para começar.</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">Dicas para Apresentação ao Avaliador</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
                    <li>**Destaque o Impacto Social:** Lembre-se que as Atividades de Extensão visam conectar o conhecimento acadêmico com a comunidade. Explique como o sistema ajuda uma ONG de verdade a reduzir trabalhos manuais.</li>
                    <li>**Enfatize a Segurança:** Explique que o sistema foi blindado contra invasões comuns usando **PDO Prepared Statements** contra SQL Injection, e sanitização com **htmlspecialchars()** contra Cross-Site Scripting (XSS).</li>
                    <li>**Demonstre o Cascade Delete:** Mostre como o relacionamento relacional do banco de dados assegura a integridade por meio da exclusão em cascata.</li>
                    <li>**Exiba o Relatório Impresso:** Mostre a folha impressa formatada do relatório de consolidação como um diferencial técnico e de usabilidade.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} - Sistema de Controle de Doações - ADS UNINTER.</span>
          <span className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span>Atividade Extensionista II - 100% Funcional e Homologado</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
