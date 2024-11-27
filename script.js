// Crear efectos y nodos
const reverb = new Tone.Reverb(6).toDestination(); // Reverb con un decay de 3 segundos
reverb.wet.value = 0.8;

// Crear sintetizadores para cada pista
Tone.Transport.bpm.value = 127;

const kickTrack = new Tone.Player({
	url: "https://tonejs.github.io/audio/drum-samples/Techno/kick.mp3",
    volume: +6
}).toDestination();
 // Canal para la pista 1
 const snareTrack = new Tone.Player({
	url: "https://tonejs.github.io/audio/drum-samples/Techno/snare.mp3",
    volume: +6
}).toDestination();
const melodyTrack = new Tone.Synth({
    oscillator: {
        type: "triangle" // Onda sawtooth para un sonido más grueso y adecuado para un bajo
    },
    volume: -24  
}).toDestination();
const clapTrack = new Tone.Player({
	url: "https://tonejs.github.io/audio/drum-samples/Kit8/snare.mp3",
    volume: -42
}).toDestination();

const chordsTrack = new Tone.PolySynth({
    oscillator : {type: "sawtooth"}
}).toDestination();   

// Muted means on, i missed in the begging and now it's all messed up
let isMutedTrack1 = true;
let isMutedTrack2 = true;
let isMutedTrack3 = true;
let isMutedTrack4 = true;
let isMutedTrack5= true;
let isReverbConnectedTrack1 = false; 
let isReverbConnectedTrack2 = false; 
let isReverbConnectedTrack3 = false;
let isReverbConnectedTrack4 = false;
let isReverbConnectedTrack5 = false;

// Control de volumen
kickTrack.volume.value = -12;
snareTrack.volume.value = -12; 
melodyTrack.volume.value = -12;
clapTrack.volume.value = -18;
chordsTrack.volume.value = -12;
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
const chord1 = ["G4","A#4","D4"];
const chord2 = ["F4","A4","D4"];
const chord3 = ["G4","A#3","D4"];

Tone.Transport.scheduleRepeat((time) => {
    chordsTrack.triggerAttackRelease(chords[0], "16n", time); 
    chordsTrack.triggerAttackRelease(chords[0], "16n", time + Tone.Time("8n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[1], "16n", time + Tone.Time("4n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[1], "16n", time + Tone.Time("4n").toSeconds() + Tone.Time("8n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[2], "16n", time + Tone.Time("2n").toSeconds()); 
    chordsTrack.triggerAttackRelease(chords[2], "16n", time + Tone.Time("2n").toSeconds() + Tone.Time("8n").toSeconds()+ Tone.Time("16n").toSeconds());
    chordsTrack.triggerAttackRelease(chords[2], "16n", time + Tone.Time("2n").toSeconds() + Tone.Time("4n").toSeconds()+ Tone.Time("16n").toSeconds()); 
}, "1n");





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
                chordsTrack;
  const controlButton = document.getElementById(`${controlType}-${trackId}`);
  let isControlActive;

  if (controlType === "mute") {
    isControlActive = trackId === "track1" ? isMutedTrack1 :
                    trackId === "track2" ? isMutedTrack2 :
                    trackId === "track3" ? isMutedTrack3 :
                    trackId === "track4" ? isMutedTrack4 :
                    isMutedTrack5;
    if (isControlActive) {
      synth.volume.value = -Infinity; // Silenciar la pista
      controlButton.classList.remove('active');
      controlButton.classList.add('inactive');
    } else {
      synth.volume.value = -12; // Restaurar volumen original
      controlButton.classList.remove('inactive');
      controlButton.classList.add('active');
    }
    if (trackId === "track1") isMutedTrack1 = !isMutedTrack1;
    else if (trackId === "track2")isMutedTrack2 = !isMutedTrack2;
        else if (trackId === "track3")isMutedTrack3 = !isMutedTrack3;
            else if (trackId === "track4")isMutedTrack4 = !isMutedTrack4;
                else if (trackId === "track5")isMutedTrack5 = !isMutedTrack5;

  } else if (controlType === "reverb") {
    isControlActive = trackId === "track1" ? isReverbConnectedTrack1 :
                    trackId === "track2" ? isReverbConnectedTrack2 :
                    trackId === "track3" ? isReverbConnectedTrack3 :
                    trackId === "track4" ? isReverbConnectedTrack4 :
                    isReverbConnectedTrack5;
    if (isControlActive) {
      synth.disconnect(reverb); // Desconectar reverb
      controlButton.classList.remove('active');
      controlButton.classList.add('inactive');
    } else {
      synth.connect(reverb); // Conectar reverb
      controlButton.classList.remove('inactive');
      controlButton.classList.add('active');
    }
    if (trackId === "track1") isReverbConnectedTrack1 = !isReverbConnectedTrack1;
    else if(trackId === "track2") isReverbConnectedTrack2 = !isReverbConnectedTrack2;
    else if(trackId === "track3") {isReverbConnectedTrack3 = !isReverbConnectedTrack3;} 
    else if(trackId === "track4") {isReverbConnectedTrack4 = !isReverbConnectedTrack4;}  
    else if(trackId === "track5") {isReverbConnectedTrack5 = !isReverbConnectedTrack5;} 
  }
}

// Controles para la pista 1
document.getElementById("volume-track1").addEventListener("input", (e) => {
  kickTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
});

// Pista 1: Mute y Reverb
document.getElementById("mute-track1").addEventListener("click", () => toggleControl("track1", "mute"));
document.getElementById("reverb-track1").addEventListener("click", () => toggleControl("track1", "reverb"));

// Controles para la pista 2
document.getElementById("volume-track2").addEventListener("input", (e) => {
  snareTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track2").addEventListener("click", () => toggleControl("track2", "mute"));
document.getElementById("reverb-track2").addEventListener("click", () => toggleControl("track2", "reverb"));


document.getElementById("volume-track3").addEventListener("input", (e) => {
    melodyTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track3").addEventListener("click", () => toggleControl("track3", "mute"));
document.getElementById("reverb-track3").addEventListener("click", () => toggleControl("track3", "reverb"));


document.getElementById("volume-track4").addEventListener("input", (e) => {
    clapTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track4").addEventListener("click", () => toggleControl("track4", "mute"));
document.getElementById("reverb-track4").addEventListener("click", () => toggleControl("track4", "reverb"));


document.getElementById("volume-track5").addEventListener("input", (e) => {
    chordsTrack.volume.value = parseFloat(e.target.value); // Cambiar volumen con el deslizador
});

// Pista 2: Mute y Reverb
document.getElementById("mute-track5").addEventListener("click", () => toggleControl("track5", "mute"));
document.getElementById("reverb-track5").addEventListener("click", () => toggleControl("track5", "reverb"));