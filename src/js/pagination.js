import { state } from "./store.js";
import { renderLeads } from "./render.js";

const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");

export function updatePaginationButtons() {
  prevPageButton.disabled = state.currentPage === 0;
  nextPageButton.disabled = state.currentPage >= Math.ceil(state.deals.length / state.pageSize) - 1;
}

export function handlePageSizeButtonClick(value) {
  state.currentPage = 0;
  state.pageSize = value;
  renderLeads();
  updatePaginationButtons();
}

export function handlePrevPageButtonClick() {
  state.currentPage--;
  renderLeads();
  updatePaginationButtons();
}

export function handleNextPageButtonClick() {
  state.currentPage++;
  renderLeads();
  updatePaginationButtons();
}
