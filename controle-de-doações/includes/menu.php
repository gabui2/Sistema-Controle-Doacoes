<?php
/**
 * Componente do Menu Lateral (Sidebar) e Barra de Topo.
 * Atividade Extensionista II - UNINTER
 * 
 * Requer a variável $base_path definida no arquivo que o inclui.
 */
$base_path = isset($base_path) ? $base_path : '';
$pagina_corrente = basename($_SERVER['PHP_SELF']);
?>
<!-- Estrutura Principal do Layout -->
<div class="wrapper">
    <!-- Barra Lateral (Sidebar) -->
    <nav id="sidebar">
        <div class="sidebar-header d-flex align-items-center">
            <i class="bi bi-heart-fill text-danger me-2 fs-4"></i>
            <span class="h5 m-0 fw-bold tracking-tight">DoaAmor</span>
        </div>

        <ul class="list-unstyled components">
            <li class="<?= ($pagina_corrente == 'dashboard.php') ? 'active' : '' ?>">
                <a href="<?= $base_path ?>dashboard.php">
                    <i class="bi bi-speedometer2"></i> Painel Inicial
                </a>
            </li>
            
            <li class="<?= (strpos($_SERVER['PHP_SELF'], 'doadores') !== false) ? 'active' : '' ?>">
                <a href="<?= $base_path ?>doadores/listar.php">
                    <i class="bi bi-people-fill"></i> Doadores
                </a>
            </li>

            <li class="<?= (strpos($_SERVER['PHP_SELF'], 'doacoes') !== false) ? 'active' : '' ?>">
                <a href="<?= $base_path ?>doacoes/listar.php">
                    <i class="bi bi-gift-fill"></i> Doações
                </a>
            </li>

            <li class="<?= ($pagina_corrente == 'relatorios.php') ? 'active' : '' ?>">
                <a href="<?= $base_path ?>relatorios.php">
                    <i class="bi bi-file-earmark-bar-graph-fill"></i> Relatórios
                </a>
            </li>
            
            <li class="mt-4 border-top border-secondary pt-3">
                <a href="<?= $base_path ?>logout.php" class="text-danger">
                    <i class="bi bi-box-arrow-right text-danger"></i> Sair do Sistema
                </a>
            </li>
        </ul>
    </nav>

    <!-- Conteúdo da Página -->
    <div id="content">
        <!-- Menu Superior (Navbar) -->
        <nav class="navbar navbar-expand-lg navbar-custom d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <h4 class="m-0 fw-bold text-dark-blue">
                    <?php
                    // Define o título do cabeçalho de acordo com o arquivo
                    switch($pagina_corrente) {
                        case 'dashboard.php': echo 'Painel de Controle'; break;
                        case 'listar.php': 
                            echo (strpos($_SERVER['PHP_SELF'], 'doadores') !== false) ? 'Gerenciar Doadores' : 'Gerenciar Doações'; 
                            break;
                        case 'cadastrar.php': 
                            echo (strpos($_SERVER['PHP_SELF'], 'doadores') !== false) ? 'Cadastrar Novo Doador' : 'Registrar Nova Doação'; 
                            break;
                        case 'editar.php': 
                            echo (strpos($_SERVER['PHP_SELF'], 'doadores') !== false) ? 'Editar Doador' : 'Editar Doação'; 
                            break;
                        case 'relatorios.php': echo 'Relatório de Doações'; break;
                        default: echo 'Sistema de Controle de Doações';
                    }
                    ?>
                </h4>
            </div>
            
            <!-- Perfil Usuário Autenticado -->
            <div class="d-flex align-items-center bg-light px-3 py-2 rounded-pill">
                <i class="bi bi-person-circle text-primary me-2 fs-5"></i>
                <span class="fw-semibold text-dark me-1" style="font-size: 0.9rem;">
                    <?= isset($_SESSION['usuario_nome']) ? explode(' ', $_SESSION['usuario_nome'])[0] : 'Usuário' ?>
                </span>
                <span class="badge bg-primary rounded-pill text-white ms-1" style="font-size: 0.7rem;">Admin</span>
            </div>
        </nav>
        
        <!-- Abre o container do conteúdo da página -->
        <div class="main-container">
