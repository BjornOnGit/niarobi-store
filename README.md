# Novadora Liquor Store

A modern e-commerce platform for premium liquor delivery in Lagos and Abuja, built with Next.js, Supabase, and Paystack.

## 🚀 Features

### Customer Features

- **Product Catalog**: Browse premium wines, spirits, and champagne
- **Advanced Search & Filtering**: Find products by category, price range, and search terms
- **Product Reviews**: Rate and review products
- **Shopping Cart**: Add items, adjust quantities, and apply promo codes
- **Secure Checkout**: Integrated with Paystack for secure payments
- **Order Tracking**: Look up orders and track delivery status
- **User Authentication**: Sign up, sign in, and manage account
- **Delivery Management**: City-based delivery with dynamic fees

### Admin Features

- **Dashboard**: Overview of sales, orders, and key metrics
- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Management**: View orders, update status, and track fulfillment
- **User Management**: View users and promote to admin status
- **Promo Code Management**: Create and manage discount codes
- **Analytics**: Detailed insights into sales, top products, and performance

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Paystack
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone [repository-url]
   cd niarobi-store
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   \`\`\`

4. **Set up the database**
   Run the SQL scripts in the `scripts/` folder in order:
   \`\`\`bash

   ## Run these in your Supabase SQL editor

   scripts/001-create-products-table.sql
   scripts/002-create-orders-tables.sql
   scripts/003-create-delivery-cities-table.sql
   scripts/004-create-product-reviews-table.sql
   scripts/005-create-get-user-emails-function.sql
   scripts/006-fix-get-user-emails-function.sql
   scripts/007-create-admin-system.sql
   scripts/008-create-promo-codes-table.sql
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   - Customer site: <http://localhost:3000>
   - Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🗄 Database Schema

### Core Tables

- `products` - Product catalog with pricing and inventory
- `orders` - Customer orders with payment details
- `order_items` - Individual items within orders
- `product_reviews` - Customer reviews and ratings
- `promo_codes` - Discount codes and promotions
- `delivery_cities` - Supported delivery locations
- `delivery_fees` - City-specific delivery charges
- `user_roles` - Admin access management

## 🔐 Admin Setup

1. **Create your account** by signing up at `/auth`
2. **Get your user ID** from the Supabase Auth dashboard
3. **Make yourself admin** by running this SQL in Supabase:
   \`\`\`sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('your-user-id-here', 'admin');
   \`\`\`
4. **Access admin dashboard** at `/admin`

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Environment Variables for Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

## 📱 Usage

### For Customers

1. Browse products at `/products`
2. Add items to cart
3. Apply promo codes for discounts
4. Checkout with Paystack
5. Track orders at `/order-lookup`

### For Admins

1. Access dashboard at `/admin`
2. Manage products, orders, and users
3. Create promo codes
4. View analytics and reports

## 🔧 API Routes

### Public APIs

- `GET /api/products` - Get products with filtering
- `POST /api/checkout` - Initialize payment
- `POST /api/paystack/verify` - Verify payment
- `GET /api/order-details` - Get order details
- `POST /api/promo/validate` - Validate promo codes
- `POST /api/reviews` - Submit product reviews
- `GET /api/reviews` - Get product reviews

### Admin APIs

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/products` - Product management
- `GET /api/admin/orders` - Order management
- `GET /api/admin/users` - User management
- `GET /api/admin/promo-codes` - Promo code management
- `GET /api/admin/analytics` - Analytics data

## 🎯 Key Features Explained

### Promo Code System

- Percentage or fixed amount discounts
- Minimum order requirements
- Usage limits and expiry dates
- Maximum discount caps for percentage codes

### Order Management

- Real-time status updates
- Email notifications (ready for integration)
- Delivery tracking by city
- Payment verification with Paystack

### Product Reviews

- 5-star rating system
- Text reviews with moderation ready
- Average rating calculations
- User authentication required

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Admin role-based access control
- Secure API routes with authentication
- Input validation and sanitization
- CORS protection

## 🚧 Future Enhancements

- Email notifications
- SMS notifications
- Inventory management
- Multi-vendor support
- Mobile app
- Advanced analytics
- Customer loyalty program
- Wishlist functionality
