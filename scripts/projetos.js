function removerAcentos(texto) {
    // Remove acentos de caracteres Unicode
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function slugSemOSlug2(texto) {
    // Remove acentos, converte para minúsculas, substitui espaços por hífens e etc
    return removerAcentos(texto)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Função para obter o conteúdo do arquivo HTML do template
async function obterConteudoDoArquivo2() {
    const caminhoArquivo = '/assets/templateProjetos.html';
    try {
        const response = await fetch(caminhoArquivo);
        if (!response.ok) {
            throw new Error('Não foi possível obter o arquivo.');
        }
        const conteudoHTML = await response.text();
        return conteudoHTML;
    } catch (error) {
        console.error('Erro ao obter o arquivo:', error.message);
        return null;
    }
}

// Função para gerar o documento HTML a partir do template
async function gerarDocHTML2() {
    try {
        // Chama a função para obter o conteúdo do arquivo HTML
        const conteudoHTML = await obterConteudoDoArquivo2();
        return conteudoHTML;
    } catch (error) {
        console.error('Erro ao gerar o documento HTML:', error);
        return null;
    }
}

// Função para gerar o HTML do projeto
async function GerarHTMLProjeto2(projeto, imagem) {
    try {

        // Obtém o caminho do perfil do usuário e o nome do projeto
        const caminhoUser = document.getElementById('nomeUsuarioBarra').textContent.toLowerCase() + '.html';

        // Para a URL, o nome do projeto deve ser sem acentos e com extensão .html
        const nomeProjetoSemCorrecao = slugSemOSlug2(projeto.titulo);

        // Adiciona a extensão .html corretamente aqui
        const nomeProjeto = `${nomeProjetoSemCorrecao}` + '.html';

        // Obter o conteúdo do template HTML
        let conteudoHTML = await gerarDocHTML2(projeto);
        // Se o template HTML foi obtido com sucesso, faça:
        if (conteudoHTML) {

            // Obtem a data e hora atual com base no relógio do servidor
            const dataAtual = new Date();

            // Formatar a data e hora atual
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); 
            const ano = String(dataAtual.getFullYear()).slice(-2); 
            const horas = String(dataAtual.getHours()).padStart(2, '0');
            const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
            const dataHoraFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
            const descricao2 = document.getElementById('Descricao').value;

            // Substituir os elementos do template HTML com os dados do projeto
            conteudoHTML = conteudoHTML
                .replace(/\${projeto.titulo}/g, projeto.titulo)
                .replace(/\${projeto.nome}/g, projeto.nome)
                .replace(/\${projeto.descricao}/g, descricao2)
                .replace(/\${projeto.dataCriacao}/g, dataHoraFormatada)
                .replace(/\${projeto.caminho}/g, caminhoUser);

            // Adicionar a imagem ao HTML
            const imagemContainerDiv = `<div class="imagemContainer"><img src="${imagem.replace('/var/www/html', '')}" alt="Imagem do projeto"></div>`;

            // Inserir a nova div com a imagem no conteúdo HTML
            conteudoHTML = conteudoHTML.replace('<div class="conteudo">', `<div class="conteudo">${imagemContainerDiv}`);

            // dataProjeto é um objeto FormData que será enviado ao servidor
            const dataProjeto = new FormData();
            // Adiciona o arquivo HTML ao FormData
            dataProjeto.append('arquivo2', new Blob([conteudoHTML], { type: 'text/html' }), nomeProjeto);
            
            // Adiciona o nome do projeto ao FormData
            dataProjeto.append('projeto', JSON.stringify({ nome: nomeProjeto, conteudo: conteudoHTML }));

            // Envia o FormData para o servidor
            const resposta = await fetch('http://45.239.246.197:10100/salvarHTML', {
                method: 'POST',
                body: dataProjeto,
            });
            if (resposta.ok) {
                const dados = await resposta.json();
                const uuid = dados.id;
                window.location.href = `http://45.239.246.197:10101/ProjetosSubmetidos/${uuid}.html`;
            } else {
                console.error("Erro ao salvar o arquivo no servidor.");
            }
        } else {
            console.error("Conteúdo HTML inválido ou não obtido.");
        }
    } catch (error) {
        console.error("Erro ao gerar o arquivo HTML:", error);
    }
}
document.addEventListener('DOMContentLoaded', function () {

    // Quando o botão de upload for clicado, executa a função
    document.getElementById('uploadarquivo').addEventListener('click', async function (acao) {

        // Previne o comportamento padrão de um botão de formulário
        acao.preventDefault();

        // Pega o valor do campo de texto do título e remove espaços extras
        const titulo = document.getElementById('Titulo').value.trim();

        // Obtém o elemento do nome do usuário e o campo de arquivo
        const proprietarioElemento = document.getElementById('nomeUsuarioBarra');
        const InputArquivo = document.getElementById('Input');

        if (!titulo) {
            console.error('Título não pode ser vazio');
            return;
        }

        if (InputArquivo.files.length > 0) {
            const arquivo = InputArquivo.files[0];
            const DataFormulario = new FormData();
            DataFormulario.append('arquivo', arquivo);
            DataFormulario.append('proprietario', proprietarioElemento.textContent.trim());
            DataFormulario.append('titulo', titulo);
            DataFormulario.append('descricao', document.getElementById('Descricao').value.trim()); 
            try {
                // Envia o arquivo para o servidor no endpoint especificado
                const resposta = await fetch('http://45.239.246.197:10100/uploadarquivo', {
                    method: 'POST',
                    body: DataFormulario,
                });
                // Debugging da resposta do servidor
                console.log('Resposta do servidor:', resposta);

                if (!resposta.ok) {
                    throw new Error(`Erro no envio do arquivo: ${resposta.statusText}`);
                }

                // Obtém os dados retornados pelo servidor (Assíncrono)
                const dados = await resposta.json();

                // Debugging dos dados retornados pelo servidor
                console.log('Arquivo enviado com sucesso:', dados);

                const projeto = {
                    titulo: titulo,
                    nome: proprietarioElemento.textContent.trim(), 
                    descricao: document.getElementById('Descricao').value.trim(), 
                };

                // Verifica se o caminho da imagem foi retornado
                let caminho = '/var/www/html/ImagensProjetos/' + dados.caminhoImagem;

                // Gera o HTML do projeto fazendo o link com o caminho da imagem
                GerarHTMLProjeto2(projeto, caminho);

                // Exibe o caminho da imagem no console
                console.log(caminho);
            } catch (error) {
                console.error('Erro no envio do arquivo:', error.message);
            }
        } else {
            console.error('Selecione um arquivo para upload');
        }
    });
});
