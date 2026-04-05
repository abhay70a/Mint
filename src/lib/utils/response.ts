import { NextResponse } from 'next/server'

export function successResponse(data: any, meta?: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status }
  )
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
  field?: string
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        field,
      },
    },
    { status }
  )
}
