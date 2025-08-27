# 📝 Aplicación de Notas

Una plataforma completa para gestionar notas privadas de texto con sistema de categorización, desarrollada con React y Node.js.

## 🎯 Descripción del Proyecto

Esta aplicación permite a los usuarios crear, gestionar y organizar sus notas de texto de forma segura. Incluye un sistema completo de autenticación y la posibilidad de hacer notas públicas para compartir.

## ✨ Funcionalidades Implementadas

### 📋 Requisitos Cumplidos

**✅ Sistema de Autenticación**
- Login con email + contraseña
- Registro de nuevos usuarios
- Autenticación JWT segura
- Verificación automática de sesión

**✅ Gestión de Notas (CRUD Completo)**
- Ver listado de notas (solo títulos en el dashboard)
- Visualizar nota completa
- Crear nueva nota (título, contenido, categoría)
- Modificar notas existentes
- Eliminar notas

**✅ Sistema de Categorías**
- 8 categorías predefinidas: Personal, Trabajo, Estudios, Ideas, Recordatorios, Recetas, Viajes, Libros
- Asignación única por nota
- Contador de notas por categoría

**✅ Funcionalidades Opcionales Implementadas**
- **Notas Públicas**: Marcar/desmarcar notas como públicas
- **Acceso por URL**: Las notas públicas son accesibles sin autenticación mediante URL directa
- **Eliminación de Notas**: Sistema completo de borrado

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express.js**
- **MySQL** (Base de datos)
- **JWT** (Autenticación)
- **bcryptjs** (Encriptación de contraseñas)
- **express-validator** (Validaciones)

### Frontend
- **React 18** + **Vite**
- **React Router** (Navegación)
- **Context API** (Gestión de estado)
- **CSS moderno** (Diseño responsive)

## 📋 Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **MySQL** (versión 8.0 o superior)
- **npm** o **yarn**

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd aplicacion-notas
```

### 2. Configurar la Base de Datos

**Crear la base de datos en MySQL:**
```sql
CREATE DATABASE notas_app;
```

### 3. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env con la configuración
cp .env.example .env
```

**Configuración del archivo `.env`:**
```env
# Configuración de MySQL
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=TU_PASSWORD_MYSQL
MYSQL_DATABASE=notas_app

# Configuración JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024
JWT_EXPIRES_IN=7d

# Configuración del servidor
PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

**⚠️ Importante:** Reemplaza `TU_PASSWORD_MYSQL` con tu contraseña real de MySQL.

```bash
# Inicializar la base de datos (crea tablas y datos de prueba)
npm run init-db

# Iniciar el servidor de desarrollo
npm run dev
```

El backend estará disponible en: `http://localhost:3000`

### 4. Configurar el Frontend

```bash
# En una nueva terminal, navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 👤 Usuario de Prueba

La aplicación incluye un usuario de prueba con notas de ejemplo ya creadas:

**Credenciales:**
- **Email:** `test@notas.com`
- **Contraseña:** `test123456`

**Notas incluidas:**
- 4 notas de ejemplo (1 pública, 3 privadas)
- Distribuidas en diferentes categorías
- Listas para probar todas las funcionalidades

## 📱 Cómo Usar la Aplicación

### 1. Acceso Inicial
- Visita `http://localhost:5173`
- Verás la página de bienvenida con información del proyecto

### 2. Autenticación
- **Registrarse:** Crear nueva cuenta con email y contraseña
- **Iniciar Sesión:** Usar las credenciales del usuario de prueba o tu cuenta

### 3. Gestión de Notas
- **Dashboard:** Ver todas tus notas y estadísticas
- **Crear Nota:** Botón "Nueva Nota" → Formulario con título, contenido y categoría
- **Ver Nota:** Click en cualquier nota del listado
- **Editar:** Botón "Editar" en la vista de detalle
- **Eliminar:** Botón "Eliminar" en la vista de detalle
- **Cambiar Visibilidad:** Toggle "Pública/Privada" en la vista de detalle

### 4. Notas Públicas
- Las notas marcadas como públicas generan una URL única
- Accesibles sin autenticación: `http://localhost:5173/public/[ID_NOTA]`
- Ejemplo: `http://localhost:5173/public/3`

## 📁 Estructura del Proyecto

```
aplicacion-notas/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── database/        # Conexión y configuración DB
│   │   ├── middlewares/     # Autenticación y validaciones
│   │   ├── routes/          # Definición de endpoints
│   │   └── utils/           # Utilidades y manejo de errores
│   ├── .env                 # Variables de entorno
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Componentes reutilizables
    │   ├── context/         # Context API (AuthContext)
    │   ├── pages/           # Páginas de la aplicación
    │   └── App.jsx          # Componente principal
    └── package.json
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Notas
- `GET /api/notas` - Listar notas del usuario
- `POST /api/notas` - Crear nueva nota
- `GET /api/notas/:id` - Ver nota específica
- `PUT /api/notas/:id` - Actualizar nota
- `DELETE /api/notas/:id` - Eliminar nota
- `PATCH /api/notas/:id/toggle-public` - Cambiar visibilidad
- `GET /api/notas/public/:id` - Ver nota pública

### Categorías
- `GET /api/categorias` - Listar todas las categorías

## 🧪 Testing

### Verificar Backend
```bash
# Health check
curl http://localhost:3000/

# Login de prueba
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@notas.com","password":"test123456"}'
```

### Verificar Frontend
1. Abrir `http://localhost:5173`
2. Hacer login con las credenciales de prueba
3. Verificar que aparezcan las 4 notas de ejemplo
4. Probar crear, editar y eliminar notas

## 🔧 Comandos Útiles

### Backend
```bash
npm run init-db    # Reinicializar base de datos
npm run dev        # Desarrollo con nodemon
npm start          # Producción
```

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
```

## 🐛 Solución de Problemas Comunes

### Error de conexión a MySQL
- Verificar que MySQL esté ejecutándose
- Comprobar credenciales en el archivo `.env`
- Asegurar que la base de datos `notas_app` existe

### Error "Cannot find module"
- Ejecutar `npm install` en ambos directorios (backend y frontend)
- Verificar que Node.js esté actualizado

### Error JWT "No token provided"
- Verificar que el usuario esté logueado
- Comprobar que el token se esté enviando correctamente

## 📊 Estado del Proyecto

**✅ Completado al 100%**
- Backend con API REST completa
- Frontend con interfaz moderna
- Sistema de autenticación seguro
- CRUD completo de notas
- Sistema de categorías
- Funcionalidades opcionales implementadas
- Base de datos con datos de prueba
- Documentación completa

## 👨‍💻 Desarrollador

Proyecto desarrollado como parte del curso de desarrollo web full-stack.

---

**🚀 ¡La aplicación está lista para usar!** Sigue las instrucciones de instalación y disfruta gestionando tus notas de forma organizada y segura.