import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function exportDashboardPDF(element, projectName = 'Startup Intelligence Report') {
  if (!element) {
    throw new Error('Dashboard report area not found')
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#090b10',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  })

  const imageData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imageWidth = pageWidth
  const imageHeight = (canvas.height * imageWidth) / canvas.width

  let heightLeft = imageHeight
  let position = 0

  pdf.addImage(
    imageData,
    'PNG',
    0,
    position,
    imageWidth,
    imageHeight,
    undefined,
    'FAST'
  )

  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imageHeight

    pdf.addPage()

    pdf.addImage(
      imageData,
      'PNG',
      0,
      position,
      imageWidth,
      imageHeight,
      undefined,
      'FAST'
    )

    heightLeft -= pageHeight
  }

  const safeName = String(projectName)
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  pdf.save(`${safeName || 'startup'}-intelligence-report.pdf`)
}