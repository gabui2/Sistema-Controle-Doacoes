/**
 * Tipos e Interfaces para o Simulador do Sistema de Doações
 */

export interface UsuarioSim {
  id: number;
  nome: string;
  email: string;
}

export interface DoadorSim {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
}

export interface DoacaoSim {
  id: number;
  doadorId: number;
  tipo: string;
  descricao: string;
  quantidade: string;
  dataDoacao: string;
}

export interface FileItem {
  name: string;
  path: string;
  icon: string;
  language: 'php' | 'sql' | 'css' | 'javascript' | 'markdown';
  content: string;
}

export type ActiveTab = 'simulator' | 'code' | 'database' | 'guide';
export type SimPage = 'login' | 'dashboard' | 'doadores_listar' | 'doadores_cadastrar' | 'doadores_editar' | 'doacoes_listar' | 'doacoes_cadastrar' | 'doacoes_editar' | 'relatorios';
