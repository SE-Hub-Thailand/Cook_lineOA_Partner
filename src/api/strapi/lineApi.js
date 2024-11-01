export const sendMessageToLine = async (message) => {
  try {
    const LINE_API_URL = "https://api.line.me/v2/bot/message/push"; // URL สำหรับ LINE Messaging API
    const lineToken = localStorage.getItem('token') // ใช้ LINE Access Token ของคุณ

    const response = await fetch(LINE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lineToken}`,
      },
      body: JSON.stringify({
        to: "LINE_USER_ID", // ใส่ User ID ของร้านค้าหรือใช้ User ID ที่เหมาะสม
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending message to LINE:", errorData);
      throw new Error(`Request failed with status ${response.status}`);
    }

    console.log("Message sent to LINE successfully!");
  } catch (error) {
    console.error("Error sending message to LINE:", error);
  }
};
