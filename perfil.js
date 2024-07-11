function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //Obrigado Stack Overflow vc é um anjo
}
function slugSemOSlug(texto) {
    return removerAcentos(texto)
        .toLowerCase() 
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, '') 
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '') 
        .replace(/-+$/, '');
}
async function obterConteudoDoArquivo() {
    const caminhoArquivo = '/Usuarios/templateUsuarios.html';
    try {
        const response = await fetch(caminhoArquivo);
        if (!response.ok) {
            throw new Error('Não foi possível obter o template HTML.');
        }
        const conteudoHTML = await response.text();
        return conteudoHTML;
    } catch (error) {
        console.error('Erro ao obter o arquivo:', error.message);
        return null;
    }
}
async function gerarDocHTML(perfil) {
    try {
        const conteudoHTML = await obterConteudoDoArquivo();
        if (conteudoHTML) {
            return conteudoHTML
                .replace(/\${perfil\.nome}/g, perfil.nomeUsuario)
                .replace(/\${perfil\.email}/g, perfil.email)
                .replace(/\${perfil\.descricao}/g, perfil.descricao || '');
        } else {
            console.error("Conteúdo HTML inválido ou não obtido.");
            return null;
        }
    } catch (error) {
        console.error('Erro ao gerar o documento HTML:', error);
        return null;
    }
}

async function verificarSePaginaExiste(nomePerfil) {
    try {
        const resposta = await fetch(`/Usuarios/${nomePerfil}`);
        return resposta.ok;
    } catch (error) {
        console.error('Erro ao verificar a existência da página:', error);
        return false;
    }
}
async function GerarHTMLPerfil(perfil, criarPaginaUsuario) {
    try {
        const conteudoHTML = await gerarDocHTML(perfil);
        if (conteudoHTML) {
            const nomePerfil = `${slugSemOSlug(perfil.nomeUsuario)}.html`;
            const infoPerfil = await fetch(`http:45.239.246.197:10100/infUsuario/${nomePerfil}`);
            const dataPerfil = {
                //TODO: Adicionar mais informações ao fetch e criar um sistema que procure a data em que o perfil do usuario foi criado
                nome: nomePerfil,
                email: infoPerfil,
                conteudo: conteudoHTML,
                criarPaginaUsuario: criarPaginaUsuario ? 'true' : 'false'
            };
            const resposta = await fetch('http://45.239.246.197:10100/salvarHTML', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataPerfil)
            });
            if (resposta.ok) {
                window.location.href = `/Usuarios/${nomePerfil}`;
            } else {
                console.error("Erro ao salvar o arquivo no servidor.");
            }
        }
    } catch (error) {
        console.error("Erro ao gerar o arquivo HTML:", error);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const nomePerfilBotao = document.getElementById('nomePerfil');
    if (nomePerfilBotao) {
        nomePerfilBotao.addEventListener('click', async function () {
            const perfil = verificarLogin();
            if (perfil) {
                const criarPaginaUsuario = !await verificarSePaginaExiste(slugSemOSlug(perfil.nomeUsuario));
                await GerarHTMLPerfil(perfil, criarPaginaUsuario);
            } else {
                console.error("Nenhum perfil encontrado.");
            }
        });
    } else {
        console.error("Botão de perfil não encontrado.");
    }
});