async function envioRegistro() {

    // Função para enviar o registro do usuário
    try {

        // Obtém os valores dos campos de entrada
        const nomeUsuarioNovo = document.getElementById('nomeUsuarioNovo').value;
        const senhaEnviadaNova = document.getElementById('senha').value;
        const emailEnviadoNovo = document.getElementById('email').value;

        // Verifica se os campos estão preenchidos e manda solicitação para o servidor
        const response = await fetch('http://45.239.246.197:10100/registro', {

            method: 'POST',
            body: JSON.stringify({ 
                nomeUsuarioNovo: nomeUsuarioNovo,
                senhaEnviadaNova: senhaEnviadaNova,
                emailEnviadoNovo: emailEnviadoNovo
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Se a resposta não for ok, lança um erro
        if (!response.ok) {
            const erroData = await response.json();
            console.error('Erro ao enviar o registro:', erroData);
            throw new Error(erroData.error || 'Erro ao enviar o registro');
        }

        // Janela de alerta para confirmar o registro e chamar a atenção do usuário
        alert('Usuário ' + JSON.stringify(nomeUsuarioNovo) + ' Registrado com sucesso');

        // Redireciona para a página de login após o registro
        window.location.href = 'http://45.239.246.197:10101/public/login.html';
    } catch (error) {
        console.error('Erro:', error);
    }
}
document.addEventListener('DOMContentLoaded', function () {

    // Se o botão de se registrar for clicado, chama a função de envio de registro
    document.getElementById('botaoRegistro').addEventListener('click', envioRegistro);
});