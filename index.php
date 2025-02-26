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
        .content {
            padding: 20px;
        }
        .navbar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .navbar a {
            background-color: #6DB50A;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
        }
        .navbar a:hover {
            background-color: #49ADA5;
        }
        .welcome-message {
            font-size: 24px;
            margin-bottom: 20px;
            background-color: #49ADA5;
            color: white;
            padding: 20px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
    </style>
</head>
<body>
    <!-- Contenido Principal -->
    <div class="content">
        <!-- Bienvenida Personalizada -->
        <div class="welcome-message">
            <span>Hola, <?php echo htmlspecialchars($nombre_estudiante); ?> 👋 Bienvenido.</span>
            <div class="navbar">
                <a href="#">Inicio</a>
                <a href="#">Proyectos</a>
                <a href="#">Perfil</a>
            </div>
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
    </div>
</body>
</html>