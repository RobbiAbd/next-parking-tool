import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";

const generateBarcodeAndPDF = (barcode: string) => {
  const doc = new jsPDF();

  // Generate barcode as a base64 image using JsBarcode
  const canvas = document.createElement("canvas");

  // Adjust barcode width and height
  JsBarcode(canvas, barcode, {
    format: "CODE128", // Use CODE128 barcode format
    width: 1, // Adjust width of each bar in the barcode
    height: 30, // Adjust height of the barcode
    displayValue: false, // Optionally display the barcode value below the barcode
    margin: 2, // Margin around the barcode
  });

  const barcodeDataUrl = canvas.toDataURL("image/png");

  // Add the barcode image to the PDF with controlled width/height
  // x, y, width, height of the image in the PDF (adjust width to avoid being too wide)
  doc.addImage(barcodeDataUrl, "PNG", 10, 10, 180, 30);

  // Add additional text or information to the PDF
  doc.setFontSize(12);
  doc.text("Parking Ticket", 10, 50); // Title of the PDF
  doc.text(`Barcode: ${barcode}`, 10, 60); // Display the barcode text below it

  // Save the PDF with a custom name
  doc.save(`parking-ticket-${barcode}.pdf`);
};

export { generateBarcodeAndPDF }