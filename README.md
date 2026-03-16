# Clothing Shop (Spring Boot + React + MySQL + Elasticsearch)

## Tech stack
- Backend: Spring Boot, Maven, JWT, MySQL, Elasticsearch
- Frontend: React + Vite

## Quick start
### 1) Run MySQL + Elasticsearch (Docker)
```bash
docker run --name shop-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=shop -p 3306:3306 -d mysql:8

docker run --name shop-es -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -d docker.elastic.co/elasticsearch/elasticsearch:8.12.2
```

### 2) Backend
```bash
cd backend
mvn spring-boot:run
```
Default admin account (seeded on startup):
- email: `admin@shop.local`
- password: `admin123`

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

## API overview
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Public
- `GET /api/public/products`
- `GET /api/public/products/{id}`
- `GET /api/public/search?q=keyword`

### User
- `GET /api/user/cart`
- `POST /api/user/cart/items`
- `PUT /api/user/cart/items`

### Admin
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `PATCH /api/admin/products/{id}/inventory`
- `GET /api/admin/users`
- `PATCH /api/admin/users/{id}/enabled?enabled=true|false`
- `GET /api/admin/reports/daily`
- `GET /api/admin/reports/weekly`
- `GET /api/admin/reports/monthly`
- `GET /api/admin/reports/yearly`

## Notes
- Khi tao/sua san pham o admin, du lieu se duoc index vao Elasticsearch.
- Phan report hien tai thong ke so user moi theo ngay/tuan/thang/nam.
