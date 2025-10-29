# Email Setup Instructions

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS` in your `.env` file

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

### Custom SMTP
```env
EMAIL_HOST=your_smtp_server
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_username
EMAIL_PASS=your_password
```

## Testing Email

After setting up the environment variables, restart your server and try registering a new user. The system will automatically send a registration email with the generated password.

## Troubleshooting

- **Authentication failed**: Check your email credentials and app password
- **Connection timeout**: Verify your SMTP host and port
- **Emails not received**: Check spam folder, verify email address is correct
