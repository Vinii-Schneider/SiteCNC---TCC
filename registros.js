async function envioRegistro() {
    try {
        const nomeUsuarioNovo = document.getElementById('nomeUsuarioNovo').value;
        const senhaEnviadaNova = document.getElementById('senha').value;
        const emailEnviadoNovo = document.getElementById('email').value;
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
        if (!response.ok) {
            const erroData = await response.json();
            console.error('Erro ao enviar o registro:', erroData);
            throw new Error(erroData.error || 'Erro ao enviar o registro');
        }
        alert('Usuário ' + JSON.stringify(nomeUsuarioNovo) + ' Registrado com sucesso');
        window.location.href = 'http://45.239.246.197:10101/login.html';
    } catch (error) {
        console.error('Erro:', error);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('botaoRegistro').addEventListener('click', envioRegistro);
});