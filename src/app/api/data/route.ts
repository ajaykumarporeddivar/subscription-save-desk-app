import { NextRequest, NextResponse } from 'next/server'
import { activity, metrics, records } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const limit = Math.min(Number(searchParams.get('limit') ?? 25), 50)
    const filtered = records
      .filter(record => !status || record.status === status)
      .filter(record => !priority || record.priority === priority)
      .slice(0, limit)
      .map(record => ({
        ...record,
        riskBand: record.status === 'blocked' ? 'high' : record.confidence >= 90 ? 'low' : 'medium',
      }))

    return NextResponse.json({
      ok: true,
      filters: { status, priority, limit },
      data: { metrics, records: filtered, activity },
      total: filtered.length,
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to read generated data',
    }, { status: 500 })
  }
}
