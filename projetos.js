function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function slugSemOSlug2(texto) {
    return removerAcentos(texto)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
async function obterConteudoDoArquivo2() {
    const caminhoArquivo = '/templateProjetos.html';
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
async function gerarDocHTML2() {
    try {
        const conteudoHTML = await obterConteudoDoArquivo2();
        return conteudoHTML;
    } catch (error) {
        console.error('Erro ao gerar o documento HTML:', error);
        return null;
    }
}
async function GerarHTMLProjeto2(projeto, imagem) {
    try {
        const caminhoUser = document.getElementById('nomeUsuarioBarra').textContent.toLowerCase() + '.html';
        const nomeProjetoSemCorrecao = slugSemOSlug2(projeto.titulo);
        const nomeProjeto = `${nomeProjetoSemCorrecao}` + '.html'; // Adicionar a extensão .html corretamente aqui
        let conteudoHTML = await gerarDocHTML2(projeto);
        if (conteudoHTML) {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); 
            const ano = String(dataAtual.getFullYear()).slice(-2); 
            const horas = String(dataAtual.getHours()).padStart(2, '0');
            const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
            const dataHoraFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
            const descricao2 = document.getElementById('Descricao').value;
            conteudoHTML = conteudoHTML
                .replace(/\${projeto.titulo}/g, projeto.titulo)
                .replace(/\${projeto.nome}/g, projeto.nome)
                .replace(/\${projeto.descricao}/g, descricao2)
                .replace(/\${projeto.dataCriacao}/g, dataHoraFormatada)
                .replace(/\${projeto.caminho}/g, caminhoUser);
            const imagemContainerDiv = `<div class="imagemContainer"><img src="${imagem.replace('/var/www/html', '')}" alt="Imagem do projeto"></div>`;
            conteudoHTML = conteudoHTML.replace('<div class="conteudo">', `<div class="conteudo">${imagemContainerDiv}`);
            const dataProjeto = new FormData();
            dataProjeto.append('arquivo2', new Blob([conteudoHTML], { type: 'text/html' }), nomeProjeto);
            dataProjeto.append('projeto', JSON.stringify({ nome: nomeProjeto, conteudo: conteudoHTML }));
            fetch('http://45.239.246.197:10100/salvarHTML', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: nomeProjeto, conteudo: conteudoHTML }),
            }).then(resposta => {
                if (resposta.ok) {
                    window.location.href = `/ProjetosSubmetidos/${nomeProjeto}`;
                } else {
                    console.error("Erro ao salvar o arquivo no servidor.");
                }
            });
        } else {
            console.error("Conteúdo HTML inválido ou não obtido.");
        }
    } catch (error) {
        console.error("Erro ao gerar o arquivo HTML:", error);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploadarquivo').addEventListener('click', async function (ação) {
        ação.preventDefault();
        const titulo = document.getElementById('Titulo').value;
        const proprietarioElemento = document.getElementById('nomeUsuarioBarra');
        const InputArquivo = document.getElementById('Input');
        if (InputArquivo.files.length > 0) {
            const arquivo = InputArquivo.files[0];
            const DataFormulario = new FormData();
            DataFormulario.append('arquivo', arquivo);
            DataFormulario.append('proprietario', proprietarioElemento.textContent);
            try {
                const resposta = await fetch('http://45.239.246.197:10100/uploadarquivo', {
                    method: 'POST',
                    body: DataFormulario,
                });
                if (!resposta.ok) {
                    throw new Error(`Erro no envio do arquivo: ${resposta.statusText}`);
                }
                const dados = await resposta.json();
                console.log('Arquivo enviado com sucesso:', dados);
                
                const projeto = {
                    titulo: titulo,
                    nome: document.getElementById('nomeUsuarioBarra').textContent,
                    //caminho: document.getElementById('nomeUsuarioBarra').textContent.toLowerCase() + '.html',
                    descricao: document.getElementById('Descricao').textContent
                };
                alert(document.getElementById('Descricao').textContent);
                GerarHTMLProjeto2(projeto, dados.caminhoArquivo);
            } catch (error) {
                console.error('Erro no envio do arquivo:', error.message);
            }
        } else {
            console.error('Selecione um arquivo para upload');
        }
    });
});