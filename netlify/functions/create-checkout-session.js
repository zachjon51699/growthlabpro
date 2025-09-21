// netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    // Accept both naming styles from the client
    const line_items = body.items || body.line_items;
    const mode = body.mode || 'payment';
    const success_url = body.successUrl || body.success_url;
    const cancel_url = body.cancelUrl || body.cancel_url;

    if (!Array.isArray(line_items) || line_items.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing or invalid items' }) };
    }
    if (!success_url || !cancel_url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing successUrl or cancelUrl' }) };
    }

    // Normalize items to Stripe's expected format
    const normalized = line_items.map((li) => {
      if (li && typeof li === 'object' && 'price' in li && 'quantity' in li) {
        return { price: li.price, quantity: li.quantity };
      }
      return li; // already in correct shape
    });

    const session = await stripe.checkout.sessions.create({
      mode,                         // 'payment' or 'subscription'
      line_items: normalized,       // [{ price: 'price_xxx', quantity: 1 }, ...]
      success_url,
      cancel_url,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    // Frontend uses this to call window.Stripe(...)
    const publishableKey =
      process.env.VITE_STRIPE_PUBLISHABLE_KEY ||
      process.env.STRIPE_PUBLISHABLE_KEY ||
      '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id, publishableKey }),
    };
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Server error' }) };
  }
};
