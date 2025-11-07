document.addEventListener('DOMContentLoaded', async () => {
    
    const lista = document.querySelector(".gridLista");
    const usuario = document.getElementById('nomeUsuarioBanner')?.textContent || null;
    const externo = !window.location.pathname.endsWith('/public/projetos.html');

    async function carregarProjetos() {
        lista.innerHTML = '<div class="loading">Carregando projetos...</div>';

        try {
            const resposta = await fetch("http://45.239.246.197:10100/projetos", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ usuario, externo })
            });

            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            const projetos = await resposta.json();

            lista.innerHTML = '';
            if (projetos.length === 0) {
                lista.innerHTML = '<div class="empty">Nenhum projeto encontrado</div>';
                return;
            }

            projetos.forEach(projeto => {
                const item = document.createElement('li');
                item.className = 'projeto-item';
                
                const link = document.createElement('a');
                link.href = `/ProjetosSubmetidos/${projeto.uuid}.html`;
                link.className = 'projeto-link';

                const img = document.createElement('img');
                img.src = `/ImagensProjetos/${projeto.src_imagem}`;
                img.alt = projeto.nome_projeto || 'Projeto sem título';
                img.className = 'projeto-imagem';
                img.onerror = () => img.src = '/assets/padrao1.jpg';

                const titulo = document.createElement('span');
                titulo.className = 'projeto-titulo';
                titulo.textContent = projeto.nome_projeto || 'Sem título';

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
                    <button onclick="window.location.reload()">Tentar novamente</button>
                </div>
            `;
        }
    }

    await carregarProjetos(); 

    const botaoGrid = document.getElementById('vistaGrid');
    const botaoLista = document.getElementById('vistaLista');

    botaoGrid.addEventListener('click', () => {
        lista.classList.remove('lista');
        localStorage.setItem('modoExibicao', 'grid');
    });

    botaoLista.addEventListener('click', () => {
        lista.classList.add('lista');
        localStorage.setItem('modoExibicao', 'lista');
    });

    const modoSalvo = localStorage.getItem('modoExibicao');
    if (modoSalvo === 'lista') lista.classList.add('lista');

    const campoBusca = document.getElementById('campoBusca');
    campoBusca.addEventListener('input', async (e) => {
        const termo = e.target.value.trim().toLowerCase();
        if (termo === '') {
            await carregarProjetos(); 
        } else {
            const itens = lista.querySelectorAll('.projeto-item');
            itens.forEach(item => {
                const titulo = item.querySelector('.projeto-titulo').textContent.toLowerCase();
                item.style.display = titulo.includes(termo) ? '' : 'none';
            });
        }
    });
});
