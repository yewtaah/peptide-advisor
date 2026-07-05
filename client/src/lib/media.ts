export function attachAndPlay(
  video: HTMLVideoElement,
  stream: MediaStream,
  onNeedsUnmute: () => void,
) {
  video.srcObject = stream;
  video.muted = false;
  video.play().catch(() => {
    // Autoplay-with-sound was blocked; fall back to muted playback and
    // let the user opt back into sound with a fresh click.
    video.muted = true;
    video.play().catch(() => {});
    onNeedsUnmute();
  });
}
