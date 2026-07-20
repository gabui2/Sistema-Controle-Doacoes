<?php
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
?>
