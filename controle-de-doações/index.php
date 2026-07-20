<?php
/**
 * Gateway de Entrada do Sistema
 * Atividade Extensionista II - UNINTER
 */

require_once 'includes/autenticacao.php';

// Redirecionamento automático baseado no estado da autenticação
if (isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id'])) {
    header('Location: dashboard.php');
} else {
    header('Location: login.php');
}
exit;
?>
