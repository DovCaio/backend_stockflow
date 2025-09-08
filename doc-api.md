# Documentação da API 

## Endpoints e Respostas Esperadas

### 1. Resumo do Dashboard
**GET /api/dashboard/summary**
- Método: GET
- Payload: Nenhum
- Resposta:

```json
{
  "totalProducts": 100,
  "lowStockProducts": 8,
  "outOfStockProducts": 2,
  "totalMovements": 350,
  "todayMovements": 12
}
```

### 2. Listar Produtos com Paginação
**GET /api/products/all**

- Método: GET
- Query params (opcionais):

```json
{
  "page": 1,
  "limit": 10,
  "search": "caneta",
  "category": "escolar",
  "stockStatus": "low"
}
```

Exemplo:
```json
/api/products/all?page=1&limit=10&search=caneta&category=escolar&stockStatus=low
```

- Resposta:

```json
{
  "products": [
    {
      "id": "1",
      "name": "Caneta Azul",
      "sku": "CAN-001",
      "currentStock": 12,
      "minimumStock": 10,
      "description": "Caneta esferográfica azul",
      "category": "escolar",
      "price": 2.5,
      "createdAt": "2024-09-01T12:00:00Z",
      "updatedAt": "2024-09-03T10:00:00Z"
    }
    // ...outros produtos
  ],
  "total": 50,
  "totalPages": 5
}
```

### 3. GET /api/products
- Método: GET
- Query params:

```json
{
  "limit": 6,
  "sort": "bestSellers",
  "period": "month"
}
```

Exemplo: 
```json 
/api/products?limit=6&sort=bestSellers&period=month
```

- Resposta:

```json
[
  {
    "id": "1",
    "name": "Caneta Azul",
    "sku": "CAN-001",
    "currentStock": 12,
    "minimumStock": 10,
    "description": "Caneta esferográfica azul",
    "category": "escolar",
    "price": 2.5,
    "createdAt": "2024-09-01T12:00:00Z",
    "updatedAt": "2024-09-03T10:00:00Z"
  }
  // ...outros produtos
]
```

### 4. GET /api/products/alerts
- Método: GET

```json
{
  "type": "lowStock"
}
```

Exemplo 
```json
/api/products/alerts?type=lowStock
```

- Resposta:

```json
[
  {
    "id": "2",
    "name": "Lápis Preto",
    "sku": "LAP-002",
    "currentStock": 5,
    "minimumStock": 10,
    "description": "Lápis escolar preto",
    "category": "escolar",
    "price": 1.0,
    "createdAt": "2024-09-01T12:00:00Z",
    "updatedAt": "2024-09-03T10:00:00Z"
  }
  // ...outros produtos
]
```

### 5. GET /api/products/:id
- Método: GET
- URL param: **id (string)**

Exemplo 
```json
/api/products/123
```

- Resposta:

```json
{
  "id": "1",
  "name": "Caneta Azul",
  "sku": "CAN-001",
  "currentStock": 12,
  "minimumStock": 10,
  "description": "Caneta esferográfica azul",
  "category": "escolar",
  "price": 2.5,
  "createdAt": "2024-09-01T12:00:00Z",
  "updatedAt": "2024-09-03T10:00:00Z"
}
```

### 6. POST /api/products
- Método: POST
- Body:

```json
{
  "name": "Caneta Azul",
  "sku": "CAN-001",
  "description": "Caneta esferográfica azul",
  "category": "escolar",
  "price": 2.5,
  "minimumStock": 10
}
```
- Resposta:

```json
{
  "id": "1",
  "name": "Caneta Azul",
  "sku": "CAN-001",
  "currentStock": 0,
  "minimumStock": 10,
  "description": "Caneta esferográfica azul",
  "category": "escolar",
  "price": 2.5,
  "createdAt": "2024-09-01T12:00:00Z",
  "updatedAt": "2024-09-01T12:00:00Z"
}
```

### 7. PATCH /api/products/:id
- Método: PATCH
- URL param: **id (string)**
- Body:

```json
{
  "name": "Caneta Azul Premium",
  "price": 3.0
}
```
- Resposta:

```json
{
  "id": "1",
  "name": "Caneta Azul Premium",
  "sku": "CAN-001",
  "currentStock": 12,
  "minimumStock": 10,
  "description": "Caneta esferográfica azul",
  "category": "escolar",
  "price": 3.0,
  "createdAt": "2024-09-01T12:00:00Z",
  "updatedAt": "2024-09-03T10:00:00Z"
}
```

### 8. DELETE /api/products/:id
- Método: DELETE
- URL param: **id (string)**
- Resposta: **HTTP 204 ou 200 (sem conteúdo)**


### 9. POST /api/products/:id/movements
- Método: POST
- URL param: **id (string)**
- Body:

```json
{
  "type": "IN",
  "quantity": 50,
  "note": "Reposição de estoque"
}
```
- Resposta: **HTTP 201 ou 200 (sem conteúdo)**


### 10. GET /api/movements
- Método: GET
- Query params (opcional):

```json
{
  "page": 1,
  "limit": 20,
  "search": "caneta",
  "type": "IN",
  "productId": "1",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-31"
}
```

Exemplo
```json
/api/movements?page=1&limit=20&type=IN&productId=123&dateFrom=2024-01-01&dateTo=2024-01-31
```

- Resposta:

```json
{
  "movements": [
    {
      "id": "m1",
      "productId": "1",
      "type": "IN",
      "quantity": 50,
      "note": "Reposição de estoque",
      "createdAt": "2024-09-03T10:00:00Z"
    }
    // ...outros movimentos
  ],
  "total": 10,
  "totalPages": 1
}
```
