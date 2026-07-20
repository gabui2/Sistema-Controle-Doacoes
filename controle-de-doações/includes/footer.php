<?php
/**
 * Rodapé comum do sistema.
 * Atividade Extensionista II - UNINTER
 * 
 * Requer a variável $base_path definida no arquivo que o inclui.
 */
$base_path = isset($base_path) ? $base_path : '';
?>
        </div> <!-- Fim do .main-container -->

        <!-- Rodapé Visual -->
        <footer class="footer-custom">
            <div class="container-fluid d-flex flex-column flex-sm-row justify-content-between align-items-center">
                <span>&copy; <?= date('Y') ?> <strong>Sistema de Controle de Doações</strong> - Todos os direitos reservados.</span>
                <span class="mt-2 mt-sm-0 text-muted">
                    <i class="bi bi-mortarboard-fill me-1"></i> Atividade Extensionista II - <strong>UNINTER</strong> | ADS
                </span>
            </div>
        </footer>
    </div> <!-- Fim do #content -->
</div> <!-- Fim do .wrapper -->

<!-- Scripts Bootstrap 5 Bundle (JS + Popper) e Scripts Customizados -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="<?= $base_path ?>js/script.js"></script>
</body>
</html>
