document.getElementById('secaoUsuario').addEventListener('click', function() {
    var dropdown = document.getElementById('Dropdown');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
});
// Fechar o dropdown ao clicar fora dele
window.onclick = function(evento) {
    if (!evento.target.matches('#secaoUsuario') && !evento.target.closest('#secaoUsuario')) {
        var dropdown = document.getElementById('Dropdown');
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    }
}
// Fechar o dropdown e esconder a barra de navegação ao rolar a página para baixo
let ultimaRolagemCima = 0;
const barra = document.querySelector('.navegacao');
window.addEventListener("scroll", function() {
    let rolagemCima = window.pageYOffset || document.documentElement.scrollTop;
    var dropdown = document.getElementById('Dropdown');
    if (rolagemCima > ultimaRolagemCima && rolagemCima > 50) {
        barra.style.top = "-55px";
        dropdown.style.top = "-200px";
    } else {
        barra.style.top = "0px";
        dropdown.style.top = "100%";
    }
    barra.style.transition = "top 0.2s ease-in-out";
    dropdown.style.transition = "top 0.2s ease-in-out";
    ultimaRolagemCima = rolagemCima;
});
const botoes = document.querySelectorAll('button[data-url]');
botoes.forEach(botao => {
    botao.addEventListener('click', function() {
        const url = botao.getAttribute('data-url');
        window.location.href = url;
    });          
});