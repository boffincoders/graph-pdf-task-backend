"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
function generateHeader(pdfDoc) {
    pdfDoc.image(path_1.default.join(__dirname, '/assets', 'logo-black.png'), 50, 45, { width: 50 })
        .image(path_1.default.join(__dirname, '/assets', 'vector-1.png'), 500, 45, { width: 100, height: 80, align: 'right' })
        .moveDown();
}
function generateFooter(pdfDoc, name) {
    pdfDoc.image(path_1.default.join(__dirname, '/assets', 'vector-2.png'), 40, 680, { width: 100, height: 80 })
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
const generatePDF = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { graphImageBuffer, jsonData } = data;
        let publicDirectory = path_1.default.join(__dirname, '../../public/');
        let assetsDirectory = path_1.default.join(__dirname, '../../assets/');
        if (!fs_1.default.existsSync(publicDirectory))
            fs_1.default.mkdirSync(publicDirectory, {
                recursive: true
            });
        let pdfPath = path_1.default.resolve(publicDirectory, `${new Date().toDateString()}.pdf`);
        // Create a new PDF document
        const doc = new pdfkit_1.default({
            layout: "portrait",
            margin: 20,
        });
        const gradient = doc.linearGradient(30, 40, 580, 40);
        gradient.stop(0, '#005DFF'); // Start color (#005DFF)
        gradient.stop(1, '#21DDFF'); // End color (#21DDFF)
        // Pipe the PDF to a writable stream (e.g., a file)
        const stream = fs_1.default.createWriteStream(pdfPath);
        doc.registerFont('Poppins-Bold', path_1.default.resolve(assetsDirectory, 'fonts/Poppins/Poppins-Bold.ttf'));
        doc.registerFont('Poppins-SemiBold', path_1.default.resolve(assetsDirectory, 'fonts/Poppins/Poppins-SemiBold.ttf'));
        // Pipe the document to the stream
        doc.pipe(stream);
        doc.fontSize(10);
        doc.font("Poppins-Bold");
        // Define the header function
        doc.image(path_1.default.resolve(assetsDirectory, 'logo.png'), 20, 20, { width: 100 });
        doc
            .text("123, Main street, Dover, NH-2837489273", 0, 25, { align: 'right' })
            .moveTo(20, 45)
            .lineTo(590, 45)
            .stroke(gradient);
        // Crime Text with line
        doc.image(path_1.default.resolve(assetsDirectory, 'location.png'), 20, 508, { width: 20 });
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
            statusCode: axios_1.HttpStatusCode.Ok,
            success: true,
            data: {
                pdfLink: !jsonData ? null : ""
            }
        };
    }
    catch (error) {
        return {
            statusCode: axios_1.HttpStatusCode.InternalServerError,
            success: false,
            message: error.message
        };
    }
});
const generateServerPDF = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const canvasRenderService = new chartjs_node_canvas_1.ChartJSNodeCanvas({
        width: 800,
        height: 400,
    });
    let lineChartType = "line";
    const chartData = {
        type: lineChartType,
        data: {
            labels: data.jsonData.data.map((x) => x.data_year),
            datasets: [
                {
                    label: "Burglary",
                    data: data.jsonData.data.map((x) => x.Burglary),
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                },
            ],
        }
    };
    // Create a PDF document
    const doc = new pdfkit_1.default();
    const pdfPath = path_1.default.join(__dirname, 'chart.pdf');
    const stream = fs_1.default.createWriteStream(pdfPath);
    doc.pipe(stream);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // Generate the chart
        const imageBuffer = yield canvasRenderService.renderToBuffer(chartData);
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
    }))();
});
exports.default = { generatePDF, generateServerPDF };
