import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Update section
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await req.json()
    const { title, description, steps } = body

    // Delete existing steps and create new ones
    await prisma.documentationStep.deleteMany({
      where: { sectionId: params.id }
    })

    const updatedSection = await prisma.documentationSection.update({
      where: { id: params.id },
      data: {
        title,
        description,
        steps: {
          create: steps?.map((step: any, index: number) => ({
            title: step.title,
            content: step.content,
            imageUrl: step.imageUrl,
            order: index
          })) || []
        }
      },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedSection)
  } catch (error) {
    console.error('Failed to update section:', error)
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}

// DELETE - Delete section
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.documentationSection.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete section:', error)
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    )
  }
}
