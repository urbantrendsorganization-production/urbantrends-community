# 🏙️ Urbantrends: Developer Collective
> **The Digital Architecture of Elite Engineering.**

[![Framework: Django](https://img.shields.io/badge/Backend-Django_5.0-092E20?style=flat-square&logo=django)](https://djangoproject.com)
[![Library: React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Auth: SimpleJWT](https://img.shields.io/badge/Auth-SimpleJWT-black?style=flat-square)](https://django-rest-framework-simplejwt.readthedocs.io/)
[![UI: shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-000000?style=flat-square&logo=shadcnui)](https://ui.shadcn.com)

---

## Project Overview
Urbantrends is a specialized community platform where developers don't just "post"—they **architect**. It is a space for sharing deep technical experiences, high-fidelity project showcases, and the "structural" decisions behind the code.



---

## Technical Stack

### **Frontend (Vite + React)**
- **Styling:** Tailwind CSS with a strict **radius: 0** (Brutalist) configuration.
- **Components:** Radix UI primitives via **shadcn/ui**.
- **Icons:** Phosphor Icons for a clean, architectural aesthetic.
- **State:** Axios with Interceptors for automated JWT token rotation.

### **Backend (Django REST Framework)**
- **App Name:** `community_accounts`
- **Auth:** SimpleJWT with a 1-hour sliding access window.
- **Signals:** Automated `CommunityProfile` creation upon User registration.
- **Database:** PostgreSQL (Production) / SQLite (Development).

---

## Quick Start

### 1. Backend Setup (Django)
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

# accounts apis
Register	/accounts/auth/register/	POST
Login	    /accounts/auth/login/	    POST
My Profile	/accounts/accounts/me/	    GET/   PATCH