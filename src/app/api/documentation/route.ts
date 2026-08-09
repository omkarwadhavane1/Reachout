import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminCheck'

// GET - Fetch all documentation
export async function GET() {
  try {
    const sections = await prisma.documentationSection.findMany({
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Failed to fetch documentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documentation' },
      { status: 500 }
    )
  }
}

// POST - Create new section
export async function POST(req: NextRequest) {
  try {
    // 🔐 ADMIN CHECK (THIS IS THE KEY FIX)
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, description, steps } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Get highest order
    const maxOrder = await prisma.documentationSection.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const newSection = await prisma.documentationSection.create({
      data: {
        title,
        description,
        order: (maxOrder?.order ?? -1) + 1,
        steps: {
          create:
            steps?.map((step: any, index: number) => ({
              title: step.title,
              content: step.content,
              imageUrl: step.imageUrl,
              order: index
            })) || []
        }
      },
      include: {
        steps: { orderBy: { order: 'asc' } }
      }
    })

    return NextResponse.json(newSection, { status: 201 })
  } catch (error) {
    console.error('Failed to create section:', error)
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    )
  }
}