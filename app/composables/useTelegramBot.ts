export default function useTelegramBot() {
  const TELEGRAM_BOT_TOKEN = '8285306955:AAF8r-aMASuu8maT9fEz78STbs0gEH93voU'; // @PowerSrasChorkBot
  const TELEGRAM_CHAT_ID = "-4885871456";
  const sendMessageToGroup = async (message: string): Promise<void> => {
    if (!message) return;

    console.log(message);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        console.error('Telegram API error:', data);
      } else {
        console.log('Message sent:', data.result.text);
      }
    } catch (err) {
      console.error('Failed to send Telegram message:', err);
    }
  };

  return {
    sendMessageToGroup,
  };
}
