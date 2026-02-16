
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const speakGreekWord = async (text: string) => {
  if (!API_KEY) {
    console.error("API Key not found");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    // Use the specific TTS model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ 
          text: `Pronounce the following Koine Greek word clearly: ${text}. 
                 Use a standard scholarly pronunciation (similar to Erasmian but natural).` 
        }] 
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is a good balanced voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      await playRawAudio(base64Audio);
    }
  } catch (error) {
    console.error("Error generating speech:", error);
  }
};

const playRawAudio = async (base64EncodedAudioString: string) => {
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 24000
  });
  const outputNode = outputAudioContext.createGain();
  outputNode.connect(outputAudioContext.destination);

  const audioData = decode(base64EncodedAudioString);
  const audioBuffer = await decodeAudioData(
    audioData,
    outputAudioContext,
    24000,
    1
  );

  const source = outputAudioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(outputNode);
  source.start();
};

// Standard manual decoding as per documentation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
