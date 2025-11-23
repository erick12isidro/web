let expresion = '';
let resultadoMostrado = '';
const pantalla = document.getElementById('pantalla');  // Referencia al elemento HTML donde se muestra la expresión/resultado

//Funcion para actualizar la pantalla

function actualizarPantalla(valor) {
    pantalla.textContent = valor || '0'; // Si el valor es una cadena vacía (''), muestra un '0' por defecto
}

//Funcion para agregar Numeros 
function agregarNumero(numero){
    if(resultadoMostrado) {
        expresion = '';
        resultadoMostrado = false;
}
//Evitar multiples ceros al principio
    if (expresion === '0' && numero === '0') return;

    //Reemplazar el 0 inicial si el usuario ingresa un número distinto de cero
     if (expresion === '0' && numero !== '0') {
         expresion = numero;
     }else{
        expresion += numero; // Concatenar el nuevo número a la expresión
    }
    actualizarPantalla(expresion) // Muestra la expresión actualizada
}

//Funcion limpiar completamente la calculadora (botón 'C')
function Limpiar() {  
    expresion = '';
    resultadoMostrado = false;
    actualizarPantalla('0');  // Muestra '0' en la pantalla limpia
}

//Funcion borrar
function borrar() {
    if (!resultadoMostrado && expresion !==''){  // Solo permite borrar si NO se está mostrando un resultado final.
        expresion = expresion.slice(0, -1);  // Elimina el último carácter de la cadena 'expresion'
        actualizarPantalla(expresion || '0');  // Actualiza la pantalla, mostrando '0' si la expresión queda vacía
    }
}
// Función para agregar operadores (+, -, *, /) a la expresión.
function agregarOperador(operador) {
    if(expresion === '') return; // Evita agregar un operador si la expresión está completamente vacía

    //si hay un resultado mostrado usar ese resultado como inicio
    if(resultadoMostrado) {
        resultadoMostrado = false;
    }

    //Evitar operadores consecutivos
    // Revisa si el último carácter ya es un operador (+, -, *, /, %)
    const ultimoCaracter = expresion[expresion.length - 1];
    if (['+', '-', '*', '/', '%'].includes(ultimoCaracter)) {
        // Si el último es un operador, lo reemplaza por el nuevo (borra el anterior)
        expresion = expresion.slice(0, -1);
    }

    expresion += operador; // Añade el nuevo operador a la expresión
    actualizarPantalla(expresion);  // Muestra la expresión actualizada en la pantalla
}

//Función para agregar deciamles
function agregarDecimal(){
    // Si se acaba de mostrar un resultado, la entrada decimal inicia un '0.'
    if(resultadoMostrado) {
        expresion = '0';
        resultadoMostrado = false;
    }

    //Verificar si ya hay un decimal en el número actual 
    const numeros = expresion.split(/[\+\-\*\/\%]/);
    const numeroActual = numeros[numeros.length - 1];

    // Si el número actual NO incluye un punto decimal ('.')
    if(!numeroActual.includes('.')){
    if (numeroActual === '' || expresion === ''){ // Si el número actual está vacío o es la primera entrada, añade un '0.'
        expresion += '0.';
    } else {
        expresion += '.'; // Si hay un número, simplemente añade el punto
    }

    actualizarPantalla(formatearExpresion(expresion));
    }
    animarBoton(event.target);
}
//Funcion para calcular el resultado
function calcular() {
    if (expresion === '') return  // Si la expresión está vacía, no hace nada

    try {
        let expresionEval = expresion; // Crea una copia de la expresión para modificarla antes de la evaluación
        if(expresionEval.includes('%')){
            expresionEval = expresionEval.replace(/(\d+\.?\d*)%/g, '($1/100)');
        }

        const resultado = eval(expresionEval); // Evalúa la cadena de expresión matemática
        // Formatear resultado
        let resultadoFormateado;
        if(Number.isInteger(resultado)){ // Si el resultado es un entero, lo convierte directamente a cadena
        resultadoFormateado = resultado.toString();
        } else {
            resultadoFormateado = resultado.toFixed(8).replace(/\.?0+$/, ''); // Si tiene decimales, lo fija a 8 posiciones y elimina ceros finales
        }
        // Muestra el resultado final en la pantalla
        actualizarPantalla(resultadoFormateado)
        // Establece la bandera para indicar que se muestra un resultado final.
        resultadoMostrado = true;
    } catch(error) {
        // En caso de error de cálculo (ej: división por cero o sintaxis inválida)
        actualizarPantalla('Error')
        // Limpia la expresión y establece la bandera para iniciar una nueva operación.
        expresion = '';
        resultadoMostrado = true;
    }
}

function formatearExpresion(exp) {
    // Reemplaza el '*' interno (multiplicación) por el '×' visual.
    // Reemplaza el '/' interno (división) por el '÷' visual.
    return exp.replace(/\*/g, '×').replace(/\//g, '÷');
}