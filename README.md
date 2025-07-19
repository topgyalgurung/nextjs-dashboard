## Next.js Dashboard Application

#### Goal:
Learn Next.js through hands-on experience by building a full-stack application that covers its core features.

- Followed the curriculum chapter by chapter and wrote code along with it.
- Used external resources (Google, documentation, forums) to deepen understanding beyond the course material.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

##### Features:
- A public home page.
- A login page.
- Dashboard pages that are protected by authentication.
- The ability for users to add, edit, and delete invoices

# Overview

an overview of features to learn on this course:

- **Styling**: The different ways to style your application in Next.js.
- **Optimizations**: How to optimize images, links, and fonts.
- **Routing**: How to create nested layouts and pages using file-system routing.
- **Data Fetching**: How to set up a Postgres database on Vercel, and best practices for fetching and streaming.
- **Search and Pagination**: How to implement search and pagination using URL search params.
- **Mutating Data**: How to mutate data using React Server Actions, and revalidate the Next.js cache.
- **Error Handling**: How to handle general and 404 not found errors.
- **Form Validation and Accessibility**: How to do server-side form validation and tips for improving accessibility.
- **Authentication**: How to add authentication to your application using NextAuth.js and Middleware.
- **Metadata**: How to add metadata and prepare your application for social sharing.

___

### Available Routes
- [/dashboard](https://nextjs-dashboard-rho.vercel.app/dashboard) – Main dashboard page
  - [/dashboard/customers](https://nextjs-dashboard-rho.vercel.app/dashboard/customers) – Customer management view
  - [/dashboard/invoices](https://nextjs-dashboard-rho.vercel.app/dashboard/invoices) – Invoice tracking and management

- Login Credentials:
  - Email: user@nextmail.com
  - Password: 123456

#### NEXTAUTH.JS (AUTH.JS)

- NextAuth.js abstracts away much of the complexity involved in managing sessions, sign-in and sign-out, and other aspects of authentication

###### Setting up 
```bash
npm i next-auth@beta
```
Then generate a secret key for your application. This key is used to encrypt cookies, ensuring the security of user sessions
```bash
# macOS
openssl rand -base64 32
# Windows can use https://generate-secret.vercel.app/32
```
- Then, in your .env file, add your generated key to the AUTH_SECRET variable
  - or you van generate via 
    - $ npx auth secret 
  - this will add the secret into your .env.local for nextjs  
- For auth to work in production, you'll need to update your environment variables in your Vercel project too