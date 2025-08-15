// cargar el svg y animar los corazones
fetch('multimedia/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = 'white';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // después de la animación de dibujo, mueve y agranda el svg
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        // mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // mostrar corazones flotando
          startFloatingObjects();
          // mostrar cuenta regresiva
          showCountdown();
          // iniciar música de fondo
          playBackgroundMusic();
        }, 1200); // tiempo para agrandar el svg
      }, totalDuration);
    }, 50);

    // selecciona los corazones (formas rojas o similares)
    const heartPaths = allPaths.filter(el => {
      const fill = el.getAttribute('fill') || '';
      // busca colores rojos o rosas típicos
      return /#(c1321f|e60026|f13a96|ff69b4|ffb6c1|ff1493|db7093|c71585|d72660|e75480|e75480|f88379|f4978e|f7cac9|f9a1bc)/i.test(fill);
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
      // cambia el color a un tono rosa
      path.setAttribute('fill', '#f883b4');
    });
  });

// efecto máquina de escribir para el texto de dedicatoria
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { 
  let text = getURLParam('text');
  if (!text) {
    text = `mensaje`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// firma manuscrita animada
function showSignature() {
  // cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Siempre tuyo, Agus";
  signature.classList.add('visible');
}

// controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    const petalsPerBatch = 2; 
    for (let j = 0; j < petalsPerBatch; j++) {
      // crea un div y agrega un svg de corazón dentro
      let el = document.createElement('div');
      el.className = 'floating-petal';
      el.style.left = `${Math.random() * 90 + 2}%`;
      el.style.top = `${100 + Math.random() * 10}%`;
      el.style.opacity = 0.7 + Math.random() * 0.3;
      el.innerHTML = `
        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20s-7.5-6.2-10-10.2C-1.5 5.2 3.5 0.5 8 4.5c2.1 1.9 4 3.7 4 3.7s1.9-1.8 4-3.7c4.5-4 9.5 0.7 6 5.3C19.5 13.8 12 20 12 20z"
            fill="#f883b4" stroke="#e75480" stroke-width="1"/>
        </svg>
      `;
      el.style.width = '24px';
      el.style.height = '22px';
      el.style.background = 'none';
      el.style.borderRadius = '0';

      container.appendChild(el);

      const duration = 8000 + Math.random() * 6000;
      const drift = (Math.random() - 0.5) * 60;
      setTimeout(() => {
        el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
        el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
        el.style.opacity = 0.2;
      }, 30);

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, duration + 2000);
    }

    if (count++ < 2000) setTimeout(spawn, 180 + Math.random() * 200);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// cuenta regresiva o fecha especial
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let startDate = startParam ? new Date(startParam) : new Date('2024-08-25T14:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((diff / (1000 * 60)) % 60);
    let seconds = Math.floor((diff / 1000) % 60);

    container.innerHTML =
      `Llevamos <b>${days}</b> días, <b>${hours}</b> horas, <b>${minutes}</b> minutos y <b>${seconds}</b> segundos siendo novios`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}
