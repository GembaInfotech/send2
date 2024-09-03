const ParkingApprovalTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parking Approval Notification</title>
    <style>
        .email-container {
            max-width: 670px;
            margin: 0 auto;
            font-family: 'Open Sans', sans-serif;
            border: 1px solid #e0e0e0;
            background-color: #f2f3f8;
        }

        .header {
            text-align: center;
            padding: 20px 0;
        }

        .content {
            background-color: #fff;
            padding: 40px 35px;
            border-radius: 3px;
            box-shadow: 0 6px 18px 0 rgba(0, 0, 0, .06);
        }

        .content h1 {
            color: #1e1e2d;
            font-weight: 500;
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
        }

        .content p {
            color: #1e1e2d;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            line-height: 1.5;
        }

        .content .details {
            margin: 20px 0;
        }

        .content .details p {
            margin: 5px 0;
            font-weight: bold;
        }

        .content .footer {
            margin-top: 20px;
        }

        .content .footer p {
            font-size: 12px;
        }
    </style>
</head>

<body style="margin: 0px; background-color: #f2f3f8;">
    <div class="email-container">
        <!-- Logo Section -->
        <div class="header">
            <a href="https://gembainfotech.com" title="logo" target="_blank">
                <img width="300" height="90" src="https://iili.io/dVW66X9.png" title="Gemba Infotech" alt="Gemba Infotech Logo">
            </a>
        </div>

        <!-- Content Section -->
        <div class="content">
            <h1>Dear %NAME%,</h1>
            <p>We are delighted to inform you that your parking area has been successfully approved. Below are the details of your parking area:</p>
            <div class="details">
                <p><strong>Parking Name:</strong> %PARKING_NAME%</p>
                <p><strong>Parking Address:</strong> %PARKING_ADDRESS%</p>
                <p><strong>Validity:</strong> From %VALIDITY_FROM% to %VALIDITY_TO%</p>
            </div>
            <p>Your parking area is now active and available for use. Thank you for your patience throughout the approval process.</p>
            <p>If you have any questions or need further assistance, feel free to reach out to our support team at <a href="mailto:support@gembainfotech.com">support@gembainfotech.com</a>.</p>
            <div class="footer">
                <p>Thank you for choosing Gemba Infotech.</p>
                <p>Warm regards,<br>Gemba Infotech Team<br><a href="mailto:support@gembainfotech.com">support@gembainfotech.com</a></p>
            </div>
        </div>
    </div>
</body>

</html>
`;

module.exports = { ParkingApprovalTemplate };
