import nodemailer from "nodemailer";
import Newsletter from "../models/newsletterSchema.js";
import MessagePage from "../models/messageSchema.js"; // Added MessagePage model
import ContactPage from "../models/contactSchema.js"; // Added ContactPage model
import ContactSubmission from "../models/contactSubmissionsSchema.js"; // Added ContactSubmission model

// --- CONFIGURATION ---
// Ideally, put these in your .env file
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true only for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // APP PASSWORD
  },
  connectionTimeout: 60 * 1000, // 60 seconds
  greetingTimeout: 30 * 1000,
  socketTimeout: 60 * 1000,
});

export const sendNewsletterNotification = async (req, res) => {
  try {
    // 1. Get email data from request
    let { userEmail, adminEmail, name, phone, subject, message, materialPreference } = req.body;

    // 2. Fetch admin email from DB if not provided or to ensure it's from DB
    if (!adminEmail || adminEmail === "contact@ecoglow.ae") {
      try {
        const [messageSettings, contactSettings] = await Promise.all([
          MessagePage.findOne().lean(),
          ContactPage.findOne().lean(),
        ]);

        adminEmail =
          messageSettings?.contactEmail ||
          contactSettings?.contactEmail ||
          "contact@ecoglow.ae";
        console.log("📍 Backend resolved admin email from DB:", adminEmail);
      } catch (dbError) {
        console.warn("⚠️ DB Fetching settings failed:", dbError.message);
        adminEmail = "contact@ecoglow.ae"; // Fallback
      }
    }

    if (!userEmail || !adminEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email details" });
    }

    // 3. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Determine if this is a newsletter subscription or contact form with newsletter
    const hasContactData = name || phone || subject || message;

    // 2. Define Email Options based on data type
    let mailOptions;

    if (hasContactData) {
      // Enhanced email with contact form data
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `📩 New Enquiry${subject ? `: ${subject}` : ""}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; border-radius: 12px 12px 0 0;">
              <h2 style="color: white; margin: 0; font-size: 24px;">📩 New Enquiry</h2>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">Contact Details</h3>
                
                ${name
            ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">👤 Name:</strong><br/>
                  <span style="font-size: 1.1em; color: #1e293b;">${name}</span>
                </div>
                `
            : ""
          }
                
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">📧 Email:</strong><br/>
                  <a href="mailto:${userEmail}" style="font-size: 1.1em; color: #0f766e; text-decoration: none;">${userEmail}</a>
                </div>
                
                ${phone
            ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">📞 Phone:</strong><br/>
                  <a href="tel:${phone}" style="font-size: 1.1em; color: #0f766e; text-decoration: none;">${phone}</a>
                </div>
                `
            : ""
          }
                
                ${materialPreference
            ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">🧽 Material Preference:</strong><br/>
                  <span style="font-size: 1.1em; color: #1e293b;">${materialPreference}</span>
                </div>
                `
            : ""
          }

                ${subject
            ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">📌 Subject:</strong><br/>
                  <span style="font-size: 1.1em; color: #1e293b;">${subject}</span>
                </div>
                `
            : ""
          }
              </div>
              
              ${message
            ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">💬 Message</h3>
                <div style="background: #f0fdfa; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6; line-height: 1.6;">
                  ${message.replace(/\n/g, "<br/>")}
                </div>
              </div>
              `
            : ""
          }      
              <div style="padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 0.9em; color: #92400e;">
                  ⏰ <strong>Received:</strong> ${new Date().toLocaleString(
            "en-US",
            {
              dateStyle: "full",
              timeStyle: "short",
            }
          )}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 15px; color: #94a3b8; font-size: 0.85em;">
              <p style="margin: 5px 0;">This email was sent automatically from your EcoGlow website.</p>
              ${name || message
            ? `<p style="margin: 5px 0;">Please respond to: <a href="mailto:${userEmail}" style="color: #0f766e;">${userEmail}</a></p>`
            : ""
          }
            </div>
          </div>
        `,
        replyTo: userEmail,
      };
    } else {
      // Simple enquiry email
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: "📩 New Enquiry",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0f766e;">📩 New Enquiry</h2>
            <p>You have a new enquiry from the website.</p>
            <div style="background: #f0fdfa; padding: 15px; border-radius: 8px; border: 1px solid #ccfbf1;">
              <strong>Customer Email:</strong> <br/>
              <span style="font-size: 1.2em; color: #0f766e;">${userEmail}</span>
            </div>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
              This email was sent automatically from your EcoGlow website.
            </p>
          </div>
        `,
      };
    }

    // 3. SEND EMAIL (NON-BLOCKING BACKGROUND SEND)
    transporter
      .sendMail(mailOptions)
      .then(() => console.log(`✅ Email sent successfully for: ${userEmail}`))
      .catch((emailError) =>
        console.error(
          "❌ Background Email Delivery Failed:",
          emailError.message
        )
      );

    if (hasContactData) {
      await Newsletter.findOneAndUpdate(
        { email: userEmail },
        {
          $setOnInsert: {
            email: userEmail,
            source: "newEnquiry",
          },
        },
        { upsert: true, new: false }
      );

      // Save as Contact Submission as well for backup/admin dashboard
      try {
        const newSubmission = new ContactSubmission({
          name: name || "Booking Request",
          email: userEmail,
          phone: phone || null,
          subject: subject || "New Enquiry",
          message: message || "No message provided",
          materialPreference: materialPreference || null,
          source: "newEnquiry",
          status: "new"
        });
        await newSubmission.save();
        console.log(`✅ Booking submission saved to DB for: ${userEmail}`);
      } catch (dbErr) {
        console.error("⚠️ Failed to save booking submission:", dbErr.message);
      }
    } else {
      await Newsletter.findOneAndUpdate(
        { email: userEmail },
        {
          $setOnInsert: {
            email: userEmail,
            source: "newEnquiry",
          },
        },
        { upsert: true, new: false }
      );
    }

    // 5. RESPOND INSTANTLY
    return res.status(200).json({
      success: true,
      message: hasContactData
        ? "✅ Thank you! Your message has been received."
        : "✅ Thank you! Your enquiry has been received.",
    });
  } catch (error) {
    console.error("❌ Enquiry Process Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process enquiry. Please try again later.",
    });
  }
};

// --- CONTACT FORM SUBMISSION HANDLER ---
export const sendContactFormNotification = async (req, res) => {
  try {
    // Accept all contact form fields from the body
    const { name, email, phone, subject, message, adminEmail } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    if (!adminEmail) {
      return res.status(400).json({
        success: false,
        message: "Admin email not configured",
      });
    }

    // Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Save submission to database
    try {
      const newSubmission = new ContactSubmission({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        source: "newEnquiry",
        status: "new"
      });

      await newSubmission.save();
      console.log(`✅ Contact submission saved to database for: ${email}`);
    } catch (dbError) {
      console.error("⚠️ Failed to save submission to database:", dbError.message);
      // Continue with email sending even if DB save fails
    }

    // Define Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `📩 New Enquiry${subject ? `: ${subject}` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0; font-size: 24px;">📩 New Enquiry</h2>
            <p style="color: #e0f2fe; margin: 5px 0 0 0;">Someone contacted you through your website!</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">Contact Details</h3>
              
              <div style="margin: 15px 0;">
                <strong style="color: #64748b;">👤 Name:</strong><br/>
                <span style="font-size: 1.1em; color: #1e293b;">${name}</span>
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #64748b;">📧 Email:</strong><br/>
                <a href="mailto:${email}" style="font-size: 1.1em; color: #0f766e; text-decoration: none;">${email}</a>
              </div>
              
              ${phone
          ? `
              <div style="margin: 15px 0;">
                <strong style="color: #64748b;">📞 Phone:</strong><br/>
                <a href="tel:${phone}" style="font-size: 1.1em; color: #0f766e; text-decoration: none;">${phone}</a>
              </div>
              `
          : ""
        }
              
              ${subject
          ? `
              <div style="margin: 15px 0;">
                <strong style="color: #64748b;">📌 Subject:</strong><br/>
                <span style="font-size: 1.1em; color: #1e293b;">${subject}</span>
              </div>
              `
          : ""
        }
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">💬 Message</h3>
              <div style="background: #f0fdfa; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6; line-height: 1.6;">
                ${message.replace(/\n/g, "<br/>")}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; font-size: 0.9em; color: #92400e;">
                ⏰ <strong>Received:</strong> ${new Date().toLocaleString(
          "en-US",
          {
            dateStyle: "full",
            timeStyle: "short",
          }
        )}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; color: #94a3b8; font-size: 0.85em;">
            <p style="margin: 5px 0;">This email was sent automatically from your EcoGlow website.</p>
            <p style="margin: 5px 0;">Please respond to the customer at: <a href="mailto:${email}" style="color: #0f766e;">${email}</a></p>
          </div>
        </div>
      `,
      // Also set reply-to for easy responses
      replyTo: email,
    };

    // Try to Send Email (NON-BLOCKING)
    transporter
      .sendMail(mailOptions)
      .then(() =>
        console.log(`✅ Contact form notification sent to: ${adminEmail}`)
      )
      .catch((emailError) =>
        console.error(
          "⚠️ Background Contact Email Delivery Failed:",
          emailError.message
        )
      );

    // RESPOND INSTANTLY
    return res.status(200).json({
      success: true,
      message: "✅ Thank you for contacting us! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("❌ Contact Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
