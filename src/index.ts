import cors from "cors";
import express from "express";
import pdfRouter from "./routes";
const app = express();
const port = process.env.GPDFTASK_PORT || 9001;
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/ping", (req, res) => {
  res.send("Server is running properly!");
});
app.use("/api", pdfRouter);
app.use("/api/public", express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
