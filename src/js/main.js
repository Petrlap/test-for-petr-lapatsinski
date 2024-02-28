// Параметры вашей интеграции amoCRM
const clientId = "31d40032-e82b-4218-938c-d85abb14ba17";
const redirectUri = "https://petrlap.github.io/test-for-petr-lapatsinski/"; // Замените на ваш действительный URI перенаправления

// Функция для отправки запроса на получение токенов
async function getTokens(authorizationCode) {
  const proxyUrl = "https://cors-anywhere.herokuapp.com"; // Прокси-сервер для обхода политики CORS

  try {
    const response = await fetch(
      `${proxyUrl}/https://www.amocrm.ru/oauth2/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: redirectUri,
        }),
      }
    );

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  } catch (error) {
    throw new Error("Ошибка при получении токенов: " + error.message);
  }
}

// Функция для обработки ответа авторизации и получения токенов
async function handleAuthorizationResponse(response) {
  try {
    if (response.client_id !== clientId) {
      throw new Error("Неверный ID клиента в ответе");
    }
    if (!response.code) {
      throw new Error("Отсутствует код авторизации в ответе");
    }

    const authorizationCode = response.code;
    const tokens = await getTokens(authorizationCode);

    console.log("Access token:", tokens.access_token);
    console.log("Refresh token:", tokens.refresh_token);

    // После получения токенов отправляем запрос на получение списка сделок
    const deals = await getDeals(tokens.access_token);
    console.log("Deals:", deals);

    // Отображаем список сделок в виде таблицы
    renderDealsTable(deals);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

// Обработчик клика по кнопке авторизации
function handleAuthorizationButtonClick() {
  // Создание элемента кнопки на сайте
  const button = document.createElement("script");
  button.setAttribute("class", "amocrm_oauth");
  button.setAttribute("charset", "utf-8");
  button.setAttribute("data-client-id", clientId);
  button.setAttribute("data-title", "Авторизоваться через amoCRM");
  button.setAttribute("data-compact", "false");
  button.setAttribute("data-class-name", "className");
  button.setAttribute("data-color", "default");
  button.setAttribute("data-state", "state");
  button.setAttribute("data-error-callback", "functionName");
  button.setAttribute("data-mode", "popup");
  button.setAttribute("src", "https://www.amocrm.ru/auth/button.min.js");

  // Добавление кнопки на страницу
  document.body.appendChild(button);
}

// Получаем authorization_code из параметров URL (если он есть)
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get("code");

// Если есть authorization_code, обрабатываем его
if (authorizationCode) {
  handleAuthorizationResponse({ code: authorizationCode, client_id: clientId });
} else {
  // Если нет authorization_code, добавляем кнопку на страницу и ждем клика пользователя
  handleAuthorizationButtonClick();
}
