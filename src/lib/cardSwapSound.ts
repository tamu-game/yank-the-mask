const CARD_SWAP_URL = "/music/card_swap.mp3";
const SWAP_VOLUME = 0.8;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let loadingPromise: Promise<AudioBuffer | null> | null = null;
let fallbackAudio: HTMLAudioElement | null = null;

const getAudioContext = () => {
  if (audioContext) return audioContext;
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext || (window as WebkitWindow).webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext = new AudioContextClass();
  return audioContext;
};

const getFallbackAudio = () => {
  if (typeof window === "undefined") return null;
  if (fallbackAudio) return fallbackAudio;
  fallbackAudio = new Audio(CARD_SWAP_URL);
  fallbackAudio.preload = "auto";
  fallbackAudio.volume = SWAP_VOLUME;
  return fallbackAudio;
};

const playFallback = () => {
  const baseAudio = getFallbackAudio();
  if (!baseAudio) return;
  const instance = baseAudio.cloneNode(true) as HTMLAudioElement;
  instance.volume = SWAP_VOLUME;
  void instance.play().catch(() => undefined);
};

const loadBuffer = async () => {
  if (audioBuffer) return audioBuffer;
  if (loadingPromise) return loadingPromise;
  if (typeof window === "undefined") return null;
  const context = getAudioContext();
  if (!context) return null;

  loadingPromise = fetch(CARD_SWAP_URL)
    .then((response) => response.arrayBuffer())
    .then((data) => context.decodeAudioData(data))
    .then((buffer) => {
      audioBuffer = buffer;
      return buffer;
    })
    .catch(() => null)
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
};

const playBuffer = (context: AudioContext, buffer: AudioBuffer) => {
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = SWAP_VOLUME;
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(context.destination);
  source.start(0);
};

export const preloadCardSwapSound = () => {
  void loadBuffer();
};

export const playCardSwapSound = () => {
  if (typeof window === "undefined") return;
  const context = getAudioContext();
  if (!context) {
    playFallback();
    return;
  }

  if (context.state === "suspended") {
    void context.resume().catch(() => undefined);
  }

  if (audioBuffer) {
    playBuffer(context, audioBuffer);
    return;
  }

  void loadBuffer().then((buffer) => {
    if (buffer) {
      playBuffer(context, buffer);
      return;
    }
    playFallback();
  });
};
