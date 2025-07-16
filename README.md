# Geospatial Data Converter

A web-based tool for converting between KML and CSV geospatial formats, with interactive map visualization.

## 🚀 Features
- Convert between KML and CSV formats
- Upload, manage, and download geospatial files
- Visualize data on an interactive map (Leaflet.js)
- User authentication (JWT)
- Conversion history
- Responsive, modern UI with dark mode

## 🛠️ Tech Stack
- **Backend:** Django REST Framework, Python, PostgreSQL/SQLite
- **Frontend:** React.js, Leaflet.js, Bootstrap
- **Other:** Axios, react-router-dom, react-leaflet, GitHub

## ⚡ Quick Start

### Backend
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📋 API Endpoints
- `POST /api/auth/register/` — Register user
- `POST /api/auth/login/` — Login (JWT)
- `GET /api/auth/profile/` — User profile
- `POST /api/files/upload/` — Upload file
- `GET /api/files/list/` — List files
- `DELETE /api/files/delete/<id>/` — Delete file
- `POST /api/files/convert/` — Convert KML/CSV

## 🗺️ Usage
- Register/login to your account
- Upload KML or CSV files
- Convert files and visualize results on the map
- Download converted files
- Manage your files and conversion history

## 📖 User Guide
- See the in-app dashboard for guided usage
- Drag & drop or click to upload files
- Use the map to visualize and interact with your data
- Switch between light/dark mode in the navbar

## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change.

## 📄 License
MIT 