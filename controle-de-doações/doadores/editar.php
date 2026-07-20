<?php
/**
 * Edição de Doadores - CRUD Doadores
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

$erro = '';
$doador = null;

// Verifica se o ID foi fornecido e é válido
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Location: listar.php');
    exit;
}

$id = intval($_GET['id']);

try {
    // Busca os dados atuais do doador
    $stmt = $pdo->prepare('SELECT * FROM doadores WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $doador = $stmt->fetch();

    if (!$doador) {
        header('Location: listar.php?status=erro');
        exit;
    }
} catch (PDOException $e) {
    die("Erro ao carregar dados: " . $e->getMessage());
}

// Processamento da Atualização via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = sanitize($_POST['nome']);
    $telefone = sanitize($_POST['telefone']);
    $email = sanitize($_POST['email']);
    $endereco = sanitize($_POST['endereco']);

    // Validação de campos obrigatórios
    if (empty($nome) || empty($telefone)) {
        $erro = 'Os campos Nome Completo e Telefone de contato são obrigatórios.';
    } elseif (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erro = 'O endereço de e-mail informado é inválido.';
    } else {
        try {
            // Executa o update com Prepared Statement
            $stmtUpdate = $pdo->prepare('UPDATE doadores SET nome = :nome, telefone = :telefone, email = :email, endereco = :endereco WHERE id = :id');
            $stmtUpdate->execute([
                'nome' => $nome,
                'telefone' => $telefone,
                'email' => !empty($email) ? $email : null,
                'endereco' => !empty($endereco) ? $endereco : null,
                'id' => $id
            ]);

            // Redireciona com status de sucesso
            header('Location: listar.php?status=editado');
            exit;
        } catch (PDOException $e) {
            $erro = 'Erro interno ao atualizar registro: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Doador - Sistema de Doações</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Estilos Customizados -->
    <link href="../css/style.css" rel="stylesheet">
</head>
<body>

<?php require_once $base_path . 'includes/menu.php'; ?>

<!-- Botão Voltar -->
<div class="mb-4">
    <a href="listar.php" class="btn btn-outline-secondary btn-custom d-inline-flex align-items-center">
        <i class="bi bi-arrow-left me-2"></i> Voltar para Lista
    </a>
</div>

<!-- Formulário de Edição -->
<div class="form-card">
    <h5 class="fw-bold text-dark-blue mb-4 d-flex align-items-center">
        <i class="bi bi-pencil-square text-primary me-2"></i> Editar Informações do Doador #<?= $doador['id'] ?>
    </h5>

    <!-- Exibição de Erros -->
    <?php if (!empty($erro)): ?>
        <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div><?= htmlspecialchars($erro) ?></div>
        </div>
    <?php endif; ?>

    <form action="editar.php?id=<?= $doador['id'] ?>" method="POST">
        <div class="row g-3">
            <!-- Nome Completo -->
            <div class="col-12 col-md-6">
                <label for="nome" class="form-label">Nome Completo <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" id="nome" name="nome" placeholder="Ex: João da Silva" required value="<?= htmlspecialchars($doador['nome']) ?>">
                </div>
            </div>

            <!-- Telefone -->
            <div class="col-12 col-md-6">
                <label for="telefone" class="form-label">Telefone de Contato <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-telephone"></i></span>
                    <input type="tel" class="form-control border-start-0 ps-0" id="telefone" name="telefone" placeholder="Ex: (11) 99999-9999" required value="<?= htmlspecialchars($doador['telefone']) ?>">
                </div>
            </div>

            <!-- E-mail -->
            <div class="col-12 col-md-12">
                <label for="email" class="form-label">Endereço de E-mail</label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-envelope"></i></span>
                    <input type="email" class="form-control border-start-0 ps-0" id="email" name="email" placeholder="Ex: joao@email.com" value="<?= htmlspecialchars($doador['email'] ?? '') ?>">
                </div>
                <div class="form-text">Opcional. Utilizado para envio de informativos e comprovantes de doação.</div>
            </div>

            <!-- Endereço -->
            <div class="col-12">
                <label for="endereco" class="form-label">Endereço Completo</label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-geo-alt"></i></span>
                    <textarea class="form-control border-start-0 ps-0" id="endereco" name="endereco" rows="3" placeholder="Rua, número, complemento, bairro, cidade - UF"><?= htmlspecialchars($doador['endereco'] ?? '') ?></textarea>
                </div>
                <div class="form-text">Opcional. Utilizado para coleta de doações em domicílio.</div>
            </div>
        </div>

        <div class="mt-4 pt-3 border-top text-end">
            <a href="listar.php" class="btn btn-outline-secondary btn-custom me-2">Cancelar Alterações</a>
            <button type="submit" class="btn btn-primary btn-custom">
                <i class="bi bi-save me-1"></i> Salvar Alterações
            </button>
        </div>
    </form>
</div>

<?php require_once $base_path . 'includes/footer.php'; ?>
</body>
</html>
