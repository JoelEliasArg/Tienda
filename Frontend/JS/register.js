// register.js
document.addEventListener("DOMContentLoaded", () => {
  const formRegister = document.getElementById("form-register");

  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (!nombre || !correo || !clave) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, clave }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || "Error al registrarse");

      alert("✅ Registro exitoso. Inicia sesión para continuar.");
      window.location.href = "login.html";

    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});
