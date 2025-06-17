// const pdf = require('pdf-parse');
// const fs = require('fs');

// // Alternative: Install pdf2pic + tesseract for image-based PDFs
// // const pdf2pic = require('pdf2pic');
// // const { createWorker } = require('tesseract.js');

// const extractTextFromPDF = async (filePath) => {
//   try {
//     console.log('Attempting to read PDF from:', filePath);
    
//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       throw new Error('PDF file not found at path: ' + filePath);
//     }
    
//     // Check file size
//     const stats = fs.statSync(filePath);
//     console.log('PDF file size:', stats.size, 'bytes');
    
//     if (stats.size === 0) {
//       throw new Error('PDF file is empty');
//     }
    
//     const dataBuffer = fs.readFileSync(filePath);
//     console.log('Buffer length:', dataBuffer.length);
    
//     // Try multiple approaches for PDF parsing
//     let text = null;
    
//     // Approach 1: Standard pdf-parse
//     try {
//       console.log('Trying standard pdf-parse...');
//       const data = await pdf(dataBuffer);
//       text = data.text;
//       console.log('Standard pdf-parse successful');
//     } catch (standardError) {
//       console.log('Standard pdf-parse failed:', standardError.message);
      
//       // Approach 2: pdf-parse with relaxed options
//       try {
//         console.log('Trying pdf-parse with options...');
//         const options = {
//           normalizeWhitespace: false,
//           disableCombineTextItems: false,
//           max: 0
//         };
//         const data = await pdf(dataBuffer, options);
//         text = data.text;
//         console.log('pdf-parse with options successful');
//       } catch (optionsError) {
//         console.log('pdf-parse with options failed:', optionsError.message);
//         throw new Error('All PDF parsing methods failed. The PDF may be corrupted, encrypted, or image-based.');
//       }
//     }
    
//     console.log('Extracted text length:', text ? text.length : 0);
    
//     if (!text || text.trim().length === 0) {
//       throw new Error('No text content found in PDF. This may be a scanned/image-based PDF.');
//     }
    
//     return text;
//   } catch (error) {
//     console.error('PDF extraction error details:', {
//       message: error.message,
//       stack: error.stack,
//       filePath: filePath
//     });
//     throw new Error(`Failed to extract text from PDF: ${error.message}`);
//   }
// };

// module.exports = { extractTextFromPDF };


const pdf = require('pdf-parse');
const tmp = require('tmp');
const fs = require('fs');

// Alternative: Install pdf2pic + tesseract for image-based PDFs
// const pdf2pic = require('pdf2pic');
// const { createWorker } = require('tesseract.js');

const extractTextFromPDF = async (fileBuffer) => {
  let tempFile;
  try {
    // Create temporary file
    tempFile = tmp.fileSync({ postfix: '.pdf' });
    
    // Write buffer to temp file
    fs.writeFileSync(tempFile.name, fileBuffer);
    
    // Process the temp file
    const dataBuffer = fs.readFileSync(tempFile.name);
    const data = await pdf(dataBuffer);
    
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  } finally {
    // Clean up temp file
    if (tempFile) {
      tempFile.removeCallback();
    }
  }
};

module.exports = { extractTextFromPDF };
