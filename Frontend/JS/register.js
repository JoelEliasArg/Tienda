// register.js - Modificado para usar Cliente
document.addEventListener("DOMContentLoaded", () => {
  // Asegúrate de que el ID del formulario en HTML sea 'registerForm'
  const formRegister = document.getElementById("registerForm"); 
  const API_URL = "http://localhost:3000/clientes";

  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Recoger datos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    
    // Validación básica de campos requeridos
    if (!nombre || !email) {
      alert("Por favor completa el nombre y el correo electrónico.");
      return;
    }

    try {
      // 2. Enviar datos al endpoint de Clientes
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // El payload ahora incluye los campos del modelo Cliente
        body: JSON.stringify({ nombre, email, telefono, direccion }), 
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar el caso de EMAIL YA EXISTENTE (Error 400)
        if (response.status === 400 && data.error && data.error.includes('Validation error')) {
          throw new Error("Este correo electrónico ya está registrado. Por favor, inicia sesión.");
        }
        throw new Error(data.error || "Error al registrar cliente.");
      }

      // 3. Registro exitoso
      alert(`✅ Cliente ${data.nombre} registrado exitosamente. Serás redirigido al login.`);
      window.location.href = "login.html";

    } catch (error) {
      console.error("Error en registro:", error);
      alert("❌ " + error.message);
    }
  });
});