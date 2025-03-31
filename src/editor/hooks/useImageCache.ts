const imageCache = new Set<string>()

export function useImageCache(target: string) {
  if (!imageCache.has(target)) {
    imageCache.add(target)

    throw new Promise<void>((resolve) => {
      const img = new Image()
      img.src = target
      img.onload = () => {
        resolve()
      }
      img.onerror = () => {
        resolve()
      }
    })
  }
}
