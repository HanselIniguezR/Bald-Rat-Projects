import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify, render_template, redirect, url_for
from sqlalchemy.orm import Session
from BaldRat.DB_Connect.database import engine, get_db
from BaldRat.DB_Connect.models import Base, Project, ProjectCollaborator

# Crear la base de datos si no existe
Base.metadata.create_all(bind=engine)

# Instancia de la aplicación Flask
app = Flask(__name__)

# Ruta para listar proyectos
@app.route('/')
def index():
    db = next(get_db())
    projects = db.query(Project).all()
    return render_template('project_list.html', projects=projects)

# Ruta para crear un proyecto
@app.route('/create_project', methods=['GET', 'POST'])
def create_project():
    if request.method == 'POST':
        db = next(get_db())
        new_project = Project(
            title=request.form['title'],
            description=request.form['description'],
            requirements=request.form.get('requirements'),
            category=request.form['category'],
            professor_id=request.form['professor_id'],
            start_date=request.form['start_date'],
            end_date=request.form.get('end_date')
        )
        db.add(new_project)
        db.commit()
        return redirect(url_for('index'))
    return render_template('create_project.html')

# Ruta para editar un proyecto
@app.route('/edit_project/<int:project_id>', methods=['GET', 'POST'])
def edit_project(project_id):
    db = next(get_db())
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if request.method == 'POST':
        project.title = request.form['title']
        project.description = request.form['description']
        project.requirements = request.form.get('requirements')
        project.category = request.form['category']
        project.professor_id = request.form['professor_id']
        project.status = request.form['status']
        project.start_date = request.form['start_date']
        project.end_date = request.form.get('end_date')
        db.commit()
        return redirect(url_for('index'))
    return render_template('edit_project.html', project=project)

# Ruta para actualizar un proyecto
@app.route('/update_project/<int:project_id>', methods=['POST'])
def update_project(project_id):
    db = next(get_db())
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        return "Proyecto no encontrado", 404

    # Actualizar los datos del proyecto con los valores enviados desde el formulario
    project.title = request.form['title']
    project.description = request.form['description']
    project.requirements = request.form.get('requirements')
    project.category = request.form['category']
    project.professor_id = request.form['professor_id']
    project.status = request.form['status']
    project.start_date = request.form['start_date']
    project.end_date = request.form.get('end_date')

    db.commit()
    return redirect(url_for('index'))

# Ruta para asignar colaboradores
@app.route('/assign_collaborators/<int:project_id>', methods=['GET', 'POST'])
def assign_collaborators(project_id):
    db = next(get_db())
    if request.method == 'POST':
        new_collaborator = ProjectCollaborator(
            project_id=project_id,
            student_id=request.form['student_id'],
            role=request.form['role'],
            status=request.form['status']
        )
        db.add(new_collaborator)
        db.commit()
        return redirect(url_for('index'))
    project = db.query(Project).filter(Project.project_id == project_id).first()
    return render_template('assign_collaborators.html', project=project)

# Ruta para ver los detalles de un proyecto
@app.route('/project_details/<int:project_id>')
def project_details(project_id):
    db = next(get_db())
    project = db.query(Project).filter(Project.project_id == project_id).first()
    collaborators = db.query(ProjectCollaborator).filter(ProjectCollaborator.project_id == project_id).all()
    return render_template('project_details.html', project=project, collaborators=collaborators)

# Ruta para eliminar un proyecto
@app.route('/delete_project/<int:project_id>', methods=['POST'])
def delete_project(project_id):
    db = next(get_db())
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if project:
        db.delete(project)
        db.commit()
    return redirect(url_for('index'))

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)