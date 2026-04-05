import * as jose from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'secret-must-be-min-32-chars-at-least-longer'
)

export interface JWTPayload {
  sub: string
  email: string
  role: 'CLIENT' | 'ADMIN'
  iat: number
  exp: number
}

export async function signAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return await new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_ACCESS_EXPIRES_IN || '15m')
    .sign(secret)
}

export async function signRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return await new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d')
    .sign(secret)
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (err) {
    return null
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (err) {
    return null
  }
}
