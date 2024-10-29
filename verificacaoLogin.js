function verificarLogin() {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString !== null) {
        const usuario = JSON.parse(usuarioString);
        usuario.nomeUsuario = usuario.nomeUsuario.trim();
        mostrarElementosUsuarioLogado(usuario);
        elementosLoginRegistro('none');
        const nomeUsuarioPerfil = document.getElementById('nomeUsuarioPerfil');
        if (nomeUsuarioPerfil) {
            nomeUsuarioPerfil.textContent = usuario.nomeUsuario;
        }
        const nomePerfilBotao = document.getElementById('nomePerfil');
        if (nomePerfilBotao) {
            nomePerfilBotao.dataset.url = `/Usuarios/${usuario.nomeUsuario}`;
        }
        const email = document.getElementById('email');
        return usuario;
    } else {
        elementosLoginRegistro('block');
        ocultarElementosUsuarioLogado();
        return null;
    }
}
// top 10 piores codigos
// Nome autoexplicativo

function mostrarElementosUsuarioLogado(usuario) {
    const secaoUsuario = document.getElementById('secaoUsuario');
    const nomeUsuarioBarra = document.getElementById('nomeUsuarioBarra');
    if (secaoUsuario && nomeUsuarioBarra) {
        nomeUsuarioBarra.textContent = usuario.nomeUsuario;
        secaoUsuario.style.display = 'flex';
    } else {
        console.error('Elementos de usuário não encontrados no DOM.');
    }
}
// Nome autoexplicativo 
function ocultarElementosUsuarioLogado() {
    const secaoUsuario = document.getElementById('secaoUsuario');
    if (secaoUsuario) {
        secaoUsuario.style.display = 'none';
    }
}
function elementosLoginRegistro(argumento) {
    const elementosLogin = document.querySelectorAll('.Login');
    const elementosRegistro = document.querySelectorAll('.Registro');
    elementosLogin.forEach(elemento => elemento.style.display = `${argumento}`);
    elementosRegistro.forEach(elemento => elemento.style.display = `${argumento}`);
}
window.addEventListener('DOMContentLoaded', () => { // Caso pagina carregar/regarregar, fazer
    verificarLogin(); 
    const botaoSair = document.getElementById('sairPerfil');
    if (botaoSair) {
        botaoSair.addEventListener('click', () => { // Se queres sair, pode sair
            localStorage.removeItem('usuario'); // Limpa o localstorage com credeciais
            window.location.reload(); // Recarrega a pagina
        });
    } else {
        console.error('Botão de sair não encontrado no DOM.'); // Caso der erro 
    }
});