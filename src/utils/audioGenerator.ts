import { MusicMood } from '../types/story';

// Synthesize seamless cinematic background music using Web Audio API and generate clean WAV buffers
export class MusicSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Generate an offline rendered audio WAV Blob for a given mood and duration (in seconds)
  public async renderMusicWav(mood: MusicMood, durationSeconds: number = 30): Promise<Blob> {
    const sampleRate = 44100;
    const numChannels = 2;
    const length = Math.floor(sampleRate * durationSeconds);
    const offlineCtx = new OfflineAudioContext(numChannels, length, sampleRate);

    // Create chords & motifs based on mood
    const masterGain = offlineCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, 0);
    masterGain.connect(offlineCtx.destination);

    // Fade in and fade out
    masterGain.gain.setValueAtTime(0.01, 0);
    masterGain.gain.exponentialRampToValueAtTime(0.35, 2.5);
    masterGain.gain.setValueAtTime(0.35, Math.max(0, durationSeconds - 3));
    masterGain.gain.exponentialRampToValueAtTime(0.01, durationSeconds);

    let chordFrequencies: number[][] = [];
    if (mood === 'emotional') {
      // Am - F - C - G
      chordFrequencies = [
        [220, 261.63, 329.63, 440], // A3, C4, E4, A4
        [174.61, 220, 261.63, 349.23], // F3, A3, C4, F4
        [130.81, 164.81, 196, 261.63], // C3, E3, G3, C4
        [196, 246.94, 293.66, 392], // G3, B3, D4, G4
      ];
    } else if (mood === 'peaceful') {
      // Cmaj7 - Em7 - Fmaj7 - Gsus4
      chordFrequencies = [
        [130.81, 196, 246.94, 329.63], // Cmaj7
        [164.81, 196, 246.94, 329.63], // Em7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [196, 261.63, 293.66, 392], // Gsus4
      ];
    } else if (mood === 'uplifting') {
      // D - G - Bm - A
      chordFrequencies = [
        [146.83, 220, 293.66, 369.99], // D
        [196, 246.94, 293.66, 392], // G
        [123.47, 185, 246.94, 293.66], // Bm
        [220, 277.18, 329.63, 440], // A
      ];
    } else {
      // energetic: upbeat rhythm motif
      chordFrequencies = [
        [130.81, 196, 261.63, 392],
        [174.61, 261.63, 349.23, 440],
        [146.83, 220, 293.66, 440],
        [196, 293.66, 392, 587.33],
      ];
    }

    const chordDuration = 4.0;
    const numChordCycles = Math.ceil(durationSeconds / (chordDuration * chordFrequencies.length));

    let time = 0;
    for (let c = 0; c < numChordCycles && time < durationSeconds; c++) {
      for (const chord of chordFrequencies) {
        if (time >= durationSeconds) break;
        // Pad synthesizer
        for (const freq of chord) {
          const osc = offlineCtx.createOscillator();
          const noteGain = offlineCtx.createGain();

          osc.type = mood === 'energetic' ? 'sawtooth' : 'sine';
          osc.frequency.setValueAtTime(freq, time);

          // Subtle filter
          const filter = offlineCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(mood === 'energetic' ? 1200 : 800, time);

          noteGain.gain.setValueAtTime(0.001, time);
          noteGain.gain.linearRampToValueAtTime(0.05, time + 0.8);
          noteGain.gain.setValueAtTime(0.05, time + chordDuration - 0.6);
          noteGain.gain.linearRampToValueAtTime(0.001, time + chordDuration);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(time);
          osc.stop(time + chordDuration);
        }

        // Add soft arpeggio / bell pulse
        for (let step = 0; step < 4; step++) {
          const stepTime = time + step * 1.0;
          if (stepTime >= durationSeconds) break;

          const arpFreq = chord[(step % chord.length)] * 2;
          const arpOsc = offlineCtx.createOscillator();
          const arpGain = offlineCtx.createGain();

          arpOsc.type = 'triangle';
          arpOsc.frequency.setValueAtTime(arpFreq, stepTime);

          arpGain.gain.setValueAtTime(0.04, stepTime);
          arpGain.gain.exponentialRampToValueAtTime(0.0001, stepTime + 0.9);

          arpOsc.connect(arpGain);
          arpGain.connect(masterGain);

          arpOsc.start(stepTime);
          arpOsc.stop(stepTime + 0.95);
        }

        time += chordDuration;
      }
    }

    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWavBlob(renderedBuffer);
  }
}

// Convert AudioBuffer to standard WAV Blob
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');

  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Interleave channel samples
  let offset = 44;
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channelData[ch][i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Convert base64 WAV to Audio element or AudioBuffer
export function base64ToAudioBlob(base64Data: string, mimeType: string = 'audio/wav'): Blob {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export const musicSynthesizer = new MusicSynthesizer();
