import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

const validateInput = (data: QuoteRequest): { valid: boolean; error?: string } => {
  if (!data.name || data.name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }

  if (!validateEmail(data.email)) {
    return { valid: false, error: "Invalid email address" };
  }

  if (!validatePhone(data.phone)) {
    return { valid: false, error: "Invalid phone number" };
  }

  if (!data.projectDetails || data.projectDetails.trim().length < 10) {
    return { valid: false, error: "Project details must be at least 10 characters" };
  }

  return { valid: true };
};

const sendEmailViaSMTP = async (data: QuoteRequest): Promise<EmailResponse> => {
  const smtpServer = Deno.env.get("SMTP_SERVER");
  const smtpPort = Deno.env.get("SMTP_PORT");
  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");

  if (!smtpServer || !smtpPort || !smtpUser || !smtpPassword) {
    console.error("SMTP configuration missing");
    return {
      success: false,
      message: "Email service not configured",
    };
  }

  try {
    const emailContent = `
New Quote Request from KNK Builders Website

Customer Information:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Project Details:
${data.projectDetails}

---
This is an automated email from your website form.
    `.trim();

    const response = await fetch(`smtp://${smtpServer}:${smtpPort}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: smtpUser,
        to: "knkbuildersmarketing@gmail.com",
        subject: `New Quote Request from ${data.name}`,
        text: emailContent,
        replyTo: data.email,
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: "Thank you, your quote request has been sent. We'll contact you shortly.",
      };
    } else {
      return {
        success: false,
        message: "Failed to send email. Please try again later.",
      };
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
};

const sendEmailViaAPI = async (data: QuoteRequest): Promise<EmailResponse> => {
  const apiKey = Deno.env.get("RESEND_API_KEY");

  if (!apiKey) {
    console.error("Email API key not configured");
    return {
      success: false,
      message: "Email service not configured",
    };
  }

  try {
    const emailContent = `
New Quote Request from KNK Builders Website

Customer Information:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Project Details:
${data.projectDetails}

---
This is an automated email from your website form.
    `.trim();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "knkbuildersmarketing@gmail.com",
        to: "knkbuildersmarketing@gmail.com",
        subject: `New Quote Request from ${data.name}`,
        text: emailContent,
        replyTo: data.email,
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: "Thank you, your quote request has been sent. We'll contact you shortly.",
      };
    } else {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return {
        success: false,
        message: "Failed to send email. Please try again later.",
      };
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const { name, email, phone, projectDetails, honeypot } = body;

    if (honeypot) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid form submission",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const validation = validateInput({
      name,
      email,
      phone,
      projectDetails,
    });

    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: validation.error || "Validation failed",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const useResend = Deno.env.get("RESEND_API_KEY");
    let emailResponse: EmailResponse;

    if (useResend) {
      emailResponse = await sendEmailViaAPI({
        name,
        email,
        phone,
        projectDetails,
      });
    } else {
      emailResponse = await sendEmailViaSMTP({
        name,
        email,
        phone,
        projectDetails,
      });
    }

    return new Response(JSON.stringify(emailResponse), {
      status: emailResponse.success ? 200 : 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred. Please try again later.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
