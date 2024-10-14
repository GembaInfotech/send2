const GuardForgetPasswordTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
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
            font-size: 16px;
            font-family: Arial, Helvetica, sans-serif;
        }

        .content p {
            color: #1e1e2d;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            line-height: 20.8px;
        }

        .content a {
            color: #007BFF;
            text-decoration: none;
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
            <p>We have received a request to reset your password. Please click the link below to reset your password:</p>
            <p><strong>Reset Password Link:</strong> <a href="%LINK%" target="_blank">Click here to reset your password</a></p>

            <p>If you did not request a password reset, please ignore this email or contact our support team at <a href="mailto:support@gembainfotech.com">support@gembainfotech.com</a>.</p>
            <p>Thank you for using our services. We are here to assist you with any concerns.</p>
            <p>Best regards,<br>Gemba Infotech Team<br><a href="mailto:support@gembainfotech.com">support@gembainfotech.com</a></p>
        </div>
    </div>
</body>

</html>
`;

module.exports = { GuardForgetPasswordTemplate };
