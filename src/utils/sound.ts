let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function initAudio() {
  getAudioContext()
}

export function playEatSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.06)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12)
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(800, now + 0.05)
    osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.12)
    gain2.gain.setValueAtTime(0.12, now + 0.05)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.05)
    osc2.stop(now + 0.18)
  } catch {
    // audio not available
  }
}

export function playLevelUpChime() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const notes = [523, 659, 784, 1047]
    const duration = 0.12

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * duration)
      gain.gain.setValueAtTime(0, now + i * duration)
      gain.gain.linearRampToValueAtTime(0.2, now + i * duration + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * duration + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * duration)
      osc.stop(now + i * duration + duration)
    })

    const bass = ctx.createOscillator()
    const bassGain = ctx.createGain()
    bass.type = 'triangle'
    bass.frequency.setValueAtTime(130, now)
    bass.frequency.linearRampToValueAtTime(200, now + 0.5)
    bassGain.gain.setValueAtTime(0.1, now)
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
    bass.connect(bassGain)
    bassGain.connect(ctx.destination)
    bass.start(now)
    bass.stop(now + 0.5)
  } catch {
    // audio not available
  }
}

export function playDamageSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25)
    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)

    const noise = ctx.createOscillator()
    const noiseGain = ctx.createGain()
    noise.type = 'square'
    noise.frequency.setValueAtTime(150, now)
    noise.frequency.exponentialRampToValueAtTime(40, now + 0.2)
    noiseGain.gain.setValueAtTime(0.08, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + 0.25)
  } catch {
    // audio not available
  }
}

function randomBetween(a: number, b: number): number {
  return a + Math.random() * (b - a)
}

const PRAISE_PHRASES: { text: string; mood: 'excited' | 'cool' | 'cheerful' }[] = [
  { text: 'Amazing!', mood: 'excited' },
  { text: 'Excellent!', mood: 'excited' },
  { text: 'Great job!', mood: 'cheerful' },
  { text: 'Wonderful!', mood: 'excited' },
  { text: 'Fantastic!', mood: 'excited' },
  { text: 'Unbelievable!', mood: 'excited' },
  { text: 'Good!', mood: 'cool' },
  { text: 'Awesome!', mood: 'excited' },
  { text: 'Incredible!', mood: 'excited' },
  { text: 'Perfect!', mood: 'cool' },
  { text: 'So good!', mood: 'cheerful' },
  { text: 'Nice!', mood: 'cool' },
  { text: 'Wow!', mood: 'excited' },
  { text: 'Keep going!', mood: 'cheerful' },
  { text: 'Brilliant!', mood: 'excited' },
]

export function speakPraise() {
  try {
    const phrase = PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)]
    const utterance = new SpeechSynthesisUtterance(phrase.text)
    utterance.lang = 'en-US'

    switch (phrase.mood) {
      case 'excited':
        utterance.pitch = randomBetween(1.3, 1.7)
        utterance.rate = randomBetween(0.85, 1.0)
        utterance.volume = 1
        break
      case 'cheerful':
        utterance.pitch = randomBetween(1.2, 1.45)
        utterance.rate = randomBetween(0.9, 1.05)
        utterance.volume = 0.95
        break
      case 'cool':
        utterance.pitch = randomBetween(1.0, 1.25)
        utterance.rate = randomBetween(0.85, 0.95)
        utterance.volume = 0.9
        break
    }

    speechSynthesis.speak(utterance)
  } catch {
    // speech not available
  }
}

let blessingNodes: OscillatorNode[] = []
let blessingGains: GainNode[] = []
let blessingRunning = false

export function playBlessingBGM() {
  if (blessingRunning) return
  blessingRunning = true
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const rootNote = 196

    const chord = [rootNote, rootNote * 5 / 4, rootNote * 3 / 2, rootNote * 2]
    const lfoRate = 0.3

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      lfo.type = 'sine'
      lfo.frequency.setValueAtTime(lfoRate * (i + 1) * 0.7, now)
      lfoGain.gain.setValueAtTime(8, now)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      const delay = i * 0.15
      gain.gain.setValueAtTime(0, now + delay)
      gain.gain.linearRampToValueAtTime(0.06, now + delay + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      lfo.start(now)

      blessingNodes.push(osc, lfo)
      blessingGains.push(gain, lfoGain)
    })

    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmer.type = 'triangle'
    shimmer.frequency.setValueAtTime(800, now)
    shimmer.frequency.linearRampToValueAtTime(2000, now + 5)
    shimmerGain.gain.setValueAtTime(0.02, now)
    shimmerGain.gain.linearRampToValueAtTime(0.04, now + 3)
    shimmerGain.gain.linearRampToValueAtTime(0.01, now + 6)
    shimmer.connect(shimmerGain)
    shimmerGain.connect(ctx.destination)
    shimmer.start(now)
    blessingNodes.push(shimmer)
    blessingGains.push(shimmerGain)
  } catch {
    blessingRunning = false
  }
}

export function stopBlessingBGM() {
  blessingRunning = false
  try {
    blessingNodes.forEach((n) => {
      try { n.stop() } catch { /* already stopped */ }
    })
    blessingNodes = []
    blessingGains = []
  } catch {
    // cleanup
  }
}