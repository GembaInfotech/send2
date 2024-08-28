const VendorAccountVerificationTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
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
            padding: 20px 100px 0px 0px;
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
            font-size: 13px;
            font-family: Arial, Helvetica, sans-serif;
        }

        .content p {
            color: #1e1e2d;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            line-height: 20.8px;
        }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700"
        rel="stylesheet">
</head>

<body style="margin: 0px; background-color: #f2f3f8;">
    <div class="email-container">
        <!-- Logo Section -->
        <div class="header">
            <a href="https://gembainfotech.com" title="logo" target="_blank">
                <img width="300" height="90" src="https://iili.io/dVW66X9.png" title="logo" alt="logo">
            </a>
        </div>

        <!-- Content Section -->
        <div class="content">
            <h1>Dear %NAME%,</h1>
            <p>Thank you for choosing our service. We're thrilled to have you on board! Your registration was successful, and you can now access your account with the credentials Below:</p>
            <p><strong>Email ID:</strong> %EMAIL% </p>
            <p><strong>Password:</strong> %PASSWORD% </p>
            <p><strong>Login Link:</strong> <a href="%LINK%" target="_blank">Click here to log in</a></p>

            <p>If you have any questions or need assistance, please do not hesitate to contact our support team at <a href="mailto:support@gembainfotech.com">support@gembainfotech.com</a>. We're here to help you every step of the way.</p>
            <p>Welcome to Gemba Infotech, where we are committed to providing you with top-notch services and solutions.</p>
            <p>Warm regards,<br>Gemba Infotech Team<br><a href="mailto:support@gembainfotech.com">support@gembainfotech.com</a></p>
        </div>
    </div>
</body>

</html>
`;

module.exports = { VendorAccountVerificationTemplate };
