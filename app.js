<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TecNM - Acceso</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Montserrat', sans-serif; background-color: #f8fafc; overflow-x: hidden;}
        .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 1); }
    </style>
</head>
<body id="page-login" class="min-h-screen flex flex-col items-center justify-center relative px-4 py-8">
    
    <div class="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[100px] z-0 pointer-events-none"></div>
    <div class="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[100px] z-0 pointer-events-none"></div>

    <div class="z-10 text-center mb-10 w-full">
        <div class="inline-flex items-center space-x-2 mb-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-bold tracking-widest uppercase text-[#1b396a]">Demo Funcional</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-[#1b396a] drop-shadow-sm">Sistema de Tutorías</h1>
        <p class="text-slate-600 text-lg font-medium">Tecnológico Nacional de México</p>
    </div>

    <div id="hub-cards" class="z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl transition-all duration-300">
        <div onclick="abrirLogin('alumno', 'Acceso Estudiantes')" class="glass-card p-8 rounded-3xl cursor-pointer hover:shadow-xl hover:shadow-[#1b396a]/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 group text-center">
            <div class="w-16 h-16 mx-auto bg-white border border-blue-100 text-[#1b396a] rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-[#1b396a] group-hover:text-white transition-all shadow-sm">🎓</div>
            <h3 class="text-xl font-extrabold text-[#1b396a] mb-1">Portal Estudiantes</h3><p class="text-sm text-slate-500 font-medium">Inscripción y Kárdex</p>
        </div>
        <div onclick="abrirLogin('tutor', 'Acceso Docentes')" class="glass-card p-8 rounded-3xl cursor-pointer hover:shadow-xl hover:shadow-[#1b396a]/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 group text-center">
            <div class="w-16 h-16 mx-auto bg-white border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">👨‍🏫</div>
            <h3 class="text-xl font-extrabold text-slate-800 mb-1">Portal Tutores</h3><p class="text-sm text-slate-500 font-medium">Firmas de Liberación</p>
        </div>
        <div onclick="abrirLogin('encargado', 'Acceso Evaluadores')" class="glass-card p-8 rounded-3xl cursor-pointer hover:shadow-xl hover:shadow-[#1b396a]/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 group text-center">
            <div class="w-16 h-16 mx-auto bg-white border border-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">📋</div>
            <h3 class="text-xl font-extrabold text-slate-800 mb-1">Encargados de Actividad </h3><p class="text-sm text-slate-500 font-medium">Pase de lista y Calificación</p>
        </div>
        <div onclick="abrirLogin('admin', 'Jefatura Central')" class="glass-card p-8 rounded-3xl cursor-pointer hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 group text-center">
            <div class="w-16 h-16 mx-auto bg-white border border-slate-200 text-slate-600 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-slate-700 group-hover:text-white transition-all shadow-sm">⚙️</div>
            <h3 class="text-xl font-extrabold text-slate-800 mb-1">Jefatura de Tutorias</h3><p class="text-sm text-slate-500 font-medium">Análisis Institucional</p>
        </div>
    </div>

    <div id="login-form-container" class="z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white p-8 md:p-10 hidden transition-all duration-300 transform">
        <button onclick="volverHub()" class="text-sm font-bold text-slate-400 hover:text-[#1b396a] mb-6 flex items-center transition-colors outline-none focus:ring-2 focus:ring-slate-200 rounded p-1"><span class="mr-2 text-lg leading-none">←</span> Regresar</button>
        <h2 id="login-title" class="text-2xl font-extrabold text-[#1b396a] mb-6 border-b border-slate-100 pb-4">Acceso</h2>
        
        <form id="login-form" class="space-y-5">
            <input type="hidden" id="login-role" value="">
            <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Usuario / Matrícula</label>
                <input type="text" id="user" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1b396a] focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all shadow-inner" required>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
                <input type="password" id="pass" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1b396a] focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all shadow-inner" required>
            </div>
            <button type="submit" class="w-full bg-[#1b396a] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-900 active:scale-95 outline-none focus:ring-4 focus:ring-blue-500/50 transition-all mt-2 text-sm">Ingresar</button>
        </form>

        <div class="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <p class="font-bold text-slate-500 mb-2 uppercase tracking-wider text-[10px]">Cuentas de Prueba</p>
            <ul class="text-slate-600 space-y-1.5 font-mono">
                <li class="flex justify-between"><span class="font-bold">22370703</span> <span>123</span></li>
                <li class="flex justify-between"><span class="font-bold">rgomez</span> <span>123</span></li>
                <li class="flex justify-between"><span class="font-bold">eval_basquet</span> <span>123</span></li>
                <li class="flex justify-between"><span class="font-bold">admin</span> <span>123</span></li>
            </ul>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="app.js"></script>
</body>
</html>
