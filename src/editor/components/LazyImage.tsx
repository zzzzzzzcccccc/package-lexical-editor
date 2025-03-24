import { useImageCache } from '../hooks'

export interface LazyImageProps {
  altText: string
  height: 'inherit' | number
  imageRef: { current: null | HTMLImageElement }
  maxWidth: number
  src: string
  width: 'inherit' | number
  onError: () => void
  className?: string
  attributes?: string | null
}

export function LazyImage(props: LazyImageProps) {
  const { src, altText, imageRef, className, width, height, maxWidth, attributes, onError } = props

  useImageCache(src)

  return (
    <img
      src={src}
      onError={onError}
      ref={imageRef}
      alt={altText}
      className={className}
      style={{ width, height, maxWidth }}
      data-customer-attributes={attributes}
      draggable='false'
    />
  )
}
