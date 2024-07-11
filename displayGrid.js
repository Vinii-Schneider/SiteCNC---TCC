document.addEventListener('DOMContentLoaded', function listarDiretoriosHTML() {
    const pastaListas = "/ProjetosSubmetidos/"; // Diretorio dos projetos
    fetch(pastaListas) // Se a pasta existir, prosseguir
        .then(resposta => resposta.text())
        .then(html => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(html, 'text/html');
            const links = htmlDoc.querySelectorAll('a[href]');
            // Lista abaixo com todos os projetos para listar um por um
            const lista = document.getElementsByClassName("gridLista")[0];
            links.forEach(link => {
                let href = link.getAttribute('href');
                // Se a URL do projeto começar com "https://" e etc ele aceita
                if (!href.startsWith("http://") && !href.startsWith("https://")) {
                    href = pastaListas + href;
                }
                // Cuidado para não listar pastas e afins
                if (href !== '../' && !href.trim().endsWith('/')) {
                    if (!/\b(Name|Last modified|Size)\b/i.test(link.textContent) && !href.trim().endsWith('?C=D;O=A')) {
                        // Elementos da listagem do apache estavam sendo listados junto com os projetos, por isso a comparação ^^
                        fetch(href)
                            .then(response => response.text()) // Se resposta, pegar texto da resposta
                            .then(projetoHtml => {
                                const projetoDoc = parser.parseFromString(projetoHtml, 'text/html');
                                const imagemContainer = projetoDoc.querySelector('.imagemContainer img');
                                // Substitui a imagem por uma padrão caso o projeto nao tenha uma
                                const imagemSrc = imagemContainer ? imagemContainer.getAttribute('src') : '/padrao1.jpg';
                                imagemSrc.alt = "Teste";
                                const li = document.createElement("li");
                                const a = document.createElement("a");
                                const imaji = document.createElement("img");
                                // Cria imagem com base no enviado pelo usuario caso ela exista dentro do HTML
                                imaji.src = imagemSrc;
                                
                                a.href = href;
                                let textoFormatado = link.textContent.replace('.html', '').replace(/-/g, ' '); 
                                // Limpa o nome quando for exibir no grid, sem a extensão e hifens
                                a.textContent = textoFormatado;
                                li.appendChild(imaji);
                                imaji.alt = "";
                                li.appendChild(a);
                                lista.appendChild(li);
                            })
                            .catch(erro => {
                                console.error("Erro ao carregar projeto!", erro);
                            });
                    }
                }
            });
        })
        .catch(erro => {
            console.error("Algo deu errado ao obter a lista de projetos!", erro);
        });
});
