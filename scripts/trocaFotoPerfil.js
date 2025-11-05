document.addEventListener('DOMContentLoaded', async () => {
    try {
        const usuario = verificarLogin(); 
        if (!usuario || !usuario.nomeUsuario) {
            console.error('Usuário não autenticado.');
            return;
        }

        const imagemPerfil = document.getElementById('imagemPerfil');
        const fotoPerfil   = document.getElementById('fotoPerfil');
        const fotoPerfil2  = document.getElementById('fotoPerfil2');

        const resposta = await fetch(`http://45.239.246.197:10100/obterFotoPerfil/${usuario.nomeUsuario}`);
        const data = await resposta.json();

        if (data.foto_perfil) {
            const url = `http://45.239.246.197:10101${data.foto_perfil}?t=${Date.now()}`;
            if (imagemPerfil) imagemPerfil.src = url;
            if (fotoPerfil)   fotoPerfil.src   = url;
            if (fotoPerfil2)  fotoPerfil2.src  = url;
        } else {
            if (imagemPerfil) imagemPerfil.src = '/assets/usuarioPadrao.png';
            if (fotoPerfil)   fotoPerfil.src   = '/assets/usuarioPadrao.png';
            if (fotoPerfil2)  fotoPerfil2.src  = '/assets/usuarioPadrao.png';
        }

    } catch (error) {
        console.error('Erro ao carregar foto de perfil:', error);
    }
});
