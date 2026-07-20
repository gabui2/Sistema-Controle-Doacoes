<?php
/**
 * Logout e Encerramento de Sessão
 * Atividade Extensionista II - UNINTER
 */

require_once 'includes/autenticacao.php';

// Limpa todas as variáveis de sessão
$_SESSION = array();

// Se o cookie de sessão existe, invalida-o no navegador do usuário
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destrói a sessão
session_destroy();

// Redireciona para o login com mensagem de despedida ou apenas redireciona
header('Location: login.php');
exit;
?>
