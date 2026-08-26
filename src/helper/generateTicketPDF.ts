import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import jwt from "jsonwebtoken";
import { envVars } from "@/config/envVars";

interface TicketItem {
  seatRow: string;
  seatNumber: number;
  seatType: string;
  price: number;
}

interface TicketPDFData {
  reservationId: string;
  userName: string;
  totalAmount: number;
  discount: number | null;
  confirmedAt: Date | string;
  tickets: TicketItem[];
}

export const generateTicketPDF = async (
  data: TicketPDFData,
): Promise<Buffer> => {
  // Generate QR code as a PNG buffer before building the PDF
  const token = jwt.sign(
    { reservationId: data.reservationId },
    envVars.jwtSecret,
    {
      expiresIn: "30d",
      algorithm: "HS256",
    },
  );

  const qrCodeBuffer = await QRCode.toBuffer(token, {
    width: 120,
    margin: 1,
  });

  const confirmedDate = new Date(data.confirmedAt);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Header ──
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("🎬 Movie Ticket", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text("Booking Confirmation", { align: "center" });

    doc.moveDown(1);

    // ── Divider ──
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#cccccc").stroke();

    doc.moveDown(1);

    // ── Reservation Details ──
    doc.fillColor("#000000").fontSize(12).font("Helvetica-Bold");
    doc.text("Reservation Details");
    doc.moveDown(0.5);

    doc.fontSize(10).font("Helvetica");
    doc.text(`Reservation ID: ${data.reservationId}`);
    doc.text(`Customer: ${data.userName}`);
    doc.text(`Date: ${confirmedDate.toLocaleDateString()}`);
    doc.text(`Time: ${confirmedDate.toLocaleTimeString()}`);

    doc.moveDown(1);

    // ── Ticket Table ──
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Tickets");
    doc.moveDown(0.5);

    // Table header
    const tableTop = doc.y;
    const col1 = 50; // #
    const col2 = 80; // Seat
    const col3 = 200; // Type
    const col4 = 350; // Price

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333");
    doc.text("#", col1, tableTop);
    doc.text("Seat", col2, tableTop);
    doc.text("Type", col3, tableTop);
    doc.text("Price", col4, tableTop);

    // Header underline
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .strokeColor("#cccccc")
      .stroke();

    // Table rows
    let rowY = tableTop + 25;
    doc.font("Helvetica").fillColor("#000000");

    data.tickets.forEach((ticket, index) => {
      doc.text(`${index + 1}`, col1, rowY);
      doc.text(`${ticket.seatRow}${ticket.seatNumber}`, col2, rowY);
      doc.text(ticket.seatType, col3, rowY);
      doc.text(`$${ticket.price.toFixed(2)}`, col4, rowY);
      rowY += 20;
    });

    // Row underline
    doc.moveTo(50, rowY).lineTo(545, rowY).strokeColor("#cccccc").stroke();

    rowY += 10;

    // ── Totals ──
    doc.font("Helvetica-Bold").fontSize(10);

    if (data.discount && data.discount > 0) {
      doc.text(`Discount: -$${data.discount.toFixed(2)}`, col3, rowY);
      rowY += 20;
    }

    doc.fontSize(12);
    doc.text(`Total: $${data.totalAmount.toFixed(2)}`, col3, rowY);

    doc.moveDown(3);

    // ── QR Code ──
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333");
    doc.text("Scan QR Code to verify ticket:", { align: "center" });
    doc.moveDown(0.5);

    const qrX = (doc.page.width - 120) / 2;
    doc.image(qrCodeBuffer, qrX, doc.y, { width: 120, height: 120 });
    doc.moveDown(9);

    // ── Footer ──
    doc.fontSize(8).font("Helvetica").fillColor("#999999");

    doc.end();
  });
};
