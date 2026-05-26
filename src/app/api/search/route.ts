import { NextRequest, NextResponse } from 'next/server'
import { activity, records } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = (searchParams.get('q') ?? '').trim().toLowerCase()
    const status = searchParams.get('status')
    const minConfidence = Number(searchParams.get('minConfidence') ?? 0)
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)

    const matchingRecords = records
      .filter(record => !status || record.status === status)
      .filter(record => record.confidence >= minConfidence)
      .filter(record => {
        if (!query) return true
        return [
          record.name,
          record.customer,
          record.owner,
          record.status,
          record.priority,
          record.nextStep,
          record.notes,
        ].join(' ').toLowerCase().includes(query)
      })
      .slice(0, limit)
      .map(record => ({
        id: record.id,
        type: 'workflow',
        title: record.name,
        subtitle: record.customer,
        owner: record.owner,
        status: record.status,
        priority: record.priority,
        confidence: record.confidence,
        value: record.value,
        nextStep: record.nextStep,
      }))

    const matchingActivity = activity
      .filter(event => !query || [event.title, event.actor, event.status].join(' ').toLowerCase().includes(query))
      .slice(0, 8)
      .map(event => ({
        id: event.id,
        type: 'activity',
        title: event.title,
        subtitle: event.actor,
        status: event.status,
        timestamp: event.timestamp,
      }))

    return NextResponse.json({
      ok: true,
      query,
      filters: { status, minConfidence, limit },
      results: [...matchingRecords, ...matchingActivity],
      counts: {
        workflows: matchingRecords.length,
        activity: matchingActivity.length,
      },
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Search failed',
      results: [],
    }, { status: 500 })
  }
}
