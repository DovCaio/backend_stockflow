# 🛠️ CRUD de Produto

Este é um projeto simples de API REST para gerenciamento de produtos.  
Cada produto possui os seguintes atributos:

- `nome` (string): Nome do produto  
- `sku` (string): Código identificador único  
- `qttMin` (number): Quantidade mínima em estoque

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) instalado

### Passo a passo

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

3. Inicie o docker compose

```bash
docker compose up -d
```

4. Inicie o prisma

```bash
npx prisma migrate
```

5. **Inicie o servidor:**

```bash
npm run start:dev
# ou
yarn dev
```

6. A aplicação estará rodando em:

```
http://localhost:3000
```

---

## 📡 Endpoints

A API segue o padrão RESTful e está disponível em:  
**`http://localhost:3000/product`**

### 🔸 GET `/product`

Lista todos os produtos cadastrados.

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Produto A",
    "sku": "ABC123",
    "qttMin": 10
  }
]
```

---

### 🔸 GET `/product/:id`

Retorna um produto específico pelo `id`.

**Exemplo:**  
`GET http://localhost:3000/product/1`

---

### 🔸 POST `/product`

Cria um novo produto.

**Corpo da requisição (JSON):**
```json
{
  "nome": "Produto B",
  "sku": "XYZ456",
  "qttMin": 5
}
```

---

### 🔸 PUT `/product/:id`

Atualiza um produto existente.

**Exemplo:**  
`PUT http://localhost:3000/product/1`

**Corpo da requisição (JSON):**
```json
{
  "nome": "Produto Atualizado",
  "sku": "ABC123",
  "qttMin": 15
}
```

---

### 🔸 DELETE `/product/:id`

Remove um produto pelo `id`.

**Exemplo:**  
`DELETE http://localhost:3000/product/1`

### 🔍 Obter todos os produtos
GET /product
Retorna uma lista com todos os produtos cadastrados.

---

### 🔍 Obter a quantidade (`qtt`) de um produto
GET /product/qtt/:id

Parâmetros:
- id (number): ID do produto.

Retorna a quantidade atual (`qtt`) do produto com o ID fornecido.

---

### 🔄 Atualizar a quantidade (`qtt`) de um produto
PUT /product/qtt/:id/:newqtt

Parâmetros:
- id (number): ID do produto.
- newqtt (number): Nova quantidade a ser atribuída.

Atualiza a quantidade do produto com o ID fornecido para o novo valor especificado.

---

### 🕘 Obter histórico de um produto
GET /product/historic/:prodId

Parâmetros:
- prodId (number): ID do produto.

Retorna todos os registros de histórico associados ao produto.

___

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

