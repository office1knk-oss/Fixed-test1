import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SubscriberEvent {
  email: string;
  branch: string;
}

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const BREVO_API_URL = "https://api.brevo.com/v3";

const branchListIds: Record<string, number> = {
  "Dwarsloop": 6,
  "Dayizenza": 3,
  "Kwamhlanga": 5,
  "Elukwatini": 4,
  "Numbi": 7,
};

async function addContactToBrevo(email: string, branch: string): Promise<void> {
  const listId = branchListIds[branch];

  if (!listId) {
    throw new Error(`Invalid branch: ${branch}`);
  }

  const payload = {
    email: email,
    attributes: {
      BRANCH: branch,
    },
  };

  const response = await fetch(`${BREVO_API_URL}/contacts`, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${response.status} - ${error}`);
  }

  await fetch(`${BREVO_API_URL}/contacts/lists/${listId}/contacts/add`, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emails: [email] }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, branch }: SubscriberEvent = await req.json();

    if (!email || !branch) {
      return new Response(
        JSON.stringify({ error: "Missing email or branch" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await addContactToBrevo(email, branch);

    return new Response(
      JSON.stringify({ success: true, message: "Contact synced to Brevo" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
