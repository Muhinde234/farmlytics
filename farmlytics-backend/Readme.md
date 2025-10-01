# Farmlytics Backend API

## Empowering Rwandan Farmers with Data-Driven Decisions

This repository contains the backend API for **Farmlytics**, a comprehensive agricultural intelligence platform designed to empower Rwandan farmers. By leveraging national agricultural and socio-economic datasets (SAS, EICV7, Establishment Census, Population Census), Farmlytics provides personalized crop planning, market connection insights, and harvest tracking to optimize agricultural productivity and market access.

---

## Deployed API Link

**(Note: Once your backend is deployed, replace this placeholder with the actual URL.)**

`https://your-deployed-farmlytics-backend.com/api/v1`

---

##  Key Features

The Farmlytics backend provides a robust set of API endpoints to power the web and mobile applications:

- **User Authentication & Authorization:** Secure user registration, login, JWT-based authentication, and role-based access control (`admin`, `farmer`, `buyer`).
- **Email Verification:** Ensures valid user accounts through email confirmation.
- **Personalized Crop Planner:** Recommends optimal crops, area allocation, and estimated yields based on farmer's location and farm size.
- **Market Demand Analysis:** Identifies high-demand crops and consumption patterns in specific regions.
- **Market Connection & Export Insights:** Helps farmers find cooperatives, local buyers, food processors, and export-oriented businesses.
- **Harvest & Revenue Tracker:** Allows farmers to log their planting data, get dynamic estimates for harvest dates, total production, and estimated revenue, with full CRUD (Create, Read, Update, Delete) capabilities.
- **Interactive API Documentation:** Powered by Swagger/OpenAPI for easy exploration and testing of all endpoints.

---

## Tech Stack

- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB
- **ODM (Object Data Modeling):** Mongoose
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js
- **Emailing:** Nodemailer
- **Asynchronous Handling:** `express-async-handler`
- **Environment Variables:** `dotenv`
- **CORS:** `cors` middleware
- **CSV Parsing:** `csv-parse`
- **API Documentation:** `swagger-jsdoc` & `swagger-ui-express`

---

## Project Structure

The backend follows a modular and organized structure:

```bash
farmlytics-backend/
├── src/
│   ├── app.js                  # Main Express app setup, middleware, Swagger, and route mounting.
│   ├── server.js               # Entry point: connects to DB, initializes analytics, starts server, seeds admin.
│   ├── config/
│   │   ├── db.js               # MongoDB connection logic.
│   │   └── index.js            # Centralized environment variable loading.
│   ├── middlewares/
│   │   ├── auth.js             # JWT authentication and role-based authorization middleware.
│   │   └── error.js            # Centralized error handling middleware.
│   ├── models/
│   │   ├── User.js             # Mongoose schema for users (Auth).
│   │   └── CropPlan.js         # Mongoose schema for farmer's crop planting records (Harvest Tracker).
│   ├── routes/
│   │   ├── auth.js             # API routes for user authentication and email verification.
│   │   ├── cropPlanner.js       # API routes for crop recommendations.
│   │   ├── market.js           # API routes for market demand and business connections.
│   │   ├── tracker.js          # API routes for harvest and revenue estimates (query-based).
│   │   └── cropPlan.js         # API routes for CRUD operations on farmer's stored crop plans.
│   ├── controllers/
│   │   ├── authController.js    # Logic for user registration, login, and email verification.
│   │   ├── cropPlannerController.js # Logic for crop recommendations.
│   │   ├── marketController.js   # Logic for market insights and business searching.
│   │   ├── trackerController.js   # Logic for getting instant harvest/revenue estimates.
│   │   └── cropPlanController.js  # Logic for CRUD operations on CropPlan records.
│   └── utils/
│       ├── analyticsService.js   # JavaScript adaptation of Python analytical models. Loads CSV data and provides services.
│       └── sendEmail.js          # Helper function for sending emails.
├── data/
│   ├── farmlytics_sas_production_cleaned_aggregated.csv
│   ├── farmlytics_eicv_consumption_cleaned_aggregated.csv
│   └── farmlytics_establishment_census_cleaned_aggregated.csv
├── .env                          # Environment variables (sensitive information).
├── .gitignore                    # Files/folders to exclude from Git.
└── package.json                  # Project metadata and dependencies.
```

---

## ⚙️ Setup & Installation

Follow these steps to get the Farmlytics backend running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Muhinde234/farmlytics.git
cd farmlytics-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Prepare Data Files

Ensure your `data/` directory contains the cleaned and aggregated CSV files generated in the data preparation phase:

- `farmlytics_sas_production_cleaned_aggregated.csv`
- `farmlytics_eicv_consumption_cleaned_aggregated.csv`
- `farmlytics_establishment_census_cleaned_aggregated.csv`

The `analyticsService.js` loads these files on server startup.

### 4. Configure Environment Variables

Create a `.env` file in the root of the `farmlytics-backend` directory and add the following:

```plaintext
# Dotenv
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://<your_atlas_user>:<your_atlas_password>@cluster0.abcde.mongodb.net/farmlyticsdb?retryWrites=true&w=majority
# OR for local MongoDB: MONGO_URI=mongodb://localhost:27017/farmlyticsdb

# JWT Configuration
JWT_SECRET=YOUR_VERY_STRONG_RANDOM_JWT_SECRET_KEY # CHANGE THIS IN PRODUCTION
JWT_EXPIRE=30d # e.g., 30 days

# Admin User Seeding (used on first server start if user doesn't exist)
ADMIN_EMAIL=admin@farmlytics.com
ADMIN_PASSWORD=strongadminpassword # CHANGE THIS IN PRODUCTION

# Email Service Configuration (for Nodemailer - e.g., Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587 # Use 465 for SSL, 587 for TLS
EMAIL_USER=your_sending_email@gmail.com 
EMAIL_PASS=your_app_password # IMPORTANT: For Gmail, use an App Password, not your main password!
NOREPLY_EMAIL=your_sending_email@gmail.com
SENDER_NAME="Farmlytics"

# Frontend URL (for email verification redirects)
BASE_FRONTEND_URL=http://localhost:3000 # Replace with your frontend's actual URL
```

### 5. MongoDB Setup

#### For MongoDB Atlas:

- Ensure your cluster is running.
- Whitelist your application's IP address (or `0.0.0.0/0` for development, not recommended for production).
- Create a database user with readWrite access to the `farmlyticsdb` database.
- Replace `<your_atlas_user>` and `<your_atlas_password>` in `MONGO_URI` with your Atlas credentials.

#### For Local MongoDB:

- Ensure your MongoDB daemon (`mongod`) is running on your machine.

### 6. Start the Server

```bash
npm start
# Or for development with auto-reloading (if nodemon is installed):
# npm run dev
```

Upon successful startup, you should see messages like:

```
MongoDB Connected: ...
Initializing analytics services... All analytics services initialized successfully.
Server running in development mode on port 5000
Admin user seeded successfully. (or Admin user already exists. on subsequent runs)
```

---

## 📚 API Documentation (Swagger/OpenAPI)

Once the server is running, you can access the interactive API documentation:

- **Swagger UI:** Navigate to `http://localhost:5000/api-docs` in your web browser. Here, you can explore all endpoints, view schemas, and even send requests directly from the browser after authenticating.

---

##  Authentication & Authorization

Farmlytics employs JWT-based authentication and role-based authorization to secure its API.

### Roles:

- **admin:** Full access to all functionalities, including managing user accounts and viewing all crop plans.
- **farmer:** Can access crop recommendations, market insights, and manage their own crop plans.
- **buyer:** Can access market demand and market connection insights (buyers, processors, exporters).

### Email Verification:

New user registrations require email verification before they can log in. A verification link is sent to the registered email, which, when clicked, updates the user's `isVerified` status in the database.

### JWT Protection:

Most API routes are protected (using `protect` middleware), requiring a valid JWT in the `Authorization: Bearer <token>` header. Role-based authorization (using `authorize` middleware) further restricts access to specific roles.

---

## Core API Modules & Endpoints

This section details the purpose and functionality of each API endpoint.

### 1. Auth Module (/api/v1/auth)

Manages user authentication, registration, and email verification.

- **POST /auth/register**
  - **Purpose:** Registers a new user. Sends an email verification link to the user's provided email address.
  - **Access:** Public

- **POST /auth/login**
  - **Purpose:** Authenticates a user with their email and password. Returns a JWT if credentials are valid and the email is verified.
  - **Access:** Public

- **GET /auth/me**
  - **Purpose:** Retrieves the profile details of the currently authenticated user.
  - **Access:** Private (All authenticated roles)

- **GET /auth/verifyemail/{token}**
  - **Purpose:** Verifies a user's email address using a unique token sent via email.
  - **Access:** Public

### 2. Crop Planner Module (/api/v1/crops)

Provides data-driven crop recommendations and estimates.

- **GET /crops/recommendations**
  - **Purpose:** Generates personalized crop recommendations, suggested area allocations, and estimated yields for a farmer based on their `district_name` and `farm_size_ha`.
  - **Access:** Private (farmer, admin)

### 3. Market Connection Module (/api/v1/market)

Connects farmers to market opportunities and provides demand insights.

- **GET /market/demand**
  - **Purpose:** Identifies crops with high local market demand within a specified `district_name` or `province_name`.
  - **Access:** Private (farmer, buyer, admin)

- **GET /market/cooperatives**
  - **Purpose:** Lists characteristics of agricultural cooperatives in a given `district_name` or `province_name`.
  - **Access:** Private (farmer, buyer, admin)

- **GET /market/buyers-processors**
  - **Purpose:** Identifies potential buyers and food processors in a specified area.
  - **Access:** Private (farmer, buyer, admin)

- **GET /market/exporters**
  - **Purpose:** Lists characteristics of establishments involved in exporting goods from a given `district_name` or `province_name`.
  - **Access:** Private (farmer, buyer, admin)

### 4. Harvest Tracker Module (/api/v1/tracker & /api/v1/crop-plans)

Helps farmers track their actual plantings and provides dynamic revenue estimations.

- **GET /tracker/estimates**
  - **Purpose:** Provides immediate estimates for harvest date, total production, and revenue for a hypothetical crop planting based on input parameters.
  - **Access:** Private (farmer, admin)

- **POST /crop-plans**
  - **Purpose:** Creates a new farmer-specific crop planting record in the database.
  - **Access:** Private (farmer, admin)

- **GET /crop-plans**
  - **Purpose:** Retrieves all crop planting records for the authenticated user.
  - **Access:** Private (farmer, admin)

- **GET /crop-plans/{id}**
  - **Purpose:** Retrieves a single crop planting record by its unique ID.
  - **Access:** Private (farmer, admin)

- **PUT /crop-plans/{id}**
  - **Purpose:** Updates an existing crop planting record.
  - **Access:** Private (farmer, admin)

- **DELETE /crop-plans/{id}**
  - **Purpose:** Deletes a specific crop planting record from the database.
  - **Access:** Private (farmer, admin)

---

##  Future Enhancements (Roadmap)

- **Real-time Market Prices:** Integration with live market price APIs for more accurate revenue forecasting.
- **Weather Data Integration:** Incorporate weather forecasts into crop planning and yield estimation.
- **Soil Data Integration:** Use soil analysis data for highly tailored recommendations.
- **Farmer Profiles:** More detailed farmer profiles to personalize recommendations further.
- **Buyer/Cooperative Contact Management:** Secure contact information for direct farmer-to-buyer communication.
- **Push Notifications:** Alerts for upcoming harvest dates, market changes, or weather warnings.
- **Advanced Analytics:** Machine learning models for dynamic yield prediction, risk assessment, and optimal planting windows.

---

##  Contributing

Contributions are welcome! Please feel free to open issues, submit pull requests, or suggest improvements.

---

##  License

This project is licensed under the MIT License.
