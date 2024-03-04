import { handleAuthorizationResponse } from "./auth.js";
import { renderLeads } from "./render.js";
import {
  handlePageSizeButtonClick,
  handlePrevPageButtonClick,
  handleNextPageButtonClick,
  updatePaginationButtons,
} from "./pagination.js";

//refreshTokens();
//Уберите комментарий чтобы получить новые токены,чтобы их было проще найти и не потерять я их вывел в консоль
//Так же нужно не забыть запустить прокси сервер. Перейдите по ссылке и нажмите на кнопку запуска.
//https://cors-anywhere.herokuapp.com/corsdemo

handleAuthorizationResponse();

document.addEventListener("DOMContentLoaded", function () {
  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");

  document
    .getElementById("pageSizeSelect")
    .addEventListener("change", function () {
      const selectedPageSize = parseInt(this.value);
      if (selectedPageSize === 9999) {
        handleAuthorizationResponse();
      } else {
        handlePageSizeButtonClick(selectedPageSize);
      }
    });

  prevPageButton.addEventListener("click", handlePrevPageButtonClick);
  nextPageButton.addEventListener("click", handleNextPageButtonClick);
});

renderLeads();
updatePaginationButtons();
