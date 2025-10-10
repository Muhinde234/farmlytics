

# 🌾 **Farmlytics — Empowering Rwandan Farmers Through Data**

> **Farmlytics** is a full-stack agricultural intelligence platform that empowers Rwandan farmers with **data-driven insights**, **crop planning**, **market connections**, and **harvest tracking** — through a unified ecosystem of **Web**, **Mobile**, and **Backend API** applications.

---

## **farmlytics logo**
![Uploading logo.png…]()
![Description](https://drive.google.com/uc?export=view&id=12FEFOGPIa5bvgjoFncOypS0fJJSk-xhY)



## 🚀 **Live Demo & Resources**

* 🌐 **Web App:** [https://farmlytics-eta.vercel.app/en](#)
* 📱 **Mobile App (APK):** [https://expo.dev/artifacts/eas/sTY7wPtgNJtZMQqcwBDgfb.apk](#)
* ⚙️ **Backend API (Swagger):** [https://farmlytics1-1.onrender.com/api-docs/](https://farmlytics1-1.onrender.com/api-docs/)
* ⚙️ **Demo-Video (demonstration):** (https://drive.google.com/file/d/1sQY-LgFJ-28602CGcPxEnfBONXA-9_om/view?usp=drivesdk)

---

## 🌟 **Project Overview**

**Farmlytics** leverages Rwanda’s **National Institute of Statistics (NISR)** datasets to help farmers make informed agricultural decisions.
It transforms complex national data into clear, actionable insights that farmers can directly apply to improve **productivity**, **market access**, and **income**.

---

## 📊 **Datasets Used (NISR Open Data)**

Farmlytics relies on cleaned and aggregated public datasets from the **National Institute of Statistics of Rwanda (NISR)**.
These datasets were analyzed, preprocessed, and integrated into the backend to support crop planning, yield estimation, and market demand analysis.

| Dataset File                                           | Purpose                                                                                             | Source                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **farmlytics_sas_production_cleaned_aggregated.csv**   | Historical crop yields, production areas, and planting trends used for the **Crop Planner** module. | NISR Seasonal Agricultural Survey (SAS)                   |
| **farmlytics_eicv_consumption_cleaned_aggregated.csv** | Consumption and demand patterns across provinces and districts used for **Market Insights**.        | NISR Integrated Household Living Conditions Survey (EICV) |
| **farmlytics_establishment_census_cleaned.csv**        | Business and cooperative data used for **Market Connection** and **Export Insights**.               | NISR Establishment Census                                 |

📂 All  cleaned data from  datasets we got at nisr  are stored in the backend `/data/Aggregated_CSVs` directory and are loaded automatically by the analytics service on startup.

---

## 🧩 **Ecosystem Overview**

| Component                 | Description                                                                   | Tech Stack                                                          |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 🌐 **Frontend (Web App)** | Multilingual, responsive dashboard for farmers and buyers.                    | Next.js, TypeScript, Tailwind CSS, TanStack Query, Framer Motion    |
| 📱 **Mobile App**         | React Native app for accessible, on-the-go agricultural insights.             | React Native, Expo, TypeScript, Styled-Components, React Navigation |
| ⚙️ **Backend API**        | Central data engine for analytics, crop recommendations, and user management. | Node.js, Express.js, MongoDB, Mongoose, JWT, Swagger                |

---

## 💡 **Key Features**

### 🌐 **Web App**

* Personalized **Crop Planner** based on district and farm size
* **Market Insights** highlighting high-demand crops
* **Harvest Tracker** with yield and revenue estimation
* **Crop Disease Awareness** (educational, not detection-based)
* **Visual Insights** via charts 
* **Multi-language support** (English, Kinyarwanda, French)

### 📱 **Mobile App**

* Animated and modern **farmer dashboard**
* **Secure authentication** and email verification
* **Multi-language interface** with persistent language preference
* **Market insights**, **crop planner**, and **tracker** modules
* **Profile management** and **pull-to-refresh** UX

### ⚙️ **Backend API**

* JWT-based **authentication** and **role-based access control**
* **Email verification** and user management
* **Crop planning algorithm** powered by NISR data
* **Market demand and cooperative insights**
* **Harvest & Revenue Tracker** with CRUD endpoints
* **Swagger documentation** for all endpoints

---

## 🏗️ **System Architecture**

```plaintext
            ┌──────────────────────────────┐
            │  🌐 Farmlytics Web App       │
            │  (Next.js + TypeScript)      │
            └────────────▲─────────────────┘
                         │ HTTPS REST API Calls
                         ▼
            ┌──────────────────────────────┐
            │  ⚙️ Farmlytics Backend API   │
            │  (Node.js + Express + DB)    │
            └────────────▲─────────────────┘
                         │
                         ▼
            ┌──────────────────────────────┐
            │  📱 Farmlytics Mobile App     │
            │  (React Native + Expo)        │
            └──────────────────────────────┘
```

---

## 🧰 **Tech Stack Summary**

| Layer               | Tools & Frameworks                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------- |
| **Frontend (Web)**  | Next.js 14+, TypeScript, Tailwind CSS, TanStack Query, Framer Motion, Recharts, Next-Intl |
| **Mobile**          | React Native, Expo, TypeScript, Styled-Components, React Navigation, i18next              |
| **Backend**         | Node.js, Express.js, MongoDB, Mongoose, JWT, Swagger, csv-parse                           |
| **Deployment**      | Vercel (Web), Render (Backend), Expo EAS (Mobile)                                         |
| **Version Control** | Git & GitHub                                                                              |
| **Data Source**     | Open NISR Datasets (SAS, EICV, Establishment Census)                                      |

---

## ⚙️ **Setup & Installation**

### 🖥️ **Frontend (Web App)**

```bash
git clone https://github.com/Muhinde234/farmlytics
cd farmlytics-frontend
npm install
npm run dev
```

> Visit [http://localhost:3000](http://localhost:3000)

---

### 📱 **Mobile App**

```bash
git clone https://github.com/Muhinde234/farmlytics
cd farmlytics-mobile
npm install
npm start
```

**Environment:**

```
EXPO_PUBLIC_API_BASE_URL=https://farmlytics1-1.onrender.com/api/v1
```

Run via **Expo Go** (QR code) or Android Emulator.

---

### ⚙️ **Backend API**

```bash
git clone https://github.com/Muhinde234/farmlytics
cd farmlytics-backend
npm install
npm run dev
```

**.env Configuration**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/farmlyticsdb
JWT_SECRET=your_jwt_secret
BASE_FRONTEND_URL=http://localhost:3000
```

Access API Docs at:

📘 [https://farmlytics1-1.onrender.com/api-docs]


---

## 🧩 **Frontend Project Structure**

```plaintext
farmlytics-frontend/
├── .next/                    # Build output
├── node_modules/             # Dependencies
├── public/                   # Static assets
├── src/
│   ├── api/                  # API services
│   ├── app/                  # App Router, pages & layouts
│   ├── components/           # Reusable UI components
│   ├── context/              # Global state (React Context)
│   ├── helpers/              # Utility functions
│   ├── hooks/                # Custom React hooks (TanStack Query)
│   ├── i18n/                 # Internationalization setup
│   ├── lib/                  # Shared configs/utilities
│   ├── messages/             # Translation messages
│   └── middleware.ts         # Middleware for locale redirection
│
├── .env                      # Environment variables
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # Tailwind setup
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation
```

---

## 🩺 **Crop Disease Awareness**

Farmlytics educates farmers on **common crop diseases** and prevention practices.
This feature complements the **Crop Planner** and **Harvest Tracker** modules.

* Lists common diseases per crop (e.g., Cassava Mosaic, Potato Blight, Maize Rust).
* Explains **symptoms**, **causes**, and **preventive measures**.

* Focuses on awareness and prevention .


---

## 📊 **Visual Insights**

* Interactive charts via **Recharts** and **TanStack Query**
* Animated transitions with **Framer Motion** and **React Native Reanimated**
* Real-time data from backend analytics (powered by NISR datasets)

---

## 🗺️ **Project Roadmap**

| Phase     | Focus                                                          |
| --------- | -------------------------------------------------------------- |
| ✅ MVP     | Web, Mobile, API, Planner, Market, Tracker, Disease Awareness  |
| 🔜 Next   | Live Market Prices, Weather API, SMS Notifications             |
| 🚧 Future | Soil Data Integration, AI-based Crop Insights, Offline Support |

---

## 💡 **Impact**

* 🌾 **Empowers farmers** with practical, data-based recommendations
* 💵 **Increases productivity** and profitability
* 🩺 **Educates on disease prevention** and sustainable farming
* 📈 **Encourages open-data innovation** for Rwandan agriculture
* 🧑‍💻 **Bridges digital and rural communities** through technology



## 🏆 **Why Farmlytics Stands Out**

* End-to-end **full-stack ecosystem** (Web, Mobile, API)
* **Powered by real NISR datasets**
* **Multilingual, inclusive, and mobile-first**
* Modern stack: **Next.js, React Native, Node.js, MongoDB**
* Designed for **impact, scalability, and accessibility**



#### **screenshots**
#### **Screenshots**

### **Web App Landing Page**
<img width="800" alt="Web App Landing Page" src="https://github.com/user-attachments/assets/da62826f-fb57-4355-8c52-0eca654f954c" />

### **Mobile Landing Pages**
<p float="left">
  <img src="https://github.com/user-attachments/assets/6c9f8640-13ca-47a0-80a4-9344bf3e2b78" width="300" />
  <img src="https://github.com/user-attachments/assets/382f88e1-4d75-4d79-afa9-1917618f5bfe" width="300" />
</p>






## 🤝 **Contributors**

**Team Farmlytics**

_Developed with ❤️ by BitQueens passionate about **agriculture**, **data**, and **technology for Rwanda’s digital future**._

