/**
 * Synthesised & Extended Audio Description (SEAD).
 *
 * @license MIT
 * @copyright Nick Freear, 10-April-2026.
 * @see https://github.com/nfreear/audio-describe
 */
import SEADController from './src/ExAudioDescriptionPlayer.js';
import SynthAudioDescriber from './src/SynthAudioDescriber.js';
import MetaVttParser from './src/MetaVttParser.js';
import AudioDescribeElement from './src/util/AudioDescribeElement.js';
import VoiceSelectElement from './src/util/VoiceSelectElement.js';

export {
  MetaVttParser, SynthAudioDescriber,
  AudioDescribeElement, VoiceSelectElement, SEADController
};

export default SEADController;
