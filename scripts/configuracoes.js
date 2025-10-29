document.addEventListener('DOMContentLoaded', function() {
    const botaoPerfil       = document.getElementById('botaoPerfil');
    const botaoPreferencias = document.getElementById('botaoPreferencias');
    const botaoSeguranca    = document.getElementById('botaoSeguranca');
    const botaoInfoGeral    = document.getElementById('botaoInfoGeral');

    function mudaEstadoBotao(botaoAtivo) {
        const botoes = [botaoPerfil, botaoPreferencias, botaoSeguranca, botaoInfoGeral];
        botoes.forEach(botao => {
            if (botao === botaoAtivo) {
                botao.style.fontWeight = 'bold';
            } else {
                botao.style.fontWeight = 'normal';
            }
        });
    }

    function resetarDivForms() {
        const divForms     = document.getElementsByClassName("forms")[0];
        divForms.innerHTML = '';
    }


    botaoPerfil.addEventListener('click', async function() {
        mudaEstadoBotao(botaoPerfil);
        resetarDivForms();

        const divFormsNovo = document.getElementsByClassName("forms")[0];
        const usuario      = verificarLogin();
        
        try {
            const response = await fetch("http://45.239.246.197:10100/infUsuario/" + usuario.nomeUsuario);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar informações do usuário');
            }
            
            const data     = await response.json();
            const infoUser = data.usuario; 
            
            console.log('Informações do usuário:', infoUser);

            const dataCriacao = infoUser.data_criacao_conta ? 
            new Date(infoUser.data_criacao_conta).toLocaleDateString('pt-BR', {
                day   : '2-digit',
                month : '2-digit',
                year  : 'numeric',
                hour  : '2-digit',
                minute: '2-digit'
            }) : 
            'data não disponível';


            const novoConteudo = `

                <h2>Conta criada em ${dataCriacao}</h2>
                <p>Nome de usuário: ${infoUser.nomeUsuario}</p>
                <p>Email: ${infoUser.email}</p>
                ${infoUser.projetos && infoUser.projetos.length > 0 ? 
                    `<h3>Projetos (${infoUser.projetos.length})</h3>
                    <ul>
                        ${infoUser.projetos.map(projeto => 
                            `<li><a href="/ProjetosSubmetidos/${projeto.uuid}.html">${projeto.nome_projeto || 'Projeto sem nome'}</a></li>`
                        ).join('')}
                    </ul>` : 
                    '<p>Nenhum projeto encontrado</p>'
                }
                <h2>Máquinas registradas</h2>
                ${infoUser.maquina_id && infoUser.maquina_id.length > 0 ? 
                    `<ul>
                        ${infoUser.maquina_id.map(maquina_id => 
                            `<li>ID da Máquina: ${maquina_id}</li>`
                        ).join('')}
                    </ul>` :
                    '<p>Nenhuma máquina registrada</p>'
                }
            `;
            
            divFormsNovo.innerHTML = novoConteudo;

        } catch (error) {
            console.error('Erro:', error);
            divFormsNovo.innerHTML = '<p>Erro ao carregar perfil</p>';
        }
    });

    botaoPreferencias.addEventListener('click', function() {
        mudaEstadoBotao(botaoPreferencias);
        resetarDivForms();

        const divFormsNovo = document.getElementsByClassName("forms")[0];

        const novoConteudo = `
            <h2>Preferências</h2>
            <p>Aqui você pode ajustar suas preferências.</p>
        `;
            
        divFormsNovo.innerHTML = novoConteudo;

    });

    botaoSeguranca.addEventListener('click', function() {
        mudaEstadoBotao(botaoSeguranca);
        resetarDivForms();
    });     
    
    botaoInfoGeral.addEventListener('click', function() {
        mudaEstadoBotao(botaoInfoGeral);
        resetarDivForms();
    });

});