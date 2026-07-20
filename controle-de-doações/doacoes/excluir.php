<?php
/**
 * Exclusão de Doações - CRUD Doações
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
        // Exclui a doação com prepared statement
        $stmt = $pdo->prepare('DELETE FROM doacoes WHERE id = :id');
        $stmt->execute(['id' => $id]);
        
        // Redireciona de volta com feedback positivo
        header('Location: listar.php?status=excluido');
        exit;
    } catch (PDOException $e) {
        header('Location: listar.php?status=erro');
        exit;
    }
} else {
    header('Location: listar.php');
    exit;
}
?>
