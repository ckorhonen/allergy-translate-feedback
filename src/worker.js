// wrangler.toml (unchanged)
// send_email = [{ name = "EMAIL" }]
// wrangler secret put WORKFLOW_API_KEY
// wrangler secret put REPLY_FROM       # support@yourdomain.com
// (optional) wrangler secret put BCC   # overrides default BCC

import { EmailMessage } from "cloudflare:email";

export default {
  async email(message, env) {
    /* ---------- basic fields ---------- */
    const sender   = message.from;                          // envelope-from
    const subject  = message.headers.get("Subject") ?? "(no subject)";
    const origID   = message.headers.get("Message-ID") ?? "";
    const replySub = subject.startsWith("Re:") ? subject : `Re: ${subject}`;

    /* ---------- crude body extraction ---------- */
    const rawIn  = new TextDecoder().decode(
      await new Response(message.raw).arrayBuffer()
    );
    const body   = rawIn.split(/\r?\n\r?\n/).slice(1).join("\n\n").trim();

    /* ---------- call WorkflowAI ---------- */
    const wf = await fetch(
      "https://run.workflowai.com/v1/@ckorhonengmailcom/tasks/customer-support-email-response/schemas/1/run",
      {
        method:  "POST",
        headers: {
          Authorization: `Bearer ${env.WORKFLOW_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          task_input: {
            email_from:    sender,
            email_subject: subject,
            email_body:    body
          },
          version:   "production",
          use_cache: "auto"
        })
      }
    );
    if (!wf.ok) throw new Error(`WorkflowAI ${wf.status}`);
    const answer =
      (await wf.json())?.task_output?.response ??
      "Sorry — we couldn’t generate a reply.";

    /* ---------- build raw reply (RFC-822) ---------- */
    const msgID = `<${crypto.randomUUID()}@${env.REPLY_FROM.split("@")[1]}>`;
    const hdrs  = [
      `Message-ID: ${msgID}`,
      origID && `In-Reply-To: ${origID}`,
      `From: ${env.REPLY_FROM}`,
      `To: ${sender}`,
      `Bcc: ${env.BCC || "chris@sourcebottle.net"}`,
      `Subject: ${replySub}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8"
    ]
      .filter(Boolean)
      .join("\r\n");

    const rawOut = `${hdrs}\r\n\r\n${answer}`;

    /* ---------- wrap & send ---------- */
    const reply = new EmailMessage(env.REPLY_FROM, sender, rawOut);
    await message.reply(reply);    // must be EmailMessage object
  }
};