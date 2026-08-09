import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sectionIds } = body // Array of section IDs in new order

    // Update each section's order
    const updates = sectionIds.map((id: string, index: number) =>
      prisma.documentationSection.update({
        where: { id },
        data: { order: index }
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to reorder sections:', error)
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    )
  }
}
