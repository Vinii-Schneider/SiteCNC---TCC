/*document.addEventListener('DOMContentLoaded', function () {
    let indiceProjeto = 1;
    document.getElementById('uploadarquivo').addEventListener('click', async function (ação) {
        ação.preventDefault();
        const proprietario = document.getElementById('nomeUsuarioBarra');
        // TODO: linkar proprietário com o arquivo a ser enviado
        // TODO: adicionar suporte a proprietários de outros websites
        const InputArquivo = document.getElementById('Input');
        if (InputArquivo.files.length > 0) {
            const arquivo = InputArquivo.files[0];
            const DataFormulario = new FormData();
            DataFormulario.append('arquivo', arquivo);
            DataFormulario.append('proprietario', proprietario.textContent);
            DataFormulario.append('indice', indiceProjeto);
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
                indiceProjeto++;
                console.log('Indice:', indiceProjeto);
            } catch (error) {
                console.error('Erro no envio do arquivo:', error.message);
            }
        } else {
            console.error('Selecione um arquivo para upload');
        }
    });
});
*/