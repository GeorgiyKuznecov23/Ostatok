# API: DummyJSON products

Документация: https://dummyjson.com/docs/products

## Общее

| Что | Значение |
|---|---|
| Base URL | `https://dummyjson.com` (в коде: `src/shared/api/config.ts`) |
| Протокол | HTTPS, ответы в JSON |
| Авторизация | не нужна, ключей нет |
| Заголовки запроса | `Accept: application/json` |
| Лимиты | в ответе есть заголовки `x-ratelimit-limit: 100`, `x-ratelimit-remaining`, `x-ratelimit-reset`. Приложение делает 1 запрос на загрузку списка и 1 на открытие карточки, до лимита далеко |
| CORS | для Expo Web сервер отвечает `access-control-allow-origin` с адресом страницы, браузер запрос пропускает |

## Запросы, которые использует приложение

### Список товаров

```
GET /products?limit=0&select=id,title,description,category,brand,sku,stock,price,thumbnail,minimumOrderQuantity
```

- `limit=0` — вернуть все товары сразу (194 штуки), без постраничной разбивки;
- `select` — только нужные поля, ответ около 80 КБ вместо нескольких сотен.

Ответ 200:

```json
{
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "The Essence Mascara Lash Princess is a popular mascara ...",
      "category": "beauty",
      "brand": "Essence",
      "sku": "BEA-ESS-ESS-001",
      "stock": 99,
      "price": 9.99,
      "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      "minimumOrderQuantity": 48
    }
  ],
  "total": 194,
  "skip": 0,
  "limit": 194
}
```

### Один товар

```
GET /products/{id}
```

Ответ 200 — объект товара с теми же полями (и ещё многими, приложение их не использует).

Ответ 404, если товара нет:

```json
{"message":"Product with id '9999' not found"}
```

## Какие поля обязательны

Проверка в `src/api/products/productDto.ts` (`parseProduct`):

| Поле | Тип | Обязательное |
|---|---|---|
| `id` | number | да |
| `title` | string | да |
| `description` | string | да |
| `category` | string | да |
| `sku` | string | да |
| `stock` | number | да |
| `price` | number | да |
| `brand` | string | нет — у 92 товаров из 194 бренда нет |
| `thumbnail` | string | нет |
| `minimumOrderQuantity` | number | нет |

У списка обязательны `products` (массив) и `total` (число). Если хоть одно поле не того типа, весь ответ считается ошибкой `contract_error`.

## Команды curl

В PowerShell нужно писать `curl.exe`, а не `curl`. Каждая команда в одну строку.

Список (выводим только статус и время, сам ответ большой):

```
curl.exe -s -o NUL -w "HTTP %{http_code}, %{size_download} байт, %{time_total} с" --max-time 10 "https://dummyjson.com/products?limit=0&select=id,title,description,category,brand,sku,stock,price,thumbnail,minimumOrderQuantity"
```

Результат: `HTTP 200, 82298 байт, 0.75 с`.

Один товар с заголовками:

```
curl.exe -i --max-time 10 "https://dummyjson.com/products/1"
```

Результат: `HTTP/1.1 200 OK`, `Content-Type: application/json; charset=utf-8`, `x-ratelimit-limit: 100`, дальше JSON товара.

Несуществующий товар:

```
curl.exe -i --max-time 10 "https://dummyjson.com/products/9999"
```

Результат: `HTTP/1.1 404 Not Found`, тело `{"message":"Product with id '9999' not found"}`.

Неверный маршрут:

```
curl.exe -i --max-time 10 "https://dummyjson.com/productz"
```

Результат: `HTTP/1.1 404 Not Found`, но `Content-Type: text/html` — сервер отдаёт HTML-страницу «Page not found», а не JSON. Поэтому для проверки 404 в приложении используется тестовый режим сети (сценарий «HTTP 404»): он даёт предсказуемый ответ.

Нечисловой id:

```
curl.exe -s "https://dummyjson.com/products/abc"
```

Результат: 404 и `{"message":"Product with id 'abc' not found"}`.
