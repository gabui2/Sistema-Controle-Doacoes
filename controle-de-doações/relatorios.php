<?php
/**
 * Relatórios - Página de Consolidação de Dados
 * Atividade Extensionista II - UNINTER
 */

$base_path = './';
require_once 'includes/conexao.php';
require_once 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

// Inicialização das variáveis do relatório
$totalDoacoes = 0;
$totalDoadoresUnicos = 0;
$resumoCategorias = [];
$listaCompleta = [];

try {
    // 1. Total Geral de Doações Registradas
    $stmtTotal = $pdo->query('SELECT COUNT(*) AS total FROM doacoes');
    $totalDoacoes = $stmtTotal->fetch()['total'];

    // 2. Total de Doadores Únicos Participantes
    $stmtDonors = $pdo->query('SELECT COUNT(DISTINCT doador_id) AS total FROM doacoes');
    $totalDoadoresUnicos = $stmtDonors->fetch()['total'];

    // 3. Agrupamento e Quantidade por Categoria
    $stmtCat = $pdo->query('SELECT tipo, COUNT(*) AS quantidade, GROUP_CONCAT(quantidade SEPARATOR " | ") AS volumes FROM doacoes GROUP BY tipo ORDER BY quantidade DESC');
    $resumoCategorias = $stmtCat->fetchAll();

    // 4. Lista Completa de Doações (Relatório Analítico)
    $stmtAll = $pdo->query('
        SELECT d.*, doador.nome AS doador_nome, doador.telefone AS doador_tel 
        FROM doacoes d 
        INNER JOIN doadores doador ON d.doador_id = doador.id 
        ORDER BY d.data_doacao DESC
    ');
    $listaCompleta = $stmtAll->fetchAll();

} catch (PDOException $e) {
    $erroDb = 'Erro ao processar relatórios consolidado: ' . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatórios de Doações - Atividade Extensionista</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Estilos Customizados -->
    <link href="css/style.css" rel="stylesheet">
    <!-- Estilos de Impressão -->
    <style>
        @media print {
            body {
                background-color: #fff;
                color: #000;
            }
            #sidebar, .navbar-custom, .btn, .alert {
                display: none !important;
            }
            #content {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .main-container {
                padding: 0 !important;
            }
            .custom-card {
                box-shadow: none !important;
                border: 1px solid #000 !important;
                margin-bottom: 20px !important;
            }
            .table-responsive-custom {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
            }
            .table {
                width: 100% !important;
                border-collapse: collapse !important;
            }
            .table th, .table td {
                border: 1px solid #ddd !important;
                padding: 8px !important;
            }
        }
    </style>
</head>
<body>

<?php require_once 'includes/menu.php'; ?>

<!-- Cabeçalho de Botão de Impressão -->
<div class="d-flex justify-content-between align-items-center mb-4">
    <span class="text-muted small">Consolidação acadêmica de registros para apresentação de atividades sociais.</span>
    <button onclick="window.print()" class="btn btn-primary btn-custom shadow-sm d-inline-flex align-items-center">
        <i class="bi bi-printer-fill me-2"></i> Imprimir Relatório Oficial
    </button>
</div>

<!-- Resumo Executivo / Metas -->
<div class="row">
    <!-- KPI Total Doações -->
    <div class="col-12 col-md-6">
        <div class="card custom-card bg-light border-start border-primary border-4">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="text-muted text-uppercase mb-1 small fw-bold">Volume Total de Atendimentos</h6>
                    <h2 class="m-0 fw-bold text-primary"><?= $totalDoacoes ?> registros</h2>
                    <p class="m-0 text-muted small mt-1">Soma agregada de todas as entradas registradas no sistema.</p>
                </div>
                <div class="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                    <i class="bi bi-clipboard2-check fs-3"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- KPI Doadores Mobilizados -->
    <div class="col-12 col-md-6">
        <div class="card custom-card bg-light border-start border-success border-4">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="text-muted text-uppercase mb-1 small fw-bold">Doadores Ativos Mobilizados</h6>
                    <h2 class="m-0 fw-bold text-success"><?= $totalDoadoresUnicos ?> doadores</h2>
                    <p class="m-0 text-muted small mt-1">Diferentes indivíduos da comunidade que efetuaram contribuições.</p>
                </div>
                <div class="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                    <i class="bi bi-people-fill fs-3"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row mt-2">
    <!-- Tabela por Categorias de Doação -->
    <div class="col-12">
        <div class="card custom-card">
            <div class="card-body p-4">
                <h5 class="fw-bold text-dark-blue mb-4 d-flex align-items-center">
                    <i class="bi bi-pie-chart text-warning me-2"></i> Consolidação Quantitativa por Categoria
                </h5>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Categoria do Item</th>
                                <th class="text-center" style="width: 200px;">Qtd de Registros</th>
                                <th>Detalhamento de Volumes Arrecadados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($resumoCategorias)): ?>
                                <tr>
                                    <td colspan="3" class="text-center py-3 text-muted">Nenhum registro para resumir.</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($resumoCategorias as $cat): ?>
                                    <tr>
                                        <td class="fw-bold text-dark-blue"><?= htmlspecialchars($cat['tipo']) ?></td>
                                        <td class="text-center">
                                            <span class="badge bg-secondary rounded-pill px-3 py-2 fw-semibold">
                                                <?= $cat['quantidade'] ?> entrada(s)
                                            </span>
                                        </td>
                                        <td class="text-muted font-mono" style="font-size: 0.9rem;">
                                            <?= htmlspecialchars($cat['volumes']) ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row mt-2">
    <!-- Lista Completa de Doações -->
    <div class="col-12">
        <div class="card custom-card">
            <div class="card-body p-4">
                <h5 class="fw-bold text-dark-blue mb-4 d-flex align-items-center">
                    <i class="bi bi-journals text-danger me-2"></i> Relatório Analítico de Entradas (Lista Completa)
                </h5>
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Código</th>
                                <th>Doador</th>
                                <th>Telefone</th>
                                <th>Categoria</th>
                                <th>Descrição do Item</th>
                                <th>Quantidade</th>
                                <th>Data Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($listaCompleta)): ?>
                                <tr>
                                    <td colspan="7" class="text-center py-4 text-muted">Nenhuma doação cadastrada até o momento.</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($listaCompleta as $item): ?>
                                    <tr>
                                        <td class="text-muted fw-semibold">#<?= $item['id'] ?></td>
                                        <td class="fw-bold text-dark-blue"><?= htmlspecialchars($item['doador_nome']) ?></td>
                                        <td><?= htmlspecialchars($item['doador_tel']) ?></td>
                                        <td>
                                            <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 text-uppercase" style="font-size: 0.7rem;">
                                                <?= htmlspecialchars($item['tipo']) ?>
                                            </span>
                                        </td>
                                        <td class="text-muted small"><?= htmlspecialchars($item['descricao'] ?? 'Sem descrição') ?></td>
                                        <td class="fw-semibold text-dark-blue"><?= htmlspecialchars($item['quantidade']) ?></td>
                                        <td><i class="bi bi-calendar3 text-muted me-1"></i><?= date('d/m/Y', strtotime($item['data_doacao'])) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Assinatura de Validação de Extensão -->
<div class="row mt-4 d-none d-print-block">
    <div class="col-12 mt-5">
        <div class="d-flex justify-content-around text-center pt-5">
            <div style="border-top: 1px solid #333; width: 250px;" class="pt-2">
                <strong>Responsável Institucional</strong><br>
                <span class="text-muted small">Assinatura e Carimbo</span>
            </div>
            <div style="border-top: 1px solid #333; width: 250px;" class="pt-2">
                <strong>Acadêmico da UNINTER</strong><br>
                <span class="text-muted small">Atividade Extensionista II</span>
            </div>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
</body>
</html>
