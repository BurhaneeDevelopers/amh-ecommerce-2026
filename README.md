# MSI E-commerce Platform

This is a modern, full-stack e-commerce platform for MSI products, built with Next.js and Supabase.

## Features

- **Product Catalog:** Browse and search for MSI products.
- **User Authentication:** Sign up, log in, and manage your account.
- **Wishlist:** Save your favorite products to a wishlist.
- **Enquiries:** Submit enquiries about products.
- **Responsive Design:** A clean and modern UI that works on all devices.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Backend & Database:** [Supabase](https://supabase.io/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Jotai](https://jotai.org/)
- **Form Management:** [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/msi-ecommerce.git
   cd msi-ecommerce
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root of the project and add the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   You can get these keys from your Supabase project dashboard.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase.

## Project Structure

The project is organized into the following directories:

- `src/api`: Contains services for interacting with the Supabase API.
- `src/app`: Contains the pages and layouts for the application.
- `src/components`: Contains reusable UI components.
- `src/hooks`: Contains custom React hooks.
- `src/jotai`: Contains the Jotai state management configuration.
- `src/lib`: Contains utility functions.
- `src/supabase`: Contains the Supabase client configuration.