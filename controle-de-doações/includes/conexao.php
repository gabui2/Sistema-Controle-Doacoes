<?php
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
?>
