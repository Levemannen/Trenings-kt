from pathlib import Path

import lameenc
import miniaudio
import numpy as np


SOURCE = Path("sounds/treningsbuddy-sport-start.mp3")
TARGETS = [SOURCE, Path("publisering/sounds/treningsbuddy-sport-start.mp3")]
BACKUP = Path("sounds/treningsbuddy-sport-start-original.mp3")

decoded = miniaudio.decode_file(str(SOURCE), output_format=miniaudio.SampleFormat.FLOAT32)
audio = np.frombuffer(decoded.samples, dtype=np.float32).reshape(-1, decoded.nchannels).copy()
rate = decoded.sample_rate

# Detect each bleep from a short-window RMS envelope.
mono = audio.mean(axis=1)
window = max(1, round(rate * 0.005))
envelope = np.sqrt(np.convolve(mono * mono, np.ones(window) / window, mode="same"))
active = envelope > 10 ** (-42 / 20)
edges = np.diff(np.pad(active.astype(np.int8), (1, 1)))
starts = np.where(edges == 1)[0]
ends = np.where(edges == -1)[0]

clean = np.zeros_like(audio)
fade_samples = round(rate * 0.010)
for start, end in zip(starts, ends):
    segment = audio[start:end].copy()
    segment -= segment.mean(axis=0, keepdims=True)
    fade = min(fade_samples, len(segment) // 3)
    if fade:
        curve = np.sin(np.linspace(0, np.pi / 2, fade, endpoint=True)) ** 2
        segment[:fade] *= curve[:, None]
        segment[-fade:] *= curve[::-1, None]
    clean[start:end] = segment

# Add a tiny clean lead-in and keep only a short tail after the final signal.
lead = np.zeros((round(rate * 0.012), decoded.nchannels), dtype=np.float32)
tail_end = min(len(clean), int(ends[-1] + rate * 0.035))
clean = np.concatenate([lead, clean[:tail_end]], axis=0)

# Normalize conservatively to avoid harsh clipping on phone speakers.
peak = float(np.max(np.abs(clean)))
target_peak = 10 ** (-3 / 20)
if peak:
    clean *= target_peak / peak
clean = np.clip(clean, -1, 1)
pcm = (clean * 32767).astype("<i2").tobytes()

encoder = lameenc.Encoder()
encoder.set_bit_rate(192)
encoder.set_in_sample_rate(rate)
encoder.set_channels(decoded.nchannels)
encoder.set_quality(2)
encoded = encoder.encode(pcm) + encoder.flush()

if not BACKUP.exists():
    BACKUP.write_bytes(SOURCE.read_bytes())
for target in TARGETS:
    target.write_bytes(encoded)

print(f"Renset {len(starts)} signaler: {len(audio)/rate:.3f}s -> {len(clean)/rate:.3f}s, {len(encoded)} bytes")
