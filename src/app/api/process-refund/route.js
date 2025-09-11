// app/api/process-refund/route.js
export async function POST(request) {
  try {
    const { reference_number, amount, username, password } = await request.json();

    // Validate required fields
    if (!reference_number || !amount || !username || !password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("Making refund request to payment gateway:", {
      reference_number,
      amount,
      username: username ? "provided" : "missing"
    });

    // Make request to the payment gateway API
    const response = await fetch(
      "https://api.sandbox.paycreategateway.com/api/v2/transactions/refund",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString('base64'),
        },
        body: JSON.stringify({
          reference_number,
          amount,
        }),
      }
    );

    const responseText = await response.text();
    
    // console.log("Payment gateway response status:", response.status);
    // console.log("Payment gateway response preview:", responseText.substring(0, 200));

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
        return new Response(JSON.stringify({ 
          error: "Payment gateway returned an error page",
          details: "The API server may be experiencing issues",
          status: response.status
        }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      responseData = { 
        rawResponse: responseText,
        message: "Received non-JSON response from payment gateway"
      };
    }

    return new Response(JSON.stringify({
      ...responseData,
      _originalStatus: response.status
    }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}