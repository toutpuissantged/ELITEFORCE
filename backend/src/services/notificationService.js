const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

const sendPushNotification = async (pushToken, title, body, data = {}) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const message = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  };

  try {
    const receipts = await expo.sendPushNotificationsAsync([message]);
    console.log('Push notification receipt:', receipts);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

module.exports = {
  sendPushNotification,
};