# Farmlytics Backend API

## 🌾 Empowering Rwandan Farmers with Data-Driven Decisions

This repository contains the backend API for **Farmlytics**, a comprehensive agricultural intelligence platform designed to empower Rwandan farmers. By leveraging national agricultural and socio-economic datasets (SAS, EICV7, Establishment Census, Population Census), Farmlytics provides personalized crop planning, market connection insights, and harvest tracking to optimize agricultural productivity and market access.

---

## 🔗 Deployed API Link

**(Note: Once your backend is deployed, replace this placeholder with the actual URL.)**

`https://your-deployed-farmlytics-backend.com/api/v1`

---

## 🚀 Key Features

The Farmlytics backend provides a robust set of API endpoints to power the web and mobile applications:

*   **User Authentication & Authorization:** Secure user registration, login, JWT-based authentication, and role-based access control (`admin`, `farmer`, `buyer`).
*   **Email Verification:** Ensures valid user accounts through email confirmation.
*   **Personalized Crop Planner:** Recommends optimal crops, area allocation, and estimated yields based on farmer's location and farm size.
*   **Market Demand Analysis:** Identifies high-demand crops and consumption patterns in specific regions.
*   **Market Connection & Export Insights:** Helps farmers find cooperatives, local buyers, food processors, and export-oriented businesses.
*   **Harvest & Revenue Tracker:** Allows farmers to log their planting data, get dynamic estimates for harvest dates, total production, and estimated revenue, with full CRUD (Create, Read, Update, Delete) capabilities.
*   **Interactive API Documentation:** Powered by Swagger/OpenAPI for easy exploration and testing of all endpoints.

---

## 🛠️ Tech Stack

*   **Runtime:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB
*   **ODM (Object Data Modeling)::** Mongoose
*   **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js
*   **Emailing:** Nodemailer
*   **Asynchronous Handling:** `express-async-handler`
*   **Environment Variables:** `dotenv`
*   **CORS:** `cors` middleware
*   **CSV Parsing:** `csv-parse`
*   **API Documentation:** `swagger-jsdoc` & `swagger-ui-express`

---

## 📂 Project Structure

The backend follows a modular and organized structure:

```bash
farmlytics-backend/
├── src/
│   ├── app.js                # Main Express app setup, middleware, Swagger, and route mounting.
│   ├── server.js             # Entry point: connects to DB, initializes analytics, starts server, seeds admin.
│   ├── config/
│   │   ├── db.js             # MongoDB connection logic.
│   │   └── index.js          # Centralized environment variable loading.
│   ├── middlewares/
│   │   ├── auth.js           # JWT authentication and role-based authorization middleware.
│   │   └── error.js          # Centralized error handling middleware.
│   ├── models/
│   │   ├── User.js           # Mongoose schema for users (Auth).
│   │   └── CropPlan.js       # Mongoose schema for farmer's crop planting records.
│   ├── routes/
│   │   ├── auth.js           # Authentication routes (register, login, verify email).
│   │   ├── cropPlanner.js    # Crop recommendation routes.
│   │   ├── market.js         # Market demand & business connection routes.
│   │   ├── tracker.js        # Harvest & revenue estimation routes.
│   │   └── cropPlan.js       # CRUD operations on crop plans.
│   ├── controllers/
│   │   ├── authController.js       # User auth logic.
│   │   ├── cropPlannerController.js # Crop recommendations logic.
│   │   ├── marketController.js      # Market insights logic.
│   │   ├── trackerController.js     # Harvest & revenue estimates logic.
│   │   └── cropPlanController.js    # CropPlan CRUD logic.
│   └── utils/
│       ├── analyticsService.js # Analytics service for CSV data.
│       └── sendEmail.js        # Email sending helper.
├── data/
│   ├── farmlytics_sas_production_cleaned_aggregated.csv
│   ├── farmlytics_eicv_consumption_cleaned_aggregated.csv
│   └── farmlytics_establishment_census_cleaned_aggregated.csv
├── .env                 # Environment variables
├── .gitignore           # Files/folders to ignore
└── package.json         # Project metadata and dependencies

---
# ⚙️ Setup & Installation

Follow these steps to get the **Farmlytics Backend** running locally:

---

## 1. Clone the Repository

```bash
git clone <repository-url> # Replace with your actual repository URL
cd farmlytics-backend
2. Install Dependencies
bash
Copy code
npm install
3. Prepare Data Files
Ensure your data/ directory contains the cleaned and aggregated CSV files generated in the data preparation phase:

farmlytics_sas_production_cleaned_aggregated.csv

farmlytics_eicv_consumption_cleaned_aggregated.csv

farmlytics_establishment_census_cleaned_aggregated.csv

👉 These files are automatically loaded by analyticsService.js during server startup.

4. Configure Environment Variables
Create a .env file in the root of the project:

dotenv
Copy code
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://<your_atlas_user>:<your_atlas_password>@cluster0.abcde.mongodb.net/farmlyticsdb?retryWrites=true&w=majority
# OR local MongoDB
# MONGO_URI=mongodb://localhost:27017/farmlyticsdb

# JWT Configuration
JWT_SECRET=YOUR_VERY_STRONG_RANDOM_JWT_SECRET_KEY   # CHANGE THIS IN PRODUCTION
JWT_EXPIRE=30d

# Admin User (auto-seeded on first run if missing)
ADMIN_EMAIL=admin@farmlytics.com
ADMIN_PASSWORD=strongadminpassword  # CHANGE THIS IN PRODUCTION

# Email Service (e.g., Gmail + Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_sending_email@gmail.com 
EMAIL_PASS=your_app_password   # Gmail requires an App Password
NOREPLY_EMAIL=your_sending_email@gmail.com
SENDER_NAME="Farmlytics"

# Frontend URL (for email verification)
BASE_FRONTEND_URL=http://localhost:3000
5. MongoDB Setup
Using MongoDB Atlas
Ensure your cluster is running

Whitelist your IP address (0.0.0.0/0 only for development)

Create a database user with readWrite access to farmlyticsdb

Replace <your_atlas_user> and <your_atlas_password> in MONGO_URI

Using Local MongoDB
Start your MongoDB service with mongod

Default URI: mongodb://localhost:27017/farmlyticsdb

6. Start the Server
bash
Copy code
npm start
For development (with auto-reloading if nodemon is installed):

bash
Copy code
npm run dev
Expected logs on success:

sql
Copy code
MongoDB Connected: ...
Initializing analytics services...
All analytics services initialized successfully.
Server running in development mode on port 5000
Admin user seeded successfully. (or "Admin user already exists.")
📚 API Documentation (Swagger/OpenAPI)
Once running, open:
👉 http://localhost:5000/api-docs

Here you can explore endpoints, schemas, and test requests directly.

🔐 Authentication & Authorization
Farmlytics uses JWT-based authentication and role-based authorization.

Roles
admin → Full access, user management, crop plans

farmer → Crop recommendations, market insights, crop plans

buyer → Market demand insights, buyers/processors/exporters

Security Features
✅ Email Verification: Required before login (via verification link)

✅ JWT Protection: Protected routes require Authorization: Bearer <token>

✅ Role-based Access: Enforced with middleware

📍 Core API Modules & Endpoints
1. Auth Module (/api/v1/auth)
POST /auth/register → Register + send verification email

POST /auth/login → Login + get JWT (only if verified)

GET /auth/me → Get authenticated user profile

GET /auth/verifyemail/{token} → Verify email

2. Crop Planner Module (/api/v1/crops)
GET /crops/recommendations → Personalized crop suggestions

3. Market Connection Module (/api/v1/market)
GET /market/demand → Crops in high demand

GET /market/cooperatives → Agricultural cooperatives list

GET /market/buyers-processors → Buyers & processors directory

GET /market/exporters → Exporter insights

4. Harvest Tracker Module (/api/v1/tracker, /api/v1/crop-plans)
GET /tracker/estimates → On-the-fly harvest & revenue estimates

POST /crop-plans → Create crop plan

GET /crop-plans → View all plans (per user, admin can filter by userId)

GET /crop-plans/{id} → View single crop plan

PUT /crop-plans/{id} → Update plan (recalculates estimates)

DELETE /crop-plans/{id} → Delete crop plan

🎨 Color Palette (Rwandan Flag Inspired)
Green #007A3D → Prosperity & hope

Yellow #FFD200 → Economic development

Blue #00A3DD → Peace & tranquility

🚧 Future Enhancements (Roadmap)
🔄 Real-time Market Prices (live APIs)

🌦️ Weather Data Integration

🌱 Soil Data Integration

👤 Farmer Profiles

🤝 Buyer/Cooperative Contact Management

🔔 Push Notifications

🤖 Advanced ML-based Analytics

🤝 Contributing
Contributions are welcome 🎉

Open issues

Submit PRs

Suggest improvements

📄 License
This project is licensed under the MIT License.

yaml
Copy code
