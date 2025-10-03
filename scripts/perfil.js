function removerAcentos(texto) {
    // Remove acentos de caracteres Unicode
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
}

function slugSemOSlug(texto) {
    // Remove acentos, converte para minúsculas, substitui espaços por hífens e etc
    return removerAcentos(texto)
        .toLowerCase() 
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, '') 
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '') 
        .replace(/-+$/, '');
}

async function conteudoArquivo() {
    // Função para obter o conteúdo do arquivo HTML do template dos usuarios
    const caminhoArquivo = 'http://45.239.246.197:10100/assets/templateUsuarios.html';
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
    // Função para gerar o documento HTML a partir do template dos usuarios
    try {
        const conteudoHTML = await conteudoArquivo();
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

// Função para verificar se a pagina do perfil já existe
async function paginaExiste(nomePerfil) {
    try {
        const resposta = await fetch(`http://45.239.246.197:10100/Usuarios/${nomePerfil}`);
        return resposta.ok;
    } catch (error) {
        console.error('Erro ao verificar a existência da página:', error);
        return false;
    }
}

// Função para verificar se o usuário está logado e retornar o perfil
async function GerarHTMLPerfil(perfil, criarPaginaUsuario) {
    try {

        // Gerao html do perfil do usuário
        const conteudoHTML = await gerarDocHTML(perfil);

        if (conteudoHTML) {

            // Obtém o nome do perfil sem o slug e afins
            const nomePerfil = slugSemOSlug(perfil.nomeUsuario);

            // Faz uma requisição para obter as informações do perfil
            const infoPerfil = await fetch(`http://45.239.246.197:10100/infUsuario/${nomePerfil}`);

            // Subtitui o conteúdo do perfil no HTML pelos dados reais do usuário
            const dataPerfil = {
                nome: nomePerfil,
                email: await infoPerfil.text(),
                conteudo: conteudoHTML,

                // Se a pagina do usuário não existir, cria uma nova e manda a flag para o servidor
                criarPaginaUsuario: criarPaginaUsuario ? 'true' : 'false'
            };

            // Envia o conteúdo HTML para o servidor
            const resposta = await fetch('http://45.239.246.197:10100/salvarHTML', {
                method: 'POST',
                headers: {
                    // Define o cabeçalho Content-Type como JSON
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataPerfil)
            });
            
            // Retorna true se a resposta do salvamento for bem-sucedida
            return resposta.ok;
        }
    } catch (error) {
        console.error("Erro ao gerar o arquivo HTML:", error);
    }
    return false; 
}

document.addEventListener('DOMContentLoaded', function () {

    // Seleciona o botão de perfil e adiciona um evento de clique
    const nomePerfilBotao = document.getElementById('nomePerfil');
    if (nomePerfilBotao) {
        nomePerfilBotao.addEventListener('click', async function () {
            // Verifica se o usuário está logado e obtém o perfil
            const perfil = verificarLogin();

            // Se o perfil existir, gera o HTML e redireciona para a página do usuário
            if (perfil) {

                // Gera o nome do perfil sem o slug e afins
                const nomePerfil = slugSemOSlug(perfil.nomeUsuario);
                const criarPaginaUsuario = !await paginaExiste(nomePerfil);
                const sucesso = await GerarHTMLPerfil(perfil, criarPaginaUsuario);

                // Se o HTML foi gerado com sucesso e a página do perfil existe, redireciona para a página do perfil
                if (sucesso && await paginaExiste(nomePerfil)) {
                    window.location.href = `http://45.239.246.197:10101/Usuarios/${nomePerfil}.html`;
                } else {
                    // Se não foi possível gerar o HTML ou a página do perfil não existe, exibe um erro
                    console.error("Erro ao salvar ou redirecionar para a página do perfil.");
                }
            } else {
                console.error("Nenhum perfil encontrado.");
            }
        });
    } else {
        console.error("Botão de perfil não encontrado.");
    }
});
