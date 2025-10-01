const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function procesarTexto() {
  const textoOriginal = document.getElementById("textoOriginal").value.toUpperCase();
  const metodo = document.getElementById("metodoCifrado").value;
  const mostrar = document.getElementById("mostrarProceso").checked;
  const clave = document.getElementById("claveVigenere").value.toUpperCase();

  document.getElementById("claveVigenereInput").style.display = (metodo === "vigenere" || metodo === "playfair") ? "block" : "none";

  let cifrado = "";
  let descifrado = "";
  let proceso = "";

  switch (metodo) {
    case "cesar":
      ({ cifrado, descifrado, proceso } = cifradoCesar(textoOriginal, 3));
      break;
    case "atbash":
      ({ cifrado, descifrado, proceso } = cifradoAtbash(textoOriginal));
      break;
    case "vigenere":
      ({ cifrado, descifrado, proceso } = cifradoVigenere(textoOriginal, clave));
      break;
    case "personalizado":
      ({ cifrado, descifrado, proceso } = cifradoPersonalizado(textoOriginal));
      break;
    case "playfair":
      const resultado = playfairEncrypt(textoOriginal, clave);
      cifrado = resultado.resultado.toUpperCase();
      descifrado = "(no implementado)";
      proceso = resultado.procedimiento;
      break;
    default:
      cifrado = "";
      descifrado = "";
      proceso = "Método no válido";
  }

  document.getElementById("cifrado").innerText = cifrado;
  document.getElementById("descifrado").innerText = descifrado;
  document.getElementById("proceso").innerText = mostrar ? proceso : "";
  document.getElementById("proceso").style.display = mostrar ? "block" : "none";
}


// ---------------------- MÉTODOS DE CIFRADO ----------------------

function cifradoCesar(texto, desplazamiento) {
  let cifrado = "";
  let descifrado = "";
  let proceso = "🔄 Cifrado César (+3)\n";

  for (let letra of texto) {
    if (abecedario.includes(letra)) {
      let nueva = abecedario[(abecedario.indexOf(letra) + desplazamiento) % 26];
      cifrado += nueva;
      proceso += `${letra} → ${nueva}\n`;
    } else {
      cifrado += letra;
      proceso += `${letra} → (sin cambio)\n`;
    }
  }

  proceso += "\n🔓 Descifrado César (-3)\n";
  for (let letra of cifrado) {
    if (abecedario.includes(letra)) {
      let original = abecedario[(abecedario.indexOf(letra) - desplazamiento + 26) % 26];
      descifrado += original;
      proceso += `${letra} → ${original}\n`;
    } else {
      descifrado += letra;
      proceso += `${letra} → (sin cambio)\n`;
    }
  }

  return { cifrado, descifrado, proceso };
}

function cifradoAtbash(texto) {
  let cifrado = "";
  let descifrado = "";
  let proceso = "🔁 Atbash (Inversión alfabética)\n";

  for (let letra of texto) {
    if (abecedario.includes(letra)) {
      let invertida = abecedario[25 - abecedario.indexOf(letra)];
      cifrado += invertida;
      descifrado += letra;
      proceso += `${letra} → ${invertida}\n`;
    } else {
      cifrado += letra;
      descifrado += letra;
      proceso += `${letra} → (sin cambio)\n`;
    }
  }

  return { cifrado, descifrado, proceso };
}

function cifradoVigenere(texto, clave) {
  let cifrado = "";
  let descifrado = "";
  let proceso = "🔤 Vigenère\n";
  if (!clave.match(/^[A-Z]+$/)) {
    return { cifrado: "", descifrado: "", proceso: "⚠️ Clave inválida. Usa solo letras (A-Z)." };
  }

  let claveRepetida = clave.repeat(Math.ceil(texto.length / clave.length));
  let j = 0;

  for (let i = 0; i < texto.length; i++) {
    let letra = texto[i];
    if (abecedario.includes(letra)) {
      let k = abecedario.indexOf(claveRepetida[j]);
      let c = abecedario[(abecedario.indexOf(letra) + k) % 26];
      cifrado += c;
      proceso += `${letra} + ${claveRepetida[j]} → ${c}\n`;
      j++;
    } else {
      cifrado += letra;
      proceso += `${letra} → (sin cambio)\n`;
    }
  }

  // Descifrado
  j = 0;
  proceso += "\n🔓 Descifrado Vigenère\n";
  for (let i = 0; i < cifrado.length; i++) {
    let letra = cifrado[i];
    if (abecedario.includes(letra)) {
      let k = abecedario.indexOf(claveRepetida[j]);
      let d = abecedario[(abecedario.indexOf(letra) - k + 26) % 26];
      descifrado += d;
      proceso += `${letra} - ${claveRepetida[j]} → ${d}\n`;
      j++;
    } else {
      descifrado += letra;
      proceso += `${letra} → (sin cambio)\n`;
    }
  }

  return { cifrado, descifrado, proceso };
}

function cifradoPersonalizado(texto) {
  let proceso = "🔷 Personalizado: +4 y luego invertir\n";
  let desplazado = "";
  let paso1 = "Paso 1 - Desplazamiento +4\n";

  for (let letra of texto) {
    if (abecedario.includes(letra)) {
      let nueva = abecedario[(abecedario.indexOf(letra) + 4) % 26];
      desplazado += nueva;
      paso1 += `${letra} → ${nueva}\n`;
    } else {
      desplazado += letra;
      paso1 += `${letra} → (sin cambio)\n`;
    }
  }

  let paso2 = "\nPaso 2 - Inversión del texto\n";
  let cifrado = desplazado.split("").reverse().join("");
  paso2 += `Texto desplazado: ${desplazado}\n`;
  paso2 += `Texto invertido: ${cifrado}\n`;

  // Descifrado
  let paso3 = "\n🔓 Descifrado\nPaso 1 - Inversión del texto\n";
  let desinvertido = cifrado.split("").reverse().join("");
  paso3 += `Texto cifrado: ${cifrado}\n`;
  paso3 += `Texto reinvertido: ${desinvertido}\n`;

  let descifrado = "";
  let paso4 = "\nPaso 2 - Desplazamiento -4\n";

  for (let letra of desinvertido) {
    if (abecedario.includes(letra)) {
      let original = abecedario[(abecedario.indexOf(letra) - 4 + 26) % 26];
      descifrado += original;
      paso4 += `${letra} → ${original}\n`;
    } else {
      descifrado += letra;
      paso4 += `${letra} → (sin cambio)\n`;
    }
  }

  proceso += paso1 + paso2 + paso3 + paso4;
  return { cifrado, descifrado, proceso };
}


function mostrarResultado(resultado, procedimiento) {
  document.getElementById("resultado").innerText = resultado;
  const procesoDiv = document.getElementById("proceso");
  procesoDiv.innerText = procedimiento;
  procesoDiv.style.display = "block";
}

function playfairEncrypt(texto, clave) {
  const matriz = construirMatrizPlayfair(clave);
  const textoProcesado = prepararTextoPlayfair(texto.toLowerCase());
  let resultado = '';
  let procedimiento = `Texto preparado: ${textoProcesado}\nMatriz:\n`;

  for (let i = 0; i < 5; i++) {
    procedimiento += matriz[i].join(' ') + '\n';
  }

  procedimiento += `\nCifrado de pares:\n`;

  for (let i = 0; i < textoProcesado.length; i += 2) {
    const par = [textoProcesado[i], textoProcesado[i + 1]];
    const [fila1, col1] = buscarPosicion(matriz, par[0]);
    const [fila2, col2] = buscarPosicion(matriz, par[1]);

    let cifradoPar;

    if (fila1 === fila2) {
      cifradoPar = matriz[fila1][(col1 + 1) % 5] + matriz[fila2][(col2 + 1) % 5];
      procedimiento += `${par.join('')} → misma fila → ${cifradoPar}\n`;
    } else if (col1 === col2) {
      cifradoPar = matriz[(fila1 + 1) % 5][col1] + matriz[(fila2 + 1) % 5][col2];
      procedimiento += `${par.join('')} → misma columna → ${cifradoPar}\n`;
    } else {
      cifradoPar = matriz[fila1][col2] + matriz[fila2][col1];
      procedimiento += `${par.join('')} → rectángulo → ${cifradoPar}\n`;
    }

    resultado += cifradoPar;
  }

  return { resultado, procedimiento };
}

function construirMatrizPlayfair(clave) {
  clave = clave.toLowerCase().replace(/[^a-z]/g, '').replace(/j/g, 'i');
  let matriz = [];
  let usado = new Set();
  let alfabeto = 'abcdefghiklmnopqrstuvwxyz'; // sin j

  let combinado = clave + alfabeto;

  for (let letra of combinado) {
    if (!usado.has(letra)) {
      usado.add(letra);
      if (matriz.flat().length % 5 === 0) {
        matriz.push([]);
      }
      matriz[matriz.length - 1].push(letra);
    }
  }

  return matriz;
}

function prepararTextoPlayfair(texto) {
  texto = texto.replace(/[^a-z]/g, '').replace(/j/g, 'i');
  let resultado = '';
  for (let i = 0; i < texto.length; i += 2) {
    let a = texto[i];
    let b = texto[i + 1];
    if (!b) b = 'x';
    if (a === b) {
      resultado += a + 'x';
      i--;
    } else {
      resultado += a + b;
    }
  }
  return resultado;
}

function buscarPosicion(matriz, letra) {
  for (let fila = 0; fila < 5; fila++) {
    const col = matriz[fila].indexOf(letra);
    if (col !== -1) return [fila, col];
  }
  return [-1, -1];
}

document.getElementById("cifrar").addEventListener("click", function () {
  const metodo = document.getElementById("cifrado").value;
  const texto = document.getElementById("mensaje").value;
  const clave = document.getElementById("clave").value;
  let resultado = "", procedimiento = "";

  switch (metodo) {
    case "cesar":
      // ya implementado
      break;
    case "atbash":
      // ya implementado
      break;
    case "vigenere":
      // ya implementado
      break;
    case "personalizado":
      // ya implementado
      break;
    case "playfair":
      const r = playfairEncrypt(texto, clave);
      resultado = r.resultado;
      procedimiento = r.procedimiento;
      break;
    default:
      resultado = "Método no válido";
  }

  mostrarResultado(resultado, procedimiento);
});

function guardarEnBD() {
  const metodo = document.getElementById("metodoCifrado").value;
  const original = document.getElementById("textoOriginal").value;
  const cifrado = document.getElementById("cifrado").innerText;
  const descifrado = document.getElementById("descifrado").innerText;
  const proceso = document.getElementById("proceso").innerText;

  if (!original || !cifrado || !descifrado) {
    alert("⚠️ Primero escribe un texto y elige un método para cifrar.");
    return;
  }

fetch('http://127.0.0.1:5000/guardar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    texto: 'Hola mundo',
    clave: "",  
    metodo: metodo,
    original: original,
    cifrado: cifrado,
    descifrado: descifrado,
    proceso: proceso
  })
})
.then(response => response.json())
.then(data => {
  alert(data.mensaje || '✅ Guardado correctamente');
})
.catch(error => {
  console.error('Error al guardar:', error);
  alert('❌ Hubo un error al guardar en la base de datos.');
});
}
