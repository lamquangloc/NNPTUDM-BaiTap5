# Categories API Documentation

## Base URL
`http://localhost:3000/api/v1/categories`

## Endpoints

### 1. GET All Categories (with optional name filter)
**Endpoint:** `GET /api/v1/categories`

**Query Parameters:**
- `name` (optional): Filter categories by name (case-insensitive)

**Examples:**
```
GET /api/v1/categories
GET /api/v1/categories?name=clothes
GET /api/v1/categories?name=elec
```

**Response:** Array of category objects

---

### 2. GET Category by ID
**Endpoint:** `GET /api/v1/categories/:id`

**Example:**
```
GET /api/v1/categories/7
```

**Response:** Single category object or 404 error

---

### 3. GET Category by Slug
**Endpoint:** `GET /api/v1/categories/slug/:slug`

**Example:**
```
GET /api/v1/categories/slug/clothes
GET /api/v1/categories/slug/electronics
```

**Response:** Single category object or 404 error

---

### 4. GET All Products by Category ID
**Endpoint:** `GET /api/v1/categories/:id/products`

**Example:**
```
GET /api/v1/categories/7/products
GET /api/v1/categories/8/products
```

**Description:** Returns all products that belong to the specified category.

**Response:** Array of product objects or 404 error if category not found

---

### 5. POST Create New Category
**Endpoint:** `POST /api/v1/categories`

**Request Body:**
```json
{
  "name": "New Category",
  "image": "https://example.com/image.jpg"
}
```

**Response:** Created category object with auto-generated ID and slug

---

### 6. PUT Update Category
**Endpoint:** `PUT /api/v1/categories/:id`

**Example:**
```
PUT /api/v1/categories/7
```

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "image": "https://example.com/new-image.jpg"
}
```

**Note:** When updating the name, the slug will be automatically regenerated.

**Response:** Updated category object

---

### 7. DELETE Category (Soft Delete)
**Endpoint:** `DELETE /api/v1/categories/:id`

**Example:**
```
DELETE /api/v1/categories/7
```

**Response:** Deleted category object with `isDeleted: true`

---

## Testing with cURL

### Get all categories:
```bash
curl http://localhost:3000/api/v1/categories
```

### Get categories filtered by name:
```bash
curl "http://localhost:3000/api/v1/categories?name=clothes"
```

### Get category by ID:
```bash
curl http://localhost:3000/api/v1/categories/7
```

### Get category by slug:
```bash
curl http://localhost:3000/api/v1/categories/slug/clothes
```

### Get all products by category ID:
```bash
curl http://localhost:3000/api/v1/categories/7/products
```

### Create new category:
```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"New Category\",\"image\":\"https://example.com/image.jpg\"}"
```

### Update category:
```bash
curl -X PUT http://localhost:3000/api/v1/categories/7 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Updated Name\",\"image\":\"https://example.com/new-image.jpg\"}"
```

### Delete category:
```bash
curl -X DELETE http://localhost:3000/api/v1/categories/7
```

---

## Notes
- All deleted categories are soft-deleted (marked with `isDeleted: true`)
- Deleted categories won't appear in GET requests
- Slugs are automatically generated from category names
- IDs are auto-incremented based on existing data
