import { state } from "./store.js";

export function renderLeadsTable(leads) {
  const tableContainer = document.getElementById("leads-table-container");
  tableContainer.innerHTML = "";
  const table = document.createElement("table");
  table.classList.add("leads-table");
  const headerThead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headerCells = ["Сделка", "Бюджет", "Дата", "Время создания"];
  headerCells.forEach((headerText) => {
    const headerCell = document.createElement("th");
    if (headerText === "Сделка" || headerText === "Бюджет") {
      const container = document.createElement("div");
      const textNode = document.createTextNode(headerText);
      container.appendChild(textNode);
      const button = document.createElement("button");
      button.classList.add("sort-button");
      button.innerHTML = "&darr;";
      headerText === "Сделка"
        ? (button.id = "sortByName")
        : (button.id = "sortByPrice");
      container.appendChild(button);
      headerCell.appendChild(container);
    } else {
      headerCell.textContent = headerText;
    }
    headerRow.appendChild(headerCell);
    headerThead.appendChild(headerRow);
  });

  table.appendChild(headerThead);
  const headerTbody = document.createElement("tbody");
  leads.forEach((lead) => {
    const leadRow = document.createElement("tr");
    ["name", "price", "created_at", "created_at_time"].forEach((fieldName) => {
      const cell = document.createElement("td");
      let value = lead[fieldName];
      if (fieldName === "created_at") {
        const createdAt = new Date(lead[fieldName] * 1000);
        value = createdAt.toLocaleDateString();
      }
      if (fieldName === "created_at_time") {
        const createdAtTime = new Date(lead["created_at"] * 1000);
        value = createdAtTime.toLocaleTimeString();
      }
      cell.textContent = value;
      leadRow.appendChild(cell);
    });
    headerTbody.appendChild(leadRow);
    table.appendChild(headerTbody);
  });

  tableContainer.appendChild(table);
  document.getElementById("sortByName").addEventListener("click", function () {
    state.dealsSlice = [...state.dealsSlice].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    renderLeadsTable(state.dealsSlice);
  });
  document.getElementById("sortByPrice").addEventListener("click", function () {
    state.dealsSlice = [...state.dealsSlice].sort((a, b) => a.price - b.price);
    renderLeadsTable(state.dealsSlice);
  });
}

export function renderLeads() {
  const start = state.currentPage * state.pageSize;
  const end = start + state.pageSize;
  const currentPageLeads = state.deals.slice(start, end);
  state.dealsSlice = currentPageLeads;
  renderLeadsTable(currentPageLeads);
}
