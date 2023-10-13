import { Request, Response } from "express";
import pdfService from "../services/pdf.service";

const generatePDF = async (req: Request, res: Response) => {
    let pdfData = req.body;
    let result = await pdfService.generatePDF(pdfData);
    return res.status(200).send(result);
};

export default { generatePDF }
