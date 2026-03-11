const mockDB = {
    auth_users: [
        { user: "22370703", pass: "123", role: "alumno", refId: 1 },
        { user: "23370112", pass: "123", role: "alumno", refId: 2 },
        { user: "21370998", pass: "123", role: "alumno", refId: 4 },
        { user: "rgomez", pass: "123", role: "tutor", nombre: "Ing. Roberto Gómez" },
        { user: "eval_basquet", pass: "123", role: "encargado", idActividad: "E2" },
        { user: "admin", pass: "123", role: "admin" }
    ],
    actividades_catalogo: [
        { id: "A1", nombre: "Taller de Lectura Avanzada", tipo: "Académica", cupo_max: 30, ocupados: 28 },
        { id: "A2", nombre: "Bootcamp Python & IA", tipo: "Académica", cupo_max: 20, ocupados: 20 },
        { id: "A3", nombre: "Redacción Científica", tipo: "Académica", cupo_max: 15, ocupados: 5 },
        { id: "E1", nombre: "Torneo de Ajedrez Institucional", tipo: "Extraescolar", cupo_max: 40, ocupados: 12 },
        { id: "E2", nombre: "Selección de Básquetbol", tipo: "Extraescolar", cupo_max: 15, ocupados: 14 }
    ],
    alumnos: [
        { id: 1, nombre: "CHRISTOPHER ELIHU ALVAREZ RODRIGUEZ", matricula: "22370703", carrera: "ING. TEC. INF. COM", semestre: 8, prom_sin_rep: 91.0, estatus: "VIGENTE", tutor: "Ing. Roberto Gómez", liberado: false, historial_actividades: [{ id_actividad: "A1", nombre: "Taller Lectura", tipo: "Académica", estado: "Excelente" }, { id_actividad: "A2", nombre: "Bootcamp Python", tipo: "Académica", estado: "Notable" }, { id_actividad: "E1", nombre: "Ajedrez", tipo: "Extraescolar", estado: "Suficiente" }, { id_actividad: "E2", nombre: "Básquetbol", tipo: "Extraescolar", estado: "Notable" }], actividad_actual: null },
        { id: 2, nombre: "MARIA FERNANDA LOPEZ PEREZ", matricula: "23370112", carrera: "ING. INDUSTRIAL", semestre: 5, prom_sin_rep: 85.5, estatus: "VIGENTE", tutor: "Ing. Roberto Gómez", liberado: false, historial_actividades: [{ id_actividad: "A1", nombre: "Taller Lectura", tipo: "Académica", estado: "Suficiente" }, { id_actividad: "E1", nombre: "Ajedrez", tipo: "Extraescolar", estado: "Insuficiente" }], actividad_actual: { id_actividad: "E2", nombre: "Selección de Básquetbol", tipo: "Extraescolar" } },
        { id: 3, nombre: "PEDRO ANTONIO RAMIREZ SOTO", matricula: "24370555", carrera: "ING. ELECTROMECÁNICA", semestre: 3, prom_sin_rep: 92.0, estatus: "VIGENTE", tutor: "Ing. Roberto Gómez", liberado: false, historial_actividades: [{ id_actividad: "E3", nombre: "Banda de Guerra", tipo: "Extraescolar", estado: "Excelente" }], actividad_actual: null },
        { id: 4, nombre: "JUAN CARLOS HERNANDEZ DIAZ", matricula: "21370998", carrera: "ING. MECATRÓNICA", semestre: 6, prom_sin_rep: 70.0, estatus: "BAJA TEMPORAL", tutor: "Dra. Elena Ruiz", liberado: false, historial_actividades: [{ id_actividad: "A2", nombre: "Bootcamp Python", tipo: "Académica", estado: "Insuficiente" }], actividad_actual: null },
        { id: 5, nombre: "ANA SOFIA MARTINEZ RUIZ", matricula: "25370001", carrera: "ING. GESTIÓN EMPRESARIAL", semestre: 1, prom_sin_rep: 98.0, estatus: "VIGENTE", tutor: "Ing. Roberto Gómez", liberado: false, historial_actividades: [], actividad_actual: null },
        { id: 6, nombre: "LUIS ENRIQUE GOMEZ VEGA", matricula: "20371122", carrera: "ING. SISTEMAS", semestre: 9, prom_sin_rep: 88.0, estatus: "VIGENTE", tutor: "Ing. Roberto Gómez", liberado: true, historial_actividades: [{ id_actividad: "A1", nombre: "Taller", tipo: "Académica", estado: "Suficiente" }, { id_actividad: "A2", nombre: "Python", tipo: "Académica", estado: "Notable" }, { id_actividad: "E1", nombre: "Ajedrez", tipo: "Extraescolar", estado: "Excelente" }, { id_actividad: "E4", nombre: "Teatro", tipo: "Extraescolar", estado: "Notable" }, { id_actividad: "LIB_OFICIAL", nombre: "Tutorías - Ing. Roberto Gómez", tipo: "Acreditación Institucional", estado: "Liberado" }], actividad_actual: null },
        { id: 7, nombre: "CARMEN ORTIZ MENDOZA", matricula: "22370111", carrera: "ING. TEC. INF. COM", semestre: 8, prom_sin_rep: 95.0, estatus: "VIGENTE", tutor: "Ing. Roberto Gómez", liberado: false, historial_actividades: [{ id_actividad: "A2", nombre: "Python", tipo: "Académica", estado: "Excelente" }, { id_actividad: "A4", nombre: "Robótica", tipo: "Académica", estado: "Excelente" }, { id_actividad: "E1", nombre: "Ajedrez", tipo: "Extraescolar", estado: "Excelente" }, { id_actividad: "E3", nombre: "Banda Guerra", tipo: "Extraescolar", estado: "Excelente" }], actividad_actual: null }
    ]
};

if(!localStorage.getItem('tutoria_db_v6')) {
    localStorage.setItem('tutoria_db_v6', JSON.stringify(mockDB));
}