# Literary and Debating Society

A full-stack dark academia blog platform.

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Creating an Admin Account

Register normally, then update the user's role in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Image Storage

By default images are stored locally in `backend/uploads/`.  
To use Cloudinary, add your credentials to `backend/.env`.
