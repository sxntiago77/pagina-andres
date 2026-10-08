
const pruebas = {
  1: [
    ["ciudad es un texto no vacío", "typeof ciudad === 'string' && ciudad.length > 0"],
    ["puntos vale 15", "puntos === 15"]
  ],
  2: [
    ["total vale 36", "total === 36"],
    ["mensaje es exactamente \"Total: 36\"", "mensaje === 'Total: 36'"],
    ["usas una plantilla con ${}", "/`[^`]*\\$\\{/.test(codigo)"]
  ],
  3: [
    ["ropa vale \"ligera\" con 31 grados", "ropa === 'ligera'"],
    ["usas if y else", "/if\\s*\\(/.test(codigo) && /else/.test(codigo)"]
  ],
  4: [
    ["suma vale 55", "suma === 55"],
    ["usas for o while", "/\\b(for|while)\\b/.test(codigo)"]
  ],
  5: [
    ["doble(4) devuelve 8", "doble(4) === 8"],
    ["doble(-3) devuelve -6", "doble(-3) === -6"],
    ["esPar(10) devuelve true", "esPar(10) === true"],
    ["esPar(7) devuelve false", "esPar(7) === false"]
  ],
  6: [
    ["cuadrados es [1, 4, 9, 16]", "JSON.stringify(cuadrados) === '[1,4,9,16]'"],
    ["usas map", "/\\.map\\(/.test(codigo)"]
  ],
  7: [
    ["mascota.nombre es texto", "typeof mascota.nombre === 'string'"],
    ["mascota.edad es número", "typeof mascota.edad === 'number'"],
    ["mascota.hablar() devuelve texto", "typeof mascota.hablar === 'function' && typeof mascota.hablar() === 'string'"]
  ],
  8: [
    ["el recuadro dice \"¡Hola DOM!\"", "document.getElementById('tablero').textContent === '¡Hola DOM!'"]
  ]
};

const TOTAL = 8; 


let correctos = [];


try {
  correctos = JSON.parse(localStorage.getItem("progresoJS")) || [];
} catch (error) {
  correctos = [];
}

function guardarProgreso() {
  try {
    localStorage.setItem("progresoJS", JSON.stringify(correctos));
  } catch (error) {
    
  }
}

function actualizarProgreso() {
 
  for (let n = 1; n <= TOTAL; n++) {
    if (correctos.includes(n)) {
      document.getElementById("nav" + n).classList.add("done");
    }
  }
  document.getElementById("textoProgreso").textContent =
    correctos.length + " de " + TOTAL + " ejercicios completados";
  document.getElementById("barra").style.width =
    (correctos.length / TOTAL * 100) + "%";
}


function aTexto(cosa) {
  if (typeof cosa === "object" && cosa !== null) {
    return JSON.stringify(cosa);
  }
  return String(cosa);
}


function correr(codigo) {
  let texto = "";
  let hayError = false;

 
  let consoleOriginal = console.log;

  
  console.log = function (...cosas) {
    texto = texto + cosas.map(aTexto).join(" ") + "\n";
  };

 
  try {
    eval(codigo);
  } catch (error) {
    texto = texto + "Error: " + error.message;
    hayError = true;
  }

  console.log = consoleOriginal;

  return { texto: texto, hayError: hayError };
}


function probar(codigo, condicion) {
  try {
    return Boolean(eval(codigo + "\n;" + condicion));
  } catch (error) {
    return false;
  }
}


function correrEjemplo(numero) {
  let codigo = document.getElementById("ejemplo" + numero).value;
  document.getElementById("salida" + numero).textContent = correr(codigo).texto;
}


function correrEjercicio(numero) {
  
  if (numero === 8) {
    document.getElementById("tablero").textContent = "Recuadro vacío";
  }

  let codigo = document.getElementById("ejercicio" + numero).value;
  let resultado = correr(codigo);
  document.getElementById("salidaEj" + numero).textContent = resultado.texto;
  return resultado;
}


function comprobar(numero) {
  let codigo = document.getElementById("ejercicio" + numero).value;
  let resultado = correrEjercicio(numero);
  let lista = document.getElementById("pruebas" + numero);
  let mensaje = document.getElementById("mensaje" + numero);

  lista.innerHTML = "";
  let aprobadas = 0;


  for (let prueba of pruebas[numero]) {
    let texto = prueba[0];
    let condicion = prueba[1];

    if (!resultado.hayError && probar(codigo, condicion)) {
      aprobadas++;
      lista.innerHTML += "<li class='ok'>✓ " + texto + "</li>";
    } else {
      lista.innerHTML += "<li class='no'>✗ " + texto + "</li>";
    }
  }

  if (aprobadas === pruebas[numero].length) {
    mensaje.textContent = "¡Correcto! Ejercicio completado.";
    mensaje.className = "mensaje ok";

  
    if (!correctos.includes(numero)) {
      correctos.push(numero);
      guardarProgreso();
      actualizarProgreso();
    }
  } else if (resultado.hayError) {
    mensaje.textContent = "Hay un error en tu código. Revisa el mensaje de arriba.";
    mensaje.className = "mensaje";
  } else {
    mensaje.textContent = "Casi. Revisa las condiciones marcadas con ✗.";
    mensaje.className = "mensaje";
  }
}


function restablecer(tipo, numero) {
  let cuadro = document.getElementById(tipo + numero);
  cuadro.value = cuadro.defaultValue;

  if (tipo === "ejemplo") {
    document.getElementById("salida" + numero).textContent = "";
    if (numero === 8) {
      document.getElementById("lienzo").textContent = "";
    }
  } else {
    document.getElementById("salidaEj" + numero).textContent = "";
    document.getElementById("pruebas" + numero).innerHTML = "";
    document.getElementById("mensaje" + numero).textContent = "";
    if (numero === 8) {
      document.getElementById("tablero").textContent = "Recuadro vacío";
    }
  }
}


document.querySelectorAll("textarea").forEach(function (cuadro) {
  cuadro.addEventListener("keydown", function (evento) {
    if (evento.key === "Tab") {
      evento.preventDefault();
      cuadro.setRangeText("  ", cuadro.selectionStart, cuadro.selectionEnd, "end");
    }
  });
});


actualizarProgreso();