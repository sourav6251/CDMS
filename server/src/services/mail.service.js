import mailConfiguration from "../config/mail.configuration.js";
import fs from "fs/promises"; // for async file read
import path from "path";

import { fileURLToPath } from "url";
class MailService {
    sendMail = async (To, subject, text) => {
        console.log("Enter into Mail=> ", To);

        await mailConfiguration.sendMail({
            from: process.env.EMAIL_ID,
            to: To,
            subject: subject,
            text: text,
        });
    };

    sendMailForOTP = async (To, data) => {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const templatePath = path.join(__dirname, "../mail/OTP.html");

            let htmlTemplate = await fs.readFile(templatePath, "utf-8");

            htmlTemplate = htmlTemplate
                .replace(/{{name}}/g, data.name)
                .replace(/{{otp}}/g, data.otp);
            const subject = "OTP verification";
            await mailConfiguration.sendMail({
                from: `"CDMS" <${process.env.EMAIL_ID}>`,
                to: To,
                subject: subject,
                html: htmlTemplate,
            });

            console.log("✅ OTP mail sent to", To);
        } catch (error) {
            console.error("❌ Failed to send OTP email:", error.message);
            throw new Error("Failed to send OTP email.");
        }
    };

    sendMailForLogin = async (To, data) => {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const templatePath = path.join(__dirname, "../mail/Login.html");

            let htmlTemplate = await fs.readFile(templatePath, "utf-8");

            htmlTemplate = htmlTemplate
                .replace(/{{name}}/g, data.name)
                .replace(/{{otp}}/g, data.otp);
            const subject = "Successfull login";
            await mailConfiguration.sendMail({
                from: `"CDMS" <${process.env.EMAIL_ID}>`,
                to: To,
                subject: subject,
                html: htmlTemplate,
            });

            console.log("✅ OTP mail sent to", To);
        } catch (error) {
            console.error("❌ Failed to send OTP email:", error.message);
            throw new Error("Failed to send OTP email.");
        }
    };

    sendMailForDelete = async (To, data) => {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const templatePath = path.join(__dirname, "../mail/Delete.html");

            let htmlTemplate = await fs.readFile(templatePath, "utf-8");
            console.log("data=>", data);

            htmlTemplate = htmlTemplate
                .replace(/{{name}}/g, data.name)
                .replace(/{{email}}/g, data.email);
            const subject = "Successfull login";
            await mailConfiguration.sendMail({
                from: `"CDMS" <${process.env.EMAIL_ID}>`,
                to: To,
                subject: subject,
                html: htmlTemplate,
            });

            console.log("✅ OTP mail sent to", To);
        } catch (error) {
            console.error("❌ Failed to send OTP email:", error.message);
            throw new Error("Failed to send OTP email.");
        }
    };

    meetingMail = async (Tos,data) => {
        console.log("meetingMail=> ");
        const subject = "Meeting Invitation";

        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const templatePath = path.join(__dirname, "../mail/Meeting.html");

            let htmlTemplate = await fs.readFile(templatePath, "utf-8");
            console.log("data=>", data);

            htmlTemplate = htmlTemplate
                .replace(/{{title}}/g, data.title)
                .replace(/{{date}}/g, data.date)
                .replace(/{{time}}/g, data.time)
                .replace(/{{location}}/g, data.location)
                .replace(/{{description}}/g, data.description)
            await mailConfiguration.sendMail({
                from: `"CDMS" <${process.env.EMAIL_ID}>`,
                bcc: Tos,
                subject: subject,
                html: htmlTemplate,
            });
            console.log("✅ Meeting mail sent to", Tos);
        } catch (error) {
            console.error("❌ Failed to send Meeting email:", error.message);
            throw new Error("Failed to send Meeting email.");
        }

    };

    noticeboard = async (emails, subject, text) => {
        try {
            if (!Array.isArray(emails)) {
                emails = [emails]; // Handle single email case
            }

            // Send emails sequentially
            for (const email of emails) {
                try {
                    console.log(`Sending notice to: ${email}`);
                    await mailConfiguration.sendMail({
                        from: process.env.EMAIL_ID,
                        to: email,
                        subject: subject,
                        html: text,
                    });
                    console.log(`Notice sent successfully to: ${email}`);
                } catch (error) {
                    console.error(`Failed to send notice to ${email}:`, error);
                    // Continue with next email even if one fails
                }
            }

            return { success: true, count: emails.length };
        } catch (error) {
            console.error("Error in noticeboard mail service:", error);
            return { success: false, message: error.message };
        }
    };
}
export default new MailService();
