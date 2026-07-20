# Sistema Web de Controle de Doações 

**Atividade Extensionista II**  
**Curso:** Análise e Desenvolvimento de Sistemas (ADS)  
**Instituição:** Centro Universitário Internacional UNINTER  

---

##  Descrição do Projeto

Este projeto consiste em um **Sistema Web de Controle de Doações** desenvolvido como parte prática da disciplina de **Atividade Extensionista II**. O objetivo central é auxiliar instituições beneficentes, ONGs, igrejas e associações comunitárias a organizarem, registrarem e consultarem doações recebidas de forma simples, ágil e segura.

O sistema permite o cadastro completo de doadores da comunidade, registro detalhado de itens e recursos doados (alimentos, vestuário, brinquedos, higiene, dinheiro), e disponibiliza um painel estatístico e relatórios analíticos prontos para impressão para fins de prestação de contas.

---

##  Tecnologias Utilizadas

Este projeto foi construído respeitando as restrições acadêmicas clássicas, utilizando puramente linguagens de programação e marcação fundamentais, sem a inclusão de frameworks que pudessem mascarar o aprendizado da arquitetura básica:

*   **Linguagem Principal:** PHP 8.2 (Utilizando PDO para conexão segura)
*   **Banco de Dados:** MySQL (Pronto para phpMyAdmin)
*   **Interface Visual:** HTML5, CSS3, Bootstrap 5 (Linkado via CDN para manter os arquivos limpos) e Bootstrap Icons
*   **Lógica Frontend:** JavaScript Puro (Vanilla JS, sem bibliotecas secundárias como jQuery)

---

##  Requisitos do Sistema

Para executar este sistema em seu computador local, você precisará de:

1.  **Servidor Web Local com PHP:** PHP 8.0 ou superior (Recomendado PHP 8.2)
2.  **Servidor de Banco de Dados:** MySQL 5.7 ou superior / MariaDB
3.  **Ambiente Integrado:** XAMPP, WampServer, Laragon ou similar.
4.  **Navegador Web:** Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari.

---

##  Instalação e Configuração

Siga o passo a passo abaixo para rodar o projeto em seu ambiente local (exemplo usando o **XAMPP**):

### 1. Clonar ou Copiar os Arquivos
Mova a pasta completa do projeto `Sistema-Controle-Doacoes` para dentro do diretório de publicação do seu servidor local:
*   No XAMPP: `C:\xampp\htdocs\`
*   No WampServer: `C:\wamp64\www\`

### 2. Configurar o Banco de Dados (phpMyAdmin)
1.  Inicie os módulos **Apache** e **MySQL** no Painel de Controle do XAMPP.
2.  Abra o seu navegador e acesse: `http://localhost/phpmyadmin/`
3.  No menu superior, clique em **Importar** (Import).
4.  Clique em **Escolher Arquivo** e selecione o arquivo `/database/banco.sql` localizado na pasta do projeto.
5.  Clique em **Executar** (Go) no final da página.
6.  O banco de dados `sistema_doacoes` será criado automaticamente com todas as tabelas e dados fictícios para teste.

### 3. Ajustar Conexão com o Banco (Se Necessário)
Se você estiver utilizando uma configuração diferente de usuário ou senha para o seu MySQL, abra o arquivo `includes/conexao.php` e altere os campos abaixo:
```php
$host = 'localhost';
$dbname = 'sistema_doacoes';
$username = 'root'; // Seu usuário MySQL (padrão XAMPP: root)
$password = '';     // Sua senha MySQL (padrão XAMPP: vazio)
```

### 4. Acessar o Sistema
Abra o navegador e digite a URL:
```text
http://localhost/Sistema-Controle-Doacoes/
```

---

##  Usuário de Teste Padrão

Utilize as credenciais abaixo para efetuar o login e acessar o painel de controle administrativo:

*   **E-mail de Acesso:** `admin@admin.com`
*   **Senha de Acesso:** `admin123`

*(Nota: A senha está salva de forma criptografada no banco usando o algoritmo nativo `BCRYPT` por meio da função `password_hash()` do PHP, garantindo a conformidade com as diretrizes de segurança da informação).*

---

##  Estrutura de Pastas e Arquivos

O projeto está organizado de forma modular para facilitar a manutenção e evitar códigos duplicados:

```text
Sistema-Controle-Doacoes/
├── css/
│   └── style.css            # Estilos personalizados (Menu, Cards, Tabelas, Formulários)
├── database/
│   └── banco.sql            # Script SQL completo com tabelas e carga inicial de dados
├── doacoes/
│   ├── cadastrar.php        # Formulário e lógica de inclusão de doações
│   ├── editar.php           # Formulário e lógica de edição de doações
│   ├── excluir.php          # Script de exclusão física de doações (Prepared Statement)
│   └── listar.php           # Tabela com listagem, busca e filtragem de doações
├── doadores/
│   ├── cadastrar.php        # Formulário e lógica de inclusão de doadores
│   ├── editar.php           # Formulário e lógica de edição de doadores
│   ├── excluir.php          # Script de exclusão física de doadores (com Cascade Delete)
│   └── listar.php           # Tabela com listagem e busca instantânea de doadores
├── includes/
│   ├── autenticacao.php     # Inicialização de sessões, verificação de login e sanitização XSS
│   ├── conexao.php          # Estabelece a conexão segura PDO MySQL
│   ├── footer.php           # Rodapé padrão do layout e injeção de scripts JavaScript
│   └── menu.php             # Menu lateral responsivo e cabeçalho do perfil administrativo
├── js/
│   └── script.js            # Interatividades (máscara de telefone, buscas, alertas auto-fecháveis)
├── dashboard.php            # Painel central com indicadores estatísticos e últimos registros
├── index.php                # Roteador inicial de acessibilidade de sessões
├── login.php                # Tela de Login com validação backend
├── logout.php               # Encerramento e destruição completa de sessões
├── relatorios.php           # Relatório consolidado para impressão e prestação acadêmica
└── README.md                # Manual de documentação do software
```

---

##  Demonstração das Telas (Layout & Interface)

A interface do sistema foi cuidadosamente planejada seguindo uma identidade profissional, sóbria e altamente responsiva (Azul Corporativo, Branco e Cinza Claro):

1.  **Tela de Login:** Centralizada, com background em gradiente azul profundo, ícones representativos nos inputs e validação imediata.
2.  **Dashboard Administrativo:** Apresenta cards informativos estruturados em formato bento-grid (Total de Doadores, Total de Doações, Categorias Ativas e Alerta de Campanhas), além de tabelas limpas de atividades recentes e gráficos de barras com o volume percentual por tipo.
3.  **Listagem de Doadores e Doações:** Tabelas modernas com efeitos hover, botões de ação compactos e pesquisa em tempo real que filtra os resultados de forma instantânea conforme a digitação do usuário.
4.  **Cadastro e Edição:** Formulários limpos e intuitivos com ícones descritivos em cada campo, máscara dinâmica de telefone `(XX) XXXXX-XXXX` no frontend e validações rígidas no backend.
5.  **Página de Relatórios:** Um layout de consolidação corporativa com KPIs numéricos, tabela por categorias e uma assinatura oficial de validação no rodapé, otimizada nativamente para impressão em PDF/A4.

---

##  Segurança Aplicada

O sistema conta com proteções essenciais integradas de forma nativa:
*   **Prepared Statements (PDO):** Todas as instruções SQL que lidam com variáveis externas utilizam placeholders `:nome_campo`, impedindo ataques de **SQL Injection**.
*   **Sanitização contra XSS:** Implementado um helper universal `sanitize()` que aplica `htmlspecialchars` em todas as saídas de dados, neutralizando injeções de scripts maliciosos nos formulários.
*   **Segurança de Sessão:** Verificação ativa em todas as páginas administrativas. Se um usuário tentar acessar diretamente via URL sem login, será automaticamente redirecionado à página inicial de autenticação.
*   **Criptografia de Senhas:** Senhas nunca são salvas em texto puro. Utiliza-se a função nativa `password_hash` com BCRYPT, tornando impossível reverter os hashes em caso de vazamentos acidentais.
