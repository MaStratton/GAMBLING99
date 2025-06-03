const zmq = require('zeromq');
const nodemailer = require('nodemailer');

async function main() {
    const sock = new zmq.Pull();
    await sock.bind('tcp://*:3000');
    console.log('zeromq consumer bound to port 3000');

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    for await (const [msg] of sock) {
        try {
            const emailData = JSON.parse(msg.toString());

            const mailOptions = {
                from: '"GAMBLING99" <noreply@iamliterallyhim.org>',
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.text,
                html: emailData.html || ''
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.error('Error processing message:', err);
        }
    }
}

main().catch(console.error);
