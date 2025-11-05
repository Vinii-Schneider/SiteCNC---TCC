document.addEventListener('DOMContentLoaded', async () => {

    const usuario = document.getElementById('nomeUsuarioBanner')?.textContent || null;
    const lista = document.querySelector(".gridLista");
    const externo = !window.location.pathname.endsWith('/public/projetos.html');

    lista.innerHTML = '<div class="loading">Carregando projetos...</div>';

    try {

        const controller = new AbortController();

        const resposta = await fetch("http://45.239.246.197:10100/projetos", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({usuario, externo}),
            signal: controller.signal
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const contentType = resposta.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Resposta não é JSON');
        }

        const projetos = await resposta.json();
        console.log('Projetos recebidos:', projetos);

        lista.innerHTML = '';
        
        if (projetos.length === 0) {
            lista.innerHTML = '<div class="empty">Nenhum projeto encontrado</div>';
            return;
        }

        projetos.forEach(projeto => {
            const item = document.createElement('li');
            item.className = 'projeto-item';
            
            // Criar link
            const link = document.createElement('a');
            link.href = `/ProjetosSubmetidos/${projeto.uuid}.html`;
            link.className = 'projeto-link';
            
            // Criar imagem com fallback
            const img = document.createElement('img');
            img.src = `/ImagensProjetos/${projeto.src_imagem}`;
            img.alt = projeto.nome_projeto || 'Projeto sem título';
            img.className = 'projeto-imagem';
            img.onerror = function() {
                this.src = '/assets/padrao1.jpg';
            };
            
            // Criar título
            const titulo = document.createElement('span');
            titulo.className = 'projeto-titulo';
            titulo.textContent = projeto.nome_projeto || 'Sem título';
            
            // Montar estrutura
            link.appendChild(img);
            link.appendChild(titulo);
            item.appendChild(link);
            lista.appendChild(item);
        });

    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        lista.innerHTML = `
            <div class="error">
                <p>Erro ao carregar projetos</p>
                <p>${error.message}</p>
                <small>Verifique o console para detalhes</small>
                <button onclick="window.location.reload()">Tentar novamente</button>
            </div>
        `;
    }

    const botaoGrid     =  document.getElementById('vistaGrid');
    const botaoLista    = document.getElementById('vistaLista');
    const listaProjetos = document.querySelector('.gridLista');

    botaoGrid.addEventListener('click', () => {
    listaProjetos.classList.remove('lista');
    localStorage.setItem('modoExibicao', 'grid');
    });

    botaoLista.addEventListener('click', () => {
    listaProjetos.classList.add('lista');
    localStorage.setItem('modoExibicao', 'lista');
    });

    const modoSalvo = localStorage.getItem('modoExibicao');
    if (modoSalvo === 'lista') listaProjetos.classList.add('lista');

});