
export async function GenerateSoundClick (): Promise<void> {
  const sound = new Audio('/sounds/click.wav')
  sound.playbackRate = 1.3
  await sound.play()
}