import { HttpStatusCode } from 'axios';
import { ChartType } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fs from 'fs';
import path from 'path';
import PdfDocument from 'pdfkit';
import { constants } from '../utils/constants';
import { IBaseResponse } from '../utils/interfaces/common.interface';


function generateHeader(pdfDoc: PDFKit.PDFDocument) {
  pdfDoc.image(path.join(__dirname, '/assets', 'logo-black.png'), 50, 45, { width: 50 })
    .image(path.join(__dirname, '/assets', 'vector-1.png'), 500, 45, { width: 100, height: 80, align: 'right' })
    .moveDown();
}
function generateFooter(pdfDoc: PDFKit.PDFDocument, name: string) {
  pdfDoc.image(path.join(__dirname, '/assets', 'vector-2.png'), 40, 680, { width: 100, height: 80 })
    .fontSize(10)
    .text(name, 50, 720, { align: 'center', width: 500 })
    .moveDown();
}



/**
 * 
 * @param payload 
 * 
 * This service is responsible for generating PDF documents
 * and adding generated graph from API data into it.
 * 
 */
const generatePDF = async (data: {
  jsonData: any,
  graphImageBuffer: string
}): Promise<IBaseResponse> => {
  try {
    const { graphImageBuffer, jsonData } = data;
    let publicDirectory = path.join(__dirname, '../../public/')
    let assetsDirectory = path.join(__dirname, '../../assets/')
    if (!fs.existsSync(publicDirectory))
      fs.mkdirSync(publicDirectory, {
        recursive: true
      })
    let pdfName = `${Date.now()}.pdf`
    let pdfPath = path.resolve(publicDirectory, pdfName)

    // Create a new PDF document
    const doc = new PdfDocument({
      layout: "portrait",
      margin: 20,
    });

    const gradient = doc.linearGradient(30, 40, 580, 40);
    gradient.stop(0, '#005DFF');  // Start color (#005DFF)
    gradient.stop(1, '#21DDFF');  // End color (#21DDFF)

    // Pipe the PDF to a writable stream (e.g., a file)
    const stream = fs.createWriteStream(pdfPath);
    doc.registerFont('Poppins-Bold', path.resolve(assetsDirectory, 'fonts/Poppins/Poppins-Bold.ttf'))
    doc.registerFont('Poppins-SemiBold', path.resolve(assetsDirectory, 'fonts/Poppins/Poppins-SemiBold.ttf'))

    // Pipe the document to the stream
    doc.pipe(stream);
    doc.fontSize(10);
    doc.font("Poppins-Bold")

    // Define the header function
    doc.image(path.resolve(assetsDirectory, 'logo.png'), 20, 20, { width: 100 })
    doc
      .text("123, Main street, Dover, NH-2837489273", 0, 25, { align: 'right' })
      .moveTo(20, 45)
      .lineTo(590, 45)
      .stroke(gradient);


    // Crime Text with line
    doc.image(path.resolve(assetsDirectory, 'location.png'), 20, 508, { width: 20 })

    doc
      .font("Poppins-SemiBold")
      .text("Crime", 45, 509, { align: 'left' })
      .moveTo(85, 517) // the line after Crime 80 is start point
      .lineTo(590, 515)
      .stroke(gradient);

    //Graph Image
    doc.image(graphImageBuffer, 20, 540, { width: 1900, height: 200 });

    // Footer
    doc
      .fillColor("#005DFF").text(`Report Genereted on ${new Date().toDateString()}`, 20, 755, { align: 'left' });

    const leftText = "RealAssist Property Report | Page ";
    const rightText = "1 of 25";
    doc
      .fillColor("#626E99").text(rightText, 35, 755, { continued: true, align: 'right' })
      .fillColor("#000000").text(leftText, 0, 755, { continued: false, align: 'right' })
      .moveTo(20, 750)
      .lineTo(590, 750)
      .stroke(gradient);


    // Finalize the PDF document
    doc.end();

    // Handle the end event
    stream.on('finish', () => {
      console.log('PDF created successfully');
    });
    return {
      statusCode: HttpStatusCode.Ok,
      success: true,
      data: {
        pdfLink: !jsonData ? null : constants.PUBLIC_FOLDER_URL + pdfName
      }
    }

  } catch (error: any) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      success: false,
      message: error.message
    }
  }
}

const generateServerPDF = async (data: {
  jsonData: any,
  graphImageBuffer: string
}) => {
  const canvasRenderService = new ChartJSNodeCanvas({
    width: 800,
    height: 400,
  });
  let lineChartType: ChartType = "line";

  const chartData = {
    type: lineChartType,
    data: {
      labels: data.jsonData.data.map((x: any) => x.data_year),
      datasets: [
        {
          label: "Burglary",
          data: data.jsonData.data.map((x: any) => x.Burglary),
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
      ],
    }
  };


  // Create a PDF document
  const doc = new PdfDocument();
  const pdfPath = path.join(__dirname, 'chart.pdf');
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  (async () => {
    // Generate the chart
    const imageBuffer = await canvasRenderService.renderToBuffer(chartData);

    // Add the chart image to the PDF
    doc.image(imageBuffer);

    // Finalize the PDF document
    doc.end();

    stream.on('finish', () => {
      console.log('PDF created successfully');
    });

    stream.on('error', (err) => {
      console.error('Error writing PDF:', err);
    });
  })();
}

export default { generatePDF };
