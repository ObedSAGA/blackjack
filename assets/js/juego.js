const miModulo = (() => {
  "use strict";

  let deck = [];
  //TIPOLOGIA DE CARTAS
  const tipos = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];

  //CUENTA DE PUNTOS JUGADORES
  let puntosJugadores = [];

  //REFERENCIAS DEL HTML
  const btnPedir = document.querySelector("#btnPedir"),
    btnDetener = document.querySelector("#btnDetener"),
    btnNuevo = document.querySelector("#btnNuevo");

  const divCartasJugadores = document.querySelectorAll(".divCartas"),
    puntosHTML = document.querySelectorAll("small");

  // Estas funcion crea una nueva baraja para iniciar juego
  const inicializarJuego = (numJugadores = 2) => {
    console.clear();
    deck = crearDeck();
    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }

    btnPedir.disabled = false;
    btnDetener.disabled = false;

    puntosHTML.forEach(element => element.innerText = 0);
    divCartasJugadores.forEach(element => element.innerHTML = '');

  };

  const crearDeck = () => {
    deck = [];

    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }
    for (const tipo of tipos) {
      for (const especial of especiales) {
        deck.push(especial + tipo);
      }
    }
    return _.shuffle(deck);
  };

  // Esta funcion me permite tomar una carta de la baraja
  const pedirCarta = () => {
    if (deck.length === 0) {
      throw "No hay más cartas";
    }
    return deck.pop();
  };

  // Esta funcion regresa el valor en puntos de la carta pedida
  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

  //Turno: 0 = primer jugador y el último será el rival
  const acomularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
  };

  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("carta");
    divCartasJugadores[turno].append(imgCarta);
  };

  const determinarGanador = () => {

    const [ puntosMinimos, puntosRival] = puntosJugadores;

    setTimeout(() => {
      if (puntosJugadores[0] === puntosRival) {
        alert("Fue un empate");
      } else if (
        (puntosJugadores[0] < puntosRival && puntosRival <= 21) ||
        puntosJugadores[0] > 21
      ) {
        alert("Perdiste... inténtalo de nuevo");
      } else if (
        (puntosJugadores[0] > puntosRival && puntosJugadores[0] <= 21) ||
        puntosRival > 21
      ) {
        alert("GANASTEEE!");
      }
    }, 100);
  }

  // Esta funcion retrasa la aparición de cartas del Rival
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Esta funcion gestiona el turno del rival
  const turnoRival =  async (puntosMinimos) => {
    let puntosRival = 0;

    do {
      const carta = pedirCarta();
      puntosRival = acomularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);
      await sleep(1000);

    } while (puntosRival < puntosMinimos && puntosMinimos <= 21);

    determinarGanador();
  };

  // EVENTOS

  //Pedir carta

  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta();
    const puntosJugador = acomularPuntos(carta, 0);

    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      console.warn("Lo siento mucho, perdiste");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoRival(puntosJugador);

    } else if (puntosJugador === 21) {
      console.warn("21, Genial");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoRival(puntosJugador);
    }
  });

  //Detener partida
  btnDetener.addEventListener("click", () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoRival(puntosJugadores[0]);
  });

  // Nueva partida

  btnNuevo.addEventListener("click", () => {

    inicializarJuego();

  });

  return {

    nuevoJuego: inicializarJuego

  };

})();
