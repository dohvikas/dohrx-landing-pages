export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const {
      name,
      first_name,
      last_name,
      email,
      phone,
      practiceName,
      message,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      // Accept form field names from existing landing pages
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      practice_name,
      company,
    } = body;

    // Build full name from either combined name or first/last
    let fullName = name || "";
    if (!fullName && (first_name || last_name)) {
      fullName = [first_name, last_name].filter(Boolean).join(" ");
    }

    // Validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length !== 10 || parseInt(digits[0]) < 2) {
        return res.status(400).json({ success: false, error: "Invalid US phone number" });
      }
    }

    // Split name into first/last for Zoho
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ".";

    // Get Zoho access token
    const tokenParams = new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: "refresh_token",
    });

    const tokenRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("Zoho token error:", tokenData);
      return res.status(500).json({ success: false, error: "CRM authentication failed" });
    }

    // Create lead in Zoho CRM
    const leadData = {
      data: [
        {
          First_Name: firstName,
          Last_Name: lastName,
          Email: email.trim(),
          Phone: phone || "",
          Company: practiceName || practice_name || company || "",
          Description: message || "",
          Lead_Source: "Landing Page",
          UTM_Source: utmSource || utm_source || "",
          UTM_Medium: utmMedium || utm_medium || "",
          UTM_Campaign: utmCampaign || utm_campaign || "",
        },
      ],
    };

    const crmRes = await fetch("https://www.zohoapis.com/crm/v2/Leads", {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    });

    const crmData = await crmRes.json();

    if (crmData.data && crmData.data[0] && crmData.data[0].status === "success") {
      return res.status(200).json({
        success: true,
        message: "Thank you, we'll be in touch shortly.",
      });
    }

    console.error("Zoho CRM error:", JSON.stringify(crmData));
    return res.status(500).json({ success: false, error: "Failed to submit lead" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
