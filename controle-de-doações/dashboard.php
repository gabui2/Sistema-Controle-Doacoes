<?php
/**
 * Painel Principal - Dashboard
 * Atividade Extensionista II - UNINTER
 */

$base_path = './';
require_once 'includes/conexao.php';
require_once 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

// Inicialização das variáveis de estatísticas
$totalDoadores = 0;
$totalDoacoes = 0;
$doacoesPorTipo = [];
$ultimasDoacoes = [];

try {
    // 1. Total de Doadores
    $stmtDonors = $pdo->query('SELECT COUNT(*) AS total FROM doadores');
    $totalDoadores = $stmtDonors->fetch()['total'];

    // 2. Total de Doações Registradas
    $stmtDonations = $pdo->query('SELECT COUNT(*) AS total FROM doacoes');
    $totalDoacoes = $stmtDonations->fetch()['total'];

    // 3. Distribuição de Doações por Tipo
    $stmtTypes = $pdo->query('SELECT tipo, COUNT(*) AS total_tipo FROM doacoes GROUP BY tipo ORDER BY total_tipo DESC');
    $doacoesPorTipo = $stmtTypes->fetchAll();

    // 4. Últimas 5 Doações Registradas (com INNER JOIN para pegar o nome do doador)
    $stmtRecent = $pdo->query('
        SELECT d.id, d.tipo, d.quantidade, d.data_doacao, doador.nome AS doador_nome 
        FROM doacoes d 
        INNER JOIN doadores doador ON d.doador_id = doador.id 
        ORDER BY d.id DESC 
        LIMIT 5
    ');
    $ultimasDoacoes = $stmtRecent->fetchAll();

} catch (PDOException $e) {
    // Captura erros no banco e define mensagem (pode ocorrer se as tabelas ainda não foram importadas)
    $erroDb = 'Aviso: Não foi possível carregar alguns dados. Verifique a importação do banco de dados MySQL.';
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel de Controle - Sistema de Doações</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Estilos Customizados -->
    <link href="css/style.css" rel="stylesheet">
</head>
<body>

<?php 
// Inclui o menu lateral e o cabeçalho
require_once 'includes/menu.php'; 
?>

<!-- Alerta de erro de banco de dados, se houver -->
<?php if (isset($erroDb)): ?>
    <div class="alert alert-warning d-flex align-items-center mb-4" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
        <div><?= htmlspecialchars($erroDb) ?></div>
    </div>
<?php endif; ?>

<!-- Grade de Estatísticas (Bento Cards) -->
<div class="row">
    <!-- Card de Total Doadores -->
    <div class="col-12 col-md-6 col-lg-3">
        <div class="card custom-card card-stat stat-donors">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="text-muted text-uppercase mb-1 small fw-bold">Total de Doadores</h6>
                    <h2 class="m-0 fw-bold text-dark-blue"><?= $totalDoadores ?></h2>
                </div>
                <div class="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                    <i class="bi bi-people fs-3"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Card de Total Doações -->
    <div class="col-12 col-md-6 col-lg-3">
        <div class="card custom-card card-stat stat-donations">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="text-muted text-uppercase mb-1 small fw-bold">Total de Doações</h6>
                    <h2 class="m-0 fw-bold text-success"><?= $totalDoacoes ?></h2>
                </div>
                <div class="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                    <i class="bi bi-gift fs-3"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Card de Tipos Ativos -->
    <div class="col-12 col-md-6 col-lg-3">
        <div class="card custom-card card-stat stat-categories">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="text-muted text-uppercase mb-1 small fw-bold">Categorias Ativas</h6>
                    <h2 class="m-0 fw-bold text-warning"><?= count($doacoesPorTipo) ?></h2>
                </div>
                <div class="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                    <i class="bi bi-grid-3x3-gap fs-3"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Card Acadêmico -->
    <div class="col-12 col-md-6 col-lg-3">
        <div class="card custom-card card-stat stat-recent">
            <div class="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="text-muted text-uppercase mb-1 small fw-bold">Campanha Ativa</h6>
                    <h2 class="m-0 fw-bold text-danger">Inverno</h2>
                </div>
                <div class="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                    <i class="bi bi-calendar-event fs-3"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row mt-2">
    <!-- Seção de Últimas Doações -->
    <div class="col-12 col-lg-8">
        <div class="card custom-card">
            <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="m-0 fw-bold text-dark-blue">Últimas Doações Recebidas</h5>
                    <a href="doacoes/listar.php" class="btn btn-outline-primary btn-sm btn-custom">Ver Todas</a>
                </div>
                
                <?php if (empty($ultimasDoacoes)): ?>
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                        <span>Nenhuma doação cadastrada no momento.</span>
                    </div>
                <?php else: ?>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Doador</th>
                                    <th>Tipo de Item</th>
                                    <th>Quantidade</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($ultimasDoacoes as $doacao): ?>
                                    <tr>
                                        <td class="fw-semibold text-dark-blue"><?= htmlspecialchars($doacao['doador_nome']) ?></td>
                                        <td>
                                            <span class="badge bg-primary bg-opacity-10 text-primary px-2.5 py-1.5 rounded-pill">
                                                <?= htmlspecialchars($doacao['tipo']) ?>
                                            </span>
                                        </td>
                                        <td><?= htmlspecialchars($doacao['quantidade']) ?></td>
                                        <td><i class="bi bi-calendar3 text-muted me-1"></i><?= date('d/m/Y', strtotime($doacao['data_doacao'])) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Distribuição por Categoria -->
    <div class="col-12 col-lg-4">
        <div class="card custom-card">
            <div class="card-body p-4">
                <h5 class="fw-bold text-dark-blue mb-4">Volume por Categoria</h5>
                
                <?php if (empty($doacoesPorTipo)): ?>
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-pie-chart fs-1 d-block mb-3"></i>
                        <span>Nenhum dado estatístico disponível.</span>
                    </div>
                <?php else: ?>
                    <div class="d-flex flex-column gap-3">
                        <?php foreach ($doacoesPorTipo as $tipoStat): ?>
                            <?php 
                            // Calcula porcentagem aproximada para exibição visual
                            $porcentagem = ($totalDoacoes > 0) ? round(($tipoStat['total_tipo'] / $totalDoacoes) * 100) : 0;
                            ?>
                            <div>
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-medium text-dark"><?= htmlspecialchars($tipoStat['tipo']) ?></span>
                                    <span class="text-muted small"><?= $tipoStat['total_tipo'] ?> (<?= $porcentagem ?>%)</span>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar" role="progressbar" style="width: <?= $porcentagem ?>%" aria-valuenow="<?= $porcentagem ?>" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Seção de Atalhos Rápidos e Guia Acadêmico -->
<div class="row mt-2">
    <div class="col-12">
        <div class="card custom-card bg-primary text-white border-0 p-4">
            <div class="row align-items-center">
                <div class="col-12 col-md-9 mb-3 mb-md-0">
                    <h5 class="fw-bold mb-1">Registrar Doações Solidárias</h5>
                    <p class="m-0 text-white-50 small">Utilize as abas do menu esquerdo para gerenciar novos parceiros voluntários da comunidade e registrar mantimentos, agasalhos, materiais e verbas arrecadadas.</p>
                </div>
                <div class="col-12 col-md-3 text-md-end">
                    <a href="doacoes/cadastrar.php" class="btn btn-light text-primary btn-custom fw-semibold shadow-sm">
                        <i class="bi bi-plus-circle me-1"></i> Nova Doação
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php 
// Inclui o fechamento do container, rodapé e scripts
require_once 'includes/footer.php'; 
?>
