import { API_BASE_URL } from '@/services/api'

const FALLBACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <circle cx="200" cy="200" r="120" fill="rgba(255,255,255,0.2)"/>
  <path d="M0 700 L300 450 L520 650 L780 380 L1200 700 V800 H0 Z" fill="rgba(255,255,255,0.25)"/>
  <text x="50%" y="50%" fill="white" font-size="48" font-family="Arial, sans-serif" text-anchor="middle">OsamVista</text>
</svg>
`

export const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG)}`

const isAbsoluteUrl = (url) => /^(https?:)?\/\//i.test(url)
const isDataUrl = (url) => /^data:/i.test(url)
const isBlobUrl = (url) => /^blob:/i.test(url)

const getProtocol = () => {
  if (typeof window !== 'undefined' && window.location?.protocol) {
    return window.location.protocol
  }
  return 'https:'
}

export const resolveImageUrl = (value) => {
  if (!value) return ''
  const url = String(value).trim()
  if (!url) return ''

  if (isDataUrl(url) || isBlobUrl(url)) return url

  if (isAbsoluteUrl(url)) {
    if (url.startsWith('//')) return `${getProtocol()}${url}`
    return url
  }

  const base = (API_BASE_URL || '').replace(/\/$/, '')
  if (!base) return url

  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

export const withFallback = (value) => resolveImageUrl(value) || FALLBACK_IMAGE
