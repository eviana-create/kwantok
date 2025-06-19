// ======== LOGIN E PERFIL ========

function verificarLogin() {
  const usuario = localStorage.getItem('usuario');
  if (usuario) {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    document.getElementById('topo-usuario').style.display = 'block';
    document.getElementById('nome-logado').innerText = `👤 ${usuario}`;
    carregarFeed(); // monta o feed ao logar
  } else {
    document.getElementById('login-screen').style.display = 'block';
    document.querySelector('.container').style.display = 'none';
  }
}

function fazerLogin() {
  const nome = document.getElementById('nome-usuario').value.trim();
  if (nome.length < 2) {
    alert("Digite um nome válido.");
    return;
  }
  localStorage.setItem('usuario', nome);
  verificarLogin();
}

function logout() {
  localStorage.removeItem('usuario');
  location.reload();
}

const feed = document.getElementById('feed');

// Vídeos fixos de exemplo
const videosFixos = [
  { src: 'videos/video1.mp4', id: 'vid1' },
  { src: 'videos/video2.mp4', id: 'vid2' }
];

// Vídeos enviados pelo usuário
const videosUsuario = JSON.parse(localStorage.getItem('meusVideos') || '[]');
const todosVideos = [...videosUsuario, ...videosFixos]; // prioriza os novos

// Montar feed
function carregarFeed() {
  feed.innerHTML = '';
  todosVideos.forEach(video => {
    const div = document.createElement('div');
    div.className = 'video-card';

    const vid = document.createElement('video');
    vid.src = video.src;
    vid.controls = true;
    vid.loop = true;

    const btnLike = document.createElement('div');
    btnLike.className = 'like-btn';
    btnLike.innerHTML = isLiked(video.id) ? '❤️' : '🤍';
    btnLike.onclick = () => toggleLike(video.id, btnLike);

    const btnComentario = document.createElement('div');
    btnComentario.className = 'comment-btn';
    btnComentario.innerText = '💬';
    btnComentario.onclick = () => abrirComentarios(video.id);

    const btnCompartilhar = document.createElement('div');
    btnCompartilhar.className = 'share-btn';
    btnCompartilhar.innerText = '🔗';
    btnCompartilhar.onclick = () => compartilharVideo(video.src);

    div.appendChild(vid);
    div.appendChild(btnLike);
    div.appendChild(btnComentario);
    div.appendChild(btnCompartilhar);
    feed.appendChild(div);
  });
}

carregarFeed();

// Likes
function isLiked(id) {
  const likes = JSON.parse(localStorage.getItem('likes') || '{}');
  return likes[id];
}

function toggleLike(id, btn) {
  const likes = JSON.parse(localStorage.getItem('likes') || '{}');
  likes[id] = !likes[id];
  localStorage.setItem('likes', JSON.stringify(likes));
  btn.innerHTML = likes[id] ? '❤️' : '🤍';
}

// Upload
document.getElementById('upload-video').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const base64 = event.target.result;
    const id = `vid-${Date.now()}`;
    const novoVideo = { src: base64, id };

    const armazenados = JSON.parse(localStorage.getItem('meusVideos') || '[]');
    armazenados.unshift(novoVideo);
    localStorage.setItem('meusVideos', JSON.stringify(armazenados));

    location.reload();
  };
  reader.readAsDataURL(file);
});

// Comentários
function abrirComentarios(videoId) {
  const comentarios = JSON.parse(localStorage.getItem('comentarios') || '{}');
  const lista = comentarios[videoId] || [];

  const texto = prompt(`Comentários para o vídeo:\n\n${lista.join('\n')}\n\nEscreva algo:`);
  if (texto) {
    lista.push(texto);
    comentarios[videoId] = lista;
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
    alert('Comentário adicionado!');
  }
}

// Compartilhar
function compartilharVideo(url) {
  if (navigator.share) {
    navigator.share({
      title: 'Veja esse vídeo!',
      url: url
    }).catch(err => console.log('Erro ao compartilhar:', err));
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copiado!");
    });
  }
}
verificarLogin(); // inicia app verificando se há usuário logado
function atualizarPerfil() {
  const nome = localStorage.getItem('usuario') || 'Visitante';
  const videos = JSON.parse(localStorage.getItem('videos')) || [];

  const meusVideos = videos.filter(v => v.usuario === nome);
  const totalCurtidas = meusVideos.reduce((soma, video) => soma + (video.curtidas || 0), 0);

  document.getElementById('perfil-nome').textContent = nome;
  document.getElementById('perfil-videos').textContent = meusVideos.length;
  document.getElementById('perfil-curtidas').textContent = totalCurtidas;
}
function mostrarAba(id) {
  document.querySelectorAll('.aba').forEach(aba => aba.style.display = 'none');
  document.getElementById(id).style.display = 'block';

  if (id === 'perfil') atualizarPerfil();
}

