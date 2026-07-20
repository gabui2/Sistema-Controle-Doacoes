<?php
/**
 * Listagem de Doações - CRUD Doações
 * Atividade Extensionista II - UNINTER
 */

$base_path = '../';
require_once $base_path . 'includes/conexao.php';
require_once $base_path . 'includes/autenticacao.php';

// Protege a página de acessos não autorizados
verificarAutenticacao();

// Processamento de filtros ou buscas por categoria/tipo ou doador (PHP-side)
$pesquisa = isset($_GET['q']) ? trim($_GET['q']) : '';
$tipoFiltro = isset($_GET['tipo']) ? trim($_GET['tipo']) : '';
$doacoes = [];

try {
    // Montagem da query dinâmica com Prepared Statements
    $sql = 'SELECT d.*, doador.nome AS doador_nome 
            FROM doacoes d 
            INNER JOIN doadores doador ON d.doador_id = doador.id';
    
    $params = [];
    $condicoes = [];

    if (!empty($pesquisa)) {
        $condicoes[] = '(doador.nome LIKE :pesquisa OR d.tipo LIKE :pesquisa OR d.descricao LIKE :pesquisa)';
        $params['pesquisa'] = '%' . $pesquisa . '%';
    }

    if (!empty($tipoFiltro)) {
        $condicoes[] = 'd.tipo = :tipo';
        $params['tipo'] = $tipoFiltro;
    }

    if (count($condicoes) > 0) {
        $sql .= ' WHERE ' . implode(' AND ', $condicoes);
    }

    $sql .= ' ORDER BY d.id DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $doacoes = $stmt->fetchAll();

    // Consulta os tipos distintos cadastrados para preencher o filtro select
    $stmtTipos = $pdo->query('SELECT DISTINCT tipo FROM doacoes ORDER BY tipo ASC');
    $listaTipos = $stmtTipos->fetchAll(PDO::FETCH_COLUMN);

} catch (PDOException $e) {
    $erroDb = 'Erro ao consultar banco de dados: ' . $e->getMessage();
}

// Mensagens de status (Feedback para CRUD)
$status = isset($_GET['status']) ? $_GET['status'] : '';
$mensagem = '';
if ($status === 'cadastrado') $mensagem = 'Doação registrada com sucesso!';
elseif ($status === 'editado') $mensagem = 'Registro de doação atualizado com sucesso!';
elseif ($status === 'excluido') $mensagem = 'Doação excluída com sucesso!';
elseif ($status === 'erro') $mensagem = 'Ocorreu um erro ao realizar a operação de doações.';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Doações - Sistema de Doações</title>
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

<!-- Barra de Ações (Filtros Avançados e Botão Registrar) -->
<div class="card custom-card border-0 mb-4">
    <div class="card-body p-4">
        <form action="listar.php" method="GET" class="row g-3 align-items-center">
            <!-- Pesquisa Livre -->
            <div class="col-12 col-md-4 col-lg-5">
                <div class="input-group">
                    <span class="input-group-text bg-white text-muted border-end-0">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" id="pesquisa-tabela" name="q" class="form-control border-start-0 ps-0" placeholder="Pesquise por doador, item ou descrição..." value="<?= htmlspecialchars($pesquisa) ?>">
                </div>
            </div>
            
            <!-- Filtro por Categoria de Item -->
            <div class="col-12 col-sm-6 col-md-3 col-lg-3">
                <select name="tipo" class="form-select" onchange="this.form.submit()">
                    <option value="">-- Filtrar por Categoria --</option>
                    <?php foreach ($listaTipos as $tipo): ?>
                        <option value="<?= htmlspecialchars($tipo) ?>" <?= ($tipoFiltro === $tipo) ? 'selected' : '' ?>>
                            <?= htmlspecialchars($tipo) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Botões de Ação de Pesquisa -->
            <div class="col-12 col-sm-6 col-md-2 col-lg-2 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary btn-custom w-100">Filtrar</button>
                <?php if (!empty($pesquisa) || !empty($tipoFiltro)): ?>
                    <a href="listar.php" class="btn btn-outline-secondary btn-custom d-flex align-items-center"><i class="bi bi-arrow-counterclockwise"></i></a>
                <?php endif; ?>
            </div>

            <!-- Botão Nova Doação -->
            <div class="col-12 col-md-3 col-lg-2 text-md-end ms-auto">
                <a href="cadastrar.php" class="btn btn-success btn-custom shadow-sm w-100 d-inline-flex justify-content-center align-items-center">
                    <i class="bi bi-plus-circle-fill me-2"></i> Registrar Doação
                </a>
            </div>
        </form>
    </div>
</div>

<!-- Tabela de Doações -->
<div class="table-responsive-custom">
    <?php if (empty($doacoes)): ?>
        <div class="text-center py-5 text-muted">
            <i class="bi bi-gift fs-1 d-block mb-3"></i>
            <h5>Nenhuma doação localizada</h5>
            <p class="m-0">Registre novas doações recebidas ou ajuste as opções de filtragem acima.</p>
        </div>
    <?php else: ?>
        <table class="table custom-table table-hover align-middle" id="tabela-filtrar">
            <thead>
                <tr>
                    <th scope="col" style="width: 80px;">Cod</th>
                    <th scope="col">Doador Voluntário</th>
                    <th scope="col">Categoria do Item</th>
                    <th scope="col">Detalhes/Descrição</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col">Data da Entrada</th>
                    <th scope="col" class="text-center" style="width: 140px;">Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($doacoes as $doacao): ?>
                    <tr>
                        <td class="text-muted fw-semibold">#<?= $doacao['id'] ?></td>
                        <td>
                            <div class="fw-bold text-dark-blue"><?= htmlspecialchars($doacao['doador_nome']) ?></div>
                        </td>
                        <td>
                            <?php
                            // Cores de badge dinâmicas conforme a categoria
                            $badgeClass = 'bg-primary';
                            switch(strtolower($doacao['tipo'])) {
                                case 'alimento': $badgeClass = 'bg-success'; break;
                                case 'vestuário': $badgeClass = 'bg-warning text-dark'; break;
                                case 'dinheiro': $badgeClass = 'bg-info text-dark'; break;
                                case 'higiene': $badgeClass = 'bg-secondary'; break;
                                case 'brinquedos': $badgeClass = 'bg-danger'; break;
                            }
                            ?>
                            <span class="badge <?= $badgeClass ?> px-2.5 py-1.5 rounded-pill text-uppercase" style="font-size: 0.75rem;">
                                <?= htmlspecialchars($doacao['tipo']) ?>
                            </span>
                        </td>
                        <td>
                            <span class="text-muted small">
                                <?= !empty($doacao['descricao']) ? htmlspecialchars($doacao['descricao']) : '<em class="text-white-50">Sem descrição detalhada</em>' ?>
                            </span>
                        </td>
                        <td class="fw-semibold text-dark-blue"><?= htmlspecialchars($doacao['quantidade']) ?></td>
                        <td>
                            <i class="bi bi-calendar3 text-muted me-1"></i>
                            <?= date('d/m/Y', strtotime($doacao['data_doacao'])) ?>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center gap-2">
                                <!-- Botão Editar -->
                                <a href="editar.php?id=<?= $doacao['id'] ?>" class="btn btn-outline-primary btn-custom-sm d-flex align-items-center" title="Editar registro">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                                <!-- Botão Excluir -->
                                <a href="excluir.php?id=<?= $doacao['id'] ?>" class="btn btn-outline-danger btn-custom-sm btn-excluir d-flex align-items-center" data-confirm="Deseja mesmo excluir o registro desta doação de '<?= htmlspecialchars($doacao['quantidade']) ?>' feita por <?= htmlspecialchars($doacao['doador_nome']) ?>? Esta ação é irreversível." title="Excluir registro">
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
</body>
</html>
