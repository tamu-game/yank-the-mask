const TALKING_URL = "/music/talking_male.mp3";
const TALK_VOLUME = 0.7;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let loadingPromise: Promise<AudioBuffer | null> | null = null;
let fallbackAudio: HTMLAudioElement | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentFallbackInstance: HTMLAudioElement | null = null;

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
  fallbackAudio = new Audio(TALKING_URL);
  fallbackAudio.preload = "auto";
  fallbackAudio.volume = TALK_VOLUME;
  return fallbackAudio;
};

const stopWebAudio = () => {
  if (!currentSource) return;
  try {
    currentSource.stop();
  } catch {
    // Ignore stop errors for already-stopped sources.
  }
  currentSource.disconnect();
  currentSource = null;
};

const stopFallback = () => {
  if (!currentFallbackInstance) return;
  currentFallbackInstance.pause();
  currentFallbackInstance.currentTime = 0;
  currentFallbackInstance = null;
};

const loadBuffer = async () => {
  if (audioBuffer) return audioBuffer;
  if (loadingPromise) return loadingPromise;
  if (typeof window === "undefined") return null;
  const context = getAudioContext();
  if (!context) return null;

  loadingPromise = fetch(TALKING_URL)
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
  stopWebAudio();
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = TALK_VOLUME;
  source.buffer = buffer;
  source.loop = true;
  source.connect(gain);
  gain.connect(context.destination);
  currentSource = source;
  source.start(0);
};

const playFallback = () => {
  stopFallback();
  const baseAudio = getFallbackAudio();
  if (!baseAudio) return;
  const instance = baseAudio.cloneNode(true) as HTMLAudioElement;
  instance.loop = true;
  instance.volume = TALK_VOLUME;
  currentFallbackInstance = instance;
  void instance.play().catch(() => undefined);
};

export const preloadTalkingSound = () => {
  void loadBuffer();
};

export const startTalkingSound = () => {
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

export const stopTalkingSound = () => {
  stopWebAudio();
  stopFallback();
};
