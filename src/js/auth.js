import { getDealsAll } from "./api.js";
import { state } from "./store.js";

export async function handleAuthorizationResponse() {
  try {
    state.deals = [];
    state.currentPage = 0;
    state.pageSize = 1;
    state.deals = await getDealsAll();
    state.pageSize = state.deals.length;
  } catch (error) {
    console.error("Error:", error);
  }
}
