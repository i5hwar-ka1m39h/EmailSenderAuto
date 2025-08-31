import nodemailer from "nodemailer"

interface MailOptions{
    from:string;
    to:string;
    text:string;
    subject:string;
    attachment?:{
        filename:string;
        content:Buffer;
    }
}

export const buildMailwithAttachment = async(options : MailOptions):Promise<string> =>{
    const transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });

  const mail = {
    from :options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    attachments :  options.attachment ? [options.attachment] : []
  }

  const mimeMessage = await transporter.sendMail(mail)

 return Buffer.from(mimeMessage.message.toString())
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}