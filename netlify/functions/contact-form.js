// netlify/functions/contact-form.js
// This function is no longer needed with Netlify Forms
// Netlify Forms handles form submissions automatically
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      message: 'This endpoint is deprecated. Use Netlify Forms instead.' 
    })
  };
};
