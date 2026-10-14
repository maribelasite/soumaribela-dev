import { NextResponse } from 'next/server'

export function readCookie(header: string | null, name: string): string | undefined {
  const matches = (header || '').split(';').map(part => part.trim())
    .filter(part => part.startsWith(`${name}=`))
  if (matches.length !== 1) return undefined
  try { return decodeURIComponent(matches[0].slice(name.length + 1)) } catch { return undefined }
}

export function isSameOriginMutation(request: Request): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false
  const origin = request.headers.get('origin')
  if (!origin) return true
  try { return new URL(origin).origin === new URL(request.url).origin } catch { return false }
}

export function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}
