// --- playlist data ---
   const tracks = [
  {
    title: 'Pal Pal',
    artist: 'AliSoomro',
    src: 'songs/Pal Pal.mp3',
    cover: 'songs/palpal.jpg'
  },
  {
    title: 'Azul',
    artist: 'GURU RANDHAWA',
    src: 'songs/AZUL.mp3',
    cover: 'songs/azul.png'
  },
  {
    title: 'Sira',
    artist: 'GURU RANDHAWA',
    src: 'songs/SIRRA.mp3',
    cover: 'songs/sirra.png'
  },
  {
    title: 'Killa',
    artist: 'GURU RANDHAWA',
    src: 'songs/KILLA.mp3',
    cover: 'songs/killa1.jpg'
  },
  {
    title: 'Kufar',
    artist: 'Diljit Dosanjh',
    src: 'songs/kufar.mp3',
    cover: 'songs/kufar.jpg'
  },
  {
    title: 'Deewane',
    artist: ' Navaan Sandhu ',
    src: 'songs/Deewane.mp3',
    cover: 'songs/deewane.png'
  }
];


    // --- DOM ---
    const audio = document.getElementById('audio');
    const playlistEl = document.getElementById('playlist');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const nowTitle = document.getElementById('nowTitle');
    const nowArtist = document.getElementById('nowArtist');
    const metaTitle = document.getElementById('metaTitle');
    const metaArtist = document.getElementById('metaArtist');
    const coverImg = document.getElementById('coverImg');
    const progress = document.getElementById('progress');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volume = document.getElementById('volume');
    const autoplayToggle = document.getElementById('autoplayToggle');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');

    let currentIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;

    // populate playlist UI
    function renderPlaylist(){
      playlistEl.innerHTML = '';
      tracks.forEach((t, i) => {
        const tr = document.createElement('div');
        tr.className = 'track';
        tr.dataset.index = i;
        tr.innerHTML = `
          <div class="tn"><img src="${t.cover}" alt="cover"></div>
          <div class="info">
            <div class="t">${t.title}</div>
            <div class="a">${t.artist}</div>
          </div>
        `;
        tr.addEventListener('click', () => { loadTrack(i); playAudio(); });
        playlistEl.appendChild(tr);
      });
      highlightActive();
    }

    // highlight active track
    function highlightActive(){
      const items = playlistEl.querySelectorAll('.track');
      items.forEach(it => it.classList.remove('active'));
      const active = playlistEl.querySelector(`[data-index="${currentIndex}"]`);
      if(active) active.classList.add('active');
    }

    function loadTrack(index){
      if(index < 0) index = tracks.length - 1;
      if(index >= tracks.length) index = 0;
      currentIndex = index;
      const t = tracks[currentIndex];
      audio.src = t.src;
      nowTitle.textContent = t.title;
      nowArtist.textContent = t.artist;
      metaTitle.textContent = t.title;
      metaArtist.textContent = t.artist;
      coverImg.src = t.cover;
      highlightActive();
    }

    function playAudio(){
      audio.play().then(()=>{
        isPlaying = true;
        setPlayIcon();
      }).catch(err => {
        // autoplay restrictions — do nothing but update UI
        console.warn('Play prevented:', err.message);
        isPlaying = false;
        setPlayIcon();
      });
    }
    function pauseAudio(){
      audio.pause();
      isPlaying = false;
      setPlayIcon();
    }
    function togglePlay(){ isPlaying ? pauseAudio() : playAudio(); }

    function setPlayIcon(){
      if(isPlaying){
        // pause icon
        playIcon.innerHTML = `<path d=\"M6 5h4v14H6zM14 5h4v14h-4z\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>`;
      } else {
        // play icon
        playIcon.innerHTML = `<path d=\"M5 3v18l15-9L5 3z\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>`;
      }
    }

    // progress updates
    audio.addEventListener('timeupdate', () => {
      if(audio.duration){
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = pct + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    });

    progress.addEventListener('click', (e) => {
      const rect = progress.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      if(audio.duration) audio.currentTime = pct * audio.duration;
    });

    // keyboard space toggles play/pause
    document.addEventListener('keydown', (e) => {
      if(e.code === 'Space'){
        e.preventDefault();
        togglePlay();
      }
      if(e.code === 'ArrowRight') nextTrack();
      if(e.code === 'ArrowLeft') prevTrack();
    });

    // time formatting
    function formatTime(sec){
      if(!sec || isNaN(sec)) return '0:00';
      const s = Math.floor(sec % 60).toString().padStart(2,'0');
      const m = Math.floor(sec / 60);
      return m + ':' + s;
    }

    // volume
    volume.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });

    // next / prev
    function nextTrack(){
      if(isShuffle){
        currentIndex = Math.floor(Math.random() * tracks.length);
      } else {
        currentIndex++;
      }
      if(currentIndex >= tracks.length) currentIndex = 0;
      loadTrack(currentIndex);
      if(isPlaying || autoplayToggle.checked) playAudio();
    }
    function prevTrack(){
      if(audio.currentTime > 3){ audio.currentTime = 0; return; }
      currentIndex--;
      if(currentIndex < 0) currentIndex = tracks.length - 1;
      loadTrack(currentIndex);
      if(isPlaying) playAudio();
    }

    // shuffle / repeat toggles
    shuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      shuffleBtn.style.opacity = isShuffle ? 1 : 0.6;
    });
    repeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      repeatBtn.style.opacity = isRepeat ? 1 : 0.6;
    });

    // audio ended event
    audio.addEventListener('ended', () => {
      if(isRepeat){
        audio.currentTime = 0;
        playAudio();
        return;
      }
      if(isShuffle){
        nextTrack();
        return;
      }
      // normal
      if(currentIndex < tracks.length - 1){
        currentIndex++;
        loadTrack(currentIndex);
        if(autoplayToggle.checked) playAudio();
      } else {
        // reached end
        if(autoplayToggle.checked){
          currentIndex = 0; loadTrack(currentIndex); playAudio();
        } else {
          isPlaying = false; setPlayIcon();
        }
      }
    });

    // button events
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    // initialize
    function init(){
      renderPlaylist();
      loadTrack(0);
      audio.volume = parseFloat(volume.value);
      setPlayIcon();
    }
    init();

    // accessibility: focus styles for keyboard users
    document.querySelectorAll('.btn').forEach(b=>{
      b.addEventListener('keydown', (e)=>{ if(e.key==='Enter') b.click(); });
    });

    // expose functions for debugging (optional)
    window.player = { playAudio, pauseAudio, nextTrack, prevTrack, loadTrack };