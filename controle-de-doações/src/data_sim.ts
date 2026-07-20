import { DoadorSim, DoacaoSim, FileItem } from './types_sim';

// Dados Iniciais do Banco de Dados para o Simulador
export const INITIAL_DONORS: DoadorSim[] = [
  {
    id: 1,
    nome: 'João Silva de Souza',
    telefone: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    endereco: 'Rua das Flores, 123, Centro, São Paulo - SP',
  },
  {
    id: 2,
    nome: 'Maria Oliveira Santos',
    telefone: '(21) 99888-7766',
    email: 'maria.santos@email.com',
    endereco: 'Av. Atlântica, 456, Copacabana, Rio de Janeiro - RJ',
  },
  {
    id: 3,
    nome: 'Ana Julia Pinheiro',
    telefone: '(41) 99111-2233',
    email: 'ana.pinheiro@email.com',
    endereco: 'Rua XV de Novembro, 789, Batel, Curitiba - PR',
  },
  {
    id: 4,
    nome: 'Carlos Eduardo Lima',
    telefone: '(31) 98555-4444',
    email: 'carlos.lima@email.com',
    endereco: 'Rua da Bahia, 1012, Savassi, Belo Horizonte - MG',
  }
];

export const INITIAL_DONATIONS: DoacaoSim[] = [
  {
    id: 1,
    doadorId: 1,
    tipo: 'Alimento',
    descricao: 'Cesta Básica Completa contendo arroz, feijão, óleo e café.',
    quantidade: '2 cestas',
    dataDoacao: '2026-07-15',
  },
  {
    id: 2,
    doadorId: 2,
    tipo: 'Vestuário',
    descricao: 'Lote de agasalhos, casacos e cobertores infantis em bom estado.',
    quantidade: '15 peças',
    dataDoacao: '2026-07-16',
  },
  {
    id: 3,
    doadorId: 3,
    tipo: 'Dinheiro',
    descricao: 'Transferência via PIX destinada à compra de materiais de limpeza.',
    quantidade: 'R$ 250,00',
    dataDoacao: '2026-07-18',
  },
  {
    id: 4,
    doadorId: 4,
    tipo: 'Higiene',
    descricao: 'Sabonetes, cremes dentais, escovas de dente e papel higiênico.',
    quantidade: '30 pacotes',
    dataDoacao: '2026-07-19',
  },
  {
    id: 5,
    doadorId: 1,
    tipo: 'Alimento',
    descricao: 'Pacotes de leite em pó integral.',
    quantidade: '10 pacotes',
    dataDoacao: '2026-07-20',
  }
];

// Dicionário de Arquivos Reais para o Visualizador de Código
export const PROJECT_FILES: FileItem[] = [
  {
    name: 'banco.sql',
    path: '/database/banco.sql',
    icon: 'database',
    language: 'sql',
    content: `-- Banco de Dados: sistema_doacoes
-- Atividade Extensionista II - UNINTER
-- Curso: Análise e Desenvolvimento de Sistemas

CREATE DATABASE IF NOT EXISTS sistema_doacoes DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_doacoes;

-- 1. Tabela de Usuários (Acesso ao Sistema)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela de Doadores
CREATE TABLE IF NOT EXISTS doadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NULL,
    endereco TEXT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabela de Doações
CREATE TABLE IF NOT EXISTS doacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doador_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- Ex: Alimento, Vestuário, Dinheiro, Higiene, Brinquedos, Outros
    descricao TEXT NULL,
    quantidade VARCHAR(50) NOT NULL, -- Ex: "5 kg", "10 itens", "R$ 150,00"
    data_doacao DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doador_id) REFERENCES doadores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Inserindo Usuário de Teste Padrão
-- E-mail: admin@admin.com
-- Senha original: admin123 (Criptografada usando password_hash com BCRYPT no PHP)
INSERT INTO usuarios (nome, email, senha) VALUES 
('Administrador Institucional', 'admin@admin.com', '$2y$10$WwGisG.n7X98jbe00F9h7OM.TqC5IeD79.hUoQ0uY9DOnEw8t63uW')
ON DUPLICATE KEY UPDATE id=id;`
  },
  {
    name: 'conexao.php',
    path: '/includes/conexao.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Conexão com o Banco de Dados MySQL usando PDO.
 * Atividade Extensionista II - UNINTER
 */

// Configurações do Banco de Dados
$host = 'localhost';
$dbname = 'sistema_doacoes';
$username = 'root';
$password = ''; // Padrão do XAMPP/WampServer é em branco

try {
    // Inicialização da conexão PDO com charset utf8mb4
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Habilita o lançamento de exceções em caso de erros SQL
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Retorna os resultados como array associativo por padrão
        PDO::ATTR_EMULATE_PREPARES => false, // Utiliza prepared statements nativos do MySQL para maior segurança
    ]);
} catch (PDOException $e) {
    // Tratamento amigável de erro de conexão sem expor credenciais
    die("Erro ao conectar ao banco de dados: " . $e->getMessage());
}
?>`
  },
  {
    name: 'autenticacao.php',
    path: '/includes/autenticacao.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Gerenciamento de Sessão e Controle de Acesso (Autenticação).
 * Atividade Extensionista II - UNINTER
 */

// Inicia a sessão se ela ainda não tiver sido iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Função para proteger páginas administrativas.
 * Redireciona para o login caso o usuário não esteja autenticado.
 */
function verificarAutenticacao() {
    if (!isset($_SESSION['usuario_id']) || empty($_SESSION['usuario_id'])) {
        header('Location: login.php');
        exit;
    }
}

/**
 * Função para limpar/higienizar inputs enviados pelo usuário.
 * Evita ataques de Cross-Site Scripting (XSS).
 * 
 * @param string $data Dados de entrada brutos
 * @return string Dados sanitizados
 */
function sanitize($data) {
    if ($data === null) {
        return '';
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
?>`
  },
  {
    name: 'login.php',
    path: '/login.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Página de Login do Sistema
 * Atividade Extensionista II - UNINTER
 */

require_once 'includes/conexao.php';
require_once 'includes/autenticacao.php';

// Se já estiver logado, redireciona diretamente para o dashboard
if (isset($_SESSION['usuario_id'])) {
    header('Location: dashboard.php');
    exit;
}

$erro = '';

// Processamento do Formulário de Login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $senha = trim($_POST['senha']);

    if (empty($email) || empty($senha)) {
        $erro = 'Por favor, preencha todos os campos.';
    } else {
        try {
            // Busca o usuário pelo e-mail utilizando Prepared Statement (Segurança contra SQL Injection)
            $stmt = $pdo->prepare('SELECT id, nome, email, senha FROM usuarios WHERE email = :email LIMIT 1');
            $stmt->execute(['email' => $email]);
            $usuario = $stmt->fetch();

            // Verifica se o usuário existe e se a senha está correta
            if ($usuario && password_verify($senha, $usuario['senha'])) {
                // Configura a sessão do PHP
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                $_SESSION['usuario_email'] = $usuario['email'];

                // Redireciona para o painel principal
                header('Location: dashboard.php');
                exit;
            } else {
                $erro = 'E-mail ou senha incorretos.';
            }
        } catch (PDOException $e) {
            $erro = 'Ocorreu um erro no servidor. Tente novamente mais tarde.';
        }
    }
}
?>
<!-- Formulário HTML styled with Bootstrap 5 ... -->`
  },
  {
    name: 'dashboard.php',
    path: '/dashboard.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Painel Principal - Dashboard
 * Atividade Extensionista II - UNINTER
 */

$base_path = './';
require_once 'includes/conexao.php';
require_once 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

// Inicialização das variáveis de estatísticas
$totalDoadores = 0;
$totalDoacoes = 0;
$doacoesPorTipo = [];
$ultimasDoacoes = [];

try {
    $stmtDonors = $pdo->query('SELECT COUNT(*) AS total FROM doadores');
    $totalDoadores = $stmtDonors->fetch()['total'];

    $stmtDonations = $pdo->query('SELECT COUNT(*) AS total FROM doacoes');
    $totalDoacoes = $stmtDonations->fetch()['total'];

    $stmtTypes = $pdo->query('SELECT tipo, COUNT(*) AS total_tipo FROM doacoes GROUP BY tipo ORDER BY total_tipo DESC');
    $doacoesPorTipo = $stmtTypes->fetchAll();

    $stmtRecent = $pdo->query('
        SELECT d.id, d.tipo, d.quantidade, d.data_doacao, doador.nome AS doador_nome 
        FROM doacoes d 
        INNER JOIN doadores doador ON d.doador_id = doador.id 
        ORDER BY d.id DESC 
        LIMIT 5
    ');
    $ultimasDoacoes = $stmtRecent->fetchAll();

} catch (PDOException $e) {
    $erroDb = 'Aviso: Não foi possível carregar alguns dados. Verifique a importação do banco de dados.';
}
?>`
  },
  {
    name: 'listar.php (Doadores)',
    path: '/doadores/listar.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Listagem de Doadores - CRUD Doadores
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

verificarAutenticacao();

$pesquisa = isset($_GET['q']) ? trim($_GET['q']) : '';
$doadores = [];

try {
    if (!empty($pesquisa)) {
        $stmt = $pdo->prepare('SELECT * FROM doadores WHERE nome LIKE :pesquisa OR email LIKE :pesquisa ORDER BY nome ASC');
        $stmt->execute(['pesquisa' => '%' . $pesquisa . '%']);
        $doadores = $stmt->fetchAll();
    } else {
        $stmt = $pdo->query('SELECT * FROM doadores ORDER BY nome ASC');
        $doadores = $stmt->fetchAll();
    }
} catch (PDOException $e) {
    $erroDb = 'Erro ao consultar banco de dados: ' . $e->getMessage();
}
?>`
  },
  {
    name: 'cadastrar.php (Doadores)',
    path: '/doadores/cadastrar.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Cadastro de Doadores - CRUD Doadores
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

verificarAutenticacao();

$erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = sanitize($_POST['nome']);
    $telefone = sanitize($_POST['telefone']);
    $email = sanitize($_POST['email']);
    $endereco = sanitize($_POST['endereco']);

    if (empty($nome) || empty($telefone)) {
        $erro = 'Os campos Nome Completo e Telefone são obrigatórios.';
    } else {
        try {
            $stmt = $pdo->prepare('INSERT INTO doadores (nome, telefone, email, endereco) VALUES (:nome, :telefone, :email, :endereco)');
            $stmt->execute([
                'nome' => $nome,
                'telefone' => $telefone,
                'email' => !empty($email) ? $email : null,
                'endereco' => !empty($endereco) ? $endereco : null
            ]);
            header('Location: listar.php?status=cadastrado');
            exit;
        } catch (PDOException $e) {
            $erro = 'Erro ao salvar cadastro: ' . $e->getMessage();
        }
    }
}
?>`
  },
  {
    name: 'listar.php (Doações)',
    path: '/doacoes/listar.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Listagem de Doações - CRUD Doações
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

verificarAutenticacao();

$pesquisa = isset($_GET['q']) ? trim($_GET['q']) : '';
$tipoFiltro = isset($_GET['tipo']) ? trim($_GET['tipo']) : '';
$doacoes = [];

try {
    $sql = 'SELECT d.*, doador.nome AS doador_nome FROM doacoes d INNER JOIN doadores doador ON d.doador_id = doador.id';
    $params = [];
    $condicoes = [];

    if (!empty($pesquisa)) {
        $condicoes[] = '(doador.nome LIKE :pesquisa OR d.tipo LIKE :pesquisa OR d.descricao LIKE :pesquisa)';
        $params['pesquisa'] = '%' . $pesquisa . '%';
    }

    if (!empty($tipoFiltro)) {
        $condicoes[] = 'd.tipo = :tipo';
        $params['tipo'] = $tipoFiltro;
    }

    if (count($condicoes) > 0) {
        $sql .= ' WHERE ' . implode(' AND ', $condicoes);
    }

    $sql .= ' ORDER BY d.id DESC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $doacoes = $stmt->fetchAll();
} catch (PDOException $e) {
    $erroDb = 'Erro: ' . $e->getMessage();
}
?>`
  },
  {
    name: 'relatorios.php',
    path: '/relatorios.php',
    icon: 'file-code',
    language: 'php',
    content: `<?php
/**
 * Relatórios - Página de Consolidação de Dados
 * Atividade Extensionista II - UNINTER
 */

$base_path = './';
require_once 'includes/conexao.php';
require_once 'includes/autenticacao.php';

verificarAutenticacao();

try {
    $stmtTotal = $pdo->query('SELECT COUNT(*) AS total FROM doacoes');
    $totalDoacoes = $stmtTotal->fetch()['total'];

    $stmtDonors = $pdo->query('SELECT COUNT(DISTINCT doador_id) AS total FROM doacoes');
    $totalDoadoresUnicos = $stmtDonors->fetch()['total'];

    $stmtCat = $pdo->query('SELECT tipo, COUNT(*) AS quantidade, GROUP_CONCAT(quantidade SEPARATOR " | ") AS volumes FROM doacoes GROUP BY tipo ORDER BY quantidade DESC');
    $resumoCategorias = $stmtCat->fetchAll();

    $stmtAll = $pdo->query('
        SELECT d.*, doador.nome AS doador_nome, doador.telefone AS doador_tel 
        FROM doacoes d 
        INNER JOIN doadores doador ON d.doador_id = doador.id 
        ORDER BY d.data_doacao DESC
    ');
    $listaCompleta = $stmtAll->fetchAll();
} catch (PDOException $e) {
    $erroDb = 'Erro ao processar: ' . $e->getMessage();
}
?>`
  },
  {
    name: 'style.css',
    path: '/css/style.css',
    icon: 'paint-format',
    language: 'css',
    content: `/* Folha de Estilos Customizados para o Sistema de Controle de Doações
 * Atividade Extensionista II - UNINTER
 */
:root {
    --primary-color: #0d6efd;
    --primary-hover: #0b5ed7;
    --secondary-color: #0dcaf0;
    --dark-blue: #0a2d54;
    --light-bg: #f8f9fa;
    --sidebar-bg: #112233;
}

body {
    background-color: var(--light-bg);
    font-family: 'Segoe UI', Tahoma, sans-serif;
}

.wrapper {
    display: flex;
    width: 100%;
}

#sidebar {
    min-width: 250px;
    background-color: var(--sidebar-bg);
    color: #fff;
    min-height: 100vh;
}

#content {
    width: 100%;
    display: flex;
    flex-direction: column;
}`
  },
  {
    name: 'script.js',
    path: '/js/script.js',
    icon: 'file-type-js',
    language: 'javascript',
    content: `/**
 * Scripts de Interatividade Frontend
 * Atividade Extensionista II - UNINTER
 */
document.addEventListener('DOMContentLoaded', function() {
    // Confirmação de exclusão
    const btnExcluir = document.querySelectorAll('.btn-excluir');
    btnExcluir.forEach(function(botao) {
        botao.addEventListener('click', function(event) {
            if (!confirm('Tem certeza que deseja excluir?')) {
                event.preventDefault();
            }
        });
    });

    // Máscara de telefone
    const inputTelefone = document.getElementById('telefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\\D/g, '').match(/(\\d{0,2})(\\d{0,5})(\\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
});`
  }
];
