const imageCache = new Set<string>()

export function useImageCache(target: string) {
  if (!imageCache.has(target)) {
    throw new Promise<void>((resolve) => {
      const img = new Image()
      img.src = target
      img.onload = () => {
        imageCache.add(target)
        resolve()
      }
      img.onerror = () => {
        imageCache.add(target)
      }
    })
  }
}
