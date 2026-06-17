import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Laugh,
  LoaderCircle,
  Megaphone,
  Play,
  RadioTower,
  Sparkles,
  ThumbsUp,
  Volume2,
  Waves
} from 'lucide-react';

const soundPads = [
  {
    id: 'meta-ping',
    title: 'Meta Ping',
    subtitle: 'notification sparkle',
    icon: Sparkles,
    color: 'border-blue-500',
    description: 'Bright social-network chime with a glossy sci-fi tail.'
  },
  {
    id: 'robot-laugh',
    title: 'Robot Laugh',
    subtitle: 'ha-ha-ha protocol',
    icon: Laugh,
    color: 'border-purple-500',
    description: 'A dry synthetic laugh built from stepped square waves.'
  },
  {
    id: 'hoodie-bass',
    title: 'Hoodie Bass',
    subtitle: 'founder entrance',
    icon: Waves,
    color: 'border-green-500',
    description: 'A rounded bass bump for dramatic product-demo arrivals.'
  },
  {
    id: 'like-pop',
    title: 'Like Pop',
    subtitle: 'thumbs-up snap',
    icon: ThumbsUp,
    color: 'border-hud-neon',
    description: 'Fast tap, bounce, and reward blip for every button press.'
  },
  {
    id: 'metaverse-portal',
    title: 'Metaverse Portal',
    subtitle: 'vr room opens',
    icon: RadioTower,
    color: 'border-orange-500',
    description: 'A rising tone sweep with filtered noise for a portal feel.'
  },
  {
    id: 'algorithm-drop',
    title: 'Algorithm Drop',
    subtitle: 'feed ranking slam',
    icon: BrainCircuit,
    color: 'border-pink-500',
    description: 'Descending synth sweep that lands with a tiny data thud.'
  },
  {
    id: 'congress-loading',
    title: 'Congress Loading',
    subtitle: 'buffering answer',
    icon: LoaderCircle,
    color: 'border-yellow-500',
    description: 'Awkward loading clicks and error tones for dramatic pauses.'
  },
  {
    id: 'zuck-boot',
    title: 'Zuck Boot',
    subtitle: 'android startup',
    icon: Bot,
    color: 'border-cyan-400',
    description: 'Sequential boot beeps that end in a confident synth chirp.'
  }
];

const phrases = [
  'Launching the social graph.',
  'The algorithm has thoughts.',
  'Privacy settings are very important to us.',
  'I am definitely a normal human founder.',
  'Move fast and break the silence.',
  'Your headset is ready for the metaverse.'
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
};

const deterministicNoiseSample = (index) => {
  const raw = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return (raw - Math.floor(raw)) * 2 - 1;
};

export default function Home() {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const [activePad, setActivePad] = useState(null);
  const [selectedPhrase, setSelectedPhrase] = useState(phrases[0]);
  const [intensity, setIntensity] = useState(70);
  const [pitch, setPitch] = useState(0.7);
  const [rate, setRate] = useState(0.86);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('Audio system armed. Tap a pad to synthesize a sound effect.');

  const ensureAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = getAudioContext();
    }

    const context = audioContextRef.current;

    if (!context) {
      setStatus('This browser does not expose the Web Audio API.');
      return null;
    }

    if (!masterGainRef.current) {
      masterGainRef.current = context.createGain();
      masterGainRef.current.gain.value = 0.75;
      masterGainRef.current.connect(context.destination);
    }

    if (context.state === 'suspended') {
      context.resume();
    }

    return { context, output: masterGainRef.current };
  };

  const scheduleTone = ({ frequency, start = 0, duration = 0.18, type = 'sine', gain = 0.25, endFrequency }) => {
    const audio = ensureAudio();
    if (!audio) return;

    const { context, output } = audio;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime + start;
    const scaledGain = gain * (intensity / 100);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    }

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(Math.max(scaledGain, 0.0001), now + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  };

  const scheduleNoise = ({ start = 0, duration = 0.3, gain = 0.15, frequency = 900, type = 'bandpass' }) => {
    const audio = ensureAudio();
    if (!audio) return;

    const { context, output } = audio;
    const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = deterministicNoiseSample(i);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    const now = context.currentTime + start;

    source.buffer = buffer;
    filter.type = type;
    filter.frequency.setValueAtTime(frequency, now);
    filter.frequency.exponentialRampToValueAtTime(frequency * 0.45, now + duration);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain * (intensity / 100), now + 0.03);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(output);
    source.start(now);
    source.stop(now + duration);
  };

  const playSound = (pad) => {
    setActivePad(pad.id);
    setStatus(`Synthesizing ${pad.title}...`);

    switch (pad.id) {
      case 'meta-ping':
        [523.25, 659.25, 987.77].forEach((frequency, index) => {
          scheduleTone({ frequency, start: index * 0.08, duration: 0.22, type: 'triangle', gain: 0.2 });
        });
        scheduleTone({ frequency: 1567.98, start: 0.25, duration: 0.26, type: 'sine', gain: 0.12 });
        break;
      case 'robot-laugh':
        [220, 185, 220, 185, 246.94, 196].forEach((frequency, index) => {
          scheduleTone({ frequency, start: index * 0.09, duration: 0.075, type: 'square', gain: 0.18 });
        });
        break;
      case 'hoodie-bass':
        scheduleTone({ frequency: 92, endFrequency: 48, duration: 0.48, type: 'triangle', gain: 0.38 });
        scheduleTone({ frequency: 184, endFrequency: 92, start: 0.03, duration: 0.28, type: 'sine', gain: 0.16 });
        break;
      case 'like-pop':
        scheduleNoise({ duration: 0.06, gain: 0.11, frequency: 2400, type: 'highpass' });
        scheduleTone({ frequency: 740, start: 0.04, duration: 0.11, type: 'sine', gain: 0.2 });
        scheduleTone({ frequency: 1180, start: 0.12, duration: 0.13, type: 'triangle', gain: 0.13 });
        break;
      case 'metaverse-portal':
        scheduleNoise({ duration: 0.72, gain: 0.11, frequency: 1800 });
        scheduleTone({ frequency: 130.81, endFrequency: 987.77, duration: 0.82, type: 'sawtooth', gain: 0.16 });
        scheduleTone({ frequency: 392, endFrequency: 1567.98, start: 0.1, duration: 0.7, type: 'sine', gain: 0.1 });
        break;
      case 'algorithm-drop':
        scheduleTone({ frequency: 1244.51, endFrequency: 146.83, duration: 0.6, type: 'sawtooth', gain: 0.2 });
        scheduleTone({ frequency: 65.41, start: 0.52, duration: 0.22, type: 'triangle', gain: 0.32 });
        scheduleNoise({ start: 0.5, duration: 0.12, gain: 0.08, frequency: 500, type: 'lowpass' });
        break;
      case 'congress-loading':
        [360, 360, 310, 260, 210].forEach((frequency, index) => {
          scheduleTone({ frequency, start: index * 0.13, duration: 0.055, type: 'square', gain: 0.15 });
        });
        scheduleTone({ frequency: 120, start: 0.75, duration: 0.18, type: 'sawtooth', gain: 0.12 });
        break;
      case 'zuck-boot':
        [180, 240, 320, 480, 640, 960].forEach((frequency, index) => {
          scheduleTone({ frequency, start: index * 0.075, duration: 0.06, type: 'square', gain: 0.13 });
        });
        scheduleTone({ frequency: 1280, start: 0.5, duration: 0.24, type: 'triangle', gain: 0.18 });
        break;
      default:
        scheduleTone({ frequency: 440 });
    }

    window.setTimeout(() => {
      setActivePad(null);
      setStatus(`${pad.title} rendered. Choose another pad or launch a phrase.`);
    }, 950);
  };

  const speakPhrase = () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setStatus('This browser does not support synthetic speech playback.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedPhrase);
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus('Synthetic founder phrase is broadcasting...');
      scheduleTone({ frequency: 440, duration: 0.08, type: 'square', gain: 0.09 });
      scheduleTone({ frequency: 660, start: 0.09, duration: 0.08, type: 'square', gain: 0.09 });
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus('Phrase complete. No real-person audio samples were used.');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatus('Synthetic speech playback was interrupted.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const selectNextPhrase = () => {
    const currentIndex = phrases.indexOf(selectedPhrase);
    const nextIndex = (currentIndex + 1) % phrases.length;
    setSelectedPhrase(phrases[nextIndex]);
    setStatus('Phrase cartridge swapped.');
  };

  return (
    <div className="flex flex-col gap-10 w-full min-h-[calc(100vh-8rem)] py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-hud-neon/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 border border-hud-border bg-black/40 rounded-full px-4 py-2 mb-6 font-mono text-xs uppercase tracking-[0.3em] text-hud-neon">
          <CircuitBoard size={14} />
          Parody Synth Console
        </div>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wide uppercase">
          Mark Zuckerberg <br />
          <span className="neon-text block mt-2">Sound Effects</span>
        </h1>
        <p className="font-mono text-gray-400 max-w-2xl mx-auto text-sm md:text-base tracking-widest uppercase mt-6">
          Tap a pad for playful startup pings, robot laughs, metaverse sweeps, and synthetic founder phrases.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-6">
          <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.25em] mb-2">Status Console</p>
              <p className="font-mono text-hud-neon">{status}</p>
            </div>
            <div className="min-w-[240px]">
              <label className="flex justify-between font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
                <span>Effect Intensity</span>
                <span className="text-hud-neon">{intensity}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-full accent-hud-neon"
              />
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {soundPads.map((pad) => {
              const Icon = pad.icon;
              const isActive = activePad === pad.id;

              return (
                <motion.div key={pad.id} variants={itemVariants}>
                  <button
                    type="button"
                    onClick={() => playSound(pad)}
                    className={`glass-panel h-full w-full p-6 text-left border-t-2 ${pad.color} transition-all duration-300 group ${
                      isActive ? 'scale-[1.02] shadow-neon bg-hud-neon/10' : 'hover:-translate-y-2 hover:shadow-neon'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-black/50 border ${pad.color} text-white group-hover:text-hud-neon transition-colors duration-300`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h2 className="font-mono font-bold text-lg text-white tracking-widest group-hover:text-hud-neon transition-colors duration-300">
                          {pad.title}
                        </h2>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{pad.subtitle}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed mb-5">
                      {pad.description}
                    </p>

                    <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                      <span className="text-gray-500">Tap to play</span>
                      <span className={`flex items-center gap-2 ${isActive ? 'text-hud-neon' : 'text-gray-600 group-hover:text-hud-neon'}`}>
                        <Play size={14} />
                        {isActive ? 'Rendering' : 'Ready'}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1 h-1 bg-hud-neon rounded-full" />
                      <div className="w-1 h-1 bg-hud-neon rounded-full" />
                      <div className="w-1 h-1 bg-hud-neon rounded-full" />
                    </div>
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <aside className="glass-panel p-6 border-t-2 border-hud-neon h-fit xl:sticky xl:top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-black/50 border border-hud-neon text-hud-neon">
              <Megaphone size={24} />
            </div>
            <div>
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">Phrase Launcher</h2>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Synthetic browser speech</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-2">Phrase Cartridge</span>
              <select
                value={selectedPhrase}
                onChange={(event) => setSelectedPhrase(event.target.value)}
                className="hud-input appearance-none"
              >
                {phrases.map((phrase) => (
                  <option key={phrase} value={phrase}>{phrase}</option>
                ))}
              </select>
            </label>

            <div>
              <label className="flex justify-between font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
                <span>Pitch</span>
                <span className="text-hud-neon">{pitch.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.4"
                step="0.01"
                value={pitch}
                onChange={(event) => setPitch(Number(event.target.value))}
                className="w-full accent-hud-neon"
              />
            </div>

            <div>
              <label className="flex justify-between font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
                <span>Rate</span>
                <span className="text-hud-neon">{rate.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.65"
                max="1.2"
                step="0.01"
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
                className="w-full accent-hud-neon"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={selectNextPhrase} className="hud-button px-3">
                Next
              </button>
              <button
                type="button"
                onClick={speakPhrase}
                disabled={isSpeaking}
                className="hud-button px-3 disabled:opacity-50 disabled:cursor-wait"
              >
                {isSpeaking ? 'Live' : 'Speak'}
              </button>
            </div>

            <div className="bg-black/40 border border-hud-border rounded-lg p-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-hud-neon mb-3">
                <Volume2 size={14} />
                Disclaimer
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                This is a playful themed soundboard. Effects are generated in your browser and phrases use generic synthetic speech, not recordings or a real voice clone.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs uppercase tracking-widest text-gray-500">
        <div className="glass-panel p-4 flex items-center gap-3">
          <Cpu className="text-hud-neon" size={18} />
          Web Audio Oscillators
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <Bot className="text-hud-neon" size={18} />
          Synthetic Voice Controls
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <RadioTower className="text-hud-neon" size={18} />
          No External Sound Assets
        </div>
      </div>
    </div>
  );
}
