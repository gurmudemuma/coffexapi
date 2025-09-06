/**
 * PDF Test Service - Creates sample PDF documents for immediate testing
 * This demonstrates document access without encryption issues
 */

export interface TestPDFResult {
  success: boolean;
  dataUrl?: string;
  blob?: Blob;
  error?: string;
  metadata?: {
    type: string;
    size: number;
    created: string;
  };
}

/**
 * Generate a simple test PDF document
 */
export const createTestPDF = (documentName: string): TestPDFResult => {
  try {
    // Create a minimal valid PDF content
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
100 700 Td
(${documentName}) Tj
0 -30 Td
(Document Status: ACCESSIBLE) Tj
0 -30 Td
(Access Method: Test PDF Service) Tj
0 -30 Td
(Generated: ${new Date().toLocaleString()}) Tj
0 -30 Td
(This is a test document that demonstrates) Tj
0 -30 Td
(successful document access for approvers.) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
600
%%EOF`;

    // Convert to blob
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const dataUrl = URL.createObjectURL(blob);

    return {
      success: true,
      dataUrl,
      blob,
      metadata: {
        type: 'application/pdf',
        size: blob.size,
        created: new Date().toISOString()
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to create test PDF: ${error}`
    };
  }
};

/**
 * Access test document for specific document types
 */
export const accessTestDocument = (documentType: string, documentName: string): TestPDFResult => {
  console.log('=== ACCESSING TEST DOCUMENT ===');
  console.log('Type:', documentType);
  console.log('Name:', documentName);

  // Create a document specific to the type
  const typeSpecificName = `${getDocumentTypeTitle(documentType)} - ${documentName}`;
  
  const result = createTestPDF(typeSpecificName);
  
  if (result.success) {
    console.log('✅ Test document created successfully');
    console.log('Size:', result.metadata?.size, 'bytes');
    console.log('Type:', result.metadata?.type);
  } else {
    console.error('❌ Failed to create test document:', result.error);
  }
  
  return result;
};

/**
 * Get document type title for display
 */
function getDocumentTypeTitle(docType: string): string {
  switch (docType.toLowerCase()) {
    case 'license':
      return 'Export License Application';
    case 'invoice':
      return 'Commercial Invoice';
    case 'quality':
    case 'qualitycert':
      return 'Quality Certificate';
    case 'shipping':
    case 'other':
      return 'Shipping Documents';
    default:
      return 'Trade Document';
  }
}

/**
 * Simulate different document scenarios for testing
 */
export const getTestScenarios = () => [
  {
    name: 'Valid PDF Document',
    description: 'Demonstrates successful PDF access',
    generator: () => createTestPDF('Commercial Invoice - Test Export 001')
  },
  {
    name: 'Export License',
    description: 'Sample export license document',
    generator: () => createTestPDF('Export License - Brazilian Coffee Co.')
  },
  {
    name: 'Quality Certificate',
    description: 'Sample quality certification',
    generator: () => createTestPDF('Quality Certificate - Premium Arabica')
  },
  {
    name: 'Shipping Documents',
    description: 'Sample shipping documentation',
    generator: () => createTestPDF('Bill of Lading - Container COFFEE001')
  }
];