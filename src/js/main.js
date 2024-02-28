// Параметры вашей интеграции amoCRM
const clientId = "31d40032-e82b-4218-938c-d85abb14ba17";
const redirectUri = "https://petrlap.github.io/test-for-petr-lapatsinski";

// Функция для выполнения запроса на получение access_token
async function getAccessToken(authorizationCode) {
  const response = await fetch("https://oauth.amocrm.ru/oauth2/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: authorizationCode,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

// Функция для получения authorization_code (пользователь должен быть перенаправлен на эту страницу)
function getAuthorizationCode() {
  // Перенаправьте пользователя на страницу авторизации amoCRM
  window.location.href = `https://www.amocrm.ru/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
}

// Получаем authorization_code из параметров URL (если он есть)
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get("code");

// Если есть authorization_code, выполняем запрос на получение access_token
if (authorizationCode) {
  getAccessToken(authorizationCode)
    .then((access_token) => {
      console.log("Access token:", access_token);
      // Сохраняем access_token для последующего использования
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
