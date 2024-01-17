# Artisan-backend
3. Routes and Controllers:
AuthRoutes:

    POST /api/auth/signup: User registration.
    POST /api/auth/login: User login.
    GET /api/auth/logout: User logout.
    GET /api/auth/me: Get current user details.

ArtisansRoutes:

    GET /api/artisans: Get all artisans.
    GET /api/artisans/:id: Get artisan by ID.
    POST /api/artisans: Create a new artisan profile.
    PUT /api/artisans/:id: Update artisan profile.
    DELETE /api/artisans/:id: Delete artisan profile.

ProductsRoutes:

    GET /api/products: Get all products.
    GET /api/products/:id: Get product by ID.
    POST /api/products: Create a new product.
    PUT /api/products/:id: Update product.
    DELETE /api/products/:id: Delete product.

OrdersRoutes:

    GET /api/orders: Get all orders.
    GET /api/orders/:id: Get order by ID.
    POST /api/orders: Create a new order.
    PUT /api/orders/:id: Update order status.
    DELETE /api/orders/:id: Delete order.

4. Middleware:

    authMiddleware: Authenticate user based on JWT.
    adminMiddleware: Check if the user is an admin.
    errorMiddleware: Handle errors and send appropriate responses.
    validationMiddleware: Validate request data.