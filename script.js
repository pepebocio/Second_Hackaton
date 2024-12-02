// Crear efectos y nodos
const reverb = new Tone.Reverb(6).toDestination(); // Reverb con un decay de 3 segundos
reverb.wet.value = 0.8;

// Crear sintetizadores y filtros para cada pista
Tone.Transport.bpm.value = 127;

function createLowPassFilter() {
    return new Tone.Filter({
        type: "lowpass",
        frequency: 20000, // Frecuencia inicial máxima
        rolloff: -12
    }).toDestination();
}

// Pistas y sus filtros individuales
const kickFilter = createLowPassFilter();
const kickTrack = new Tone.Player({
    url: "https://tonejs.github.io/audio/drum-samples/Techno/kick.mp3",
}).connect(kickFilter);

const snareFilter = createLowPassFilter();
const snareTrack = new Tone.Player({
    url: "https://tonejs.github.io/audio/drum-samples/Techno/snare.mp3",
}).connect(snareFilter);

const melodyFilter = createLowPassFilter();
const melodyTrack = new Tone.Synth({
    oscillator: { type: "triangle" },
}).connect(melodyFilter);

const clapFilter = createLowPassFilter();
const clapTrack = new Tone.Player({
    url: "https://tonejs.github.io/audio/drum-samples/Kit8/snare.mp3",
}).connect(clapFilter);

const chordsFilter = createLowPassFilter();
const chordsTrack = new Tone.PolySynth({
    oscillator: { type: "sawtooth" }
}).connect(chordsFilter);

const bassFilter = createLowPassFilter();
const bassTrack = new Tone.PolySynth({
    oscillator: { type: "square" },
}).connect(bassFilter);

// Control de frecuencia de filtros con deslizadores (con conversión logarítmica)
function setupFilterControl(trackId, filter) {
  const filterControl = document.getElementById(`filter-${trackId}`);
  filterControl.addEventListener("input", (e) => {
      const value = parseFloat(e.target.value);

      // Convierte el valor del deslizador a escala logarítmica
      const minFreq = 40; // Frecuencia mínima
      const maxFreq = 20000; // Frecuencia máxima
      const logValue = minFreq * Math.pow(maxFreq / minFreq, value / maxFreq); // Fórmula logarítmica

      // Aplica la frecuencia logarítmica al filtro
      filter.frequency.value = logValue;
  });
}


// Inicializar controles de filtros
setupFilterControl("track1", kickFilter);
setupFilterControl("track2", snareFilter);
setupFilterControl("track3", melodyFilter);
setupFilterControl("track4", clapFilter);
setupFilterControl("track5", chordsFilter);  
setupFilterControl("track6", bassFilter); 

// Muted means on, i missed in the begging and now it's all messed up
let isMutedTrack1 = true;
let isMutedTrack2 = true;
let isMutedTrack3 = true;
let isMutedTrack4 = true;
let isMutedTrack5= true;
let isMutedTrack6= true;
let isReverbConnectedTrack1 = false; 
let isReverbConnectedTrack2 = false; 
let isReverbConnectedTrack3 = false;
let isReverbConnectedTrack4 = false;
let isReverbConnectedTrack5 = false;
let isReverbConnectedTrack6 = false;

// Control de volumen
kickTrack.volume.value = parseFloat(document.querySelector(`#volume-track1`).value);
snareTrack.volume.value = parseFloat(document.querySelector(`#volume-track2`).value); 
melodyTrack.volume.value = parseFloat(document.querySelector(`#volume-track3`).value);
clapTrack.volume.value = parseFloat(document.querySelector(`#volume-track4`).value);
chordsTrack.volume.value = parseFloat(document.querySelector(`#volume-track5`).value);
bassTrack.volume.value = parseFloat(document.querySelector(`#volume-track6`).value);
// Loop de la melodía


Tone.Transport.scheduleRepeat((time) => {
	Tone.loaded().then(() => {
        kickTrack.start();
    }); 
}, "4n");

Tone.Transport.scheduleRepeat((time) => {
	Tone.loaded().then(() => {
	snareTrack.start();
}); 
}, "2n","4n")
const melody = ["C4", "D4", "F4","C4", "D4", "F4","C4", "D4", "F4","C4", "D4", "G4","C4", "D4", "F4"];
let index1=0

Tone.Transport.scheduleRepeat((time) => {
    melodyTrack.triggerAttackRelease(melody[index1], "16n", time);
    index1 = (index1 + 1) % melody.length ;
}, "16n")

Tone.Transport.scheduleRepeat((time) => {
	Tone.loaded().then(() => {
        clapTrack.start();
    }); 
}, "4n");

const chords =[["G4","A#4","D4"],["F4","A4","D4"],["G4","A#3","D4"]]

Tone.Transport.scheduleRepeat((time) => {
    chordsTrack.triggerAttackRelease(chords[0], "16n", time); 
    chordsTrack.triggerAttackRelease(chords[0], "16n", time + Tone.Time("8n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[1], "16n", time + Tone.Time("4n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[1], "16n", time + Tone.Time("4n").toSeconds() + Tone.Time("8n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[2], "16n", time + Tone.Time("2n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[2], "16n", time + Tone.Time("2n").toSeconds() + Tone.Time("8n").toSeconds()+ Tone.Time("16n").toSeconds());
    chordsTrack.triggerAttackRelease(chords[2], "16n", time + Tone.Time("2n").toSeconds() + Tone.Time("4n").toSeconds()+ Tone.Time("16n").toSeconds()); 
}, "1n");

const bass = ["G2", "F2", "D#2","D#2", "D#2", "F2","C2", "C2", "C2","D2", "D#2", "D#2","D#2", "F2", "G2","G2"];
let index2=0

Tone.Transport.scheduleRepeat((time) => {
    bassTrack.triggerAttackRelease(bass[index2], "4n", time);
    index2 = (index2 + 1) % bass.length ;
}, "4n")



// Controles de transporte (inicio y parada de la música)
document.getElementById("startTransport").addEventListener("click", async () => {
  await Tone.start();  // Asegurarse de que Tone.js se ha inicializado
  Tone.Transport.start(); // Iniciar la reproducción
});

document.getElementById("stopTransport").addEventListener("click", () => {
  Tone.Transport.stop(); // Detener la reproducción
});

// Función general para manejar mute y reverb
function toggleControl(trackId, controlType) {
  const synth  = trackId === "track1" ? kickTrack :
                trackId === "track2" ? snareTrack :
                trackId === "track3" ? melodyTrack :
                trackId === "track4" ? clapTrack :
                trackId === "track5" ? chordsTrack:
                bassTrack;
  const controlButton = document.getElementById(`${controlType}-${trackId}`);
  let isControlActive;

  if (controlType === "mute") {
    isControlActive = trackId === "track1" ? isMutedTrack1 :
                    trackId === "track2" ? isMutedTrack2 :
                    trackId === "track3" ? isMutedTrack3 :
                    trackId === "track4" ? isMutedTrack4 :
                    trackId === "track5" ? isMutedTrack5:
                    isMutedTrack6;
    if (isControlActive) {
      synth.volume.value = -Infinity; // Silenciar la pista
      controlButton.classList.remove('active');
      controlButton.classList.add('inactive');
      controlButton.innerText ='OFF';
    } else {
      synth.volume.value = parseFloat(document.querySelector(`#volume-${trackId}`).value);
      controlButton.classList.remove('inactive');
      controlButton.classList.add('active');
      controlButton.innerText ='ON';
    }
    if (trackId === "track1") isMutedTrack1 = !isMutedTrack1;
    else if (trackId === "track2")isMutedTrack2 = !isMutedTrack2;
        else if (trackId === "track3")isMutedTrack3 = !isMutedTrack3;
            else if (trackId === "track4")isMutedTrack4 = !isMutedTrack4;
                else if (trackId === "track5")isMutedTrack5 = !isMutedTrack5;
                  else if (trackId === "track6")isMutedTrack6 = !isMutedTrack6;

  } else if (controlType === "reverb") {
    const filter  = trackId === "track1" ? kickFilter :
                trackId === "track2" ? snareFilter :
                trackId === "track3" ? melodyFilter :
                trackId === "track4" ? clapFilter :
                trackId === "track5" ? chordsFilter:
                bassFilter;
    isControlActive = trackId === "track1" ? isReverbConnectedTrack1 :
                    trackId === "track2" ? isReverbConnectedTrack2 :
                    trackId === "track3" ? isReverbConnectedTrack3 :
                    trackId === "track4" ? isReverbConnectedTrack4 :
                    trackId === "track5" ? isReverbConnectedTrack5:
                    isReverbConnectedTrack6;
    if (isControlActive) {
      filter.disconnect(reverb); // Desconectar reverb
      controlButton.classList.remove('active');
      controlButton.classList.add('inactive');
    } else {
      filter.connect(reverb); // Conectar reverb
      controlButton.classList.remove('inactive');
      controlButton.classList.add('active');
    }
    if (trackId === "track1") isReverbConnectedTrack1 = !isReverbConnectedTrack1;
    else if(trackId === "track2") isReverbConnectedTrack2 = !isReverbConnectedTrack2;
    else if(trackId === "track3") {isReverbConnectedTrack3 = !isReverbConnectedTrack3;} 
    else if(trackId === "track4") {isReverbConnectedTrack4 = !isReverbConnectedTrack4;}  
    else if(trackId === "track5") {isReverbConnectedTrack5 = !isReverbConnectedTrack5;} 
    else if(trackId === "track6") {isReverbConnectedTrack6 = !isReverbConnectedTrack6;} 
  }
}

// Controles para la pista 1
document.getElementById("volume-track1").addEventListener("input", (e) => {
  if(isMutedTrack1){
  kickTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
  }
});

// Pista 1: Mute y Reverb
document.getElementById("mute-track1").addEventListener("click", () => toggleControl("track1", "mute"));
document.getElementById("reverb-track1").addEventListener("click", () => toggleControl("track1", "reverb"));

// Controles para la pista 2
document.getElementById("volume-track2").addEventListener("input", (e) => {
  if(isMutedTrack2){
  snareTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
  }
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track2").addEventListener("click", () => toggleControl("track2", "mute"));
document.getElementById("reverb-track2").addEventListener("click", () => toggleControl("track2", "reverb"));


document.getElementById("volume-track3").addEventListener("input", (e) => {
  if(isMutedTrack3){
    melodyTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
  }
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track3").addEventListener("click", () => toggleControl("track3", "mute"));
document.getElementById("reverb-track3").addEventListener("click", () => toggleControl("track3", "reverb"));


document.getElementById("volume-track4").addEventListener("input", (e) => {
  if(isMutedTrack4){
    clapTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
  }
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track4").addEventListener("click", () => toggleControl("track4", "mute"));
document.getElementById("reverb-track4").addEventListener("click", () => toggleControl("track4", "reverb"));


document.getElementById("volume-track5").addEventListener("input", (e) => {
  if(isMutedTrack5){
    chordsTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
  }
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track5").addEventListener("click", () => toggleControl("track5", "mute"));
document.getElementById("reverb-track5").addEventListener("click", () => toggleControl("track5", "reverb"));

// Controles para la pista 1
document.getElementById("volume-track6").addEventListener("input", (e) => {
  if(isMutedTrack6){
  bassTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
  }
});

// Pista 1: Mute y Reverb
document.getElementById("mute-track6").addEventListener("click", () => toggleControl("track6", "mute"));
document.getElementById("reverb-track6").addEventListener("click", () => toggleControl("track6", "reverb"));




// Tabla de cronograma para automatizaciones
const automationSchedule = [
  //{ time: 2, track: "track3", action: "reverb", value: true }, // Activar reverb en el segundo 2
  //{ time: 4, track: "track3", action: "volume", value: { start: -24, end: -6, duration: 2 } }, // Cambiar volumen progresivamente entre el segundo 4 y 6
  { time: 0, track: "track3", action: "filter", value: { start: 20000, end: 500, duration: 3 } }, // Cambiar filtro pasa baja
  { time: 4, track: "track3", action: "filter", value: { start: 500, end: 20000, duration: 3 } },
  { time: 8, track: "track3", action: "filter", value: { start: 20000, end: 500, duration: 3 } },
  //{ time: 8, track: "track2", action: "mute", value: true } // Desactivar el mute (activar pista)
];

// Función de automatización general
function automateMixer() {

  const now = Tone.now();

  // Iterar sobre la tabla de cronograma
  automationSchedule.forEach((event) => {
    const track =
      event.track === "track1" ? kickTrack :
      event.track === "track2" ? snareTrack :
      event.track === "track3" ? melodyTrack :
      event.track === "track4" ? clapTrack :
      event.track === "track5" ? chordsTrack :
      bassTrack;
    const filter  = event.track === "track1" ? kickFilter :
      event.track === "track2" ? snareFilter :
      event.track === "track3" ? melodyFilter :
      event.track === "track4" ? clapFilter :
      event.track === "track5" ? chordsFilter:
      bassFilter;

    if (event.action === "reverb") {
      const reverbButton = document.getElementById(`reverb-${event.track}`);
      // Automatizar reverb
      Tone.Transport.scheduleOnce(() => {
        if (event.value) {
          filter.connect(reverb);
          reverbButton.classList.remove("inactive");
          reverbButton.classList.add("active");
        } else {
          filter.disconnect(reverb);
          reverbButton.classList.remove("active");
          reverbButton.classList.add("inactive");
        }
      }, now + event.time);
    } else if (event.action === "volume") {
      const volumeSlider = document.getElementById(`volume-${event.track}`);
      // Automatizar volumen progresivo
      Tone.Transport.scheduleOnce(() => {
        const volumeParam = track.volume;
        const { start, end, duration } = event.value;

        // Actualizar visualmente el deslizador
        volumeSlider.value = start; // Establecer al valor inicial
        const interval = 100; // Milisegundos entre actualizaciones visuales
        const steps = duration / (interval / 1000); // Número de pasos
        const stepValue = (end - start) / steps;

        let step = 0;
        const visualUpdate = setInterval(() => {
          const currentValue = parseFloat(volumeSlider.value);
          const newValue = currentValue + stepValue;
        
          // Si stepValue es positivo, no debe sobrepasar el valor máximo (end)
          // Si stepValue es negativo, no debe sobrepasar el valor mínimo (min)



            volumeSlider.value = newValue // Evitar sobrepasar el valor mínimo

        
          step++;
          if (step >= steps) clearInterval(visualUpdate);
        }, interval);
        

        // Automate volume with Tone.js
        volumeParam.setValueAtTime(start, now + event.time); // Inicio
        volumeParam.linearRampToValueAtTime(end, now + event.time + duration); // Cambio progresivo
      }, now + event.time);
    } else if (event.action === "filter") {
      const filterSlider = document.getElementById(`filter-${event.track}`);
      // Automatizar filtro pasa baja
      Tone.Transport.scheduleOnce(() => {
        const { start, end, duration } = event.value;

        // Actualizar visualmente el deslizador
        filterSlider.value = start; // Establecer al valor inicial
        const interval = 100;
        const steps = duration / (interval / 1000);
        const stepValue = (end - start) / steps;

        let step = 0;
        const visualUpdate = setInterval(() => {
          const currentValue = parseFloat(filterSlider.value);
          const newValue = currentValue + stepValue;
          
          // Si stepValue es positivo, no debe sobrepasar el valor máximo (end)
          // Si stepValue es negativo, no debe sobrepasar el valor mínimo (min)
          filterSlider.value = newValue; // Evitar sobrepasar el valor mín
          step++;
          if (step >= steps) clearInterval(visualUpdate);
        }, interval);
        

        // Automatizar filtro con Tone.js
        filter.frequency.setValueAtTime(start, now + event.time); // Inicio
        filter.frequency.linearRampToValueAtTime(end, now + event.time + duration); // Cambio progresivo
      }, now + event.time);
    } else if (event.action === "mute") {
      const muteButton = document.getElementById(`mute-${event.track}`);
      // Automatizar mute (encender/apagar pista)
      Tone.Transport.scheduleOnce(() => {
        const isMuted = event.value;

        // Actualizar visualmente el botón de mute
        if (isMuted) {
          muteButton.classList.remove("active");
          muteButton.classList.add("inactive");
          muteButton.innerText = "OFF";
        } else {
          muteButton.classList.remove("inactive");
          muteButton.classList.add("active");
          muteButton.innerText = "ON";
        }

        // Silenciar o restaurar la pista
        if (isMuted) {
          track.volume.setValueAtTime(-Infinity, now + event.time);
        } else {
          track.volume.setValueAtTime(parseFloat(document.querySelector(`#volume-${event.track}`).value), now + event.time);
        }
      }, now + event.time);
    }
  });

  // Arrancar el transporte
  Tone.Transport.start();
}

// Llamar a la función de automatización al pulsar el botón
document.getElementById("automate").addEventListener("click", automateMixer);
