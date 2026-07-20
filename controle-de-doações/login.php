<?php
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
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Sistema de Controle de Doações</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Estilos Customizados -->
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="login-body">

<div class="login-card">
    <div class="login-logo text-center">
        <i class="bi bi-heart-fill text-danger"></i>
    </div>
    
    <h3 class="text-center mb-1 fw-bold text-dark-blue">DoaAmor</h3>
    <p class="text-center text-muted mb-4" style="font-size: 0.9rem;">Sistema de Controle de Doações</p>

    <!-- Exibição de Erros -->
    <?php if (!empty($erro)): ?>
        <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <div><?= htmlspecialchars($erro) ?></div>
        </div>
    <?php endif; ?>

    <form action="login.php" method="POST" class="needs-validation" novalidate>
        <div class="mb-3">
            <label for="email" class="form-label">E-mail Corporativo</label>
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-envelope"></i>
                </span>
                <input type="email" class="form-control border-start-0 ps-0" id="email" name="email" placeholder="admin@admin.com" required value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '' ?>">
            </div>
        </div>

        <div class="mb-4">
            <div class="d-flex justify-content-between">
                <label for="senha" class="form-label">Senha de Acesso</label>
            </div>
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-lock"></i>
                </span>
                <input type="password" class="form-control border-start-0 ps-0" id="senha" name="senha" placeholder="admin123" required>
            </div>
        </div>

        <button type="submit" class="btn btn-primary w-full btn-custom d-flex justify-content-center align-items-center w-100">
            <i class="bi bi-box-arrow-in-right me-2"></i> Entrar no Painel
        </button>
    </form>
    
    <div class="mt-4 pt-3 border-top text-center text-muted" style="font-size: 0.8rem;">
        <span>Atividade Extensionista II - UNINTER</span><br>
        <span>Análise e Desenvolvimento de Sistemas</span>
    </div>
</div>

</body>
</html>
