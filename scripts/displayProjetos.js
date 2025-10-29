document.addEventListener('DOMContentLoaded', function() {
    
    const usuario = document.getElementById('nomeUsuarioBanner')?.textContent || null;
    const externo = !window.location.pathname.endsWith('/public/projetos.html');
    
    let projetos = [];
    let animacaoPausada = false;
    let IDanimação = null;

    try {
        const resposta = fetch("http://45.239.246.197:10100/projetos", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({usuario, externo})
        });

        resposta.then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }
            return res.json();

        }).then(data => {
            console.log('Dados recebidos:', data);
            projetos = data;
            
            // Seleciona e cria o carrossel se houver projetos
            if (projetos && Array.isArray(projetos) && projetos.length > 0) {
                const listaProjetosDiv = document.querySelector('.listaProjetos');
                criarCarrosselInfinito(listaProjetosDiv, projetos);
                iniciarAnimacao();

                const carrosselDiv = document.querySelector('.carrossel-container');
        
                if (carrosselDiv) {
                    carrosselDiv.addEventListener('mouseenter', () => {
                        animacaoPausada = true;
                    });

                    carrosselDiv.addEventListener('mouseleave', () => {
                        animacaoPausada = false;
                    });
                }
                
            } else {

                // Mensagem quando não há projetos
                const listaProjetosDiv = document.querySelector('.listaProjetos');

                listaProjetosDiv.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <p>Nenhum projeto encontrado.</p>
                        <p>Crie seu primeiro projeto para ver aqui!</p>
                    </div>
                `;
            }
        }).catch(error => {
            console.error('Erro no processamento:', error);

            const listaProjetosDiv = document.querySelector('.listaProjetos');

            // Mensagem de erro onde o carrossel deveria estar
            listaProjetosDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc3545;">
                    <p>Erro ao carregar projetos.</p>
                    <p>Contate o administrador imediatamente.</p>
                </div>
            `;
        });

    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
    }

    function criarCarrosselInfinito(container, projetos) {
        container.innerHTML = `
            <div class="carrossel-container">
                <div class="listaProjetos-carrossel"></div>
            </div>
        `;
        
        const carrosselContainer = container.querySelector('.listaProjetos-carrossel');
        
        // Duplicata de projetos para efeito infinito
        const projetosDuplicados = [...projetos, ...projetos, ...projetos];
        
        // Cria os elementos do carrossel um por um
        projetosDuplicados.forEach(async (projeto) => { 
            const imagemUrl = `/ImagensProjetos/${projeto.src_imagem}`;
            
            const projetoDiv = document.createElement('div');
            projetoDiv.classList.add('projetoItem');

            const nomeUsuario = await fetch(`http://45.239.246.197:10100/buscaID/${projeto.user_id}`)
                .then(res => res.json())
                .then(data => data.encontrado ? data.usuario : "Usuário não encontrado")
                .catch(() => "Erro ao carregar usuário");

            projetoDiv.innerHTML = `
                <img src="${imagemUrl}" alt="${projeto.nome_projeto}" class="projetoImagem">
                <div class="projetoConteudo">
                    <h3>${projeto.nome_projeto}</h3>
                    <p>${projeto.descricao || 'Sem descrição disponível'}</p>
                    <p>Autor: ${nomeUsuario}</p> 
                    <a href="/ProjetosSubmetidos/${projeto.uuid}.html">Ver Projeto</a>
                </div>
            `;
            carrosselContainer.appendChild(projetoDiv);
        });
    }
    

    function iniciarAnimacao() {

        // Se for 2 ou menos projetos, não inicia a animação
        if (projetos.length <= 2) return;
        
        const carrossel = document.querySelector('.listaProjetos-carrossel');
        if (!carrossel) return;
        
        // Calcula a largura total do item (incluindo margem de 20px)
        const larguraItem = 280 + 20;
        let posição = 0;
        const tamanhoTotal = larguraItem * projetos.length;
        const velocidade = 0.5;

        function animar() {
            if (!animacaoPausada) {
                posição -= velocidade;
                
                if (Math.abs(posição) >= tamanhoTotal * 2) {
                    posição += tamanhoTotal;
                }
                
                carrossel.style.transform = `translateX(${posição}px)`;
            }
            
            // Continua a animação
            IDanimação = requestAnimationFrame(animar);
        }
        
        animar();
    }

    window.addEventListener('beforeunload', () => {
        if (IDanimação) {
            cancelAnimationFrame(IDanimação);
        }
    });
});