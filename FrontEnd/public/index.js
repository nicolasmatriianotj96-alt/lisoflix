const API_URL = 'https://lisoflix-backend.vercel.app/api';

async function login() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const msg = document.getElementById('mensagem');

    if (!email ||!senha) {
        msg.textContent = 'Preencha todos os campos';
        msg.style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        if (!res.ok) {
            const erro = await res.json();
            throw new Error(erro.mensagem || 'Erro ao fazer login');
        }

        const dados = await res.json();
        console.log('Login OK:', dados);

        localStorage.removeItem('modoVisitante');
        localStorage.setItem('token', dados.token);
        localStorage.setItem('user', JSON.stringify({
            usuario: dados.usuario,
            email: dados.email,
            foto_perfil: dados.foto_perfil || null
        }));

        msg.textContent = 'Login realizado!';
        msg.style.color = '#46d369';
        setTimeout(() => window.location.href = 'dashboard.html', 800);

    } catch (err) {
        console.error('Erro login:', err);
        msg.textContent = err.message;
        msg.style.color = 'red';
    }
}

function irParaCadastro() {
    window.location.href = 'index2.html';
}

function entrarComoVisitante() {
    localStorage.clear();
    localStorage.setItem('modoVisitante', '1');
    window.location.href = 'dashboard.html';
}

function abrirLogin(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('modalLogin');
    if (modal) modal.style.display = 'flex';
}

function fecharLogin(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('modalLogin');
    if (modal) modal.style.display = 'none';
}

window.onload = function() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const visitante = localStorage.getItem('modoVisitante') === '1';
    if ((token && user) || visitante) {
        window.location.href = 'dashboard.html';
    }
}