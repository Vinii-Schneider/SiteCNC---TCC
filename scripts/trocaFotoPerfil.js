document.addEventListener('DOMContentLoaded', async () => {
    try {
        const usuarioLogado = verificarLogin(); 
        if (!usuarioLogado?.nomeUsuario) return console.error('Usuário não autenticado.');

        const { nomeUsuario } = usuarioLogado;
        const caminhoAtual = window.location.pathname;

        const imagemPerfil = document.getElementById('imagemPerfil'); 
        const fotoPerfil   = document.getElementById('fotoPerfil');   
        const fotoPerfil2  = document.getElementById('fotoPerfil2');  
        const fotoPerfil3  = document.getElementById('fotoPerfil3');  

        console.log('--- [INFO PERFIS] ---');
        console.log('Usuário logado:', nomeUsuario);
        console.log('Caminho atual:', caminhoAtual);

        const [dataLogado, dataVisitado] = await Promise.all([
            obterInfoUsuario(nomeUsuario),
            caminhoAtual.includes('/Usuarios/') ? obterInfoUsuario(extrairUsuarioDePath(caminhoAtual)) : null
        ]);

        if (dataLogado?.usuario?.foto_perfil_url) {
            const url = dataLogado.usuario.foto_perfil_url;
            if (fotoPerfil)  fotoPerfil.src  = url;
            if (fotoPerfil2) fotoPerfil2.src = url;
        }

        if (caminhoAtual.includes('/Usuarios/') && imagemPerfil) {
            const url = dataVisitado?.usuario?.foto_perfil_url || '/assets/usuarioPadrao.png';
            imagemPerfil.src = url;
        }

        else if (caminhoAtual.includes('/ProjetosSubmetidos/')) {
            const autorElem = document.querySelector('.autor') || document.querySelector('.elementosSubtitulo a');
            const nomeAutor = autorElem?.textContent.trim();
            if (nomeAutor && fotoPerfil3) {
                const fotoAutor = await obterFotoPerfil(nomeAutor);
                fotoPerfil3.src = fotoAutor || '/assets/usuarioPadrao.png';
            }
        }

        console.log('--- [FIM LOG PERFIS] ---');

    } catch (error) {
        console.error('Erro ao carregar fotos de perfil:', error);
    }
});

async function obterInfoUsuario(nomeUsuario) {
    try {
        const resp = await fetch(`http://45.239.246.197:10100/infUsuario/${nomeUsuario}`);
        return await resp.json();
    } catch {
        return null;
    }
}

async function obterFotoPerfil(nomeUsuario) {
    const data = await obterInfoUsuario(nomeUsuario);
    return data?.usuario?.foto_perfil_url || null;
}

function extrairUsuarioDePath(caminho) {
    const nome = caminho.split('/Usuarios/')[1]?.replace('.html', '') || '';
    return nome.charAt(0).toUpperCase() + nome.slice(1);
}
