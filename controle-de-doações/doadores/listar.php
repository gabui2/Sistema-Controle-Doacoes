<?php
/**
 * Listagem de Doadores - CRUD Doadores
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

// Processamento de busca por nome ou e-mail (PHP-side)
$pesquisa = isset($_GET['q']) ? trim($_GET['q']) : '';
$doadores = [];

try {
    if (!empty($pesquisa)) {
        // Busca com proteção contra SQL Injection usando prepared statements
        $stmt = $pdo->prepare('SELECT * FROM doadores WHERE nome LIKE :pesquisa OR email LIKE :pesquisa ORDER BY nome ASC');
        $stmt->execute(['pesquisa' => '%' . $pesquisa . '%']);
        $doadores = $stmt->fetchAll();
    } else {
        // Listagem geral padrão
        $stmt = $pdo->query('SELECT * FROM doadores ORDER BY nome ASC');
        $doadores = $stmt->fetchAll();
    }
} catch (PDOException $e) {
    $erroDb = 'Erro ao consultar banco de dados: ' . $e->getMessage();
}

// Mensagens de status (Sucesso/Erro ao cadastrar, editar, excluir)
$status = isset($_GET['status']) ? $_GET['status'] : '';
$mensagem = '';
if ($status === 'cadastrado') $mensagem = 'Doador cadastrado com sucesso!';
elseif ($status === 'editado') $mensagem = 'Dados do doador atualizados com sucesso!';
elseif ($status === 'excluido') $mensagem = 'Doador removido com sucesso!';
elseif ($status === 'erro') $mensagem = 'Ocorreu um erro ao realizar a operação.';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Doadores - Sistema de Doações</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Estilos Customizados -->
    <link href="../css/style.css" rel="stylesheet">
</head>
<body>

<?php require_once $base_path . 'includes/menu.php'; ?>

<!-- Alertas de Feedback para o Usuário -->
<?php if (!empty($mensagem)): ?>
    <div class="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4 shadow-sm" role="alert">
        <i class="bi bi-check-circle-fill me-2 fs-5"></i>
        <div><?= htmlspecialchars($mensagem) ?></div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<?php if (isset($erroDb)): ?>
    <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
        <i class="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
        <div><?= htmlspecialchars($erroDb) ?></div>
    </div>
<?php endif; ?>

<!-- Barra de Ações (Filtros e Botão Cadastrar) -->
<div class="card custom-card border-0 mb-4">
    <div class="card-body p-4">
        <div class="row align-items-center g-3">
            <!-- Barra de Pesquisa Integrada (JS + PHP) -->
            <div class="col-12 col-md-6 col-lg-7">
                <form action="listar.php" method="GET" class="d-flex gap-2">
                    <div class="input-group">
                        <span class="input-group-text bg-white text-muted border-end-0">
                            <i class="bi bi-search"></i>
                        </span>
                        <input type="text" id="pesquisa-tabela" name="q" class="form-control border-start-0 ps-0" placeholder="Pesquise por nome, e-mail ou filtre de forma instantânea..." value="<?= htmlspecialchars($pesquisa) ?>">
                    </div>
                    <?php if (!empty($pesquisa)): ?>
                        <a href="listar.php" class="btn btn-outline-secondary d-flex align-items-center btn-custom">Limpar</a>
                    <?php endif; ?>
                </form>
            </div>
            
            <!-- Botão Novo Cadastro -->
            <div class="col-12 col-md-6 col-lg-5 text-md-end">
                <a href="cadastrar.php" class="btn btn-primary btn-custom shadow-sm">
                    <i class="bi bi-person-plus-fill me-2"></i> Cadastrar Novo Doador
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Tabela de Doadores -->
<div class="table-responsive-custom">
    <?php if (empty($doadores)): ?>
        <div class="text-center py-5 text-muted">
            <i class="bi bi-people fs-1 d-block mb-3"></i>
            <h5>Nenhum doador localizado</h5>
            <p class="m-0">Cadastre novos doadores ou ajuste o filtro de pesquisa acima.</p>
        </div>
    <?php else: ?>
        <table class="table custom-table table-hover align-middle" id="tabela-filtrar">
            <thead>
                <tr>
                    <th scope="col" style="width: 80px;">ID</th>
                    <th scope="col">Nome Completo</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Endereço Residencial</th>
                    <th scope="col" class="text-center" style="width: 150px;">Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($doadores as $doador): ?>
                    <tr>
                        <td class="text-muted fw-semibold">#<?= $doador['id'] ?></td>
                        <td>
                            <div class="fw-bold text-dark-blue"><?= htmlspecialchars($doador['nome']) ?></div>
                        </td>
                        <td>
                            <i class="bi bi-telephone text-muted me-1"></i>
                            <?= htmlspecialchars($doador['telefone']) ?>
                        </td>
                        <td>
                            <?php if (!empty($doador['email'])): ?>
                                <i class="bi bi-envelope text-muted me-1"></i>
                                <a href="mailto:<?= htmlspecialchars($doador['email']) ?>" class="text-decoration-none text-secondary">
                                    <?= htmlspecialchars($doador['email']) ?>
                                </a>
                            <?php else: ?>
                                <span class="text-muted italic small">Não cadastrado</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span class="text-truncate d-inline-block text-muted" style="max-width: 250px;" title="<?= htmlspecialchars($doador['endereco']) ?>">
                                <i class="bi bi-geo-alt text-muted me-1"></i>
                                <?= !empty($doador['endereco']) ? htmlspecialchars($doador['endereco']) : '<span class="text-muted italic">Sem endereço</span>' ?>
                            </span>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center gap-2">
                                <!-- Botão Editar -->
                                <a href="editar.php?id=<?= $doador['id'] ?>" class="btn btn-outline-primary btn-custom-sm d-flex align-items-center" title="Editar dados">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                                <!-- Botão Excluir -->
                                <a href="excluir.php?id=<?= $doador['id'] ?>" class="btn btn-outline-danger btn-custom-sm btn-excluir d-flex align-items-center" data-confirm="Deseja mesmo excluir o doador '<?= htmlspecialchars($doador['nome']) ?>'? Essa ação também excluirá todas as doações vinculadas a ele." title="Excluir doador">
                                    <i class="bi bi-trash-fill"></i>
                                </a>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<?php require_once $base_path . 'includes/footer.php'; ?>
