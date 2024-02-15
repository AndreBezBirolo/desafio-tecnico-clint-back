# Kanban - Crud Back End

## Descrição

Desenvolver um aplicativo simples de Kanban que permita aos usuários gerenciar tarefas através de três colunas: "To
Do", "Doing", e "Ready". O aplicativo será composto por backend em Node.js, utilizando Express para comunicação e SQLite
para persistência de dados.

## Tecnologias utilizadas

* Node.js
* Express.js
* React.js
* TypeScript
* Axios
* bcrypt
* jsonwebtoken
* react-beautiful-dnd
* react-bootstrap
* SQLite3
* Lodash

## Instalação

1. Clone o repositório:
    ```
    git clone https://github.com/AndreBezBirolo/nodejs-express-crud-kanban.git
    ```

2. Instale as dependências:
    ```
    npm install
    ```

## Configuração

1. Renomeie o arquivo `.env.example` para `.env`.
2. Configure as variáveis de ambiente conforme necessário.
3. O banco de dados irá se gerar automaticamente quando você iniciar o projeto.

## Uso

Para iniciar o servidor:

```
npm start
```

O servidor estará acessível em `http://localhost:3000` por padrão, a menos que especificado de outra forma nas variáveis
de ambiente.

## Endpoints

### `POST /user/register`

Cria um novo usuário com as credenciais fornecidas.

#### Parâmetros da Solicitação

- `username`: O nome de usuário do novo usuário.
- `password`: A senha do novo usuário.

#### Exemplo de Solicitação

```
POST /user/register
Content-Type: application/json

{
    "username": "novousuario",
    "password": "senhadonovousuario"
}
```

#### Exemplo de Resposta

```
Status: 201 Created
{
    "message": "User registered successfully"
    "token": "tokenJWT"
}
```

### `POST /user/login`

Se autentica com as credenciais fornecidas.

#### Parâmetros da Solicitação

- `username`: O nome de usuário do usuário cadastrado.
- `password`: A senha do usuário cadastrado.

#### Exemplo de Solicitação

```
POST /user/login
Content-Type: application/json

{
    "username": "usuarioCadastrado",
    "password": "senhadoUsuarioCadastrado"
}
```

#### Exemplo de Resposta

```
Status: 200 Ok
{
    "token": "tokenJWT"
}
```

### `GET /tasks`

Retorna todas as tarefas de um determinado usuário autenticado.

#### Exemplo de Solicitação

```
GET /tasks
Authorization: Bearer TokenJWT
```

#### Exemplo de Resposta

```
Status: 200 Ok
[{
    "id": 1,
    "name": "Tarefa",
    "status": "todo",
    "due_date": 1708041600000,
    "user_id": 1
}]
```

### `POST /tasks`

Cria uma tarefa para o usuário autenticado.

#### Exemplo de Solicitação

```
POST /tasks
Authorization: Bearer TokenJWT

{
    "name": "Tarefa",
    "due_date": "2024-02-16",
    "status": "todo"
}
```

#### Exemplo de Resposta

```
Status: 201 Created
{
    "id": 1,
    "name": "Tarefa",
    "status": "todo",
    "due_date": "2024-02-16T00:00:00.000Z"
}
```

### `PATCH /tasks/:id`

Edita valores de uma tarefa em especifico do usuário autenticado.

#### Exemplo de Solicitação

```
PATCH /tasks/:id
Authorization: Bearer TokenJWT

{
    "status": "doing"
}
```

#### Exemplo de Resposta

```
Status: 204 No content
```

### `DELETE /tasks/:id`

Deleta uma tarefa em especifico do usuário autenticado.

#### Exemplo de Solicitação

```
DELETE /tasks/:id
Authorization: Bearer TokenJWT

```

#### Exemplo de Resposta

```
Status: 204 No content
```

## Contribuição

As contribuições são bem-vindas! Para sugestões, abra um problema. Para alterações importantes, envie um pull request.

## Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).
