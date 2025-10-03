window.addEventListener('DOMContentLoaded', async () => {
    const usuario = verificarLogin(); 
    const botaoVerificar = document.getElementById('Verificar');
    const avisoDiv = document.getElementById('avisoID');
    const divTeste = document.querySelector('.teste2');

    if (!botaoVerificar || !avisoDiv || !usuario) return;

    let temCNC = false;

    try {
        const checkCNC = await fetch(`http://45.239.246.197:10100/userTemCNC/${usuario.nomeUsuario}`);
        const cncData = await checkCNC.json();
        temCNC = cncData.temCNC ?? false;

        if (temCNC) {
            avisoDiv.textContent = `Você já possui uma CNC associada: ${cncData.maquina_id}`;
            avisoDiv.style.color = 'blue';
        }

        if (divTeste) {
            divTeste.style.display = "none";
        }

    } catch (err) {
        console.error('Erro ao verificar CNC do usuário:', err);
    }

    botaoVerificar.addEventListener('click', async () => {
        const ID = document.getElementById('ID').value.trim();
        if (!ID) {
            avisoDiv.textContent = 'Informe o ID da CNC!';
            avisoDiv.style.color = 'red';
            return;
        }

        // Se o usuário já tem CNC, pergunta se quer registrar outra
        if (temCNC) {
            const confirmacao = confirm(`Você já possui uma CNC registrada. Deseja associar outra CNC com ID ${ID}?`);
            if (!confirmacao) {
                avisoDiv.textContent = 'Registro de nova CNC cancelado. Redirecionando para sua CNC...';
                avisoDiv.style.color = 'blue';
                
                window.location.href = 'http://45.239.246.197:10101/public/minhaCNC.html';
                return;
            }
        }

        try {
            const res = await fetch(`http://45.239.246.197:10100/verificaID/${ID}`);
            const data = await res.json();

            if (data.existe) {
                avisoDiv.textContent = 'ID encontrado no servidor!';
                avisoDiv.style.color = 'green';

                const nomeUsuario = usuario?.nomeUsuario ?? 'desconhecido';
                alert(`ID verificado com sucesso! Será que você é mesmo ${nomeUsuario}?`);

                const resposta = await fetch(`http://45.239.246.197:10100/associarID`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ID, usuario: nomeUsuario })
                });

                if (resposta.ok) {
                    const dados = await resposta.json();
                    console.log('ID associado com sucesso:', dados);
                    window.location.href = 'http://45.239.246.197:10101/public/projetos.html';
                } else {
                    const erro = await resposta.json();
                    console.error("Erro ao associar ID ao usuário:", erro);
                    avisoDiv.textContent = 'Erro ao associar ID ao usuário.';
                    avisoDiv.style.color = 'red';
                }
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
