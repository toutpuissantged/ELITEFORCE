const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

const createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { service: true }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this booking' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only PENDING bookings can be paid for' });
    }

    // Amount should be in cents (e.g., multiplied by 100) for currency like MAD or EUR
    // Assuming basePrice is in the primary unit (e.g., Dirhams)
    const amountInCents = Math.round(booking.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'mad', // Assuming Moroccan Dirham for this test, change if needed
      metadata: { bookingId: booking.id.toString(), userId: userId.toString() },
    });

    // Save the Stripe payment ID to the booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentId: paymentIntent.id }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalPrice
    });
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // req.body should be raw buffer here
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    try {
      const updatedBooking = await prisma.booking.update({
        where: { stripePaymentId: paymentIntent.id },
        data: { status: 'CONFIRMED', paidAt: new Date() }
      });
      console.log(`Booking with PaymentIntent ${paymentIntent.id} confirmed.`);

      // Import the notification service to send a push notification
      const { sendPushNotification } = require('../services/notificationService');
      const user = await prisma.user.findUnique({ where: { id: updatedBooking.userId } });
      if (user && user.pushToken) {
         sendPushNotification(user.pushToken, 'Réservation confirmée', 'Votre prestataire sera là le ...', { bookingId: updatedBooking.id });
      }

    } catch (updateError) {
      console.error(`Error updating booking: ${updateError.message}`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
};