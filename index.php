<?php
// Simulación de datos del estudiante (pueden provenir de una base de datos)
$nombre_estudiante = "Juan Pérez"; // Nombre del estudiante
$proyectos_activos = 5; // Número de proyectos activos
$postulaciones_pendientes = 3; // Número de postulaciones pendientes
$notificaciones = [
    "Nuevo proyecto asignado: Diseño Web.",
    "Postulación aceptada para el proyecto 'App Móvil'.",
    "Recordatorio: Entrega del informe semanal."
];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard del Estudiante</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .main-layout {
            display: flex;
            height: 100vh;
        }
        .sidebar {
            width: 250px;
            background-color: #6DB50A;
            color: white;
            padding: 20px;
        }
        .content {
            flex-grow: 1;
            padding: 20px;
        }
        .welcome-message {
            font-size: 24px;
            margin-bottom: 20px;
            background-color: #49ADA5;
            color: white;
            padding: 20px;
            border-radius: 8px;
        }
        .summary-cards {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            width: 200px;
            text-align: center;
        }
        .card h3 {
            margin: 0;
            font-size: 18px;
        }
        .card p {
            margin: 10px 0 0;
            font-size: 24px;
            font-weight: bold;
        }
        .notifications {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .notifications h3 {
            margin: 0 0 10px;
            font-size: 18px;
        }
        .notifications ul {
            list-style: none;
            padding: 0;
        }
        .notifications li {
            margin-bottom: 10px;
            font-size: 14px;
        }
        .quick-access-button {
            display: inline-block;
            background-color: #49ADA5;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
        }
        .quick-access-button:hover {
            background-color: #007bff;
        }
    </style>
</head>
<body>
    <!-- Main Layout -->
    <div class="main-layout">
        <!-- Sidebar -->
        <div class="sidebar">
            <h2>Bald Rat Cut Projects</h2>
            <ul>
                <li>Inicio</li>
                <li>Proyectos</li>
                <li>Perfil</li>
            </ul>
        </div>

        <!-- Contenido Principal -->
        <div class="content">
            <!-- Bienvenida Personalizada -->
            <div class="welcome-message">
                Hola, <?php echo htmlspecialchars($nombre_estudiante); ?> 👋 Bienvenido.
            </div>

            <!-- Resumen de Actividad -->
            <div class="summary-cards">
                <div class="card">
                    <h3>Proyectos Activos</h3>
                    <p><?php echo $proyectos_activos; ?></p>
                </div>
                <div class="card">
                    <h3>Postulaciones Pendientes</h3>
                    <p><?php echo $postulaciones_pendientes; ?></p>
                </div>
            </div>

            <!-- Notificaciones Recientes -->
            <div class="notifications">
                <h3>Notificaciones Recientes</h3>
                <ul>
                    <?php foreach ($notificaciones as $notificacion): ?>
                        <li><?php echo htmlspecialchars($notificacion); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- Botón de Acceso Rápido -->
            <a href="#" class="quick-access-button">Ver Proyectos</a>
        </div>
    </div>
</body>
</html>