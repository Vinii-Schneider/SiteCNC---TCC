function verificarLogin() {

    // Verifica se o usuário está logado verificando o localStorage (Armazenamento local do navegador)
    const usuarioString = localStorage.getItem('usuario');

    // Se o usuário estiver logado e seu nome de usuário não estiver vazio, mostra os elementos do usuário logado
    if (usuarioString !== null) {

        // Converte a string JSON armazenada no localStorage de volta para um objeto JavaScript
        const usuario = JSON.parse(usuarioString);

        // Realiza um trim() no nome de usuário para remover espaços em branco desnecessários
        usuario.nomeUsuario = usuario.nomeUsuario.trim();

        // Mostra os elementos do usuário logado, oculta os elementos de login e registro,
        mostrarElementosUsuarioLogado(usuario);

        // E atualiza a flag de visibilidade dos elementos de login e registro
        elementosLoginRegistro('none');

        // Atualiza o nome de usuário na barra de navegação
        const nomeUsuarioPerfil = document.getElementById('nomeUsuarioPerfil');
        if (nomeUsuarioPerfil) {
            nomeUsuarioPerfil.textContent = usuario.nomeUsuario;
        }

        // Atualiza o botão de perfil com o nome de usuário e a URL do perfil
        const nomePerfilBotao = document.getElementById('nomePerfil');
        if (nomePerfilBotao) {
            nomePerfilBotao.dataset.url = `/Usuarios/${usuario.nomeUsuario}`;
        }
        const email = document.getElementById('email');
        return usuario;

    // Se o usuário não estiver logado, exibe os elementos de login e registro
    } else {
        elementosLoginRegistro('block');
        ocultarElementosUsuarioLogado();
        return null;
    }
}

function mostrarElementosUsuarioLogado(usuario) {

    // Mostra os elementos do usuário logado, como a seção de usuário e o nome de usuário na barra
    const secaoUsuario = document.getElementById('secaoUsuario');
    const nomeUsuarioBarra = document.getElementById('nomeUsuarioBarra');
    if (secaoUsuario && nomeUsuarioBarra) {
        nomeUsuarioBarra.textContent = usuario.nomeUsuario;
        secaoUsuario.style.display = 'flex';
    } else {
        console.error('Elementos de usuário não encontrados no DOM.');
    }
}

// Oculta os elementos de usuário logado, como a seção de usuário
function ocultarElementosUsuarioLogado() {
    const secaoUsuario = document.getElementById('secaoUsuario');
    if (secaoUsuario) {
        secaoUsuario.style.display = 'none';
    }
}

// Função para mostrar ou ocultar os elementos de login e registro com base no argumento passado
function elementosLoginRegistro(argumento) {

    // Seleciona todos os elementos com as classes 'Login' e 'Registro' e altera seu estilo de exibição
    const elementosLogin = document.querySelectorAll('.Login');
    const elementosRegistro = document.querySelectorAll('.Registro');

    // Para cada elemento de login e registro, define o estilo de exibição com base no argumento
    elementosLogin.forEach(elemento => elemento.style.display = `${argumento}`);
    elementosRegistro.forEach(elemento => elemento.style.display = `${argumento}`);
}

window.addEventListener('DOMContentLoaded', () => { 

    // Caso a pagina seja carregada, verifica se o usuário está logado toda vez
    verificarLogin(); 

    // Caso o usuario realizar logout, adiciona um evento de clique ao botão de sair
    const botaoSair = document.getElementById('sairPerfil');

    if (botaoSair) {
        botaoSair.addEventListener('click', () => { 
            // Remove o usuário do localStorage e recarrega a página
            localStorage.removeItem('usuario'); 

            // recarrega a página para atualizar o estado da página
            window.location.reload(); 
        });
    } else {
        console.error('Botão de sair não encontrado no DOM.'); 
    }
});