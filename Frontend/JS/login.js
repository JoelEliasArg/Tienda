// login.js
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (!correo || !clave) {
      alert("Por favor, llena todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || "Error al iniciar sesión");

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      alert("✅ Bienvenido, " + data.usuario.nombre);
      window.location.href = "dashboard.html";

    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});
