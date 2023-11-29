const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createTable } = require('tabulator');


const generatePDF = (formattedData, id) => {
    try {
        const doc = new PDFDocument();
        const folderPath = './E:/Techify/student_report/api/public/student-report-pdf'
        const fileName = path.join(folderPath, `report_card_${id}.pdf`);
        const writeStream = fs.createWriteStream(fileName);

        doc.pipe(writeStream);
        doc.fontSize(18).font('Courier-Bold').text('Student Report Card', { align: 'center' }).font('Courier');
        doc.fontSize(16).text(`${formattedData.school_name}`, { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`Name: ${formattedData.first_name} ${formattedData.last_name}`);
        doc.fontSize(14).text(`Roll no.: ${formattedData.roll_no}`);
        doc.fontSize(14).text(`Email: ${formattedData.email}`);
        doc.fontSize(14).text(`School: ${formattedData.school_name}`);
        doc.fontSize(14).text(`Standard: ${formattedData.standard}`);
        doc.fontSize(14).text(`Division: ${formattedData.division}`);
        doc.moveDown();

        doc.fontSize(16).font('Courier-Bold').text('Report:', { underline: true }).font('Courier');
        doc.moveDown();

        // Without Table format

        // formattedData.report.forEach((subject, index) => {
        //     doc.fontSize(14).text(`Subject ${index + 1}: ${subject.subject_name}`);
        //     doc.fontSize(14).text(`Marks: ${subject.marks}`);
        //     doc.moveDown();
        // });

        // With Table format

        const tableTop = 270; // Adjust the top position of the table
        const tableLeft = 70; // Adjust the left position of the table
        const cellPadding = 10;
        const cellWidth = 200; // Width of each cell
        const rowHeight = 30; // Height of each row

        // Function to draw a cell with borders
        const drawCell = (text, x, y, width, height) => {
            doc.rect(x, y, width, height).stroke();
            doc.text(text, x + cellPadding, y + cellPadding);
        };

        // Draw table outline
        const tableWidth = cellWidth * 2;
        const tableHeight = (formattedData.report.length + 1) * rowHeight; // Header + rows
        doc.rect(tableLeft, tableTop, tableWidth, tableHeight).stroke();

        // Draw table headers with borders
        doc.font('Courier-Bold');
        drawCell('Subject', tableLeft, tableTop, cellWidth, rowHeight);
        drawCell('Marks', tableLeft + cellWidth, tableTop, cellWidth, rowHeight);

        // Draw table data with borders
        doc.font('Courier');
        formattedData.report.forEach((subject, index) => {
            const yPos = tableTop + rowHeight * (index + 1);
            drawCell(subject.subject_name, tableLeft, yPos, cellWidth, rowHeight);
            drawCell(subject.marks, tableLeft + cellWidth, yPos, cellWidth, rowHeight);
        });

        doc.end();
        console.log(`PDF report card generated: ${fileName}`)
        return fileName;
    } catch (error) {
        console.log(`Could not generate report: ${error.message}`);
        throw error;
    }
};

module.exports = { generatePDF }