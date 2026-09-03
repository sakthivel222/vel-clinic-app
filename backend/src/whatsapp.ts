export async function sendWhatsAppReminder(patientName: string, phone: string, time: string) {
  console.log(`[WHATSAPP AUTOMATION] Sending reminder to ${patientName} (${phone}) for appointment at ${time}`);
  // In a real app, integrate Twilio or WhatsApp Business API here:
  /*
  const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: `Hi ${patientName}, this is a reminder for your physio appointment at Vel Clinic today at ${time}.`,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${phone}`
  });
  */
  return true;
}
