import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ServiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PartItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OSData {
  // Oficina
  workshopName: string;
  workshopAddress?: string;
  workshopCity?: string;
  workshopState?: string;
  workshopPhone?: string;
  workshopEmail?: string;
  workshopCNPJ?: string;
  
  // OS
  osNumber: string;
  osDate: string;
  osStatus: string;
  
  // Cliente
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientCPF?: string;
  
  // Veículo
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlate: string;
  vehicleColor?: string;
  vehicleMileage?: number;
  
  // Serviços e Peças
  services: ServiceItem[];
  parts: PartItem[];
  
  // Valores
  laborTotal: number;
  partsTotal: number;
  discount?: number;
  total: number;
  
  // Observações
  observations?: string;
  warranty?: string;
}

export function generateOSPdf(data: OSData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cores do Instauto
  const primaryBlue = [59, 130, 246]; // #3B82F6
  const darkGray = [31, 41, 55]; // #1F2937
  const lightGray = [107, 114, 128]; // #6B7280
  
  let yPos = 20;
  
  // ============================================
  // HEADER - DADOS DA OFICINA
  // ============================================
  
  // Faixa azul no topo
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Nome da oficina
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(data.workshopName, 14, 18);
  
  // Dados da oficina
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  let headerY = 26;
  if (data.workshopAddress) {
    doc.text(`${data.workshopAddress} - ${data.workshopCity}/${data.workshopState}`, 14, headerY);
    headerY += 5;
  }
  if (data.workshopPhone) {
    doc.text(`Tel: ${data.workshopPhone}`, 14, headerY);
  }
  if (data.workshopCNPJ) {
    doc.text(`CNPJ: ${data.workshopCNPJ}`, pageWidth - 14, 26, { align: 'right' });
  }
  if (data.workshopEmail) {
    doc.text(data.workshopEmail, pageWidth - 14, 31, { align: 'right' });
  }
  
  yPos = 50;
  
  // ============================================
  // TÍTULO E NÚMERO DA OS
  // ============================================
  
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDEM DE SERVIÇO', 14, yPos);
  
  // Box com número da OS
  doc.setFillColor(245, 158, 11); // Amarelo #F59E0B
  doc.roundedRect(pageWidth - 60, yPos - 8, 46, 12, 2, 2, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text(`Nº ${data.osNumber}`, pageWidth - 37, yPos, { align: 'center' });
  
  yPos += 8;
  
  // Data e Status
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${data.osDate}`, 14, yPos);
  doc.text(`Status: ${data.osStatus}`, pageWidth - 14, yPos, { align: 'right' });
  
  yPos += 15;
  
  // ============================================
  // DADOS DO CLIENTE
  // ============================================
  
  doc.setFillColor(249, 250, 251); // gray-50
  doc.roundedRect(14, yPos - 5, pageWidth - 28, 25, 2, 2, 'F');
  
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE', 18, yPos + 2);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nome: ${data.clientName}`, 18, yPos + 10);
  if (data.clientPhone) {
    doc.text(`Telefone: ${data.clientPhone}`, 100, yPos + 10);
  }
  if (data.clientCPF) {
    doc.text(`CPF: ${data.clientCPF}`, 18, yPos + 16);
  }
  if (data.clientEmail) {
    doc.text(`Email: ${data.clientEmail}`, 100, yPos + 16);
  }
  
  yPos += 30;
  
  // ============================================
  // DADOS DO VEÍCULO
  // ============================================
  
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(14, yPos - 5, pageWidth - 28, 25, 2, 2, 'F');
  
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('VEÍCULO', 18, yPos + 2);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${data.vehicleBrand} ${data.vehicleModel} (${data.vehicleYear})`, 18, yPos + 10);
  doc.text(`Placa: ${data.vehiclePlate}`, 100, yPos + 10);
  if (data.vehicleColor) {
    doc.text(`Cor: ${data.vehicleColor}`, 18, yPos + 16);
  }
  if (data.vehicleMileage) {
    doc.text(`KM: ${data.vehicleMileage.toLocaleString()}`, 100, yPos + 16);
  }
  
  yPos += 35;
  
  // ============================================
  // TABELA DE SERVIÇOS
  // ============================================
  
  if (data.services.length > 0) {
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVIÇOS', 14, yPos);
    yPos += 5;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Descrição', 'Qtd', 'Valor Unit.', 'Total']],
      body: data.services.map(s => [
        s.description,
        s.quantity.toString(),
        `R$ ${s.unitPrice.toFixed(2)}`,
        `R$ ${s.total.toFixed(2)}`
      ]),
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // ============================================
  // TABELA DE PEÇAS
  // ============================================
  
  if (data.parts.length > 0) {
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PEÇAS / PRODUTOS', 14, yPos);
    yPos += 5;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Descrição', 'Qtd', 'Valor Unit.', 'Total']],
      body: data.parts.map(p => [
        p.name,
        p.quantity.toString(),
        `R$ ${p.unitPrice.toFixed(2)}`,
        `R$ ${p.total.toFixed(2)}`
      ]),
      headStyles: {
        fillColor: [107, 114, 128],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // ============================================
  // RESUMO DE VALORES
  // ============================================
  
  const boxWidth = 80;
  const boxX = pageWidth - 14 - boxWidth;
  
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(boxX, yPos, boxWidth, 45, 2, 2, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  
  let valueY = yPos + 8;
  doc.text('Mão de obra:', boxX + 5, valueY);
  doc.text(`R$ ${data.laborTotal.toFixed(2)}`, boxX + boxWidth - 5, valueY, { align: 'right' });
  
  valueY += 7;
  doc.text('Peças:', boxX + 5, valueY);
  doc.text(`R$ ${data.partsTotal.toFixed(2)}`, boxX + boxWidth - 5, valueY, { align: 'right' });
  
  if (data.discount && data.discount > 0) {
    valueY += 7;
    doc.setTextColor(239, 68, 68); // red
    doc.text('Desconto:', boxX + 5, valueY);
    doc.text(`- R$ ${data.discount.toFixed(2)}`, boxX + boxWidth - 5, valueY, { align: 'right' });
  }
  
  // Linha separadora
  valueY += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(boxX + 5, valueY, boxX + boxWidth - 5, valueY);
  
  // Total
  valueY += 8;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', boxX + 5, valueY);
  doc.setTextColor(59, 130, 246);
  doc.text(`R$ ${data.total.toFixed(2)}`, boxX + boxWidth - 5, valueY, { align: 'right' });
  
  yPos += 55;
  
  // ============================================
  // OBSERVAÇÕES
  // ============================================
  
  if (data.observations) {
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES:', 14, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    
    const splitObs = doc.splitTextToSize(data.observations, pageWidth - 28);
    doc.text(splitObs, 14, yPos + 6);
    yPos += 6 + (splitObs.length * 5);
  }
  
  // ============================================
  // GARANTIA
  // ============================================
  
  if (data.warranty) {
    yPos += 5;
    doc.setFillColor(254, 243, 199); // yellow-100
    doc.roundedRect(14, yPos, pageWidth - 28, 15, 2, 2, 'F');
    
    doc.setTextColor(146, 64, 14); // yellow-800
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`GARANTIA: ${data.warranty}`, 18, yPos + 9);
  }
  
  // ============================================
  // RODAPÉ
  // ============================================
  
  const footerY = doc.internal.pageSize.getHeight() - 25;
  
  // Linha de assinatura
  doc.setDrawColor(200, 200, 200);
  doc.line(14, footerY, 90, footerY);
  doc.line(pageWidth - 90, footerY, pageWidth - 14, footerY);
  
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura do Cliente', 52, footerY + 5, { align: 'center' });
  doc.text('Assinatura da Oficina', pageWidth - 52, footerY + 5, { align: 'center' });
  
  // Rodapé final
  doc.setFontSize(7);
  doc.text(
    'Documento gerado pelo sistema Instauto - www.instauto.com.br',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  return doc;
}

export function downloadOSPdf(data: OSData, filename?: string) {
  const doc = generateOSPdf(data);
  const name = filename || `OS-${data.osNumber}-${data.clientName.replace(/\s/g, '_')}.pdf`;
  doc.save(name);
}

export function printOSPdf(data: OSData) {
  const doc = generateOSPdf(data);
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
}
