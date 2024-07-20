function parseData(dateTimeString) {
    const [dataParte, horaParte] = dateTimeString.split(' - ');
    const [dia, mes, ano] = dataParte.split('/').map(Number);
    const [horas, minutos] = horaParte ? horaParte.split(':').map(Number) : [0, 0];
    // Ajusta o ano para o formato de 4 dígitos
    const anoCompleto = ano < 100 ? 2000 + ano : ano;
    // Cria um objeto Date com a data e hora fornecida
    return new Date(anoCompleto, mes - 1, dia, horas, minutos);
}
document.addEventListener('DOMContentLoaded', function listarDiretoriosHTML() {
    const pastaListas = "/ProjetosSubmetidos/"; // Diretorio dos projetos
    fetch(pastaListas) // Se a pasta existir, prosseguir
        .then(resposta => resposta.text())
        .then(html => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(html, 'text/html');
            const links = htmlDoc.querySelectorAll('a[href]');
            const projetos = [];     
            links.forEach(link => {
                let href = link.getAttribute('href');
                // Se a URL do projeto começar com "https://" e etc ele aceita
                if (!href.startsWith("http://") && !href.startsWith("https://")) {
                    href = pastaListas + href;
                }
                // Cuidado para não listar pastas e afins
                if (href !== '../' && !href.trim().endsWith('/')) {
                    if (!/\b(Name|Last modified|Size)\b/i.test(link.textContent) && !href.trim().endsWith('?C=D;O=A')) {
                        fetch(href)
                        .then(response => response.text()) // Se resposta, pegar texto da resposta
                        .then(projetoHtml => {
                            const parser = new DOMParser();
                            const projetoDoc = parser.parseFromString(projetoHtml, 'text/html');
                            // Seleciona o elemento <h1> e a data de criação
                            const h1 = projetoDoc.querySelectorAll('h1');
                            const titulo = h1.length > 0 ? h1[0].textContent : 'Título não encontrado';
                            // Exemplo de data no formato <li class="dataCriacao">20/07/24 - 00:38</li>
                            const dataCriacaoElement = projetoDoc.querySelector('.dataCriacao');
                            const dataCriacaoText = dataCriacaoElement ? dataCriacaoElement.textContent.trim() : '';
                            // Converte a data para um objeto Date
                            const dataCriacao = parseData(dataCriacaoText);
                            const imagemContainer = projetoDoc.querySelector('.imagemContainer img');
                            const imagemSrc = imagemContainer ? imagemContainer.getAttribute('src') : '/padrao1.jpg';
                            // Adiciona as informações do projeto à lista
                            projetos.push({
                                titulo,
                                imagemSrc,
                                href,
                                dataCriacao
                            });
                            // Ordena os projetos por data (mais recente primeiro)
                            projetos.sort((a, b) => b.dataCriacao - a.dataCriacao);
                            // Atualiza a lista na página
                            const lista = document.getElementsByClassName("gridLista")[0];
                            lista.innerHTML = ''; // Limpa a lista existente
                            projetos.forEach(projeto => {
                                const li = document.createElement('li');
                                const a = document.createElement('a');
                                const imaji = document.createElement('img');
                                imaji.src = projeto.imagemSrc;
                                imaji.alt = 'Imagem do projeto';
                                a.href = projeto.href;
                                a.textContent = projeto.titulo;
                                li.appendChild(imaji);
                                li.appendChild(a);
                                lista.appendChild(li);
                            });
                        })
                        .catch(erro => {
                            console.error('Erro ao carregar projeto!', erro);
                        });
                    }
                }
            });
        })
        .catch(erro => {
            console.error("Algo deu errado ao obter a lista de projetos!", erro);
        });
});