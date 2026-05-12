# Medisage Assignment

Full-stack project with:

- **Backend**: Express + MongoDB (Mongoose)
- **Frontend**: Next.js (App Router, JavaScript)
- **API Testing**: Postman collection JSON

---

## Project Structure

```text
.
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── app/
│   ├── package.json
│   └── ...
├── Medisage_assignment.postman_collection.json
└── README.md
```

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Create/update `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 3. Start backend

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Optional frontend API URL

Create `frontend/.env.local` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Postman Collection (`collection.json`)

This project includes a Postman collection file:

- `Medisage_assignment.postman_collection.json`

If your submission specifically asks for `collection.json`, rename the exported Postman file to:

- `collection.json`

### Import in Postman

1. Open Postman.
2. Click **Import**.
3. Select `Medisage_assignment.postman_collection.json` (or `collection.json`).
4. Set collection variable:
   - `baseUrl = http://localhost:5000`

---

## API Documentation

Base URL:

```text
http://localhost:5000
```

### Projects

#### 1. Create Project

- **Method**: `POST`
- **Route**: `/projects`
- **Body (JSON)**:

```json
{
  "name": "Website Revamp",
  "description": "Landing page redesign"
}
```

- **Validation**:
  - `name` is required.

#### 2. Get Projects (Paginated)

- **Method**: `GET`
- **Route**: `/projects?page=1&limit=10`
- **Query Params**:
  - `page` (optional, default: `1`)
  - `limit` (optional, default: `10`)

- **Response shape**:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1
  }
}
```

#### 3. Get Project by ID

- **Method**: `GET`
- **Route**: `/projects/:id`

#### 4. Delete Project by ID

- **Method**: `DELETE`
- **Route**: `/projects/:id`
- Also deletes related tasks for that project.

---

### Tasks

#### 1. Create Task for Project

- **Method**: `POST`
- **Route**: `/projects/:project_id/tasks`
- **Body (JSON)**:

```json
{
  "title": "Design hero section",
  "description": "Prepare first draft",
  "status": "todo",
  "priority": "medium",
  "due_date": "2026-06-01"
}
```

- **Validation**:
  - `title` is required.
  - `status` must be one of: `todo`, `in-progress`, `done`.
  - `priority` must be one of: `low`, `medium`, `high`.

#### 2. Get Tasks for Project (Filter + Sort)

- **Method**: `GET`
- **Route**: `/projects/:project_id/tasks`
- **Query Params**:
  - `status` (optional): `todo` | `in-progress` | `done`
  - `sort` (optional): `asc` | `desc`

- **Sorting logic**:
  - `.sort({ due_date: sort === "asc" ? 1 : -1 })`

#### 3. Update Task by ID

- **Method**: `PUT`
- **Route**: `/tasks/:id`
- **Body (any updatable fields)**:

```json
{
  "status": "in-progress",
  "priority": "high"
}
```

#### 4. Delete Task by ID

- **Method**: `DELETE`
- **Route**: `/tasks/:id`

---

## Error Handling

Global error middleware is enabled in backend:

```js
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
```

---

## Notes

- Ensure MongoDB connection string in `backend/.env` is valid.
- Start backend before using frontend or Postman requests.
