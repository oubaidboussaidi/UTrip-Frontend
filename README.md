# 🌍 Utrip - Comprehensive Tourism Integration Platform

Utrip is a modern, full-stack tourism and event management platform designed to provide a seamless experience for tourists, event organizers, and administrators. It combines high-performance web components, AI-driven personalization, and a robust mobile experience.

---

## 🚀 Key Features

### 🏢 Administration & Management
- **Centralized Dashboard**: A premium, high-contrast dashboard for administrators to monitor platform activity and manage users.
- **Event Orchestration**: Comprehensive tools for creating, approving, and managing tourism events.
- **Role-Based Access**: Secure system with distinct workflows for Admins, Organizers, and Tourists.

### 📊 Organizer Insights
- **Performance Analytics**: Real-time statistics on event reservations and revenue.
- **Event Lifecycle Tracking**: Track event status from draft to completed.

### 🤖 AI-Powered Discovery
- **Personalized Recommendations**: Machine learning engine that suggests events based on user preferences and search history.
- **Smart Filtering**: Advanced search logic to help users find exactly what they're looking for.

### 🗺️ Tourist Experience
- **Interactive Itineraries**: Plan your journey using map-based route optimization (Leaflet/OpenStreetMap).
- **Secure Reservations**: Integrated booking system with Stripe payment processing.
- **Modern UI**: Fully redesigned authentication modals and page layouts for a premium feel.

### 📱 Mobile Access
- **Android Companion App**: Native Kotlin application for on-the-go access to tickets and event discovery.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Syncfusion, Framer Motion |
| **Backend** | Java 17, Spring Boot, Spring Security (JWT), MongoDB |
| **AI Module** | Python 3.9, FastAPI, Scikit-learn, OpenAI API |
| **Mobile** | Kotlin, Android SDK |
| **Infrastructure** | Maven, npm, Git |

---

## 🔑 Test Credentials

> [!IMPORTANT]
> Use these accounts to explore the platform's different roles.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@Utrip.com` | `password123` |
| **Organizer** | `organizer@Utrip.com` | `password123` |

---

## 📥 Installation & Setup

### 📡 Backend
1. Navigate to `backend/`.
2. Configure your MongoDB and Stripe keys in `.env`.
3. Run with Maven:
   ```bash
   mvn spring-boot:run
   ```

### 💻 Frontend
1. Navigate to `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 🧠 AI Module
1. Navigate to `event_ai_module/`.
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --port 8000
   ```

---

## 📱 Mobile APK
The Android application build can be found in the `mobile/` directory. For quick testing, an APK link is often provided in the web application's footer.

---

## 📄 License
This project is developed as part of a Tourism Platform Integration project. All rights reserved.
