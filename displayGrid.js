function parseData(dateTimeString) {

    // Pega a string de data e hora no formato "dd/mm/aa - hh:mm"
    const [dataParte, horaParte] = dateTimeString.split(' - ');
    const [dia, mes, ano] = dataParte.split('/').map(Number);
    const [horas, minutos] = horaParte ? horaParte.split(':').map(Number) : [0, 0];

    // Ajusta o ano para o formato de 4 dígitos
    const anoCompleto = ano < 100 ? 2000 + ano : ano;

    // Cria um objeto Date com a data e hora fornecida
    return new Date(anoCompleto, mes - 1, dia, horas, minutos);
}

document.addEventListener('DOMContentLoaded', function listarDiretoriosHTML() {

    // Define o caminho para a pasta onde os projetos estão armazenados
    const pastaListas = "/ProjetosSubmetidos/";
    // Verifica se a pasta existe e prossegue com a listagem dos projetos

    fetch(pastaListas)

        // Transforma a resposta em texto
        .then(resposta => resposta.text())

        // Converte o HTML da resposta em um documento DOM
        .then(html => {

            // Cria um parser DOM para analisar o HTML e converter para um documento
            const parser = new DOMParser();

            // Analisa o HTML e cria um documento DOM
            const htmlDoc = parser.parseFromString(html, 'text/html');

            // Seleciona todos os links <a> com o atributo href
            const links = htmlDoc.querySelectorAll('a[href]');

            // Cria um array para armazenar os projetos encontrados
            const projetos = [];     

            // Para cada link encontrado, verifica se é um projeto válido
            links.forEach(link => {

                // Obtém o atributo href do link
                let href = link.getAttribute('href');

                // Se a URL do projeto começar com "https://" e etc ele aceita
                if (!href.startsWith("http://") && !href.startsWith("https://")) {
                    href = pastaListas + href;
                }

                // Parâmetro href apenas para links que não sejam o diretório pai ou links de metadados
                if (href !== '../' && !href.trim().endsWith('/')) {

                    // Verifica se o link não contém palavras como "Name", "Last modified" ou "Size" (padrão do apache)
                    if (!/\b(Name|Last modified|Size)\b/i.test(link.textContent) && !href.trim().endsWith('?C=D;O=A')) {

                        // Então, faz uma requisição para obter o conteúdo do projeto
                        fetch(href)

                        // Transforma a resposta em texto
                        .then(response => response.text())

                        // Converte o HTML do projeto em um documento DOM
                        .then(projetoHtml => {

                            // Cria um parser DOM para analisar o HTML do projeto
                            const parser = new DOMParser();
                            const projetoDoc = parser.parseFromString(projetoHtml, 'text/html');
                            
                            // Seleciona o título do projeto, que é o primeiro <h1> encontrado
                            const h1 = projetoDoc.querySelectorAll('h1');

                            // Se não encontrar um <h1>, define um título padrão
                            const titulo = h1.length > 0 ? h1[0].textContent : 'Título não encontrado';

                            // Exemplo de data no formato <li class="dataCriacao">20/07/24 - 00:38</li>
                            const dataCriacaoElement = projetoDoc.querySelector('.dataCriacao');

                            const dataCriacaoText = dataCriacaoElement ? dataCriacaoElement.textContent.trim() : '';

                            // Converte a data para um objeto Date
                            const dataCriacao = parseData(dataCriacaoText);

                            // Seleciona a imagem do projeto, se existir
                            const imagemContainer = projetoDoc.querySelector('.imagemContainer img');

                            // Se não encontrar uma imagem, define uma imagem padrão
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

                            // Verifica se a lista existe antes de tentar atualizá-la
                            lista.innerHTML = ''; 

                            // Para cada projeto, cria um item de lista com a imagem e o link
                            projetos.forEach(projeto => {

                                // Cria os elementos de lista e link, com imagem, titulo e link do projeto
                                const li = document.createElement('li');
                                const a = document.createElement('a');
                                const imaji = document.createElement('img');
                                imaji.src = projeto.imagemSrc;
                                imaji.alt = 'Imagem do projeto';
                                a.href = projeto.href;
                                a.textContent = projeto.titulo;

                                // Adiciona a data de criação como um atributo data no link
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