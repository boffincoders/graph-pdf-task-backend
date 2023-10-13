import express from "express";
import pdfController from "../controllers/pdf.controller";

const router = express.Router();

router.post("/generate-pdf", pdfController.generatePDF);

export default router;
