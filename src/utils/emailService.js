
// import nodemailer from "nodemailer";


// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, 
//   },
// });

// // Function to send email
// export const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//       html,
//     });
//     console.log("Email sent: ", info.response);
//   } catch (err) {
//     console.error("Error sending email:", err);
//   }
// };
