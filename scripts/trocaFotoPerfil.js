document.addEventListener('DOMContentLoaded', async () => {
    try {
        const usuario = verificarLogin(); 
        if (!usuario || !usuario.nomeUsuario) {
            console.error('Usuário não autenticado.');
            return;
        }

        const imagemPerfil = document.getElementById('imagemPerfil');
        const fotoPerfil  = document.getElementById('fotoPerfil');
        
        const resposta = await fetch(`http://45.239.246.197:10100/obterFotoPerfil/${usuario.nomeUsuario}`, {
            method: 'GET',
        });

        const data = await resposta.json();

        if (data.foto_perfil) {
            fotoPerfil.src   = `http://45.239.246.197:10101${data.foto_perfil}?t=${Date.now()}`;
            imagemPerfil.src = `http://45.239.246.197:10101${data.foto_perfil}?t=${Date.now()}`;
        } else {
            imagemPerfil.src = '/assets/usuarioPadrao.png';
        }
    } catch (error) {
        console.error('Erro ao carregar foto de perfil:', error);
    }
});