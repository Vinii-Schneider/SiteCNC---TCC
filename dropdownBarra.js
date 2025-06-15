document.getElementById('secaoUsuario').addEventListener('click', function() {

    // Caso pressione a seção do usuário, alterna a visibilidade do dropdown
    var dropdown = document.getElementById('Dropdown');

    // Verifica se o dropdown está visível e alterna seu estado
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
});

// Fecha o dropdown se clicar fora da seção do usuário
window.onclick = function(evento) {

    // Verifica se o clique foi fora da seção do usuário e do dropdown
    if (!evento.target.matches('#secaoUsuario') && !evento.target.closest('#secaoUsuario')) {
        var dropdown = document.getElementById('Dropdown');

        // Se o dropdown estiver visível, esconde o mesmo
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    }
}

// Fechao dropdown ao rolar a página
let ultimaRolagemCima = 0;

// Seleciona a barra de navegação e adiciona um evento de rolagem
const barra = document.querySelector('.navegacao');

// Adiciona um evento de rolagem para esconder ou mostrar a barra de navegação e o dropdown
window.addEventListener("scroll", function() {

    // Obtém a posição atual da rolagem e compara com a última posição
    let rolagemCima = window.pageYOffset || document.documentElement.scrollTop;
    var dropdown = document.getElementById('Dropdown');

    // Se a rolagem para cima for maior que a última rolagem para cima e maior que 50 pixels, esconde a barra e o dropdown
    if (rolagemCima > ultimaRolagemCima && rolagemCima > 50) {
        barra.style.top = "-55px";
        dropdown.style.top = "-200px";
    } else {
        barra.style.top = "0px";
        dropdown.style.top = "100%";
    }

    // Adiciona uma transição suave para a barra e o dropdown
    barra.style.transition = "top 0.2s ease-in-out";
    dropdown.style.transition = "top 0.2s ease-in-out";
    ultimaRolagemCima = rolagemCima;
});

// Adiciona um evento de clique a todos os botões com o atributo data-url
const botoes = document.querySelectorAll('button[data-url]');
botoes.forEach(botao => {

    // Para cada botão, adiciona um evento de clique que redireciona para a URL especificada no atributo data-url
    botao.addEventListener('click', function() {
        const url = botao.getAttribute('data-url');
        window.location.href = url;
    });          
});