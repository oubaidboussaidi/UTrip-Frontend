# 🌍 Utrip - Comprehensive Tourism Integration Platform

Utrip is a modern, full-stack tourism and event management platform designed to provide a seamless experience for tourists, event organizers, and administrators. It combines high-performance web components, AI-driven personalization, and a robust mobile experience.

---

## 🚀 Application Walkthrough & Features

### 🏠 Home & Discovery
The entry point to the Utrip experience. The homepage features a dynamic **hero carousel** showcasing featured events. Users doesn't have to be authenticated to view the events.
- **Event Details & Payment**: Clicking "View Details" on any event opens a comprehensive modal where users can book tickets directly using our integrated Stripe payment system.
- **Mobile Integration**: A dedicated "Get the App" section allows users to download the Android APK directly to their devices for on-the-go access.

![Home Page](public/screenshots/home.png)

### 🗺️ Event Exploration & Mapping
The Events page provides a powerful discovery interface.
- **Interactive Map**: Integrated Leaflet maps show event locations with real-time distance and estimated travel time calculations from the user's location.
- **Smart Filtering**: Users can filter events by category, date, and price range.

<div style="display: flex; gap: 10px;">
  <img src="public/screenshots/events.png" width="48%" />
  <img src="public/screenshots/events_map.png" width="48%" />
</div>

### 🤖 AI Recommendations
Powered by a Python/FastAPI backend, our recommendation engine analyzes user preferences and past interactions to suggest personalized events.
- **Tailored Suggestions**: The "For You" section (Recommendations page) displays events that match the user's implicit interests.

![Recommendations](public/screenshots/recommendations.png)

---

### 💼 Organizer Portal
Designed for content creators and event managers.
- **Performance Dashboard**: Organizers get a dedicated dashboard with real-time analytics on revenue, total reservations, and user engagement (favorites).
- **Event Creation Workflow**: Organizers can create detailed events with images, locations, and pricing.
- **Approval System**: When an event is created, it is set to `PENDING` status. A notification is automatically sent to the Admin dashboard for review and approval before it goes live.

<div style="display: flex; gap: 10px;">
  <img src="public/screenshots/organizer_stats.png" width="48%" />
  <img src="public/screenshots/organizer_events.png" width="48%" />
</div>

---

### 🛡️ Admin Administration
The command center for platform management.
- **Overview Dashboard**: A high-level view of platform health, including total revenue (commission based), user growth, and event distribution.
- **Event Management**: Admins receive notifications for new pending events. They can review details and **Approve** or **Reject** them. Approved events become visible to all users; rejected ones are flagged for the organizer.
- **User & Reservation Management**: Admins have full control over user accounts (role management) and can inspect all reservation data for support and auditing.

![Admin Overview](public/screenshots/admin_overview.png)

<div style="display: flex; gap: 10px; margin-top: 10px;">
  <img src="public/screenshots/admin_events.png" width="32%" />
  <img src="public/screenshots/admin_users.png" width="32%" />
  <img src="public/screenshots/admin_reservations.png" width="32%" />
</div>

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
| **Admin** | `admin@Utrip.com` | `Test123!` |
| **Organizer** | `organizer@Utrip.com` | `Test123!` |

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
