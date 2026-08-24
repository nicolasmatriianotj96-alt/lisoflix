const API_URL = 'https://lisoflix-backend.vercel.app/api';

let filmes = [];
let favoritosIds = new Set();
let token = '';
let modoVisitante = false;
let heroFilme = null;

const CHAVE_FAV_LOCAL = 'lisoflix_favoritos_local';

window.addEventListener('load', async () => {
    token = localStorage.getItem('token');
    modoVisitante = localStorage.getItem('modoVisitante') === '1';

    if (!token && !modoVisitante) {
        window.location.href = 'index.html';
        return;
    }

    await carregarUsuario();
    carregarFilmes();
    await carregarFavoritos();
    renderizarTudo();
});

async function carregarUsuario() {
    const nomeEl = document.getElementById('boasvindas');
    const inicialEl = document.getElementById('inicialHeader');
    const previewEl = document.getElementById('previewInicial');

    if (modoVisitante) {
        if (nomeEl) nomeEl.textContent = 'Olá, Visitante';
        if (inicialEl) inicialEl.textContent = 'V';
        if (previewEl) previewEl.textContent = 'V';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/usuario`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
            // token realmente inválido/expirado - aí sim desloga
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        if (!res.ok) throw new Error('Falha ao carregar usuário');

        const usuario = await res.json();
        const letra = usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U';

        if (nomeEl) nomeEl.textContent = `Olá, ${usuario.nome || 'Usuário'}`;
        if (inicialEl) inicialEl.textContent = letra;
        if (previewEl) previewEl.textContent = letra;

        const novoNomeEl = document.getElementById('novoNome');
        const novoEmailEl = document.getElementById('novoEmail');
        if (novoNomeEl) novoNomeEl.value = usuario.nome || '';
        if (novoEmailEl) novoEmailEl.value = usuario.email || '';

    } catch (e) {
        // backend fora do ar não deve travar a navegação pelo catálogo
        console.error('Erro carregarUsuario:', e);
        if (nomeEl) nomeEl.textContent = 'Olá, Usuário';
    }
}

function carregarFilmes() {
    // O catálogo real (Supabase) ainda não tem gênero/vídeo cadastrados,
    // então por enquanto o site roda com o catálogo local em filmes-locais.js.
    // Quando o backend tiver esses campos, basta trocar isso por um fetch em /filmes.
    filmes = typeof FILMES_LOCAIS !== 'undefined' ? FILMES_LOCAIS : [];
}

async function carregarFavoritos() {
    if (modoVisitante) {
        favoritosIds = lerFavoritosLocais();
        atualizarContadorFavoritos();
        return;
    }

    try {
        const resp = await fetch(`${API_URL}/favoritos`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (resp.ok) {
            const favs = await resp.json();
            favoritosIds = new Set(favs.map(f => Number(f.filme_id)));
        } else {
            favoritosIds = lerFavoritosLocais();
        }
    } catch (e) {
        console.log('Favoritos indisponíveis, usando cache local:', e.message);
        favoritosIds = lerFavoritosLocais();
    }
    atualizarContadorFavoritos();
}

function lerFavoritosLocais() {
    try {
        return new Set(JSON.parse(localStorage.getItem(CHAVE_FAV_LOCAL) || '[]'));
    } catch (e) {
        return new Set();
    }
}

function salvarFavoritosLocais() {
    localStorage.setItem(CHAVE_FAV_LOCAL, JSON.stringify([...favoritosIds]));
}

function atualizarContadorFavoritos() {
    const countEl = document.getElementById('countFav');
    if (countEl) countEl.textContent = favoritosIds.size;
}

async function toggleFavorito(filmeId, event) {
    if (event) event.stopPropagation();
    filmeId = Number(filmeId);

    const jaEra = favoritosIds.has(filmeId);
    if (jaEra) favoritosIds.delete(filmeId);
    else favoritosIds.add(filmeId);

    salvarFavoritosLocais();
    atualizarContadorFavoritos();
    renderizarTudo();

    if (modoVisitante) return;

    try {
        await fetch(`${API_URL}/favoritar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ filme_id: filmeId })
        });
    } catch (e) {
        console.log('Não foi possível sincronizar favorito com o servidor:', e.message);
    }
}

function filtrarFilmes() {
    renderizarTudo();
}

function mostrarAba(aba) {
    document.getElementById('catalogo').style.display = aba === 'catalogo' ? 'block' : 'none';
    document.getElementById('favoritos').style.display = aba === 'favoritos' ? 'block' : 'none';
    document.getElementById('hero').style.display = aba === 'catalogo' ? 'flex' : 'none';
    document.getElementById('btnCatalogo').classList.toggle('ativo', aba === 'catalogo');
    document.getElementById('btnFavoritos').classList.toggle('ativo', aba === 'favoritos');
    if (aba === 'favoritos') renderizarGradeFavoritos();
}

function renderizarTudo() {
    renderizarHero();
    renderizarLinhas();
    renderizarGradeFavoritos();
}

function generosNaOrdem() {
    const vistos = [];
    filmes.forEach(f => {
        const g = f.genero || 'Catálogo';
        if (!vistos.includes(g)) vistos.push(g);
    });
    return vistos;
}

function termoBusca() {
    const buscaEl = document.getElementById('busca');
    return buscaEl ? buscaEl.value.trim().toLowerCase() : '';
}

function renderizarHero() {
    const destaques = filmes.filter(f => f.destaque);
    if (!heroFilme) {
        heroFilme = destaques.length
            ? destaques[Math.floor(Math.random() * destaques.length)]
            : filmes[0];
    }

    const heroEl = document.getElementById('hero');
    if (!heroFilme || !heroEl) return;

    document.getElementById('heroTitulo').textContent = heroFilme.titulo;
    document.getElementById('heroDescricao').textContent = heroFilme.descricao || '';

    heroEl.style.background = `linear-gradient(180deg, transparent 40%, #000 100%), linear-gradient(120deg, ${heroFilme.corA}, ${heroFilme.corB})`;

    // só (re)cria o vídeo de fundo se ainda não existir ou se o destaque mudou
    // (evita reiniciar o vídeo toda vez que a tela é re-renderizada, ex: ao favoritar)
    const existente = heroEl.querySelector('video.hero-video');
    if (heroFilme.preview && (!existente || existente.src.indexOf(heroFilme.preview) === -1)) {
        if (existente) existente.remove();
        const video = document.createElement('video');
        video.className = 'hero-video';
        video.src = heroFilme.preview;
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        heroEl.prepend(video);
    } else if (!heroFilme.preview && existente) {
        existente.remove();
    }

    const btnAssistir = document.getElementById('heroAssistir');
    const btnFav = document.getElementById('heroFavoritar');
    if (btnAssistir) btnAssistir.onclick = () => abrirTrailer(heroFilme.id);
    if (btnFav) {
        const na = favoritosIds.has(Number(heroFilme.id));
        btnFav.textContent = na ? '✓ Na Minha Lista' : '＋ Minha Lista';
        btnFav.onclick = (e) => { toggleFavorito(heroFilme.id, e); };
    }
}

function renderizarLinhas() {
    const container = document.getElementById('catalogo');
    const mensagemEl = document.getElementById('mensagem');
    if (!container) return;

    container.innerHTML = '';
    const busca = termoBusca();

    let algumResultado = false;

    generosNaOrdem().forEach(genero => {
        const doGenero = filmes.filter(f => (f.genero || 'Catálogo') === genero && f.titulo.toLowerCase().includes(busca));
        if (doGenero.length === 0) return;
        algumResultado = true;

        const linha = document.createElement('div');
        linha.className = 'linha';

        const titulo = document.createElement('h2');
        titulo.className = 'linha-titulo';
        titulo.textContent = genero;
        linha.appendChild(titulo);

        const trilho = document.createElement('div');
        trilho.className = 'trilho-cards';
        doGenero.forEach(f => trilho.appendChild(criarCard(f)));
        linha.appendChild(trilho);

        container.appendChild(linha);
    });

    if (mensagemEl) mensagemEl.textContent = algumResultado ? '' : 'Nenhum filme encontrado';
}

function renderizarGradeFavoritos() {
    const grade = document.getElementById('gradeFavoritos');
    if (!grade) return;
    grade.innerHTML = '';

    const favoritos = filmes.filter(f => favoritosIds.has(Number(f.id)));
    if (favoritos.length === 0) {
        grade.innerHTML = '<p class="mensagem-vazio">Você ainda não tem favoritos. Clique no ♥ de um filme para adicionar.</p>';
        return;
    }
    favoritos.forEach(f => grade.appendChild(criarCard(f)));
}

function criarCard(filme) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => abrirTrailer(filme.id);

    const poster = document.createElement('div');
    poster.className = 'card-poster';
    poster.style.background = `linear-gradient(160deg, ${filme.corA}, ${filme.corB})`;

    const icone = document.createElement('span');
    icone.className = 'card-icone';
    icone.textContent = filme.icone || '🎬';
    poster.appendChild(icone);

    if (filme.preview) {
        const video = document.createElement('video');
        video.className = 'card-preview';
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'none';
        video.src = filme.preview;
        poster.appendChild(video);

        card.addEventListener('mouseenter', () => {
            video.currentTime = 0;
            video.play().catch(() => {});
            poster.classList.add('reproduzindo');
        });
        card.addEventListener('mouseleave', () => {
            video.pause();
            poster.classList.remove('reproduzindo');
        });
    }

    const selo = document.createElement('span');
    selo.className = 'card-selo';
    selo.textContent = filme.classificacao || '';
    poster.appendChild(selo);

    card.appendChild(poster);

    const infos = document.createElement('div');
    infos.className = 'card-info';

    const h3 = document.createElement('h3');
    h3.textContent = filme.titulo;
    infos.appendChild(h3);

    const meta = document.createElement('p');
    meta.className = 'card-meta';
    meta.textContent = `${filme.ano || ''}${filme.ano ? ' · ' : ''}${filme.genero || ''}`;
    infos.appendChild(meta);

    const botoes = document.createElement('div');
    botoes.className = 'card-botoes';

    const btnPlay = document.createElement('button');
    btnPlay.className = 'btn-card btn-play';
    btnPlay.textContent = '▶';
    btnPlay.title = 'Assistir';
    btnPlay.onclick = (e) => { e.stopPropagation(); abrirTrailer(filme.id); };
    botoes.appendChild(btnPlay);

    const isFav = favoritosIds.has(Number(filme.id));
    const btnFav = document.createElement('button');
    btnFav.className = 'btn-card btn-fav' + (isFav ? ' favoritado' : '');
    btnFav.textContent = '♥';
    btnFav.title = isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    btnFav.onclick = (e) => toggleFavorito(filme.id, e);
    botoes.appendChild(btnFav);

    infos.appendChild(botoes);
    card.appendChild(infos);

    return card;
}

function abrirTrailer(filmeId) {
    const filme = filmes.find(f => Number(f.id) === Number(filmeId));
    if (!filme) return;

    const modal = document.getElementById('modalTrailer');
    const player = document.getElementById('playerTrailer');
    document.getElementById('playerTitulo').textContent = filme.titulo;
    document.getElementById('playerMeta').textContent = `${filme.ano || ''}${filme.ano ? ' · ' : ''}${filme.genero || ''}${filme.classificacao ? ' · ' + filme.classificacao : ''}`;
    document.getElementById('playerDescricao').textContent = filme.descricao || '';

    player.src = filme.video || filme.preview || '';
    modal.style.display = 'flex';
    player.play().catch(() => {});
}

function fecharTrailer(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('modalTrailer');
    const player = document.getElementById('playerTrailer');
    player.pause();
    player.removeAttribute('src');
    player.load();
    modal.style.display = 'none';
}

function abrirPerfil() {
    const modal = document.getElementById('modalPerfil');
    if (modal) modal.style.display = 'flex';
}

function fecharPerfil(event) {
    if (event.target.id === 'modalPerfil' || event.target.classList.contains('fechar-modal')) {
        const modal = document.getElementById('modalPerfil');
        const msg = document.getElementById('msgPerfil');
        if (modal) modal.style.display = 'none';
        if (msg) msg.textContent = '';
    }
}

async function salvarPerfil() {
    const msgEl = document.getElementById('msgPerfil');

    if (modoVisitante) {
        if (msgEl) msgEl.textContent = 'Crie uma conta para editar o perfil.';
        return;
    }

    const body = {
        nome: document.getElementById('novoNome').value,
        email: document.getElementById('novoEmail').value
    };
    const senha = document.getElementById('novaSenha').value;
    if (senha) body.senha = senha;

    try {
        const resp = await fetch(`${API_URL}/usuario`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(body)
        });

        const data = await resp.json();
        if (msgEl) msgEl.textContent = data.mensagem;
        if (resp.ok) setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
        if (msgEl) msgEl.textContent = 'Erro de conexão com o servidor';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
