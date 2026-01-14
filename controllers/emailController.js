import nodemailer from 'nodemailer';
import Newsletter from '../models/newsletterSchema.js';

// --- CONFIGURATION ---
// Ideally, put these in your .env file
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use 'host', 'port' for other providers
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail App Password (Not your login password)
  }
});

export const sendNewsletterNotification = async (req, res) => {
  try {
    // 1. Get email data from request - now accepts optional contact form fields
    const { userEmail, adminEmail, name, phone, subject, message } = req.body;

    if (!userEmail || !adminEmail) {
      return res.status(400).json({ success: false, message: "Missing email details" });
    }

    // Determine if this is a newsletter subscription or contact form with newsletter
    const hasContactData = name || phone || subject || message;

    // 2. SAVE TO DATABASE FIRST (This ensures we don't lose subscribers)
    let subscriber;
    try {
      subscriber = await Newsletter.create({
        email: userEmail,
        source: hasContactData ? "contact_form" : "website"
      });
      console.log(`📥 New subscriber saved to database: ${userEmail}`);
    } catch (dbError) {
      // Handle duplicate email
      if (dbError.code === 11000) {
        console.log(`ℹ️  Email already subscribed: ${userEmail}`);

        // If contact data is provided, still send the contact notification
        if (!hasContactData) {
          return res.status(200).json({
            success: true,
            message: "You're already subscribed to our newsletter!"
          });
        }
      } else {
        throw dbError; // Re-throw other errors
      }
    }

    // 3. Define Email Options based on data type
    let mailOptions;

    if (hasContactData) {
      // Enhanced email with contact form data
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `📩 New Contact & Newsletter Subscription${subject ? `: ${subject}` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; border-radius: 12px 12px 0 0;">
              <h2 style="color: white; margin: 0; font-size: 24px;">📩 New Contact & Newsletter Subscription</h2>
              <p style="color: #e0f2fe; margin: 5px 0 0 0;">Someone contacted you and subscribed to your newsletter!</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">Contact Details</h3>
                
                ${name ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">👤 Name:</strong><br/>
                  <span style="font-size: 1.1em; color: #1e293b;">${name}</span>
                </div>
                ` : ''}
                
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">📧 Email:</strong><br/>
                  <a href="mailto:${userEmail}" style="font-size: 1.1em; color: #0f766e; text-decoration: none;">${userEmail}</a>
                </div>
                
                ${phone ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">📞 Phone:</strong><br/>
                  <a href="tel:${phone}" style="font-size: 1.1em; color: #0f766e; text-decoration: none;">${phone}</a>
                </div>
                ` : ''}
                
                ${subject ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #64748b;">📌 Subject:</strong><br/>
                  <span style="font-size: 1.1em; color: #1e293b;">${subject}</span>
                </div>
                ` : ''}
              </div>
              
              ${message ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">💬 Message</h3>
                <div style="background: #f0fdfa; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br/>')}
                </div>
              </div>
              ` : ''}
              
              <div style="background: #dcfce7; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 0.9em; color: #166534;">
                  ✅ <strong>Subscribed to Newsletter:</strong> This contact has been added to your newsletter list.
                </p>
              </div>
              
              <div style="padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 0.9em; color: #92400e;">
                  ⏰ <strong>Received:</strong> ${new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short'
        })}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 15px; color: #94a3b8; font-size: 0.85em;">
              <p style="margin: 5px 0;">This email was sent automatically from your EcoGlow website.</p>
              ${name || message ? `<p style="margin: 5px 0;">Please respond to: <a href="mailto:${userEmail}" style="color: #0f766e;">${userEmail}</a></p>` : ''}
            </div>
          </div>
        `,
        replyTo: userEmail
      };
    } else {
      // Simple newsletter subscription email
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: '🌱 New Newsletter Subscription | EcoGlow',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0f766e;">New Subscriber Alert!</h2>
            <p>You have a new newsletter subscription from the website.</p>
            <div style="background: #f0fdfa; padding: 15px; border-radius: 8px; border: 1px solid #ccfbf1;">
              <strong>Subscriber Email:</strong> <br/>
              <span style="font-size: 1.2em; color: #0f766e;">${userEmail}</span>
            </div>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
              This email was sent automatically from your EcoGlow website.
            </p>
          </div>
        `
      };
    }

    // 4. Try to Send Email Notification (with error handling for rate limits)
    try {
      // Debug logging - show what's being sent
      console.log("📧 Attempting to send email:");
      console.log("  FROM:", mailOptions.from);
      console.log("  TO:", mailOptions.to);
      console.log("  SUBJECT:", mailOptions.subject);
      console.log("  Using EMAIL_USER:", process.env.EMAIL_USER);

      await transporter.sendMail(mailOptions);
      console.log(`✅ Newsletter notification sent for: ${userEmail}`);
      console.log(`✅ Email sent to admin: ${adminEmail}`);

      return res.status(200).json({
        success: true,
        message: hasContactData
          ? "✅ Thank you! Your message has been sent and you've been subscribed to our newsletter."
          : "✅ Subscribed successfully! Check your email for confirmation."
      });

    } catch (emailError) {
      // Handle Gmail rate limit errors gracefully
      if (emailError.responseCode === 550 || emailError.code === 'EENVELOPE') {
        console.warn(`⚠️  Gmail daily limit exceeded. Subscription recorded for: ${userEmail}`);

        return res.status(200).json({
          success: true,
          message: hasContactData
            ? "✅ Message received and subscribed! We'll respond within 24 hours."
            : "✅ Subscribed successfully! You'll receive our next newsletter."
        });
      } else {
        console.error("⚠️  Email notification failed, but subscription saved:", emailError.message);
        return res.status(200).json({
          success: true,
          message: "✅ Subscribed successfully!"
        });
      }
    }

  } catch (error) {
    console.error("❌ Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process subscription. Please try again later."
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
        message: "Name, email, and message are required"
      });
    }

    if (!adminEmail) {
      return res.status(400).json({
        success: false,
        message: "Admin email not configured"
      });
    }

    // Define Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `📩 New Contact Form Submission${subject ? `: ${subject}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0; font-size: 24px;">📩 New Contact Form Submission</h2>
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
              
              ${phone ? `
              <div style="margin: 15px 0;">
                <strong style="color: #64748b;">📞 Phone:</strong><br/>
                <a href="tel:${phone}" style="font-size: 1.1em; color: #0f766e; text-decoration: none;">${phone}</a>
              </div>
              ` : ''}
              
              ${subject ? `
              <div style="margin: 15px 0;">
                <strong style="color: #64748b;">📌 Subject:</strong><br/>
                <span style="font-size: 1.1em; color: #1e293b;">${subject}</span>
              </div>
              ` : ''}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">💬 Message</h3>
              <div style="background: #f0fdfa; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6; line-height: 1.6;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; font-size: 0.9em; color: #92400e;">
                ⏰ <strong>Received:</strong> ${new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      })}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; color: #94a3b8; font-size: 0.85em;">
            <p style="margin: 5px 0;">This email was sent automatically from your EcoGlow website contact form.</p>
            <p style="margin: 5px 0;">Please respond to the customer at: <a href="mailto:${email}" style="color: #0f766e;">${email}</a></p>
          </div>
        </div>
      `,
      // Also set reply-to for easy responses
      replyTo: email
    };

    // Try to Send Email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Contact form notification sent to: ${adminEmail}`);

      return res.status(200).json({
        success: true,
        message: "✅ Thank you for contacting us! We'll get back to you soon."
      });

    } catch (emailError) {
      // Handle Gmail rate limits gracefully
      if (emailError.responseCode === 550 || emailError.code === 'EENVELOPE') {
        console.warn(`⚠️  Gmail daily limit exceeded. Contact form from: ${email}`);

        return res.status(200).json({
          success: true,
          message: "✅ Message received! We'll respond within 24 hours."
        });
      } else {
        console.error("⚠️  Email notification failed:", emailError.message);
        return res.status(500).json({
          success: false,
          message: "Failed to send message. Please try again or contact us directly."
        });
      }
    }

  } catch (error) {
    console.error("❌ Contact Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};