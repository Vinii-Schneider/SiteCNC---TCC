window.addEventListener('DOMContentLoaded', () => {
    const usuario = verificarLogin(); 
    const botaoVerificar = document.getElementById('Verificar');
    const avisoDiv = document.getElementById('avisoID');

    if (!botaoVerificar || !avisoDiv) return; // evita erros se elementos não existirem

    botaoVerificar.addEventListener('click', async () => {
        const ID = document.getElementById('ID').value.trim();

        if (!ID) {
            avisoDiv.textContent = 'Informe o ID da CNC!';
            avisoDiv.style.color = 'red';
            return;
        }

        try {
            const res = await fetch(`http://45.239.246.197:10100/verificaID/${ID}`);
            const data = await res.json();

            if (data.existe) {
                avisoDiv.textContent = 'ID encontrado no servidor!';
                avisoDiv.style.color = 'green';

                // garante que temos o nome do usuário antes de mostrar
                const nomeUsuario = usuario?.nomeUsuario ?? 'desconhecido';
                alert(`ID verificado com sucesso! Será que você é mesmo ${nomeUsuario}?`);
            } else {
                avisoDiv.textContent = 'ID não registrado. Verifique o ID.';
                avisoDiv.style.color = 'red';
            }
        } catch (err) {
            console.error('Erro ao verificar ID:', err);
            avisoDiv.textContent = 'Erro de conexão com o servidor.';
            avisoDiv.style.color = 'red';
        }
    });
});
