const API_URL = 'https://lisoflix-backend.vercel.app/api'; // backend na Vercel

async function registrar() {
    const usuarioEl = document.getElementById('usuario');
    const emailEl = document.getElementById('email');
    const senhaEl = document.getElementById('senha');
    const msg = document.getElementById('mensagem');

    if (!usuarioEl ||!emailEl ||!senhaEl ||!msg) {
        console.error("Erro: Um dos campos não foi encontrado. Confere os id no HTML");
        alert("Erro interno: campos não encontrados");
        return;
    }

    const usuario = usuarioEl.value.trim();
    const email = emailEl.value.trim();
    const senha = senhaEl.value;

    if (!usuario ||!email ||!senha) {
        msg.textContent = "Preencha todos os campos";
        msg.style.color = "red";
        return;
    }
    if (senha.length < 8) {
        msg.textContent = "Senha precisa ter 8+ caracteres";
        msg.style.color = "red";
        return;
    }

    msg.textContent = "Cadastrando...";
    msg.style.color = "white";

    try {
        console.log("Enviando:", { usuario, email, senha });

        const res = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, email, senha })
        });

        const data = await res.json();
        console.log("Resposta:", data);
        msg.textContent = data.mensagem || data.erro || "Erro desconhecido";
        msg.style.color = res.ok? '#46d369' : 'red';

        if (res.ok) {
            usuarioEl.value = '';
            emailEl.value = '';
            senhaEl.value = '';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    } catch (err) {
        msg.textContent = "Erro de conexão com servidor";
        msg.style.color = "red";
        console.error("Erro fetch:", err);
    }
}

function irParaLogin() {
    window.location.href = 'index.html';
}