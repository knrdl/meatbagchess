// Sounds: Model_Ten
import ourMove from './M10SpacePing.mp3'
import theirMove from './M10SpaceTine.mp3'
import capture from './M10NoiseTom1.mp3'
import check from './M10Snare3.mp3'
import lose from './M10Bass5.mp3'
import undo from './M10RevrsFX.mp3'
import win from './M102Kosm1Em_120.mp3'
import draw from './M10MAJTriad.mp3'
import offer from './M10Warbler.mp3'

type AudioEvent = 'ourMove' | 'theirMove' | 'check' | 'capture' | 'draw' | 'win' | 'lose' | 'undo' | 'offer'

const sounds: Record<AudioEvent, string> = {
    ourMove,
    theirMove,
    check,
    capture,
    draw,
    win,
    lose,
    undo,
    offer,
}

let currentAudio: HTMLAudioElement | null = null

export function playSound(type: AudioEvent) {
    currentAudio?.load() // stop
    currentAudio = new Audio(sounds[type])
    currentAudio.dataset.type = type
    currentAudio.volume = 0.25
    currentAudio.play()
}

export function stopSound(type: AudioEvent) {
    if (currentAudio?.dataset.type === type) currentAudio.load()
}
