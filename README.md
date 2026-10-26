 <div align="center">
  <img src="frontend/public/Skywatch.webp" alt="Skywatch Logo" width="160" />

  # Skywatch

  **Look up. Stay ahead.**

  A modern weather application built with Django and React, designed to make checking the weather intuitive, informative, and visually engaging.

  ![Version](https://img.shields.io/badge/version-1.0.0--dev-blue)
  ![Python](https://img.shields.io/badge/Python-3.14+-3776AB?logo=python&logoColor=white)
  ![Django](https://img.shields.io/badge/Django-6.x-092E20?logo=django&logoColor=white)
  ![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
  ![License](https://img.shields.io/badge/license-TBD-lightgrey)
</div>

---

## Overview

**Well, that took a while.**

After countless lines of code, a few weather storms of our own, and what felt like an endless wait, Skywatch is finally here.

The wait is over. The forecast is in. And yes, the sky is finally under surveillance.

<div align="center">
  <img src="docs/images/skywatch-release.webp" alt="Skywatch is released " width="100%" />
  <sub>Breaking news: Skywatch is finally released. The watch begins.</sub>
</div>

Skywatch is a full-stack weather app built with Django and React, bringing forecasts, city search, favorite locations, and map-based weather lookup together in one sleek interface.

Because apparently, even checking the weather deserves a proper release announcement.


## Features

- **City Search** — Search for cities and explore weather conditions at different locations.
- **Current Weather** — Get detailed weather information, including temperature, feels-like temperature, humidity, wind speed, atmospheric pressure, visibility, UV index, and precipitation.
- **Hourly Forecast** — Check upcoming temperatures, weather conditions, precipitation probability, and wind speed.
- **7-Day Forecast** — Plan ahead with daily high and low temperatures, weather conditions, precipitation, and maximum wind speed.
- **Favorite Locations** — Save your favorite cities for quick access and remove them whenever you want.
- **User Authentication** — Create an account and sign in to access your personalized favorites.
- **Map-Based Location Picker** — Select a location on the map and check its weather.
- **Dynamic Weather Visuals** — Enjoy weather-aware backgrounds, condition-specific visuals, and day/night atmosphere.
- **Responsive Interface** — A polished layout designed to work across desktop and mobile screens.



## Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT authentication
- HTTPX

### Frontend
- React
- Vite
- React Router
- Axios
- Lucide React

### Weather Data
- [Open-Meteo](https://open-meteo.com/) — Weather forecasts and weather data.
- Open-Meteo geocoding services — City search and location lookup.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python
- Node.js and npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/RealRick37/Skywatch.git
cd Skywatch
```

### 2. Set up the backend

Create and activate a virtual environment from the project root.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```powershell
pip install -r requirements.txt
```

Configure the environment variables required by the Django settings, including the secret key, debug mode, and PostgreSQL connection details.

Create the database and apply migrations:

```powershell
python manage.py migrate
```

Start the Django development server:

```powershell
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000/`.

### 3. Set up the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal, typically `http://localhost:5173/`.

### 4. Configure the application

Before running the full application, make sure that:

- PostgreSQL is running and the database credentials match your Django configuration.
- Required environment variables are configured.
- The frontend API base URL points to the backend.
- The backend allows requests from the frontend's development origin.

> **Note:** The commands above assume the backend dependency file is named `requirements.txt` and that `manage.py` is in the repository root. Adjust these paths if your project uses a different structure.

## Project Structure

```text
Skywatch/
├── config/                 # Django project configuration
├── accounts/               # User and authentication functionality
├── weather/                # Weather API and favorites
├── frontend/               # React + Vite application
│   ├── public/              # Static assets and logo
│   └── src/                 # UI components and application logic
├── docs/
│   └── images/              # README artwork and screenshots
├── manage.py
├── requirements.txt
└── README.md
```

## Acknowledgements

- [Open-Meteo](https://open-meteo.com/) for weather data and geocoding services.
- The open-source projects and tools that make Skywatch possible.

---

<div align="center">
  **Skywatch — Keep your eyes on the sky.**
</div>

## What's Next?

**Skywatch isn't done yet.**

Version 1.0.0 is just the beginning. More features, improvements, and updates are on the horizon.

Stay tuned. The watch continues.

