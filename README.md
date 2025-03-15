# U-DO Druk - E-commerce Platform

A modern e-commerce platform for selling prints and products with admin management capabilities.

## Features

- Multi-language support (English, Ukrainian, Polish, Japanese)
- Product and print management
- Order management
- User authentication and authorization
- Admin dashboard
- Responsive design

## Backend API

The application includes a RESTful API for managing products, prints, and orders:

### Products API

- `GET /api/products` - Get all products (with optional filtering)
- `POST /api/products` - Create a new product (admin only)
- `GET /api/products/:id` - Get a specific product
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Prints API

- `GET /api/prints` - Get all prints (with optional filtering)
- `POST /api/prints` - Create a new print (admin only)
- `GET /api/prints/:id` - Get a specific print
- `PUT /api/prints/:id` - Update a print (admin only)
- `DELETE /api/prints/:id` - Delete a print (admin only)

### Orders API

- `GET /api/orders` - Get all orders (admin) or user orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get a specific order
- `PUT /api/orders/:id` - Update an order status (admin only)
- `DELETE /api/orders/:id` - Delete an order (admin only)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/udo-druk.git
   cd udo-druk
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/udo-druk?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

Use the following credentials to access the admin dashboard:

- **Admin User**

  - Email: admin@u-do.shop
  - Password: admin123

- **Superadmin User**
  - Email: marina@u-do.shop
  - Password: motherlord

## Database Models

### Product Model

```typescript
interface IProduct {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
}
```

### Print Model

```typescript
interface IPrint {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  inStock: boolean;
}
```

### Order Model

```typescript
interface IOrder {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
