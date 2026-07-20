/**
 * Scripts de Interatividade Frontend
 * Atividade Extensionista II - UNINTER
 * JavaScript Puro (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Confirmação de Exclusão (Doadores e Doações)
    const btnExcluir = document.querySelectorAll('.btn-excluir');
    btnExcluir.forEach(function(botao) {
        botao.addEventListener('click', function(event) {
            const mensagem = botao.getAttribute('data-confirm') || 'Tem certeza que deseja excluir este registro?';
            if (!confirm(mensagem)) {
                event.preventDefault(); // Cancela o clique se o usuário clicar em "Cancelar"
            }
        });
    });

    // 2. Máscara de Telefone no Cadastro de Doadores
    const inputTelefone = document.getElementById('telefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // 3. Pesquisa de Tabelas em Tempo Real (Busca Instantânea no Listar)
    const inputPesquisa = document.getElementById('pesquisa-tabela');
    const tabelaAlvo = document.getElementById('tabela-filtrar');
    if (inputPesquisa && tabelaAlvo) {
        inputPesquisa.addEventListener('keyup', function() {
            const termo = inputPesquisa.value.toLowerCase();
            const linhas = tabelaAlvo.querySelectorAll('tbody tr');
            
            linhas.forEach(function(linha) {
                const textoLinha = linha.textContent.toLowerCase();
                if (textoLinha.indexOf(termo) > -1) {
                    linha.style.display = '';
                } else {
                    linha.style.display = 'none';
                }
            });
        });
    }

    // 4. Fechamento Automático de Alertas de Sucesso/Erro após 5 segundos
    const alertas = document.querySelectorAll('.alert');
    alertas.forEach(function(alerta) {
        setTimeout(function() {
            // Verifica se o Bootstrap está ativo e usa a API de fechamento de alertas se disponível, senão remove do DOM
            if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
                const bsAlert = new bootstrap.Alert(alerta);
                bsAlert.close();
            } else {
                alerta.style.opacity = '0';
                alerta.style.transition = 'opacity 0.5s ease';
                setTimeout(() => alerta.remove(), 500);
            }
        }, 5000);
    });
});
