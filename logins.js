function updateBarra(usuario) {
    const loginLinks = document.getElementsByClassName('Login');
    const registroLinks = document.getElementsByClassName('Registro');
    for (let i = 0; i < loginLinks.length; i++) { // Percorre os elementos de login
        loginLinks[i].style.display = 'none';
    }
    for (let i = 0; i < registroLinks.length; i++) { // Percorre os elementos de registro
        registroLinks[i].style.display = 'none';
    } 
    const secaoUsuario = document.getElementById('secaoUsuario');
    const fotoUsuario = document.getElementById('fotoPerfil');
    //TODO: adicionar uma foto linkada ao usuário que será salva no MySQL
    const nomeUsuario = document.getElementById('nomeUsuario');
    // Atualiza os elementos da barra de navegação com os dados do usuário
    nomeUsuario.textContent = usuario.nome;
    secaoUsuario.style.display = 'block';
    // Exibe info do user e a mostra com o estilo block
    var nomeUsuarioBarra = document.getElementById("nomeUsuarioBarra");
    nomeUsuarioBarra.textContent = nomeUsuario;
}
async function envioSenha(envio) {
    envio.preventDefault(); 
    const nomeUsuario = document.getElementById('nomeUsuario').value; 
    const senhaEnviada = document.getElementById('senha').value; // Vixi tenho que encriptar
    try {
        const response = await fetch('http://45.239.246.197:10100/login', {
            method: 'POST',
            body: JSON.stringify({ 
                nomeUsuario: nomeUsuario,
                senhaEnviada: senhaEnviada
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const mensagemErro = document.getElementById('mensagemErro');
        if (!response.ok) {
            const erroData = await response.json();
            mensagemErro.textContent = erroData.error || 'Erro ao realizar o login';
            mensagemErro.style.display = 'block'; // Mostra a msg de erro até então invisivel
            alert(erroData.error || 'Erro ao realizar o login'); 
            return; 
        }
        const data = await response.json();
        console.log(data);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        alert("Perfil verificado: " + JSON.stringify(nomeUsuario));
        updateBarra(nomeUsuario);
        window.location.href = 'http://45.239.246.197:10101/projetos'; // Redirecionamento caso login/registro realizado
    } catch (error) {
        console.error('Erro ao realizar o login:', error);
        mensagemErro.textContent = 'Erro no servidor';
        mensagemErro.style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', function () { 
    document.getElementById('botaoLogin').addEventListener('click', envioSenha); // Ouvando o usuario clicar no botão
}); 
