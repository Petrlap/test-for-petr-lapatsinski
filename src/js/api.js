import { proxyUrl, apiUrl, apiUrlToken, clientId, clientSecret, redirectUri } from "./constants.js";
import { state } from "./store.js";
import { renderLeadsTable } from "./render.js";

const MAX_REQUESTS_PER_SECOND = 2;
const REQUEST_INTERVAL = 1000 / MAX_REQUESTS_PER_SECOND;
const DEALS_PER_REQUEST = 5;
let lastRequestTime = 0;
let currentPage = 1;

let accessToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjllMTg4ZjE5M2ZjZjVhZGE5OTY1MmZlNWNlZjQ1YTVkOGQxZDhmNWVmYWU4MmJmMDEyMmM0OWJjMWJlYjQwY2FhY2EyOWNiMDA4OTU3YTEzIn0.eyJhdWQiOiIzMWQ0MDAzMi1lODJiLTQyMTgtOTM4Yy1kODVhYmIxNGJhMTciLCJqdGkiOiI5ZTE4OGYxOTNmY2Y1YWRhOTk2NTJmZTVjZWY0NWE1ZDhkMWQ4ZjVlZmFlODJiZjAxMjJjNDliYzFiZWI0MGNhYWNhMjljYjAwODk1N2ExMyIsImlhdCI6MTcwOTQ3OTQxNSwibmJmIjoxNzA5NDc5NDE1LCJleHAiOjE3MDk1NjU4MTUsInN1YiI6IjEwNzMwMzEwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTk3MjQ2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZmFhZjVlMDQtOWEyNS00ZmRmLTg1YWQtMmM4OTE5NDY0YWNmIn0.XZIcahn8R3ZZEfjHaA-eguV4QSQkbTaBcCbM283T-se-KeTcpJSeyjRiuLcAAA6oUEsz8e_iRkgBUz8hdHE2x-D9KPGWbp1YbjToj4uKn203caReCUA7PPaSbslqAbE7WXPojE8HKONkAGOWeE8CckbFS7IcFtZ2esGRDUqVYbeEkVHUVXTBStxx_KfnBc1UcI_ctytyxx_Md7f0BcUsGfzTMXFLKaJKG3zGtO-zJAzcKlzSuSfFuKE8S91WZQsiztHNEHa1bP1O9g37TywGw_kd51kD287on6IWkzkFdWk6dgq1t9c_L0VhWTJnQXxuFmMEoFqaVp4Oe2qkGzMLKg";
let refreshToken =
  "def50200d16a2f62aca33f8ecf3e31af785de5dac438047776bec0a02e6bf3482e5bf0e73a060d6bda73ec2e6da8a45c4edb6582c41c991f2c3eb9d52e35f79482d0acc549f26a1dc6bf4edb5508c2224ebdb78a45905b2d8fa6e91fad1d40db340dd0b33abe83a585a4556925ac620aaeb22b43d1ae5e8bafe9c01f81c336bb98a4f76c55f292a861620f0af939b995bda735ea58e3ac2b37c71ee0b9f02bfc1a93b50673511064f959db05ddc19f68554e0286fa03a37f40138600cc1d215dd03f0d648fea65c9a11319c852c3202a82ec7780fe8dd0e60c4ea41ec5bdef89e19ce0a6ce18e23f135333b8f04bb0b0aa371b97839b26a27dc86a2d7cf6bda7588cf61f80412cd78e2e4ed178b595c5fb757519aefbc81d5e92a87679fb9acf31518a8c03b8aadf504a4334ad4190ed5229143aa872ea0e4c932a11d3a23b85b2f0e5b456307a143fc7762b2546fb62b05337270ec477f73c571590a3e2d5bb46121deef16cc7273a69ea6cb3d576a50732a2772ff9632a639414b6ec8a1f89a5186cd9f9482ea4a4e5c44a3a5e23987256bb9cbac6230cfac19e8789bb68dc6a1b24bbc365b038149e735a5a7d066f567f32892e9d9d167f4e8416e9c6ed1c4d72e3c4cf6fdddc1c81adae7ff2a4fbe27021238d390dcf985024782f448fc14aa2bcda362a00e176a846c58dc3";

export async function getDeals() {
  try {
    const response = await fetch(`${proxyUrl}/${apiUrl}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leads");
    }

    const data = await response.json();
    state.deals = [...data._embedded.leads];
    return state.deals;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
}

export async function getDealsAll() {
  try {
    let allDeals = [];
    while (true) {
      const currentTime = Date.now();
      const timeSinceLastRequest = currentTime - lastRequestTime;

      if (timeSinceLastRequest < REQUEST_INTERVAL) {
        const delay = REQUEST_INTERVAL - timeSinceLastRequest;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await fetch(
        `${proxyUrl}/${apiUrl}?page=${currentPage}&limit=${DEALS_PER_REQUEST}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();
      const dealsChunk = data._embedded.leads;

      allDeals = [...allDeals, ...dealsChunk];
      renderLeadsTable(allDeals);

      if (!data._links || !data._links.next) {
        break;
      }

      currentPage++;
      lastRequestTime = Date.now();
    }
    currentPage = 1;
    state.dealsSlice = allDeals;
    return allDeals;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
}

export async function refreshTokens() {
  try {
    const response = await fetch(`${proxyUrl}/${apiUrlToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        client_id: `${clientId}`,
        client_secret: `${clientSecret}`,
        grant_type: "refresh_token",
        refresh_token: `${refreshToken}`,
        redirect_uri: `${redirectUri}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    console.log(data.access_token);
    console.log(data.refresh_token);
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}
