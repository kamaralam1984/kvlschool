import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  return NextResponse.redirect(new URL('/apple-icon', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
}
