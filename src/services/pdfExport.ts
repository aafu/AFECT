import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * แปลงฟังก์ชันสี oklch(...) ที่ Tailwind CSS v4 สร้างขึ้นมาให้เป็น rgb(...) / rgba(...)
 * เพื่อให้ html2canvas สามารถประมวลผลสีได้โดยไม่โยนข้อผิดพลาด 'Attempting to parse an unsupported color function "oklch"'
 */
export function oklchToRgb(str: string): string {
  if (!str || typeof str !== 'string' || !str.includes('oklch')) {
    return str;
  }

  // Regex ดักจับ oklch(L C H) หรือ oklch(L C H / alpha)
  return str.replace(/oklch\(\s*([^/)]+)(?:\s*\/\s*([^)]+))?\)/g, (_fullMatch, coords, alphaPart) => {
    try {
      const parts = coords.trim().split(/\s+/);
      if (parts.length < 3) return '#1e293b';

      let L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
      let C = parseFloat(parts[1]);
      let H = parseFloat(parts[2]);

      if (isNaN(L) || isNaN(C) || isNaN(H)) return '#1e293b';

      let alpha = 1;
      if (alphaPart) {
        const cleanA = alphaPart.trim();
        alpha = cleanA.endsWith('%') ? parseFloat(cleanA) / 100 : parseFloat(cleanA);
        if (isNaN(alpha)) alpha = 1;
      }

      // 1. แปลงพิกัดเชิงขั้ว (C, H) เป็นพิกัดคาร์ทีเซียน (a, b) ใน OKLab
      const hRad = (H * Math.PI) / 180;
      const a = C * Math.cos(hRad);
      const b = C * Math.sin(hRad);

      // 2. แปลง OKLab เป็นโคน LMS (Nonlinear)
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

      // 3. แปลงเป็นโคน LMS (Linear) โดยการยกกำลัง 3
      const l = l_ ** 3;
      const m = m_ ** 3;
      const s = s_ ** 3;

      // 4. แปลงจาก LMS เป็น Linear sRGB
      const rLinear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

      // 5. แปลง Linear sRGB เป็น Standard sRGB พร้อมฟังก์ชันแกมมา
      const transfer = (c: number) => {
        const clamped = Math.max(0, Math.min(1, c));
        return clamped <= 0.0031308
          ? 12.92 * clamped
          : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
      };

      const R = Math.round(Math.min(255, Math.max(0, transfer(rLinear) * 255)));
      const G = Math.round(Math.min(255, Math.max(0, transfer(gLinear) * 255)));
      const B = Math.round(Math.min(255, Math.max(0, transfer(bLinear) * 255)));

      if (alpha < 1) {
        return `rgba(${R}, ${G}, ${B}, ${alpha.toFixed(3)})`;
      }
      return `rgb(${R}, ${G}, ${B})`;
    } catch {
      return '#1e293b';
    }
  });
}

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = 'รายงานสมาชิก_สมาคมอ่าข่า_AFECT.pdf',
  title: string = 'รายงานสมาชิก',
  orientation: 'portrait' | 'landscape' = 'landscape'
): Promise<void> {
  // Ensure all fonts are loaded
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth || (orientation === 'portrait' ? 800 : 1280),
    windowHeight: element.scrollHeight || (orientation === 'portrait' ? 1130 : 800),
    onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
      // 1. Sanitize all <style> tags in the cloned document
      try {
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((styleTag) => {
          if (styleTag.textContent && styleTag.textContent.includes('oklch')) {
            styleTag.textContent = oklchToRgb(styleTag.textContent);
          }
        });
      } catch (e) {
        console.warn('Style sanitize notice:', e);
      }

      // 2. Set safe background & text colors on root document and body
      if (clonedDoc.documentElement) {
        clonedDoc.documentElement.style.backgroundColor = '#ffffff';
        clonedDoc.documentElement.style.color = '#1e293b';
      }
      if (clonedDoc.body) {
        clonedDoc.body.style.backgroundColor = '#ffffff';
        clonedDoc.body.style.color = '#1e293b';
      }

      // 3. Ensure the cloned target element is placed in normal flow
      if (clonedEl) {
        clonedEl.style.position = 'static';
        clonedEl.style.left = '0';
        clonedEl.style.top = '0';
        clonedEl.style.opacity = '1';
        clonedEl.style.visibility = 'visible';
        clonedEl.style.display = 'block';
      }

      // 4. Iterate through all elements in the cloned document to replace any computed oklch colors with rgb
      try {
        const allElements = clonedDoc.querySelectorAll('*');
        const view = clonedDoc.defaultView || window;

        allElements.forEach((node) => {
          const el = node as HTMLElement;
          if (!el || !el.style) return;

          try {
            const computed = view.getComputedStyle(el);
            if (!computed) return;

            // Background color
            const bg = computed.backgroundColor;
            if (bg && bg.includes('oklch')) {
              el.style.backgroundColor = oklchToRgb(bg);
            }

            // Foreground text color
            const color = computed.color;
            if (color && color.includes('oklch')) {
              el.style.color = oklchToRgb(color);
            }

            // Border colors
            const borderTop = computed.borderTopColor;
            if (borderTop && borderTop.includes('oklch')) {
              el.style.borderTopColor = oklchToRgb(borderTop);
            }
            const borderRight = computed.borderRightColor;
            if (borderRight && borderRight.includes('oklch')) {
              el.style.borderRightColor = oklchToRgb(borderRight);
            }
            const borderBottom = computed.borderBottomColor;
            if (borderBottom && borderBottom.includes('oklch')) {
              el.style.borderBottomColor = oklchToRgb(borderBottom);
            }
            const borderLeft = computed.borderLeftColor;
            if (borderLeft && borderLeft.includes('oklch')) {
              el.style.borderLeftColor = oklchToRgb(borderLeft);
            }

            // Outline color
            const outline = computed.outlineColor;
            if (outline && outline.includes('oklch')) {
              el.style.outlineColor = oklchToRgb(outline);
            }

            // Box shadow & text shadow
            const boxShadow = computed.boxShadow;
            if (boxShadow && boxShadow.includes('oklch')) {
              el.style.boxShadow = oklchToRgb(boxShadow);
            }

            // CSS Filter
            const filter = computed.filter;
            if (filter && filter.includes('oklch')) {
              el.style.filter = oklchToRgb(filter);
            }

            // SVG fill & stroke
            const fill = computed.fill;
            if (fill && fill.includes('oklch')) {
              el.style.fill = oklchToRgb(fill);
            }
            const stroke = computed.stroke;
            if (stroke && stroke.includes('oklch')) {
              el.style.stroke = oklchToRgb(stroke);
            }
          } catch {
            // Skip elements that cannot be inspected
          }
        });
      } catch (err) {
        console.warn('Element tree sanitize notice:', err);
      }
    }
  });

  const imgData = canvas.toDataURL('image/png');
  
  // A4 dimensions: Landscape 297x210mm, Portrait 210x297mm
  const isLandscape = orientation === 'landscape';
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = isLandscape ? 297 : 210;
  const pdfHeight = isLandscape ? 210 : 297;
  const margin = 8;
  const contentWidth = pdfWidth - (margin * 2);
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  // If content fits on one page or multi-page
  let heightLeft = contentHeight;
  let position = margin;
  const pageHeightLimit = pdfHeight - (margin * 2);

  pdf.setProperties({
    title,
    subject: 'สมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า (AFECT)',
    author: 'AFECT System',
    creator: 'AFECT Member Registry'
  });

  if (heightLeft <= pageHeightLimit) {
    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
  } else {
    // Multi-page slicing
    let currentY = 0;
    const canvasPageHeight = (canvas.width * pageHeightLimit) / contentWidth;

    while (heightLeft > 0) {
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(canvasPageHeight, canvas.height - currentY);

      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );

        const pageImgData = pageCanvas.toDataURL('image/png');
        const renderedHeight = (pageCanvas.height * contentWidth) / pageCanvas.width;

        if (currentY > 0) {
          pdf.addPage('a4', orientation);
        }
        pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, renderedHeight);
      }

      currentY += canvasPageHeight;
      heightLeft -= pageHeightLimit;
    }
  }

  pdf.save(filename);
}
