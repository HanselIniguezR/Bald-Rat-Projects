from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    # Datos de ejemplo para proyectos
    projects = [
        {'project_id': 1, 'title': 'Proyecto 1', 'category': 'Tecnología', 'status': 'Abierto'},
        {'project_id': 2, 'title': 'Proyecto 2', 'category': 'Ciencia', 'status': 'Cerrado'}
    ]
    return render_template('project_list.html', projects=projects)

@app.route('/create_project')
def create_project():
    return render_template('create_project.html')

@app.route('/edit_project/<int:project_id>')
def edit_project(project_id):
    # Datos de ejemplo para un proyecto
    project = {
        'project_id': project_id,
        'title': 'Proyecto de Ejemplo',
        'description': 'Descripción del proyecto.',
        'requirements': 'Requisitos del proyecto.',
        'category': 'Tecnología',
        'professor_id': 123,
        'status': 'Abierto',
        'start_date': '2023-01-01',
        'end_date': '2023-12-31'
    }
    return render_template('edit_project.html', project=project)

@app.route('/project_details/<int:project_id>')
def project_details(project_id):
    # Datos de ejemplo para un proyecto y sus colaboradores
    project = {
        'project_id': project_id,
        'title': 'Proyecto de Ejemplo',
        'description': 'Descripción detallada del proyecto.',
        'requirements': 'Requisitos para participar.',
        'category': 'Ciencia',
        'status': 'En progreso',
        'start_date': '2023-01-01',
        'end_date': '2023-12-31'
    }
    collaborators = [
        {'student_id': 1, 'role': 'Asistente', 'status': 'Activo'},
        {'student_id': 2, 'role': 'Investigador', 'status': 'Inactivo'}
    ]
    return render_template('project_details.html', project=project, collaborators=collaborators)

@app.route('/update_project/<int:project_id>', methods=['POST'])
def update_project(project_id):
    # Aquí puedes procesar los datos enviados desde el formulario
    title = request.form.get('title')
    description = request.form.get('description')
    requirements = request.form.get('requirements')
    category = request.form.get('category')
    professor_id = request.form.get('professor_id')
    status = request.form.get('status')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')

    # Simulación de actualización (puedes reemplazar esto con lógica de base de datos)
    print(f"Actualizando proyecto {project_id}:")
    print(f"Título: {title}, Descripción: {description}, Requisitos: {requirements}")
    print(f"Categoría: {category}, Profesor ID: {professor_id}, Estado: {status}")
    print(f"Fecha de Inicio: {start_date}, Fecha de Finalización: {end_date}")

    # Redirige a la página de detalles del proyecto después de actualizar
    return render_template('project_details.html', project={
        'project_id': project_id,
        'title': title,
        'description': description,
        'requirements': requirements,
        'category': category,
        'professor_id': professor_id,
        'status': status,
        'start_date': start_date,
        'end_date': end_date
    }, collaborators=[])

@app.route('/delete_project/<int:project_id>', methods=['GET', 'POST'])
def delete_project(project_id):
    # Simulación de eliminación (puedes reemplazar esto con lógica de base de datos)
    print(f"Eliminando proyecto con ID: {project_id}")

    # Redirige a la lista de proyectos después de eliminar
    return render_template('project_list.html', projects=[
        {'project_id': 1, 'title': 'Proyecto 1', 'category': 'Tecnología', 'status': 'Abierto'},
        {'project_id': 2, 'title': 'Proyecto 2', 'category': 'Ciencia', 'status': 'Cerrado'}
    ])

@app.route('/reports')
def reports():
    return render_template('reports.html')

@app.route('/assign_collaborators/<int:project_id>', methods=['GET', 'POST'])
def assign_collaborators(project_id):
    if request.method == 'POST':
        # Obtener los datos del formulario
        student_id = request.form.get('student_id')
        role = request.form.get('role')
        status = request.form.get('status')

        # Simulación de asignación (puedes reemplazar esto con lógica de base de datos)
        print(f"Asignando colaborador al proyecto {project_id}:")
        print(f"Estudiante ID: {student_id}, Rol: {role}, Estado: {status}")

        # Redirigir a la página de detalles del proyecto después de asignar
        return render_template('project_details.html', project={
            'project_id': project_id,
            'title': 'Proyecto de Ejemplo',
            'description': 'Descripción del proyecto.',
            'requirements': 'Requisitos del proyecto.',
            'category': 'Tecnología',
            'professor_id': 123,
            'status': 'Abierto',
            'start_date': '2023-01-01',
            'end_date': '2023-12-31'
        }, collaborators=[
            {'student_id': student_id, 'role': role, 'status': status}
        ])

    # Si es una solicitud GET, renderiza el formulario
    return render_template('assign_collaborators.html', project={
        'project_id': project_id,
        'title': 'Proyecto de Ejemplo'
    })

if __name__ == '__main__': 
    app.run(debug=True)