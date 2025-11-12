// login.js
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("loginForm");

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nombre || !email) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    try {
      // 1️⃣ Buscar cliente existente
      const resGet = await fetch(`http://localhost:3000/clientes`);
      const clientes = await resGet.json();
      const clienteExistente = clientes.find(c => c.email === email);

      let cliente;

      if (clienteExistente) {
        // 2️⃣ Si existe, usarlo
        cliente = clienteExistente;
        console.log("Cliente encontrado:", cliente);
      } else {
        // 3️⃣ Si no existe, crearlo
        const resPost = await fetch("http://localhost:3000/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email })
        });

        if (!resPost.ok) throw new Error("Error al crear cliente");

        cliente = await resPost.json();
        console.log("Cliente creado:", cliente);
      }

      // 4️⃣ Guardar en localStorage
      localStorage.setItem("cliente", JSON.stringify(cliente));

      alert(`✅ Bienvenido, ${cliente.nombre}`);
      window.location.href = "dashboard.html"; // redirige a tu página principal

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Ocurrió un error al iniciar sesión: " + error.message);
    }
  });
});
