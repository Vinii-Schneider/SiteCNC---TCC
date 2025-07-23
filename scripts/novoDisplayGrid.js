document.addEventListener('DOMContentLoaded', () => {
    const urlParts = window.location.pathname.split('/');
    const lastPart = urlParts[urlParts.length - 1]; // Último segmento da URL

    // Verifica se a URL é para todos os projetos
    let endpoint;
    let usuarioNome = null;

    if (lastPart === 'projetos') {
        // Endpoint para buscar todos os projetos
        endpoint = "http://45.239.246.197:10100/projetos"; // Este endpoint busca todos os projetos
    } else {
        usuarioNome = lastPart.split('.')[0];
        console.log('Buscando projetos para:', usuarioNome); // Log para debug
        endpoint = "http://45.239.246.197:10100/projetos"; // Endpoint padrão para buscar projetos de um usuário
    }

    // Faz a requisição
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' // Explicitamente pedir JSON
        },
        // Envia o corpo apenas se houver um nome de usuário
        body: JSON.stringify(usuarioNome ? { usuario: usuarioNome } : {})
    })
    .then(async resposta => {
        // Verificar o tipo de conteúdo da resposta
        const contentType = resposta.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            // Log do conteúdo não-JSON para debug
            const text = await resposta.text();
            console.error('Resposta não-JSON recebida:', text);
            throw new Error("Resposta não-JSON recebida do servidor");
        }
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        
        return resposta.json();
    })
    .then(dados => {
        console.log('Dados recebidos:', dados); // Log para debug
        const lista = document.querySelector(".gridLista");
        if (!lista) {
            throw new Error("Elemento .gridLista não encontrado");
        }
        lista.innerHTML = ''; // Limpeza de array antes de recebimento
        if (!Array.isArray(dados)) {
            throw new Error("Dados recebidos não são um array");
        }
        dados.forEach(projeto => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const imaji = document.createElement('img');
            imaji.src = `/ImagensProjetos/${projeto.src_imagem}` || '/assets/padrao1.jpg';
            imaji.alt = 'Imagem do projeto';
            a.href = `/ProjetosSubmetidos/${projeto.uuid}.html`;
            a.textContent = projeto.nome_projeto || 'Sem título';
            li.appendChild(imaji);
            li.appendChild(a);
            lista.appendChild(li);
        });
    })
    .catch(erro => {
        console.error("Erro ao obter projetos:", erro);
        // Mostrar erro para o usuário
        const lista = document.querySelector(".gridLista");
        if (lista) {
            lista.innerHTML = `
                <div class="erro">
                    <p>Erro ao carregar projetos.</p>
                    <p>Detalhes: ${erro.message}</p>
                </div>
            `;
        }
    });
});
