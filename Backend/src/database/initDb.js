import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import "dotenv/config";

const initDB = async () => {
  try {
    // Crear conexión directa sin usar getPool
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      // Sin database para poder crear la BD
    });

    console.log("Eliminando base de datos 'notas_app' si existe...");
    await connection.query("DROP DATABASE IF EXISTS notas_app");

    console.log("Creando base de datos 'notas_app'...");
    await connection.query("CREATE DATABASE notas_app");

    console.log("Seleccionando base de datos 'notas_app'...");
    await connection.query("USE notas_app");

    console.log("Creando tablas...");

    // Tabla de Usuarios
    await connection.query(`
        CREATE TABLE usuarios (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Tabla de Categorías
    await connection.query(`
        CREATE TABLE categorias (
            id INT PRIMARY KEY AUTO_INCREMENT,
            nombre VARCHAR(100) UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Tabla de Notas
    await connection.query(`
        CREATE TABLE notas (
            id INT PRIMARY KEY AUTO_INCREMENT,
            titulo VARCHAR(255) NOT NULL,
            contenido TEXT NOT NULL,
            usuario_id INT NOT NULL,
            categoria_id INT NOT NULL,
            es_publica BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
        )
    `);

    console.log("Insertando categorías...");
    const categorias = ['Personal', 'Trabajo', 'Estudios', 'Ideas', 'Recordatorios', 'Recetas', 'Viajes', 'Libros'];
    
    for (const categoria of categorias) {
      await connection.query("INSERT INTO categorias (nombre) VALUES (?)", [categoria]);
    }

    console.log("Insertando usuario de prueba...");
    const testEmail = "test@notas.com";
    const testPassword = "test123456";
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    await connection.query("INSERT INTO usuarios (email, password) VALUES (?, ?)", [testEmail, hashedPassword]);

    console.log("Insertando notas de ejemplo...");
    const notas = [
      { titulo: 'Mi Primera Nota', contenido: 'Esta es mi primera nota en la aplicación. ¡Funciona genial!', categoria_id: 1, es_publica: false },
      { titulo: 'Lista de Tareas del Proyecto', contenido: 'Tareas pendientes:\n- Implementar autenticación\n- Crear CRUD de notas\n- Añadir sistema de categorías\n- Implementar notas públicas', categoria_id: 2, es_publica: false },
      { titulo: 'Receta de Pasta Carbonara', contenido: 'Ingredientes:\n- 400g espaguetis\n- 200g panceta\n- 4 yemas de huevo\n- 100g parmesano\n- Pimienta negra\n\nPreparación:\n1. Cocinar pasta al dente\n2. Freír panceta\n3. Mezclar yemas con queso\n4. Combinar todo', categoria_id: 6, es_publica: true },
      { titulo: 'Ideas para Mejorar la App', contenido: 'Funcionalidades futuras:\n- Búsqueda de notas\n- Exportar a PDF\n- Modo oscuro\n- Etiquetas adicionales\n- Papelera de reciclaje', categoria_id: 4, es_publica: false }
    ];

    for (const nota of notas) {
      await connection.query(
        "INSERT INTO notas (titulo, contenido, usuario_id, categoria_id, es_publica) VALUES (?, ?, ?, ?, ?)",
        [nota.titulo, nota.contenido, 1, nota.categoria_id, nota.es_publica]
      );
    }

    await connection.end();

    console.log("✅ ¡Base de datos inicializada correctamente!");
    console.log("📊 Estadísticas:");
    console.log(`   - ${categorias.length} categorías creadas`);
    console.log(`   - 1 usuario de prueba creado`);
    console.log(`   - ${notas.length} notas de ejemplo`);
    console.log("");
    console.log("🔐 Credenciales de prueba:");
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error.message);
    process.exit(1);
  }
};

initDB();
