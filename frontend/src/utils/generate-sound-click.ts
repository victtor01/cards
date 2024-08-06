
export function GenerateSoundClick (): void {
  const sound = new Audio('/sounds/click.wav')
  sound.playbackRate = 1.3
  sound.play()
}