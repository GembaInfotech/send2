const puppeteer = require('puppeteer');

exports.generateInvoicePDF = async (invoiceData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const invoiceHtml = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 4px solid #EA5256;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header .logo img {
            width: 300px;
            height: 90px;
            object-fit: contain;
          }
          .info {
            text-align: right;
            color: #333;
          }
          .info p {
            margin: 5px 0;
          }
          h2, h3 {
            color: #EA5256;
          }
          .flex-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .flex-item {
            width: 48%;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table th, .table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }
          .table th {
            background-color: #333;
            color: #fff;
          }
          .table td {
            background-color: #f9f9f9;
          }
          .terms-description {
            font-size: 12px;
            color: #555;
            margin_bottom: 40px
          }
          .totals {
            text-align: right;
            margin-bottom: 20px;
          }
          .totals p {
            margin: 5px 0;
            font-size: 16px;
          }
          .totals strong {
            font-size: 16px;
          }
          .signature {
            text-align: right;
            padding-top: 5px;
          }
          .terms-conditions {
            margin-top: 10px;
          }
          .terms-conditions h4 {
            color: #EA5256;
            margin-bottom: 10px;
          }
          .terms-conditions p {
            font-size: 12px;
            color: #555;
          }
          .horizontal-line {
            border-top: 4px solid #EA5256;
            margin-top: 40px; 
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="logo">
              <a href="https://gembainfotech.com" title="logo" target="_blank">
                <img src="https://iili.io/dVW66X9.png" alt="logo">
              </a>
            </div>
            <div class="info">
              <p>Invoice No.: ${invoiceData.invoice_no}</p>
              <p>Invoice Date: ${invoiceData.invoice_date}</p>
            </div>
          </div>

          <!-- Invoice Details -->
          <div class="flex-container">
            <div class="flex-item">
              <h3>Invoice From</h3>
              <p>Gemba Infotech</p>
              <p>Quark Atrium, Phase 8B</p>
              <p>Mohali, Punjab & 160071</p>
            </div>
            <div class="flex-item">
              <h3>Invoice To</h3>
              <p>${invoiceData.vendor_name}</p>
              <p>${invoiceData.vendor_PAN}</p>
              <p>${invoiceData.vendor_gstIn}</p>
              <p>${invoiceData.vendor_address}</p>
            </div>
          </div>

          <!-- Table -->
          <table class="table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Unit of</th>
                <th>Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${invoiceData.from_date}</td>
                <td>${invoiceData.to_date}</td>
                <td>${invoiceData.unit_of}</td>
                <td>${invoiceData.quantity}</td>
                <td>₹${invoiceData.total_amount}</td>
              </tr>
            </tbody>
          </table>

          <div>
            <p class="terms-description">${invoiceData.description}</p>
          </div>

          <!-- Totals and Signature -->
          <div class="footer">
            <div class="totals">
              <p>Sub Total: ₹${invoiceData.amount}</p>
              <p>Tax: ₹${invoiceData.total_Tax}</p>
              <p><strong>Grand Total: ₹${invoiceData.total_amount}</strong></p>
            </div>
            <div class="signature">
              <p>Signature: __________________</p>
            </div>
          </div>

          <!-- Horizontal Line Above Terms and Conditions -->
          <div class="horizontal-line"></div>

          <!-- Terms and Conditions -->
          <div class="terms-conditions">
            <h4>Terms and Conditions</h4>
            <p>All invoices are payable within 30 days. Please note that any delays in payment beyond the due date will incur a late fee of 2% of the invoice total. If you have any questions regarding this invoice, feel free to contact us at support@gembainfotech.com.</p>
          </div>

        </div>
      </body>
    </html>
  `;

  // Set the content to the page
  await page.setContent(invoiceHtml);

  // Generate PDF with A4 size
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
};
