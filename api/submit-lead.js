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
      date,
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

    // Build description from message + date
    const descParts = [];
    if (message) descParts.push(`Message: ${message}`);
    if (date) descParts.push(`Preferred Date: ${date}`);
    const description = descParts.join("\n");

    // Build Web-to-Lead form params
    const params = new URLSearchParams({
      xnQsjsdp: "941d8efc16780ea6427c54ab044bc9d1f59c33f838bbe389454fa3b1a967bc17",
      xmIwtLD: "ca2d7416814e7f433b84835405e7fac3532ca7529cd119a3cd40bf5030c3c955c0102c79c0dc8823585952331a80ce16",
      actionType: "TGVhZHM=",
      zc_gad: "",
      "aG9uZXlwb3Q": "",
      "Last Name": lastName,
      "First Name": firstName,
      "Email": email.trim(),
      "Phone": phone || "",
      "Company": practiceName || practice_name || company || "",
      "Description": description,
      "Lead Source": "Advertisement",
    });

    const zohoRes = await fetch("https://crm.zoho.com/crm/WebToLeadForm", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "manual",
    });

    // Zoho returns a 3xx redirect on success
    if (zohoRes.status >= 200 && zohoRes.status < 400) {
      return res.status(200).json({
        success: true,
        message: "Thank you, we'll be in touch shortly.",
      });
    }

    console.error("Zoho WebToLead error: status", zohoRes.status);
    return res.status(500).json({ success: false, error: "Submission failed" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
