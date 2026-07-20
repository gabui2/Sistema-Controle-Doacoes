<?php
/**
 * Exclusão de Doadores - CRUD Doadores
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

// Verifica se o ID foi recebido por parâmetro GET
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id = intval($_GET['id']);
    
    try {
        // Exclui o doador. (Nota: Por causa do 'ON DELETE CASCADE' na tabela 'doacoes', 
        // as doações deste doador também serão automaticamente removidas de forma íntegra)
        $stmt = $pdo->prepare('DELETE FROM doadores WHERE id = :id');
        $stmt->execute(['id' => $id]);
        
        // Redireciona com feedback positivo
        header('Location: listar.php?status=excluido');
        exit;
    } catch (PDOException $e) {
        // Em caso de falha de integridade ou banco de dados
        header('Location: listar.php?status=erro');
        exit;
    }
} else {
    // Caso o ID não esteja configurado, volta para a página principal do listado
    header('Location: listar.php');
    exit;
}
?>
