

document.addEventListener("DOMContentLoaded", () => {
  let db = JSON.parse(localStorage.getItem("tutoria_db_v6"));
  const guardarDB = () =>
    localStorage.setItem("tutoria_db_v6", JSON.stringify(db));

  const gradosAprobatorios = ["Suficiente", "Notable", "Excelente"];
  const esAprobada = (estado) =>
    gradosAprobatorios.includes(estado) ||
    estado === "Aprobada" ||
    estado === "Liberado";

  // --- MENÚ MÓVIL ---
  const btnMenu = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("sidebar");
  if (btnMenu && sidebar) {
    btnMenu.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
      sidebar.classList.toggle("absolute");
      sidebar.classList.toggle("w-full");
      sidebar.classList.toggle("h-screen");
    });
  }

  // --- TOASTS ---
  const toastContainer = document.createElement("div");
  toastContainer.className =
    "fixed bottom-6 right-6 z-[200] flex flex-col gap-4 pointer-events-none";
  document.body.appendChild(toastContainer);

  window.showToast = function (msg, type = "success") {
    const toast = document.createElement("div");
    const borderColor =
      type === "success"
        ? "border-emerald-500"
        : type === "error"
          ? "border-rose-500"
          : "border-[#1b396a]";
    const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

    toast.className = `bg-white/95 backdrop-blur-xl border border-white text-slate-800 p-5 min-w-[320px] max-w-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-l-[6px] ${borderColor} transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 translate-y-8 flex items-center space-x-4 font-medium text-sm pointer-events-auto`;
    toast.innerHTML = `<span class="text-2xl">${icon}</span> <span class="flex-1">${msg}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        toast.classList.remove("opacity-0", "translate-y-8"),
      ),
    );
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-4", "scale-95");
      setTimeout(() => toast.remove(), 500);
    }, 3500);
  };

  // --- MODALES ---
  window.showModal = function (title, contentHtml, buttonsHtml = "") {
    const overlay = document.createElement("div");
    overlay.id = "dynamic-modal";
    overlay.className =
      "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300";
    overlay.innerHTML = `
            <div class="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 transition-transform duration-300">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <h3 class="text-xl font-extrabold text-[#1b396a]">${title}</h3>
                    <button onclick="cerrarModal()" class="text-slate-400 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 rounded-lg p-1 font-bold text-2xl transition-all">&times;</button>
                </div>
                <div class="p-8 text-slate-700 max-h-[60vh] overflow-y-auto">${contentHtml}</div>
                ${buttonsHtml ? `<div class="p-6 border-t border-slate-100 bg-slate-50/80 flex justify-end space-x-3">${buttonsHtml}</div>` : ""}
            </div>
        `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.classList.remove("opacity-0");
      overlay.querySelector("div").classList.remove("scale-95");
    });
  };

  window.cerrarModal = function () {
    const modal = document.getElementById("dynamic-modal");
    if (modal) {
      modal.classList.add("opacity-0");
      setTimeout(() => modal.remove(), 300);
    }
  };

  window.confirmarAccion = function (
    titulo,
    mensaje,
    textoBtn,
    accionCallback,
  ) {
    const btns = `
            <button onclick="cerrarModal()" class="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors active:scale-95 outline-none">Cancelar</button>
            <button id="btn-modal-confirm" class="px-5 py-2.5 bg-[#1b396a] hover:bg-blue-900 text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-300">${textoBtn}</button>
        `;
    showModal(
      titulo,
      `<p class="text-base font-medium leading-relaxed">${mensaje}</p>`,
      btns,
    );
    document
      .getElementById("btn-modal-confirm")
      .addEventListener("click", () => {
        cerrarModal();
        accionCallback();
      });
  };

  // --- LÓGICA CENTRALIZADA DEL CHATBOT ---
  function initChatbot(faqs) {
    const btnOpenChat = document.getElementById("open-chat-btn");
    const btnCloseChat = document.getElementById("close-chat-btn");
    const chatWindow = document.getElementById("chat-window");
    const chatMessages = document.getElementById("chat-messages");
    const chatBubbles = document.getElementById("chat-bubbles");

    if (!btnOpenChat || !chatWindow) return;

    let inputArea = document.getElementById("chat-input-area");
    if (!inputArea) {
      inputArea = document.createElement("div");
      inputArea.id = "chat-input-area";
      inputArea.className =
        "p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0";
      inputArea.innerHTML = `
            <input type="text" id="chat-input-text" autocomplete="off" placeholder="Escríbele a Sussan..." class="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1b396a] transition-colors shadow-inner">
            <button id="chat-send-btn" class="bg-[#1b396a] text-white p-2.5 rounded-xl hover:bg-blue-900 active:scale-95 transition-all focus:outline-none shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            </button>
        `;
      chatWindow.appendChild(inputArea);
    }

    const inputField = document.getElementById("chat-input-text");
    const btnSend = document.getElementById("chat-send-btn");
    const activeUser = JSON.parse(sessionStorage.getItem("activeUser"));

    let nombrePila = "Usuario";
    if (activeUser) {
      if (activeUser.role === "alumno") {
        const alumnoInfo = db.alumnos.find((a) => a.id === activeUser.refId);
        if (alumnoInfo && alumnoInfo.nombre) {
          let partes = alumnoInfo.nombre.split(" ");
          nombrePila =
            partes[0].charAt(0).toUpperCase() +
            partes[0].slice(1).toLowerCase();
        }
      } else if (activeUser.role === "tutor") {
        nombrePila = activeUser.nombre ? activeUser.nombre : "Tutor";
      } else if (activeUser.role === "admin") {
        nombrePila = "Administrador";
      } else if (activeUser.role === "encargado") {
        nombrePila = "Evaluador";
      }
    }

    // EL NUEVO CEREBRO DE SUSSAN
    let systemPromptBase = `Eres Sussan, consejera estudiantil del Sistema de Tutorías (SIT). Eres humana, dulce, expresiva y muy amigable, pero no uses con palabras como "guapo/linda".

    REGLAS DE PERSONALIDAD:
    1. EMOJIS: Es OBLIGATORIO que uses emojis frecuentemente (ej. ✨, 😊, 📚, 📝). Si no los usas sonarás como un robot aburrido.
    2. EMPATÍA: Si el usuario cuenta un problema triste o de estrés, escúchalo, sé madura y usa emojis de consuelo (🫂, 😔, ❤️‍🩹).
    3. CERO CORTADAS: NUNCA mandes al usuario a "revisar la plataforma". TÚ le darás la información directamente.
    4. FLUYE: Si te saludan, saluda y plática normal. No ofrezcas datos administrativos ni ofrezcas talleres si no te los han pedido explícitamente.

    *** REGLAS GLOBALES DE LIBERACIÓN (Usa solo si te preguntan cómo funciona el sistema) ***
    - El alumno debe completar 4 actividades obligatorias para poder solicitar la liberación del crédito de tutorías.

Las 4 actividades deben dividirse en:

2 actividades académicas

2 actividades extraescolares

Las actividades válidas para la liberación deben pertenecer al catálogo oficial proporcionado por la Coordinación.

El alumno solo puede inscribirse a una actividad complementaria por semestre.

El alumno puede inscribirse nuevamente a una actividad ya cursada, pero no contará para la liberación del crédito de tutorías.

Algunas actividades institucionales especiales (por ejemplo eventos culturales o académicos) pueden contar como actividades válidas para liberación, si así lo determina la coordinación.

Cada actividad debe ser respaldada por un documento comprobatorio en formato PDF.

El alumno debe adjuntar los 4 PDFs correspondientes a las actividades realizadas.

Si el documento no contiene QR, debe contar con sello institucional.

El alumno solo puede solicitar la liberación del crédito de tutorías cuando:

esté cursando el 5° semestre, o

haya superado el 5° semestre.
cumplimiento de las 4 actividades

validez de los documentos

consistencia de la información

La liberación se considera válida solo cuando el tutor registra su aprobación en el sistema.\n`;

    if (activeUser && activeUser.role === "alumno") {
      const alumno = db.alumnos.find((a) => a.id === activeUser.refId);
      const aprobadasAcad = alumno.historial_actividades.filter(
        (a) => esAprobada(a.estado) && a.tipo === "Académica",
      ).length;
      const aprobadasExtra = alumno.historial_actividades.filter(
        (a) => esAprobada(a.estado) && a.tipo === "Extraescolar",
      ).length;

      const elegible =
        aprobadasAcad >= 2 && aprobadasExtra >= 2 && alumno.semestre >= 5;
      const faltanAcad = Math.max(0, 2 - aprobadasAcad);
      const faltanExtra = Math.max(0, 2 - aprobadasExtra);

      let veredicto = "";
      if (alumno.liberado) {
        veredicto = "Ya está 100% liberado oficialmente.";
      } else if (elegible) {
        veredicto =
          "¡Sí! Ya puede liberar. Cumple con las 4 actividades y el semestre. Su estatus es 'ESPERANDO FIRMA'.";
      } else {
        veredicto = `Aún no puede liberar. Le faltan ${faltanAcad} académicas y ${faltanExtra} extraescolares. `;
        if (alumno.semestre < 5)
          veredicto += `Además, está en semestre ${alumno.semestre} y necesita estar en el 5to.`;
      }

      let historialNombres = alumno.historial_actividades
        .map((act) => `- ${act.nombre} (${act.tipo}): ${act.estado}`)
        .join("\n");
      if (!historialNombres)
        historialNombres = "Aún no tiene actividades registradas.";

      let cursandoTexto = alumno.actividad_actual
        ? `${alumno.actividad_actual.nombre} (${alumno.actividad_actual.tipo})`
        : "Ninguna.";

      // --- MAGIA EXTREMA DE JAVASCRIPT ---
      // Determinamos si el alumno tiene permiso de inscribir algo ahorita
      const bloqueado =
        alumno.liberado ||
        alumno.estatus === "BAJA TEMPORAL" ||
        alumno.actividad_actual;

      // SIEMPRE obtenemos los IDs cursados para no ofrecerlos de nuevo
      const idsCursados = alumno.historial_actividades.map(
        (a) => a.id_actividad,
      );

      // Catálogo general para mostrar como texto (incluso si está bloqueado)
      let catalogoCompleto = db.actividades_catalogo
        .map((a) => `- ${a.nombre} (${a.tipo})`)
        .join("\n");

      // Catálogo interactivo solo con lo que puede cursar
      let catalogoDisponible = db.actividades_catalogo
        .filter((a) => a.ocupados < a.cupo_max && !idsCursados.includes(a.id))
        .map((a) => `- ${a.nombre} (${a.tipo}) [ID_SECRETO: ${a.id}]`)
        .join("\n");

      let bloqueCatalogo = "";
      
      if (bloqueado) {
        let razon = alumno.liberado ? "ya estás liberado" : (alumno.estatus === "BAJA TEMPORAL" ? "estás en baja temporal" : "ya tienes una materia activa");
        bloqueCatalogo = `
        *** CATÁLOGO DE OPCIONES DE ESTE SEMESTRE ***
        ${catalogoCompleto}
        
        ATENCIÓN SUSSAN: El alumno NO PUEDE INSCRIBIR NADA MÁS porque ${razon}. 
        - Si te pide la oferta, MUESTRA las opciones del catálogo de arriba, pero explícale dulcemente por qué no puede inscribirse.
        - BAJO NINGUNA CIRCUNSTANCIA uses el comando secreto de inscripción.`;
      } else {
        if (catalogoDisponible === "") {
          bloqueCatalogo = "Ya no hay talleres con cupo disponible o ya tomó todos.";
        } else {
          bloqueCatalogo = `
          *** CATÁLOGO DE OPCIONES DISPONIBLES Y NUEVAS PARA ESTE ALUMNO ***
          ${catalogoDisponible}
          
          ⚠️ REGLAS PARA OFRECER CATÁLOGO:
          - Solo ofrécele estas opciones si te pide recomendaciones.
          - NO menciones los "ID_SECRETO" al usuario, guárdatelos en tu mente.
          - Si el alumno te da la ORDEN EXPLÍCITA de inscribirlo a alguna de estas opciones, confirma y pega al final de tu respuesta el código secreto así: [INSCRIBIR: ID]. 
          - PELIGRO: NUNCA pegues el código [INSCRIBIR: ID] si solo estás sugiriendo o preguntando si le interesa. Úsalo ÚNICAMENTE cuando el alumno diga que sí quiere entrar.`;
        }
      }

      systemPromptBase += `
        ==================================================
        📋 EXPEDIENTE EN VIVO DEL ALUMNO (Úsalo SOLO si el alumno pide un resumen, ver su perfil, o pregunta qué le falta, pero NUNCA lo digas textualmente como esta aqui, si no muestralo de forma natural).
        - Nombre: ${nombrePila}
        - Semestre actual: ${alumno.semestre}
        - KÁRDEX EXACTO (Materias pasadas):\n${historialNombres}
        - Cursando en este momento: ${cursandoTexto}
        - ESTATUS PERSONAL DE LIBERACIÓN: ${veredicto}
        
        ${bloqueCatalogo}
        ==================================================`;
    } else if (activeUser && activeUser.role === "tutor") {
      systemPromptBase += `\n📋 EXPEDIENTE EN VIVO: Hablas con el Tutor ${nombrePila}. Apóyalo y escúchalo si tiene carga de trabajo.`;
    } else if (activeUser && activeUser.role === "encargado") {
      systemPromptBase += `\n📋 EXPEDIENTE EN VIVO: Hablas con el Evaluador ${nombrePila}.`;
    } else if (activeUser && activeUser.role === "admin") {
      systemPromptBase += `\n📋 EXPEDIENTE EN VIVO: Hablas con el Administrador ${nombrePila}.`;
    }

    const appendMessage = (text, isUser = false, msgId = null) => {
      // RegEx a prueba de balas para ocultar toda nuestra lógica secreta
      let displayTexto = text
        .replace(/\[INSCRIBIR:\s*[a-zA-Z0-9]+\]/gi, "")
        .replace(/\[ID_SECRETO:\s*[a-zA-Z0-9]+\]/gi, "")
        .replace(/\[ID:\s*[a-zA-Z0-9]+\]/gi, "")
        .replace(/ID_SECRETO/gi, "");

      let msgDiv;
      if (msgId && document.getElementById(msgId)) {
        msgDiv = document.getElementById(msgId);
        msgDiv.querySelector(".msg-content").innerHTML = displayTexto.replace(
          /\n/g,
          "<br>",
        );
      } else {
        msgDiv = document.createElement("div");
        if (msgId) msgDiv.id = msgId;
        msgDiv.className = `flex items-start w-full mt-3 ${isUser ? "justify-end" : "justify-start"}`;
        msgDiv.innerHTML = `
                <div class="${isUser ? "bg-[#1b396a] text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"} p-3.5 rounded-2xl shadow-sm max-w-[85%] font-medium text-sm leading-relaxed msg-content">
                    ${displayTexto.replace(/\n/g, "<br>")}
                </div>
            `;
        chatMessages.appendChild(msgDiv);
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return msgDiv;
    };

    chatMessages.innerHTML = "";
    const saludoInicial = `¡Hola, ${nombrePila}! ✨ Soy Sussan, tu asistente y compañera durante tu estadía en .`;
    appendMessage(saludoInicial, false);

    let conversationHistory = [
      { role: "system", content: systemPromptBase },
      { role: "assistant", content: saludoInicial },
    ];

    chatBubbles.innerHTML = "";
    faqs.forEach((faq) => {
      const btnBubble = document.createElement("button");
      btnBubble.className =
        "text-left text-xs bg-slate-100 hover:bg-slate-200 text-[#1b396a] font-bold px-4 py-2 rounded-full border border-slate-200 transition-colors focus:outline-none shadow-sm active:scale-95 shrink-0";
      btnBubble.textContent = faq.q;
      btnBubble.onclick = () => {
        inputField.value = faq.q;
        btnSend.click();
      };
      chatBubbles.appendChild(btnBubble);
    });

    // --- DENTRO DE app.js ---

// 1. Define tu URL de ngrok aquí (Cámbiala cada vez que reinicies ngrok)
const NGROK_URL = "https://TU-URL-DE-NGROK.ngrok-free.app"; 

// ... (resto del código igual hasta llegar a sendMessageToOllama)

    const sendMessageToOllama = async (userText) => {
        appendMessage(userText, true);
        inputField.value = "";

        conversationHistory.push({ role: "user", content: userText });

        const typingId = "typing-" + Date.now();
        const msgId = "response-" + Date.now();

        const typingDiv = document.createElement("div");
        typingDiv.id = typingId;
        typingDiv.className = `flex items-start w-full mt-3 justify-start`;
        typingDiv.innerHTML = `
            <div class="bg-slate-100 border border-slate-200 text-[#1b396a] p-3.5 rounded-2xl rounded-tl-none shadow-sm font-medium text-xs flex space-x-1 animate-pulse tracking-widest">
                ● ● ●
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // CAMBIO: Ahora apunta a la URL de ngrok en lugar de localhost
            const response = await fetch(`${NGROK_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama3.1",
                    messages: conversationHistory,
                    stream: true,
                }),
            });

            if (!response.ok) throw new Error("Error en la conexión con el servidor");

            document.getElementById(typingId).remove();
            appendMessage("", false, msgId);

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let iaResponseFull = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                let boundary = buffer.indexOf("\n");

                while (boundary !== -1) {
                    const line = buffer.slice(0, boundary).trim();
                    buffer = buffer.slice(boundary + 1);
                    boundary = buffer.indexOf("\n");

                    if (line) {
                        try {
                            const data = JSON.parse(line);
                            if (data.message && data.message.content) {
                                iaResponseFull += data.message.content;
                                appendMessage(iaResponseFull, false, msgId);
                            }
                        } catch (e) {}
                    }
                }
            }

            conversationHistory.push({ role: "assistant", content: iaResponseFull });

            // --- LÓGICA DE INSCRIPCIÓN AUTOMÁTICA ---
            const matchInscribir = iaResponseFull.match(/\[INSCRIBIR:\s*([A-Z0-9]+)\]/i);
            if (matchInscribir && activeUser.role === "alumno") {
                const idAct = matchInscribir[1].toUpperCase();
                const alumno = db.alumnos.find((a) => a.id === activeUser.refId);
                const actSel = db.actividades_catalogo.find((a) => a.id === idAct);

                setTimeout(() => {
                    if (alumno.liberado || alumno.estatus === "BAJA TEMPORAL" || alumno.actividad_actual) {
                        appendMessage("⚠️ **Sistema:** Solicitud denegada. Ya tienes una carga activa o estatus no válido.", false);
                    } else if (!actSel || actSel.ocupados >= actSel.cupo_max) {
                        appendMessage("⚠️ **Sistema:** Error. Taller inexistente o sin cupo.", false);
                    } else {
                        alumno.actividad_actual = { id_actividad: actSel.id, nombre: actSel.nombre, tipo: actSel.tipo };
                        actSel.ocupados += 1;
                        guardarDB();
                        if (typeof renderUI === "function") renderUI();
                        showToast(`Inscrito a: ${actSel.nombre}`, "success");
                        appendMessage(`✅ **Confirmación:** Te he inscrito a **${actSel.nombre}**. ✨`, false);
                    }
                }, 800);
            }
        } catch (error) {
            console.error("Error IA:", error);
            if (document.getElementById(typingId)) document.getElementById(typingId).remove();
            appendMessage("¡Uy! No pude conectar con Sussan. Asegúrate de que el túnel de ngrok esté activo. 🥺", false);
            conversationHistory.pop();
        }
    };

    btnSend.addEventListener("click", () => {
      if (inputField.value.trim() !== "")
        sendMessageToOllama(inputField.value.trim());
    });

    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && inputField.value.trim() !== "")
        sendMessageToOllama(inputField.value.trim());
    });

    btnOpenChat.addEventListener("click", () => {
      chatWindow.classList.remove("scale-0", "opacity-0");
      chatWindow.classList.add("scale-100", "opacity-100");
    });
    btnCloseChat.addEventListener("click", () => {
      chatWindow.classList.remove("scale-100", "opacity-100");
      chatWindow.classList.add("scale-0", "opacity-0");
    });
  } sendMessageToOllama

  window.cerrarSesion = function () {
    sessionStorage.removeItem("activeUser");
    window.location.href = "index.html";
  };
  const activeUser = JSON.parse(sessionStorage.getItem("activeUser"));
  const isLoginPage = document.getElementById("page-login");
  if (!activeUser && !isLoginPage) return (window.location.href = "index.html");

  // ==========================================
  // LOGIN
  // ==========================================
  if (isLoginPage) {
    window.abrirLogin = function (role, titulo) {
      document.getElementById("hub-cards").classList.add("hidden", "opacity-0");
      const formContainer = document.getElementById("login-form-container");
      formContainer.classList.remove("hidden");
      setTimeout(
        () => formContainer.classList.remove("opacity-0", "scale-95"),
        50,
      );
      document.getElementById("login-title").textContent = titulo;
      document.getElementById("login-role").value = role;
    };
    window.volverHub = function () {
      const formContainer = document.getElementById("login-form-container");
      formContainer.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        formContainer.classList.add("hidden");
        const hub = document.getElementById("hub-cards");
        hub.classList.remove("hidden");
        setTimeout(() => hub.classList.remove("opacity-0"), 50);
      }, 300);
      document.getElementById("login-form").reset();
    };

    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const u = document.getElementById("user").value;
        const p = document.getElementById("pass").value;
        const r = document.getElementById("login-role").value;
        const userMatch = db.auth_users.find(
          (x) => x.user === u && x.pass === p && x.role === r,
        );
        if (userMatch) {
          sessionStorage.setItem("activeUser", JSON.stringify(userMatch));
          showToast("Autenticación verificada. Iniciando sesión...", "success");
          setTimeout(
            () => (window.location.href = `${userMatch.role}.html`),
            600,
          );
        } else {
          showToast("Credenciales incorrectas.", "error");
        }
      });
    }
  }

  // ==========================================
  // ALUMNO
  // ==========================================
  if (document.getElementById("page-alumno")) {
    const alumno = db.alumnos.find((a) => a.id === activeUser.refId);

    if (!alumno.evidencias) alumno.evidencias = [];

    const crearBloqueEvidencias = () => {
      const listaHistorial = document.getElementById("lista-historial");
      if (!listaHistorial) return;

      let cont = document.getElementById("mis-evidencias-card");
      if (!cont) {
        cont = document.createElement("div");
        cont.id = "mis-evidencias-card";
        cont.className =
          "bg-white/60 backdrop-blur-md border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden mt-6";

        cont.innerHTML = `
                <div class="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full z-0 opacity-50"></div>
                <div class="relative z-10">
                    <h3 class="text-lg md:text-xl font-extrabold text-[#1b396a] mb-2 flex items-center">
                        <span class="bg-amber-100 text-amber-600 p-2 rounded-xl mr-3 text-sm shadow-sm">📁</span> Mis Evidencias (PDF)
                    </h3>
                    <p class="text-xs text-slate-500 mb-4 font-medium">Sube tus 4 PDFs con membrete o QR. Estos documentos son requeridos por tu tutor para la validación de tus créditos.</p>
                    
                    <div id="dropzone" class="border-2 border-dashed border-slate-300 rounded-2xl p-6 md:p-8 text-center bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer group mb-4">
                        <div class="text-4xl mb-3 transform group-hover:-translate-y-1 transition-transform">📄</div>
                        <p class="text-sm font-semibold text-slate-600">Arrastra tus PDFs aquí</p>
                        <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">O haz clic para explorar</p>
                        <input type="file" id="file-input" class="hidden" accept="application/pdf">
                    </div>
                    
                    <div id="lista-evidencias-files" class="space-y-2 mt-2"></div>
                </div>
            `;
        listaHistorial.parentElement.appendChild(cont);

        const dropzone = document.getElementById("dropzone");
        const fileInput = document.getElementById("file-input");

        dropzone.addEventListener("click", () => fileInput.click());
        dropzone.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropzone.classList.add("border-blue-500", "bg-blue-50");
        });
        dropzone.addEventListener("dragleave", () => {
          dropzone.classList.remove("border-blue-500", "bg-blue-50");
        });
        dropzone.addEventListener("drop", (e) => {
          e.preventDefault();
          dropzone.classList.remove("border-blue-500", "bg-blue-50");
          if (e.dataTransfer.files.length)
            procesarArchivo(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener("change", (e) => {
          if (e.target.files.length) procesarArchivo(e.target.files[0]);
        });
      }

      actualizarListaEvidencias();
    };

    const procesarArchivo = (file) => {
      if (file.type !== "application/pdf")
        return showToast("Solo se aceptan archivos PDF.", "error");

      showToast("Subiendo y analizando PDF...", "info");
      setTimeout(() => {
        alumno.evidencias.push({
          id: Date.now(),
          nombre: file.name,
          fecha: new Date().toLocaleDateString(),
          estado: "En Revisión",
        });
        guardarDB();
        actualizarListaEvidencias();
        showToast("Evidencia cargada correctamente.", "success");
      }, 1500);
    };

    const actualizarListaEvidencias = () => {
      const list = document.getElementById("lista-evidencias-files");
      if (!list) return;
      list.innerHTML = "";

      if (alumno.evidencias.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-400 italic text-center py-2">Aún no has subido evidencias.</p>`;
        return;
      }

      alumno.evidencias.forEach((ev) => {
        const badgeClass =
          ev.estado === "Validado"
            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
            : "bg-amber-50 text-amber-600 border-amber-200";
        const icon = ev.estado === "Validado" ? "✅" : "⏳";
        list.innerHTML += `
                <div class="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center space-x-3 overflow-hidden">
                        <div class="text-xl">📑</div>
                        <div class="truncate text-left">
                            <p class="text-sm font-bold text-slate-700 truncate">${ev.nombre}</p>
                            <p class="text-[9px] text-slate-400 font-mono">${ev.fecha}</p>
                        </div>
                    </div>
                    <span class="ml-2 shrink-0 px-2.5 py-1 border ${badgeClass} rounded-full text-[10px] font-bold tracking-wide">${icon} ${ev.estado}</span>
                </div>
            `;
      });
    };

    window.renderUI = () => {
      document.getElementById("lbl-nombre").textContent = alumno.nombre;
      document.getElementById("lbl-matricula").textContent = alumno.matricula;
      document.getElementById("lbl-carrera").textContent = alumno.carrera;
      document.getElementById("lbl-semestre").textContent =
        `${alumno.semestre}`;

      const aprobadasAcad = alumno.historial_actividades.filter(
        (a) => esAprobada(a.estado) && a.tipo === "Académica",
      ).length;
      const aprobadasExtra = alumno.historial_actividades.filter(
        (a) => esAprobada(a.estado) && a.tipo === "Extraescolar",
      ).length;
      const elegible =
        aprobadasAcad >= 2 && aprobadasExtra >= 2 && alumno.semestre >= 5;

      document.getElementById("prog-acad").textContent =
        `${aprobadasAcad} de 2`;
      document.getElementById("prog-extra").textContent =
        `${aprobadasExtra} de 2`;

      const statusBadge = document.getElementById("status-liberacion");
      if (alumno.liberado) {
        statusBadge.innerHTML = `<div class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30 text-center w-full">LIBERADO</div>`;
      } else if (elegible) {
        statusBadge.innerHTML = `<div class="bg-white text-blue-600 border border-blue-600 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-center w-full animate-pulse">ESPERANDO FIRMA</div>`;
      } else {
        statusBadge.innerHTML = `<div class="bg-slate-50 text-slate-500 border border-slate-300 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-center w-full">EN PROGRESO</div>`;
      }

      const listaHistorial = document.getElementById("lista-historial");
      listaHistorial.innerHTML = "";
      alumno.historial_actividades.forEach((act) => {
        if (act.tipo === "Acreditación Institucional") {
          listaHistorial.innerHTML += `
                        <div class="flex items-center justify-between p-4 mb-4 bg-blue-50/50 rounded-2xl border border-blue-200 shadow-sm">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600 text-xl shadow-inner">📜</div>
                                <div><p class="font-bold text-blue-900 text-sm md:text-base">${act.nombre}</p><p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Acreditación Institucional</p></div>
                            </div>
                            <span class="w-28 text-center py-1.5 rounded-full text-xs font-bold border border-blue-500 text-blue-600 bg-white shadow-sm">${act.estado}</span>
                        </div>`;
        } else {
          const bgBadge = esAprobada(act.estado)
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-rose-50 text-rose-700 border-rose-200";
          listaHistorial.innerHTML += `
                        <div class="flex flex-col md:flex-row md:items-center justify-between p-4 mb-3 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 gap-3 md:gap-0">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center ${act.tipo === "Académica" ? "bg-blue-50 text-[#1b396a]" : "bg-purple-50 text-purple-600"} text-xl shrink-0">
                                    ${act.tipo === "Académica" ? "📚" : "🏆"}
                                </div>
                                <div><p class="font-bold text-slate-800 text-sm md:text-base">${act.nombre}</p><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${act.tipo}</p></div>
                            </div>
                            <span class="w-32 inline-block text-center py-1.5 rounded-lg text-xs font-bold border ${bgBadge} self-end md:self-auto">${act.estado}</span>
                        </div>`;
        }
      });

      if (alumno.actividad_actual) {
        listaHistorial.innerHTML += `
                    <div class="flex flex-col md:flex-row md:items-center justify-between p-4 mb-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm gap-3 md:gap-0">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-200 text-slate-600 text-xl shrink-0">⏳</div>
                            <div><p class="font-bold text-slate-800 text-sm md:text-base">${alumno.actividad_actual.nombre}</p><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${alumno.actividad_actual.tipo}</p></div>
                        </div>
                        <span class="w-32 inline-block text-center py-1.5 rounded-lg text-xs font-bold bg-white text-slate-600 border border-slate-300 shadow-sm self-end md:self-auto">Cursando</span>
                    </div>`;
      }

      const selectCatalogo = document.getElementById("select-catalogo");
      const btnInscribir = document.getElementById("btn-inscribir");
      selectCatalogo.innerHTML =
        '<option value="">-- Selecciona una actividad --</option>';
      db.actividades_catalogo.forEach((act) => {
        const full = act.ocupados >= act.cupo_max;
        selectCatalogo.innerHTML += `<option value="${act.id}" ${full ? "disabled" : ""}>${act.nombre} (${act.tipo}) - ${full ? "LLENO" : `Cupos: ${act.cupo_max - act.ocupados}`}</option>`;
      });

      if (
        alumno.liberado ||
        alumno.estatus === "BAJA TEMPORAL" ||
        alumno.actividad_actual
      ) {
        btnInscribir.disabled = true;
        selectCatalogo.disabled = true;
        btnInscribir.className =
          "w-full py-3.5 rounded-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200";
        btnInscribir.innerHTML = alumno.liberado
          ? "Crédito liberado."
          : alumno.estatus === "BAJA TEMPORAL"
            ? "Bloqueado"
            : "Límite: 1 actividad por semestre";
      } else {
        btnInscribir.disabled = false;
        selectCatalogo.disabled = false;
        btnInscribir.className =
          "w-full bg-[#1b396a] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-all duration-300 text-sm";
        btnInscribir.innerHTML = "Solicitar Inscripción Manual";
        btnInscribir.onclick = () => {
          if (!selectCatalogo.value)
            return showToast("Selecciona una actividad válida", "error");
          const actSel = db.actividades_catalogo.find(
            (a) => a.id === selectCatalogo.value,
          );
          confirmarAccion(
            "Confirmar Inscripción",
            `¿Inscribirte a <b>${actSel.nombre}</b>?`,
            "Sí, Inscribirme",
            () => {
              alumno.actividad_actual = {
                id_actividad: actSel.id,
                nombre: actSel.nombre,
                tipo: actSel.tipo,
              };
              actSel.ocupados += 1;
              guardarDB();
              showToast(`Inscrito a: ${actSel.nombre}`, "success");
              renderUI();
            },
          );
        };
      }

      crearBloqueEvidencias();
    };
    renderUI();

    initChatbot([
      {
        q: "¿Qué pasa con mis evidencias PDF?",
        a: "Deben tener membrete oficial, QR o sello. Súbelos en la caja de 'Mis Evidencias'.",
      },
    ]);
  }

  // ==========================================
  // TUTOR
  // ==========================================
  if (document.getElementById("page-tutor")) {
    document.getElementById("nombre-tutor").textContent = activeUser.nombre;

    window.verExpediente = function (idAlumno) {
      const al = db.alumnos.find((a) => a.id === idAlumno);
      let historialHTML = al.historial_actividades
        .map(
          (h) =>
            `<li class="text-sm py-3 border-b border-slate-100 flex justify-between items-center"><span class="font-semibold text-slate-800">${h.nombre} <br><span class="text-[10px] text-slate-400 uppercase font-bold">${h.tipo}</span></span> <span class="w-28 text-center inline-block py-1 rounded-full text-xs font-bold border ${esAprobada(h.estado) ? (h.estado === "Liberado" ? "bg-blue-50 text-blue-600 border-blue-500" : "bg-emerald-50 text-emerald-600 border-emerald-200") : "bg-rose-50 text-rose-600 border-rose-200"}">${h.estado}</span></li>`,
        )
        .join("");
      if (historialHTML === "")
        historialHTML =
          '<li class="text-sm text-slate-400 italic py-2">No hay historial.</li>';
      if (al.actividad_actual)
        historialHTML += `<li class="text-sm py-3 flex justify-between items-center border-b border-slate-100"><span class="font-semibold text-slate-800">${al.actividad_actual.nombre} <br><span class="text-[10px] text-slate-400 uppercase font-bold">${al.actividad_actual.tipo}</span></span> <span class="w-28 text-center inline-block font-bold text-slate-500 border border-slate-300 py-1 rounded-full bg-slate-50 text-xs">Cursando</span></li>`;

      const content = `
                <div class="mb-5 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                    <div class="grid grid-cols-2 gap-4">
                        <div><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matrícula</p><p class="font-extrabold text-[#1b396a] text-lg">${al.matricula}</p></div>
                        <div><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promedio</p><p class="font-extrabold text-slate-800 text-lg">${al.prom_sin_rep}</p></div>
                        <div class="col-span-2"><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carrera</p><p class="font-semibold text-slate-700">${al.carrera} (Semestre ${al.semestre})</p></div>
                    </div>
                </div>
                <h4 class="font-bold text-[#1b396a] mb-2 text-sm uppercase tracking-wider pl-1">Desglose de Actividades</h4>
                <ul class="bg-white border border-slate-200 px-4 py-1 rounded-2xl shadow-sm">${historialHTML}</ul>
            `;
      showModal(
        `Expediente del Alumno`,
        content,
        `<button onclick="cerrarModal()" class="px-5 py-2.5 bg-[#1b396a] text-white font-bold rounded-xl active:scale-95 transition-all">Cerrar Panel</button>`,
      );
    };

    window.liberarAlumno = function (idAlumno) {
      const al = db.alumnos.find((a) => a.id === idAlumno);
      confirmarAccion(
        "Autorizar Liberación Legal",
        `¿Confirmas que <b>${al.nombre}</b> cumplió satisfactoriamente? Se inyectará el crédito oficial.`,
        "Firmar y Acreditar",
        () => {
          al.liberado = true;
          al.historial_actividades.push({
            id_actividad: "LIB_OFICIAL",
            nombre: "Tutorías - " + activeUser.nombre,
            tipo: "Acreditación Institucional",
            estado: "Liberado",
          });
          guardarDB();
          showToast(`Crédito liberado legalmente.`, "success");
          renderTutorados();
        },
      );
    };

    const renderTutorados = () => {
      const container = document.getElementById("tbody-tutorados");
      container.innerHTML = "";
      const misAlumnos = db.alumnos.filter(
        (a) => a.tutor === activeUser.nombre,
      );

      misAlumnos.forEach((alumno) => {
        const aprobadasAcad = alumno.historial_actividades.filter(
          (a) => esAprobada(a.estado) && a.tipo === "Académica",
        ).length;
        const aprobadasExtra = alumno.historial_actividades.filter(
          (a) => esAprobada(a.estado) && a.tipo === "Extraescolar",
        ).length;
        const elegible =
          aprobadasAcad >= 2 && aprobadasExtra >= 2 && alumno.semestre >= 5;

        let estatusUI = "";
        let btnUI = "";
        if (alumno.liberado) {
          estatusUI =
            '<span class="px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500 text-blue-600 bg-white">LIBERADO</span>';
          btnUI = `<span class="text-[#1b396a] font-bold text-xs uppercase tracking-widest cursor-pointer hover:underline" onclick="verExpediente(${alumno.id})">Ver Expediente</span>`;
        } else if (elegible) {
          estatusUI =
            '<span class="px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500 text-blue-600 bg-white">ESPERANDO FIRMA</span>';
          btnUI = `<span class="text-[#1b396a] font-bold text-xs uppercase tracking-widest mr-4 cursor-pointer hover:underline hidden lg:inline" onclick="verExpediente(${alumno.id})">Expediente</span> <button class="bg-[#1b396a] text-white px-5 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all" onclick="liberarAlumno(${alumno.id})">Autorizar</button>`;
        } else {
          estatusUI =
            '<span class="px-3 py-1 rounded-full text-[10px] font-bold border border-slate-300 text-slate-500 bg-slate-50">EN PROGRESO</span>';
          btnUI = `<span class="text-[#1b396a] font-bold text-xs uppercase tracking-widest cursor-pointer hover:underline" onclick="verExpediente(${alumno.id})">Ver Expediente</span>`;
        }

        container.innerHTML += `
                    <div class="flex flex-col md:grid md:grid-cols-5 md:items-center bg-white border-b border-slate-100 p-4 md:py-5 hover:bg-slate-50 transition-colors gap-3 md:gap-0">
                        <div class="md:text-left"><span class="md:hidden text-[10px] font-bold text-slate-400 uppercase mr-2">Matrícula:</span><span class="font-mono text-sm font-medium text-slate-600">${alumno.matricula}</span></div>
                        <div class="md:text-left"><span class="font-extrabold text-slate-800 text-sm">${alumno.nombre}</span><span class="text-[10px] font-semibold text-slate-400 uppercase ml-1 md:block md:ml-0">${alumno.carrera}</span></div>
                        <div class="md:text-center"><span class="md:hidden text-[10px] font-bold text-slate-400 uppercase mr-2">Nivel:</span><span class="text-slate-800 text-sm font-semibold">Semestre ${alumno.semestre}</span></div>
                        <div class="md:text-center"><span class="md:hidden text-[10px] font-bold text-slate-400 uppercase mr-2">Estatus:</span>${estatusUI}</div>
                        <div class="md:text-right flex items-center justify-between md:justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-t-0">${btnUI}</div>
                    </div>`;
      });
    };
    renderTutorados();

    initChatbot([
      {
        q: "¿Cuándo debo liberar a un alumno?",
        a: "Solo cuando su estatus diga 'ESPERANDO FIRMA', esto garantiza que cumplió reglas de créditos y semestre.",
      },
      {
        q: "¿Qué pasa si un alumno tiene PDFs inválidos?",
        a: "Debes revisarlos manualmente para asegurarte de que tienen membrete y sello antes de autorizar.",
      },
    ]);
  }

  // ==========================================
  // ENCARGADO
  // ==========================================
  if (document.getElementById("page-encargado")) {
    const idAct = activeUser.idActividad;
    const actividad = db.actividades_catalogo.find((a) => a.id === idAct);
    document.getElementById("nombre-act").textContent = actividad.nombre;

    window.evaluarAlumno = function (idAlumno) {
      const selectElem = document.getElementById(`eval-${idAlumno}`);
      const calificacion = selectElem.value;
      if (!calificacion)
        return showToast(
          "Selecciona el nivel de competencia primero.",
          "error",
        );

      const al = db.alumnos.find((a) => a.id === idAlumno);
      confirmarAccion(
        "Confirmar Calificación",
        `¿Asentar <b>"${calificacion}"</b> a ${al.nombre}?`,
        "Asentar",
        () => {
          al.historial_actividades.push({
            id_actividad: al.actividad_actual.id_actividad,
            nombre: al.actividad_actual.nombre,
            tipo: al.actividad_actual.tipo,
            estado: calificacion,
          });
          al.actividad_actual = null;
          guardarDB();
          showToast(`Evaluado correctamente.`, "success");
          renderEvaluacion();
        },
      );
    };

    const renderEvaluacion = () => {
      const container = document.getElementById("tbody-evaluacion");
      container.innerHTML = "";
      const alumnosCursando = db.alumnos.filter(
        (a) => a.actividad_actual && a.actividad_actual.id_actividad === idAct,
      );

      if (alumnosCursando.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 font-medium">No hay alumnos pendientes por evaluar.</div>`;
        return;
      }

      alumnosCursando.forEach((alumno) => {
        container.innerHTML += `
                    <div class="flex flex-col md:grid md:grid-cols-4 md:items-center bg-white border-b border-slate-100 p-4 md:py-5 hover:bg-slate-50 transition-colors gap-4 md:gap-0">
                        <div class="md:col-span-2"><p class="font-extrabold text-slate-800 text-sm md:text-base">${alumno.nombre}</p><p class="text-[11px] text-slate-500 font-mono tracking-wide uppercase">${alumno.matricula} - ${alumno.carrera}</p></div>
                        <div class="md:text-center"><span class="w-32 inline-block text-center bg-slate-100 text-slate-500 py-1.5 rounded-full text-[10px] font-bold border border-slate-200">CURSANDO</span></div>
                        <div class="flex flex-col sm:flex-row gap-2 md:justify-end">
                            <select id="eval-${alumno.id}" class="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:border-[#1b396a] outline-none shadow-sm">
                                <option value="">Seleccionar...</option><option value="Excelente" class="text-emerald-600">Excelente</option><option value="Notable" class="text-blue-600">Notable</option><option value="Suficiente" class="text-slate-700">Suficiente</option><option value="Insuficiente" class="text-rose-600">Insuficiente</option>
                            </select>
                            <button onclick="evaluarAlumno(${alumno.id})" class="w-full sm:w-auto bg-[#1b396a] text-white px-5 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-md">Evaluar</button>
                        </div>
                    </div>`;
      });
    };
    renderEvaluacion();

    initChatbot([
      {
        q: "¿Por qué no me aparecen alumnos para evaluar?",
        a: "Solo aparecen los inscritos formalmente este semestre.",
      },
    ]);
  }

  // ==========================================
  // ADMIN
  // ==========================================
  if (document.getElementById("page-admin")) {
    try {
      let liberados = 0,
        elegibles = 0,
        enRiesgo = 0,
        enProceso = 0;

      db.alumnos.forEach((al) => {
        const aprobadasAcad = al.historial_actividades.filter(
          (a) => esAprobada(a.estado) && a.tipo === "Académica",
        ).length;
        const aprobadasExtra = al.historial_actividades.filter(
          (a) => esAprobada(a.estado) && a.tipo === "Extraescolar",
        ).length;
        if (al.liberado) liberados++;
        else if (aprobadasAcad >= 2 && aprobadasExtra >= 2 && al.semestre >= 5)
          elegibles++;
        else if (
          al.estatus === "BAJA TEMPORAL" ||
          (al.semestre >= 7 && aprobadasAcad + aprobadasExtra < 2)
        )
          enRiesgo++;
        else enProceso++;
      });

      document.getElementById("met-liberados").textContent =
        `${Math.round((liberados / db.alumnos.length) * 100)}%`;
      document.getElementById("met-riesgo").textContent = enRiesgo;
      document.getElementById("met-act").textContent =
        db.actividades_catalogo.length;

      const tbodyRiesgo = document.getElementById("tbody-riesgo");
      db.alumnos
        .filter(
          (al) =>
            al.estatus === "BAJA TEMPORAL" ||
            (al.semestre >= 7 &&
              al.historial_actividades.filter((a) => esAprobada(a.estado))
                .length < 2),
        )
        .forEach((al) => {
          tbodyRiesgo.innerHTML += `
                    <div class="flex justify-between items-center bg-white border-b border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                        <div><p class="font-bold text-slate-800 text-sm">${al.nombre}</p><p class="text-[11px] text-slate-500 font-mono">${al.matricula} - Sem ${al.semestre}</p></div>
                        <span class="w-28 text-center bg-rose-50 text-rose-600 border border-rose-200 py-1 rounded-full text-[10px] font-bold">${al.estatus === "BAJA TEMPORAL" ? "BAJA TEMPORAL" : "REZAGO"}</span>
                    </div>`;
        });

      if (typeof Chart !== "undefined") {
        const ctxEstado = document
          .getElementById("chartEstado")
          .getContext("2d");
        new Chart(ctxEstado, {
          type: "doughnut",
          data: {
            labels: ["Liberados", "Elegibles", "En Proceso", "En Riesgo"],
            datasets: [
              {
                data: [liberados, elegibles, enProceso, enRiesgo],
                backgroundColor: ["#10b981", "#3b82f6", "#cbd5e1", "#f43f5e"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  usePointStyle: true,
                  font: { family: "Montserrat", size: 10 },
                },
              },
            },
            cutout: "75%",
          },
        });
        const ctxDemanda = document
          .getElementById("chartDemanda")
          .getContext("2d");
        const nombresAct = db.actividades_catalogo.map(
          (a) => a.nombre.split(" ")[0] + " " + (a.nombre.split(" ")[1] || ""),
        );
        const demandaAct = db.actividades_catalogo.map((a) =>
          Math.round((a.ocupados / a.cupo_max) * 100),
        );
        new Chart(ctxDemanda, {
          type: "bar",
          data: {
            labels: nombresAct,
            datasets: [
              {
                label: "% Ocupación",
                data: demandaAct,
                backgroundColor: "#1b396a",
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100 } },
            plugins: { legend: { display: false } },
          },
        });
      }
    } catch (e) {}

    initChatbot([
      {
        q: "¿Cómo determina la IA los Alertas de Rezago?",
        a: "Señala a alumnos en Baja Temporal o en 7mo semestre sin el 50% de tutorías acreditadas.",
      },
    ]);
  }
});
