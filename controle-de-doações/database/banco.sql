-- Banco de Dados: sistema_doacoes
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
ON DUPLICATE KEY UPDATE id=id;

-- Inserindo Doadores de Teste
INSERT INTO doadores (nome, telefone, email, endereco) VALUES
('João Silva de Souza', '(11) 98765-4321', 'joao.silva@email.com', 'Rua das Flores, 123, Centro, São Paulo - SP'),
('Maria Oliveira Santos', '(21) 99888-7766', 'maria.santos@email.com', 'Av. Atlântica, 456, Copacabana, Rio de Janeiro - RJ'),
('Ana Julia Pinheiro', '(41) 99111-2233', 'ana.pinheiro@email.com', 'Rua XV de Novembro, 789, Batel, Curitiba - PR'),
('Carlos Eduardo Lima', '(31) 98555-4444', 'carlos.lima@email.com', 'Rua da Bahia, 1012, Savassi, Belo Horizonte - MG')
ON DUPLICATE KEY UPDATE id=id;

-- Inserindo Doações de Teste
INSERT INTO doacoes (doador_id, tipo, descricao, quantidade, data_doacao) VALUES
(1, 'Alimento', 'Cesta Básica Completa contendo arroz, feijão, óleo e café.', '2 cestas', '2026-07-15'),
(2, 'Vestuário', 'Lote de agasalhos, casacos e cobertores infantis em bom estado.', '15 peças', '2026-07-16'),
(3, 'Dinheiro', 'Transferência via PIX destinada à compra de materiais de limpeza.', 'R$ 250,00', '2026-07-18'),
(4, 'Higiene', 'Sabonetes, cremes dentais, escovas de dente e papel higiênico.', '30 pacotes', '2026-07-19'),
(1, 'Alimento', 'Pacotes de leite em pó integral.', '10 pacotes', '2026-07-20')
ON DUPLICATE KEY UPDATE id=id;
