<?php
/**
 * Edição de Doações - CRUD Doações
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

$erro = '';
$doacao = null;
$doadores = [];

// Verifica se o ID foi recebido e é válido
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Location: listar.php');
    exit;
}

$id = intval($_GET['id']);

try {
    // 1. Busca os dados atuais da doação
    $stmt = $pdo->prepare('SELECT * FROM doacoes WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $doacao = $stmt->fetch();

    if (!$doacao) {
        header('Location: listar.php?status=erro');
        exit;
    }

    // 2. Busca todos os doadores para preencher a listagem dropdown
    $stmtDoadores = $pdo->query('SELECT id, nome FROM doadores ORDER BY nome ASC');
    $doadores = $stmtDoadores->fetchAll();

} catch (PDOException $e) {
    die("Erro ao carregar dados do banco: " . $e->getMessage());
}

// Processamento da Atualização via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $doador_id = intval($_POST['doador_id']);
    $tipo = sanitize($_POST['tipo']);
    $descricao = sanitize($_POST['descricao']);
    $quantidade = sanitize($_POST['quantidade']);
    $data_doacao = sanitize($_POST['data_doacao']);

    // Validação dos dados obrigatórios
    if (empty($doador_id) || empty($tipo) || empty($quantidade) || empty($data_doacao)) {
        $erro = 'Os campos Doador, Categoria de Item, Quantidade e Data da Doação são obrigatórios.';
    } else {
        try {
            // Atualiza no banco com Prepared Statement
            $stmtUpdate = $pdo->prepare('UPDATE doacoes SET doador_id = :doador_id, tipo = :tipo, descricao = :descricao, quantidade = :quantidade, data_doacao = :data_doacao WHERE id = :id');
            $stmtUpdate->execute([
                'doador_id' => $doador_id,
                'tipo' => $tipo,
                'descricao' => !empty($descricao) ? $descricao : null,
                'quantidade' => $quantidade,
                'data_doacao' => $data_doacao,
                'id' => $id
            ]);

            // Redireciona com feedback de sucesso
            header('Location: listar.php?status=editado');
            exit;
        } catch (PDOException $e) {
            $erro = 'Erro interno ao atualizar registro de doação: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Doação - Sistema de Doações</title>
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
        <i class="bi bi-pencil-square text-primary me-2"></i> Editar Informações da Doação #<?= $doacao['id'] ?>
    </h5>

    <!-- Exibição de Erros -->
    <?php if (!empty($erro)): ?>
        <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div><?= htmlspecialchars($erro) ?></div>
        </div>
    <?php endif; ?>

    <form action="editar.php?id=<?= $doacao['id'] ?>" method="POST">
        <div class="row g-3">
            <!-- Seleção do Doador -->
            <div class="col-12 col-md-6">
                <label for="doador_id" class="form-label">Doador Voluntário <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-person-fill"></i></span>
                    <select class="form-select border-start-0 ps-0" id="doador_id" name="doador_id" required>
                        <option value="">-- Selecione o Doador --</option>
                        <?php foreach ($doadores as $d): ?>
                            <option value="<?= $d['id'] ?>" <?= ($doacao['doador_id'] == $d['id']) ? 'selected' : '' ?>>
                                <?= htmlspecialchars($d['nome']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <!-- Categoria do Item (Tipo) -->
            <div class="col-12 col-md-6">
                <label for="tipo" class="form-label">Categoria do Item <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-tag-fill"></i></span>
                    <select class="form-select border-start-0 ps-0" id="tipo" name="tipo" required>
                        <option value="">-- Selecione a Categoria --</option>
                        <option value="Alimento" <?= ($doacao['tipo'] === 'Alimento') ? 'selected' : '' ?>>Alimento (Cestas, leite, enlatados)</option>
                        <option value="Vestuário" <?= ($doacao['tipo'] === 'Vestuário') ? 'selected' : '' ?>>Vestuário (Roupas, agasalhos, calçados)</option>
                        <option value="Dinheiro" <?= ($doacao['tipo'] === 'Dinheiro') ? 'selected' : '' ?>>Dinheiro (Depósito, Pix, espécie)</option>
                        <option value="Higiene" <?= ($doacao['tipo'] === 'Higiene') ? 'selected' : '' ?>>Higiene (Sabonete, escova de dente, etc)</option>
                        <option value="Brinquedos" <?= ($doacao['tipo'] === 'Brinquedos') ? 'selected' : '' ?>>Brinquedos (Para campanhas infantis)</option>
                        <option value="Outros" <?= ($doacao['tipo'] === 'Outros') ? 'selected' : '' ?>>Outros (Especificar na descrição)</option>
                    </select>
                </div>
            </div>

            <!-- Quantidade -->
            <div class="col-12 col-md-6">
                <label for="quantidade" class="form-label">Quantidade <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-box-seam-fill"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" id="quantidade" name="quantidade" placeholder="Ex: 5 cestas básicas, 10 agasalhos" required value="<?= htmlspecialchars($doacao['quantidade']) ?>">
                </div>
            </div>

            <!-- Data da Doação -->
            <div class="col-12 col-md-6">
                <label for="data_doacao" class="form-label">Data da Doação <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-calendar-event-fill"></i></span>
                    <input type="date" class="form-control border-start-0 ps-0" id="data_doacao" name="data_doacao" required value="<?= htmlspecialchars($doacao['data_doacao']) ?>">
                </div>
            </div>

            <!-- Descrição Detalhada -->
            <div class="col-12">
                <label for="descricao" class="form-label">Descrição Detalhada / Observações</label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-file-text-fill"></i></span>
                    <textarea class="form-control border-start-0 ps-0" id="descricao" name="descricao" rows="3" placeholder="Insira detalhes adicionais sobre os itens recebidos..."><?= htmlspecialchars($doacao['descricao'] ?? '') ?></textarea>
                </div>
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
