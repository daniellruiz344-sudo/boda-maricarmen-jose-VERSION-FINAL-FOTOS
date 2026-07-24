/* Invitación de boda — Maricarmen & José Armando */
document.addEventListener("DOMContentLoaded", () => {
  const musica = document.getElementById("musicaFondo");
  const botonAbrir = document.getElementById("botonAbrir");
  const botonMusica = document.getElementById("btnMusica");
  const secciones = [...document.querySelectorAll("main > section")];
  const puntos = [...document.querySelectorAll(".punto-navegacion")];
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function irA(destinoId) {
    const destino = document.getElementById(destinoId);
    if (!destino) return;
    destino.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
  }

  document.querySelectorAll("[data-destino]").forEach((control) => {
    control.addEventListener("click", () => irA(control.dataset.destino));
  });

  function actualizarBotonMusica() {
    if (!botonMusica || !musica) return;
    const activa = !musica.paused;
    botonMusica.classList.toggle("reproduciendo", activa);
    botonMusica.setAttribute("aria-pressed", String(activa));
    botonMusica.setAttribute("aria-label", activa ? "Pausar música" : "Reproducir música");
    const texto = botonMusica.querySelector(".texto-musica");
    if (texto) texto.textContent = activa ? "Pausar" : "Música";
  }

  async function reproducirMusica() {
    if (!musica) return;
    musica.volume = 0.25;
    try { await musica.play(); } catch (error) { console.info("El navegador espera interacción para reproducir audio."); }
    actualizarBotonMusica();
  }

  botonAbrir?.addEventListener("click", async () => {
    document.body.classList.add("invitacion-abierta");
    await reproducirMusica();
    window.setTimeout(() => irA("invitacion"), reducirMovimiento ? 0 : 220);
  });

  botonMusica?.addEventListener("click", async () => {
    if (!musica) return;
    if (musica.paused) await reproducirMusica();
    else musica.pause();
    actualizarBotonMusica();
  });
  musica?.addEventListener("play", actualizarBotonMusica);
  musica?.addEventListener("pause", actualizarBotonMusica);
  actualizarBotonMusica();

  const fechaBoda = new Date("2026-12-26T15:30:00-06:00").getTime();
  const campos = {
    dias: document.getElementById("dias"), horas: document.getElementById("horas"),
    minutos: document.getElementById("minutos"), segundos: document.getElementById("segundos")
  };
  function actualizarCuenta() {
    let distancia = Math.max(0, fechaBoda - Date.now());
    const valores = {
      dias: Math.floor(distancia / 86400000),
      horas: Math.floor((distancia % 86400000) / 3600000),
      minutos: Math.floor((distancia % 3600000) / 60000),
      segundos: Math.floor((distancia % 60000) / 1000)
    };
    Object.entries(valores).forEach(([clave, valor]) => {
      if (campos[clave]) campos[clave].textContent = String(valor).padStart(2, "0");
    });
  }
  actualizarCuenta();
  window.setInterval(actualizarCuenta, 1000);

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("pagina-visible");
        const id = entrada.target.id;
        puntos.forEach((punto) => punto.classList.toggle("activo", punto.dataset.destino === id));
      });
    }, { threshold: 0.35 });
    secciones.forEach((seccion) => observador.observe(seccion));
  } else {
    secciones.forEach((seccion) => seccion.classList.add("pagina-visible"));
  }
  secciones[0]?.classList.add("pagina-visible");

  function crearEfectos() {
    if (reducirMovimiento) return;
    const contenedorPetalos = document.getElementById("petalos");
    const contenedorDestellos = document.getElementById("destellos");
    if (contenedorPetalos) {
      contenedorPetalos.replaceChildren();
      const cantidad = window.innerWidth < 600 ? 12 : 22;
      for (let i = 0; i < cantidad; i++) {
        const petalo = document.createElement("span");
        petalo.className = "petalo";
        petalo.style.setProperty("--x", `${Math.random() * 100}%`);
        petalo.style.setProperty("--deriva", `${-70 + Math.random() * 140}px`);
        petalo.style.setProperty("--tamano", `${8 + Math.random() * 12}px`);
        petalo.style.setProperty("--duracion", `${8 + Math.random() * 9}s`);
        petalo.style.setProperty("--retraso", `${-Math.random() * 16}s`);
        petalo.style.setProperty("--opacidad", `${0.35 + Math.random() * 0.5}`);
        contenedorPetalos.appendChild(petalo);
      }
    }
    if (contenedorDestellos) {
      contenedorDestellos.replaceChildren();
      const cantidad = window.innerWidth < 600 ? 10 : 18;
      for (let i = 0; i < cantidad; i++) {
        const destello = document.createElement("span");
        destello.className = "destello";
        destello.style.left = `${5 + Math.random() * 90}%`;
        destello.style.top = `${5 + Math.random() * 86}%`;
        destello.style.setProperty("--tamano-destello", `${2 + Math.random() * 3}px`);
        destello.style.setProperty("--duracion-destello", `${3 + Math.random() * 4}s`);
        destello.style.setProperty("--retraso-destello", `${-Math.random() * 7}s`);
        contenedorDestellos.appendChild(destello);
      }
    }
  }
  crearEfectos();
  let ajuste;
  window.addEventListener("resize", () => { clearTimeout(ajuste); ajuste = setTimeout(crearEfectos, 250); });
});
