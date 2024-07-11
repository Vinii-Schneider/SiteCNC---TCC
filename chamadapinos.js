function EnviarChamadaPino() {
    const botoes = document.querySelectorAll('.controlepinosdefato input[type="image"]');
    botoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const numeroPino = botao.getAttribute('data-pino');
            const argumento = "pino";
            EnvioGenerico(argumento, numeroPino);
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    EnviarChamadaPino();
});