<?php
/**
 * Registro de Doações - CRUD Doações
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

$erro = '';
$doadores = [];

try {
    // Consulta a lista completa de doadores cadastrados para popular o select option
    $stmt = $pdo->query('SELECT id, nome FROM doadores ORDER BY nome ASC');
    $doadores = $stmt->fetchAll();
} catch (PDOException $e) {
    $erro = 'Erro ao carregar a lista de doadores: ' . $e->getMessage();
}

// Processamento do Formulário via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $doador_id = intval($_POST['doador_id']);
    $tipo = sanitize($_POST['tipo']);
    $descricao = sanitize($_POST['descricao']);
    $quantidade = sanitize($_POST['quantidade']);
    $data_doacao = sanitize($_POST['data_doacao']);

    // Validação básica dos dados
    if (empty($doador_id) || empty($tipo) || empty($quantidade) || empty($data_doacao)) {
        $erro = 'Os campos Doador, Categoria de Item, Quantidade e Data da Doação são obrigatórios.';
    } else {
        try {
            // Insere no banco com Prepared Statement
            $stmtInsert = $pdo->prepare('INSERT INTO doacoes (doador_id, tipo, descricao, quantidade, data_doacao) VALUES (:doador_id, :tipo, :descricao, :quantidade, :data_doacao)');
            $stmtInsert->execute([
                'doador_id' => $doador_id,
                'tipo' => $tipo,
                'descricao' => !empty($descricao) ? $descricao : null,
                'quantidade' => $quantidade,
                'data_doacao' => $data_doacao
            ]);

            // Redireciona de volta para a lista com status de sucesso
            header('Location: listar.php?status=cadastrado');
            exit;
        } catch (PDOException $e) {
            $erro = 'Erro interno no banco de dados ao salvar doação: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar Doação - Sistema de Doações</title>
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

<!-- Formulário de Registro -->
<div class="form-card">
    <h5 class="fw-bold text-dark-blue mb-4 d-flex align-items-center">
        <i class="bi bi-gift-fill text-success me-2"></i> Detalhes do Recebimento de Doação
    </h5>

    <!-- Exibição de Erros -->
    <?php if (!empty($erro)): ?>
        <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div><?= htmlspecialchars($erro) ?></div>
        </div>
    <?php endif; ?>

    <!-- Alerta caso não existam doadores cadastrados -->
    <?php if (empty($doadores)): ?>
        <div class="alert alert-warning mb-4" role="alert">
            <h6 class="fw-bold"><i class="bi bi-info-circle-fill me-1"></i> Atenção!</h6>
            <p class="m-0">Nenhum doador está cadastrado no sistema. Para poder registrar uma nova doação, você precisa primeiro cadastrar a pessoa ou empresa doadora.</p>
            <a href="../doadores/cadastrar.php" class="btn btn-warning btn-sm mt-3 fw-semibold">Cadastrar Doador Agora</a>
        </div>
    <?php endif; ?>

    <form action="cadastrar.php" method="POST">
        <div class="row g-3">
            <!-- Seleção do Doador -->
            <div class="col-12 col-md-6">
                <label for="doador_id" class="form-label">Doador Voluntário <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-person-fill"></i></span>
                    <select class="form-select border-start-0 ps-0" id="doador_id" name="doador_id" required <?= empty($doadores) ? 'disabled' : '' ?>>
                        <option value="">-- Selecione o Doador --</option>
                        <?php foreach ($doadores as $d): ?>
                            <option value="<?= $d['id'] ?>" <?= (isset($_POST['doador_id']) && $_POST['doador_id'] == $d['id']) ? 'selected' : '' ?>>
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
                        <option value="Alimento" <?= (isset($_POST['tipo']) && $_POST['tipo'] == 'Alimento') ? 'selected' : '' ?>>Alimento (Cestas, leite, enlatados)</option>
                        <option value="Vestuário" <?= (isset($_POST['tipo']) && $_POST['tipo'] == 'Vestuário') ? 'selected' : '' ?>>Vestuário (Roupas, agasalhos, calçados)</option>
                        <option value="Dinheiro" <?= (isset($_POST['tipo']) && $_POST['tipo'] == 'Dinheiro') ? 'selected' : '' ?>>Dinheiro (Depósito, Pix, espécie)</option>
                        <option value="Higiene" <?= (isset($_POST['tipo']) && $_POST['tipo'] == 'Higiene') ? 'selected' : '' ?>>Higiene (Sabonete, escova de dente, etc)</option>
                        <option value="Brinquedos" <?= (isset($_POST['tipo']) && $_POST['tipo'] == 'Brinquedos') ? 'selected' : '' ?>>Brinquedos (Para campanhas infantis)</option>
                        <option value="Outros" <?= (isset($_POST['tipo']) && $_POST['tipo'] == 'Outros') ? 'selected' : '' ?>>Outros (Especificar na descrição)</option>
                    </select>
                </div>
            </div>

            <!-- Quantidade -->
            <div class="col-12 col-md-6">
                <label for="quantidade" class="form-label">Quantidade <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-box-seam-fill"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" id="quantidade" name="quantidade" placeholder="Ex: 5 cestas básicas, 10 agasalhos, R$ 150,00" required value="<?= isset($_POST['quantidade']) ? htmlspecialchars($_POST['quantidade']) : '' ?>">
                </div>
                <div class="form-text">Indique a quantidade em número e unidade (Kg, pacotes, valor, etc).</div>
            </div>

            <!-- Data da Doação -->
            <div class="col-12 col-md-6">
                <label for="data_doacao" class="form-label">Data da Doação <span class="text-danger">*</span></label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-calendar-event-fill"></i></span>
                    <input type="date" class="form-control border-start-0 ps-0" id="data_doacao" name="data_doacao" required value="<?= isset($_POST['data_doacao']) ? htmlspecialchars($_POST['data_doacao']) : date('Y-m-d') ?>">
                </div>
            </div>

            <!-- Descrição Detalhada -->
            <div class="col-12">
                <label for="descricao" class="form-label">Descrição Detalhada / Observações</label>
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-file-text-fill"></i></span>
                    <textarea class="form-control border-start-0 ps-0" id="descricao" name="descricao" rows="3" placeholder="Insira detalhes adicionais sobre os itens recebidos..."><?= isset($_POST['descricao']) ? htmlspecialchars($_POST['descricao']) : '' ?></textarea>
                </div>
            </div>
        </div>

        <div class="mt-4 pt-3 border-top text-end">
            <button type="reset" class="btn btn-outline-secondary btn-custom me-2" <?= empty($doadores) ? 'disabled' : '' ?>>Limpar Campos</button>
            <button type="submit" class="btn btn-success btn-custom" <?= empty($doadores) ? 'disabled' : '' ?>>
                <i class="bi bi-check2-circle me-1"></i> Registrar Doação
            </button>
        </div>
    </form>
</div>

<?php require_once $base_path . 'includes/footer.php'; ?>
</body>
</html>
