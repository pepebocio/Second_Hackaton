// Create effects
const reverb = new Tone.Reverb(6).toDestination();
reverb.wet.value = 0.8;

//Synthesisors and filters, with their controlers


function createLowPassFilter() {
    return new Tone.Filter({
        type: "lowpass",
        frequency: 20000, // Frecuencia inicial máxima
        rolloff: -12
    }).toDestination();
}

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


function setupFilterControl(trackId, filter) {
  const filterControl = document.getElementById(`filter-${trackId}`);
  filterControl.addEventListener("input", (e) => {
      const value = parseFloat(e.target.value);

      const minFreq = 40; 
      const maxFreq = 20000;
      const logValue = minFreq * Math.pow(maxFreq / minFreq, value / maxFreq); 

      filter.frequency.value = logValue;
  });
}


setupFilterControl("track1", kickFilter);

setupFilterControl("track2", snareFilter);
setupFilterControl("track3", melodyFilter);
setupFilterControl("track4", clapFilter);
setupFilterControl("track5", chordsFilter);  
setupFilterControl("track6", bassFilter); 
for (i=1;i<=6;i++){
  document.getElementById(`filter-track${i}`).value=20000;
}

let isMutedTrack1 = false;
let isMutedTrack2 = false;
let isMutedTrack3 = false;
let isMutedTrack4 = false;
let isMutedTrack5= false;
let isMutedTrack6= false;
let isReverbConnectedTrack1 = false; 
let isReverbConnectedTrack2 = false; 
let isReverbConnectedTrack3 = false;
let isReverbConnectedTrack4 = false;
let isReverbConnectedTrack5 = false;
let isReverbConnectedTrack6 = false;

// volume
kickTrack.volume.value = parseFloat(document.querySelector(`#volume-track1`).value);
snareTrack.volume.value = parseFloat(document.querySelector(`#volume-track2`).value); 
melodyTrack.volume.value = parseFloat(document.querySelector(`#volume-track3`).value);
clapTrack.volume.value = parseFloat(document.querySelector(`#volume-track4`).value);
chordsTrack.volume.value = parseFloat(document.querySelector(`#volume-track5`).value);
bassTrack.volume.value = parseFloat(document.querySelector(`#volume-track6`).value);


// Melodies, drums, chords


function startSounds(){
  Tone.Transport.bpm.value = 120;

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
const melody = ["C4", "D4", "F4","C4", "D4", "F4","C4", "D4", "F4","C4", "D4", "G4","C4", "D4", "F4","F3"];
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

}

startSounds();

//Start and stop button
document.getElementById("startTransport").addEventListener("click", async () => {
  await Tone.start(); 
  Tone.Transport.position = 0;
  Tone.Transport.start();
});

document.getElementById("stopTransport").addEventListener("click", () => {
  Tone.Transport.stop(); 
});

//Control of reverb and mute (could be optimized, because was done to 2 tracks and expanded manually one by one)
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
    if (!isControlActive) {
      synth.volume.value = -Infinity; 
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
      filter.disconnect(reverb); 
      controlButton.classList.remove('active');
      controlButton.classList.add('inactive');
    } else {
      filter.connect(reverb); 
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

//Controls for the diferent tracks (listeners on each button or slider)
//track 1
document.getElementById("volume-track1").addEventListener("input", (e) => {
  if(!isMutedTrack1){
  kickTrack.volume.value = parseFloat(e.target.value); 
  }
});
document.getElementById("mute-track1").addEventListener("click", () => toggleControl("track1", "mute"));
document.getElementById("reverb-track1").addEventListener("click", () => toggleControl("track1", "reverb"));

//track 2
document.getElementById("volume-track2").addEventListener("input", (e) => {
  if(!isMutedTrack2){
  snareTrack.volume.value = parseFloat(e.target.value); 
  }
});
document.getElementById("mute-track2").addEventListener("click", () => toggleControl("track2", "mute"));
document.getElementById("reverb-track2").addEventListener("click", () => toggleControl("track2", "reverb"));

//track 3
document.getElementById("volume-track3").addEventListener("input", (e) => {
  if(!isMutedTrack3){
    melodyTrack.volume.value = parseFloat(e.target.value); 
  }
});
document.getElementById("mute-track3").addEventListener("click", () => toggleControl("track3", "mute"));
document.getElementById("reverb-track3").addEventListener("click", () => toggleControl("track3", "reverb"));

//track 4
document.getElementById("volume-track4").addEventListener("input", (e) => {
  if(!isMutedTrack4){
    clapTrack.volume.value = parseFloat(e.target.value); 
  }
});
document.getElementById("mute-track4").addEventListener("click", () => toggleControl("track4", "mute"));
document.getElementById("reverb-track4").addEventListener("click", () => toggleControl("track4", "reverb"));

//track 5
document.getElementById("volume-track5").addEventListener("input", (e) => {
  if(!isMutedTrack5){
    chordsTrack.volume.value = parseFloat(e.target.value); 
  }
});
document.getElementById("mute-track5").addEventListener("click", () => toggleControl("track5", "mute"));
document.getElementById("reverb-track5").addEventListener("click", () => toggleControl("track5", "reverb"));

//track 6
document.getElementById("volume-track6").addEventListener("input", (e) => {
  if(!isMutedTrack6){
  bassTrack.volume.value = parseFloat(e.target.value); 
  }
});
document.getElementById("mute-track6").addEventListener("click", () => toggleControl("track6", "mute"));
document.getElementById("reverb-track6").addEventListener("click", () => toggleControl("track6", "reverb"));




// Organization of the song. This idea could be used to give the user the chance
//of creating a melody, but would take much more time
const part1=32;
const part2=part1+32;
const part3=part2+32;
const part4=part3+64;
const part5=part4+80;
const part6=part5+64;
const automationSchedule = [
  { time: 0, track: "track1", action: "mute", value: false },
  { time: 0, track: "track1", action: "volume", value: { start: -48, end: -16, duration: 1} }, 
  { time: 0, track: "track2", action: "mute", value: false } ,
  { time: 0, track: "track2", action: "volume", value: { start: -48, end: -18, duration: 1 } }, 
  { time: 0, track: "track3", action: "mute", value: true } ,
  { time: 0, track: "track4", action: "mute", value: true } ,
  { time: 0, track: "track5", action: "mute", value: true }, 
  { time: 0, track: "track6", action: "mute", value: true } ,
  { time: 12, track: "track2", action: "filter", value: { start: 20000, end:15000, duration: 10 } }, 
  //Entra el piano de la melodia y más tarde las palmas
  { time: part1, track: "track3", action: "mute", value: false } ,
  { time: part1, track: "track3", action: "volume", value: { start: -48, end: -12, duration: 16 } }, 
  { time: part1+8, track: "track1", action: "volume", value: { start: -16, end: -24, duration: 8} }, 
  { time: part1+8, track: "track2", action: "volume", value: { start: -18, end: -26, duration: 8 } }, 
  { time: part1+8, track: "track4", action: "filter", value: { start: 20000, end: 16000, duration: 12 } }, 
  { time: part1+12, track: "track4", action: "mute", value: false } ,
  { time: part1+12, track: "track4", action: "volume", value: { start: -40, end: -28, duration: 8 } }, 
  { time: part1+16, track: "track3", action: "volume", value: { start: -12, end: -20, duration: 4 } }, 
  { time: part1+18, track: "track3", action: "reverb", value: true }, 
  { time: part1+20, track: "track1", action: "mute", value: true },
  { time: part1+20, track: "track2", action: "mute", value: true }, 
  { time: part1+20, track: "track4", action: "reverb", value: true },
  //filtro las palmas, aislo la melodia, la filtro, y cierro todo
  { time: part2, track: "track4", action: "filter", value: { start: 16000, end: 14000, duration: 8 } },  
  { time: part2+8, track: "track4", action: "filter", value: { start: 14000, end: 8000, duration: 16 } },
  { time: part2+8, track: "track4", action: "reverb", value: true },
  { time: part2+12, track: "track1", action: "volume", value: { start: -48, end: -20, duration: 8} }, 
  { time: part2+20, track: "track1", action: "mute", value: false },
  //Entran los acordes con la caja
  { time: part3, track: "track2", action: "mute", value: false } ,
  { time: part3, track: "track2", action: "volume", value: { start: -40, end: -20, duration: 12} },
  { time: part3+4, track: "track5", action: "volume", value: { start: -40, end: -18, duration: 16} },
  { time: part3+4, track: "track5", action: "mute", value: false }, 
  { time: part3+8, track: "track2", action: "filter", value: { start: 15000, end:16000, duration: 8 } }, 
  { time: part3+32, track: "track3", action: "volume", value: { start: -20, end: -38, duration: 16 } }, 
  { time: part3+32, track: "track1", action: "volume", value: { start: -20, end: -38, duration: 16 } },
  { time: part3+48, track: "track1", action: "mute", value: true },
  { time: part3+48, track: "track4", action: "mute", value: true },
  { time: part3+48, track: "track3", action: "mute", value: true } ,
  { time: part3+48, track: "track2", action: "filter", value: { start: 16000, end:13000, duration: 16 } },
  { time: part3+64, track: "track2", action: "mute", value: true } ,
  //Entra el bajo
  { time: part4, track: "track5", action: "volume", value: { start: -18, end: -26, duration: 8} },
  { time: part4+4, track: "track6", action: "volume", value: { start: -40, end: -8, duration: 16} },
  { time: part4+6, track: "track5", action: "reverb", value: true },
  { time: part4+8, track: "track6", action: "mute", value: false }, 
  { time: part4+20, track: "track5", action: "filter", value: { start: 20000, end:15000, duration: 16 } },
  { time: part4+27, track: "track4", action: "volume", value: { start: -48, end: -24, duration: 1 } },
  { time: part4+28, track: "track4", action: "mute", value: false },
  { time: part4+28, track: "track4", action: "filter", value: { start: 10000, end: 14000, duration: 16 } }, 
  { time: part4+43, track: "track3", action: "volume", value: { start: -38, end: -16, duration: 1 } },
  { time: part4+46, track: "track3", action: "mute", value: false } ,
  { time: part4+49, track: "track3", action: "mute", value: true } ,
  { time: part4+52, track: "track3", action: "mute", value: false } ,
  { time: part4+55, track: "track3", action: "mute", value: true } ,
  { time: part4+58, track: "track3", action: "mute", value: false } ,
  { time: part4+61, track: "track3", action: "mute", value: true } ,
  { time: part4+64, track: "track3", action: "mute", value: false } ,
  { time: part4+67, track: "track3", action: "mute", value: true } ,
  { time: part4+70, track: "track3", action: "mute", value: false } ,
  { time: part4+72, track: "track3", action: "mute", value: true } ,
  //entra todo
  { time: part5, track: "track2", action: "filter", value: { start: 13000, end: 15000, duration: 8 } },
  { time: part5, track: "track2", action: "mute", value: false } ,
  { time: part5+4, track: "track4", action: "filter", value: { start: 14000, end: 12000, duration: 12 } }, 
  { time: part5+8, track: "track1", action: "volume", value: { start: -38, end: -16, duration: 12 } },
  { time: part5+8, track: "track1", action: "mute", value: false },
  { time: part5+28, track: "track1", action: "mute", value: true },
  { time: part5+28, track: "track2", action: "mute", value: true },
  { time: part5+28, track: "track5", action: "mute", value: true },
  { time: part5+28, track: "track4", action: "mute", value: true }, 
  { time: part5+33, track: "track2", action: "mute", value: false },
  { time: part5+33, track: "track5", action: "mute", value: false },
  { time: part5+33, track: "track3", action: "mute", value: false }, 
  { time: part5+33, track: "track4", action: "mute", value: false },
  //final
  { time: part6, track: "track3", action: "mute", value: true },
  { time: part6, track: "track5", action: "mute", value: true },
  { time: part6, track: "track4", action: "mute", value: true },
  { time: part6, track: "track1", action: "mute", value: false },
  { time: part6+16, track: "track6", action: "mute", value: true },
  { time: part6+20, track: "track1", action: "mute", value: true },
  { time: part6+20, track: "track2", action: "mute", value: true },



];

let isAutomating = false; 

//This functions shares things with the one for controls, maybe they could be fused some way to optimice the code
function automateMixer() {
  if (isAutomating) {
    return; 
  }

  let gifContainer = document.getElementById("automation-gif-container");
  if (!gifContainer) {
    gifContainer = document.createElement("div");
    gifContainer.id = "automation-gif-container";
    gifContainer.style.textAlign = "center";
    gifContainer.style.marginTop = "20px";
    document.body.insertBefore(gifContainer, document.getElementById("tracks-container"));
  }


  gifContainer.innerHTML = `<img src="tecno.gif" alt="Automatizando..." style="width: 200px; height: auto;">`;
  gifContainer.style.display = "block";

  // Block buttons
  document.getElementById("stopTransport").click();
  document.getElementById("startTransport").click();
  document.getElementById("startTransport").disabled = true;
  document.getElementById("stopTransport").disabled = true;
  const automateButton = document.getElementById("automate");
  automateButton.disabled = true; 
  automateButton.classList.add("disabled");


  isAutomating = true;



  const now = Tone.now();

  // Read all the instructions and program them
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

      Tone.Transport.scheduleOnce(() => {
        if (event.value) {
          filter.connect(reverb);
          reverbButton.classList.remove("inactive");
          reverbButton.classList.add("active");
          
          if (event.track === "track1") isReverbConnectedTrack1 = true;
          else if(event.track === "track2") isReverbConnectedTrack2 = true;
          else if(event.track === "track3") {isReverbConnectedTrack3 = true;} 
          else if(event.track === "track4") {isReverbConnectedTrack4 = true;}  
          else if(event.track === "track5") {isReverbConnectedTrack5 = true;} 
          else if(event.track === "track6") {isReverbConnectedTrack6 = true;} 
        } else {
          filter.disconnect(reverb);
          reverbButton.classList.remove("active");
          reverbButton.classList.add("inactive");

          if (event.track === "track1") isReverbConnectedTrack1 = false;
          else if(event.track === "track2") isReverbConnectedTrack2 = false;
          else if(event.track === "track3") {isReverbConnectedTrack3 = false;} 
          else if(event.track === "track4") {isReverbConnectedTrack4 = false;}  
          else if(event.track === "track5") {isReverbConnectedTrack5 = false;} 
          else if(event.track === "track6") {isReverbConnectedTrack6 =false ;} 
        }


      }, now + event.time);
    } else if (event.action === "volume") {
      const volumeSlider = document.getElementById(`volume-${event.track}`);
      
      Tone.Transport.scheduleOnce(() => {
        const volumeParam = track.volume;
        const { start, end, duration } = event.value;

       
        volumeSlider.value = start; 
        const interval = 100;
        const steps = duration / (interval / 1000); 
        const stepValue = (end - start) / steps;
        let step = 0;
        const visualUpdate = setInterval(() => {
          const currentValue = parseFloat(volumeSlider.value);
          const newValue = currentValue + stepValue;
          volumeSlider.value = (newValue);  
          volumeSlider.dispatchEvent(new Event('input'));
          step++;
          if (step >= steps) clearInterval(visualUpdate);
        }, interval);
        

        // Automate volume with Tone.js
        volumeParam.setValueAtTime(start, now + event.time); 
        volumeParam.linearRampToValueAtTime(end, now + event.time + duration); 
      }, now + event.time);
    } else if (event.action === "filter") {
      const filterSlider = document.getElementById(`filter-${event.track}`);
      
      Tone.Transport.scheduleOnce(() => {
        const { start, end, duration } = event.value;

        
        filterSlider.value = start;
        const interval = 100;
        const steps = duration / (interval / 1000);
        const stepValue = (end - start) / steps;

        let step = 0;
        const visualUpdate = setInterval(() => {
          const currentValue = parseFloat(filterSlider.value);
          const newValue = currentValue + stepValue;
          filterSlider.value = newValue;
          step++;
          if (step >= steps) clearInterval(visualUpdate);
        }, interval);
        

        
        filter.frequency.setValueAtTime(40 * Math.pow(20000 / 40, start / 20000), now + event.time); 
        filter.frequency.linearRampToValueAtTime(40 * Math.pow(20000 / 40, end / 20000), now + event.time + duration); // Cambio progresivo
      }, now + event.time);
    } else if (event.action === "mute") {
      const muteButton = document.getElementById(`mute-${event.track}`);
      
      Tone.Transport.scheduleOnce(() => {
        const isMuted = event.value;

        
        if (isMuted) {
          muteButton.classList.remove("active");
          muteButton.classList.add("inactive");
          muteButton.innerText = "OFF";
          track.volume.setValueAtTime(-Infinity, now + event.time);

          if (event.track === "track1") isMutedTrack1 = true;
          else if (event.track === "track2")isMutedTrack2 = true;
              else if (event.track === "track3")isMutedTrack3 = true;
                  else if (event.track === "track4")isMutedTrack4 = true;
                      else if (event.track === "track5")isMutedTrack5 = true;
                        else if (event.track === "track6")isMutedTrack6 = true;
        } else {
          muteButton.classList.remove("inactive");
          muteButton.classList.add("active");
          muteButton.innerText = "ON";
          track.volume.setValueAtTime(parseFloat(document.querySelector(`#volume-${event.track}`).value), now + event.time);
          
          if (event.track === "track1") isMutedTrack1 = false;
          else if (event.track === "track2")isMutedTrack2 = false;
              else if (event.track === "track3")isMutedTrack3 = false;
                  else if (event.track === "track4")isMutedTrack4 = false;
                      else if (event.track === "track5")isMutedTrack5 = false;
                        else if (event.track === "track6")isMutedTrack6 = false;
        }


      }, now + event.time);
    }
  });
  const automationEndTime = 330; 
  Tone.Transport.scheduleOnce(() => {
    isAutomating = false;
    // reactivate buttons
    document.getElementById("startTransport").disabled = false;
    document.getElementById("stopTransport").disabled = false;
  }, now + automationEndTime);

  // Arrancar el transporte
  Tone.Transport.start();
}

document.getElementById("automate").addEventListener("click", automateMixer);
