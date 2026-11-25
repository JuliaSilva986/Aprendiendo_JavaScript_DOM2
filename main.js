const password = document.getElementById("password");
const longitud = document.getElementById("longitud");
const valorLongitud = document.getElementById("valorLongitud");
const mensaje = document.getElementById("mensaje");

const caracteres = {
    mayus: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    minus: "abcdefghijklmnopqrstuvwxyz",
    numeros: "0123456789",
    simbolos: "!@#$%&*?"
};

function indiceAleatorio(max) {
    const valores = new Uint32Array(1);
    const limite = Math.floor(4294967296 / max) * max;

    do {
        crypto.getRandomValues(valores);
    } while (valores[0] >= limite);

    return valores[0] % max;
}

// Generar contraseña
function generarPassword() {
    const opciones = document.querySelectorAll(
        'input[name="tipo"]:checked'
    );

    let grupos = [];

    opciones.forEach(opcion => {
        grupos.push(caracteres[opcion.value]);
    });

    if (grupos.length === 0) {
        mensaje.textContent = "Selecciona alguna opción.";
        password.value = "";
        return;
    }

    let clave = [];

    // Incluir un carácter de cada tipo seleccionado
    grupos.forEach(grupo => {
        clave.push(grupo[indiceAleatorio(grupo.length)]);
    });

    const todos = grupos.join("");

    while (clave.length < Number(longitud.value)) {
        clave.push(todos[indiceAleatorio(todos.length)]);
    }

    // Mezclar los caracteres
    for (let i = clave.length - 1; i > 0; i--) {
        let j = indiceAleatorio(i + 1);
        [clave[i], clave[j]] = [clave[j], clave[i]];
    }

    password.value = clave.join("");
    mensaje.textContent = "Contraseña generada.";
}

// Actualizar longitud
longitud.addEventListener("input", () => {
    valorLongitud.textContent = longitud.value;
});

// Botón generar
document.getElementById("generar")
    .addEventListener("click", generarPassword);

// Botón copiar
document.getElementById("copiar")
    .addEventListener("click", async () => {
        if (!password.value) return;

        try {
            await navigator.clipboard.writeText(password.value);
            mensaje.textContent = "Contraseña copiada.";
        } catch {
            mensaje.textContent = "No se pudo copiar.";
        }
    });

generarPassword();