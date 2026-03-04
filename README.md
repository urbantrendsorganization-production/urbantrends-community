# 🏙️ Urbantrends Community
> **The Digital Architecture of Urban Engagement.**

[![Framework: Django](https://img.shields.io/badge/Backend-Django_5.0-092E20?style=flat-square&logo=django)](https://djangoproject.com)
[![Library: React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Auth: SimpleJWT](https://img.shields.io/badge/Auth-SimpleJWT-black?style=flat-square)](https://django-rest-framework-simplejwt.readthedocs.io/)
[![UI: shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-000000?style=flat-square&logo=shadcnui)](https://ui.shadcn.com)

---

## 📐 Project Overview
Urbantrends Community is a bespoke dashboard designed for urban planners, architects, and city enthusiasts. It features a "Radius-0" brutalist aesthetic, an integrated **Architect_AI** query system, and a robust user-profiling engine.



---

## 🛠️ Technical Stack

### **Frontend (Vite + React)**
- **Styling:** Tailwind CSS with a strict `radius: 0` configuration.
- **Components:** Radix UI primitives via **shadcn/ui**.
- **Icons:** Phosphor Icons for a consistent architectural look.
- **State:** Axios with Interceptors for seamless JWT refreshing.

### **Backend (Django REST Framework)**
- **App Name:** `community_accounts`
- **Auth:** SimpleJWT with a 1-hour sliding window.
- **Signals:** Automated `CommunityProfile` creation on user registration.
- **Database:** PostgreSQL (Production) / SQLite (Dev).

---

## 🚀 Quick Start

### 1. The Backend (Python 3.14+)
```bash
# Enter the workspace
cd community_accounts_backend

# Setup environment
python -m venv venv
source venv/bin/activate

# Install & Migrate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py migrate

# Start the engine
python manage.py runserver 8000
```
# Enter the workspace
cd community_dashboard_frontend

# Install & Launch
npm install
npm run dev
