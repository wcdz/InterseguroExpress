require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

/**
 * Verifica si una matriz es diagonal.
 * Una matriz es diagonal si todos los elementos fuera de la diagonal principal son ceros.
 * 
 * @param {number[][]} matrix - La matriz a verificar.
 * @returns {boolean} - `true` si la matriz es diagonal, de lo contrario, `false`.
 */
const isDiagonalMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (i !== j && matrix[i][j] !== 0) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Calcula estadísticas básicas de una matriz.
 * Las estadísticas incluyen el valor máximo, el valor mínimo, la suma total, el promedio
 * y si la matriz es diagonal.
 * 
 * @param {number[][]} matrix - La matriz de entrada.
 * @returns {Object} - Un objeto con las estadísticas calculadas:
 *   - `max`: El valor máximo.
 *   - `min`: El valor mínimo.
 *   - `sum`: La suma total de los elementos.
 *   - `average`: El promedio de los elementos.
 *   - `isDiagonal`: `true` si la matriz es diagonal, de lo contrario, `false`.
 */
const calculateMatrixStats = (matrix) => {
    let max = Number.NEGATIVE_INFINITY; // Inicializar con el valor más bajo posible
    let min = Number.POSITIVE_INFINITY; // Inicializar con el valor más alto posible
    let sum = 0; // Inicializar suma en 0
    let count = 0; // Contador de elementos

    for (let row of matrix) {
        for (let value of row) {
            max = Math.max(max, value);
            min = Math.min(min, value);
            sum += value;
            count++;
        }
    }

    const average = sum / count;
    const isDiagonal = isDiagonalMatrix(matrix);

    return { max, min, sum, average, isDiagonal };
};

/**
 * Endpoint principal para procesar matrices.
 * Este endpoint recibe las matrices `Q` y `R` generadas por la API en Go,
 * así como la matriz rotada. Calcula estadísticas para las matrices `Q` y `R`
 * y las devuelve junto con la matriz rotada.
 * 
 * @route POST /analyze
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} req.body - El cuerpo de la solicitud que incluye:
 *   - `rotated`: La matriz rotada enviada desde la API en Go.
 *   - `Q`: La matriz Q generada.
 *   - `R`: La matriz R generada.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Object} - Un JSON con las estadísticas calculadas y las matrices.
 */
app.post('/analyze', (req, res) => {
    const { rotated, Q, R } = req.body;

    if (!Q || !R) {
        return res.status(400).json({ error: "Faltan las matrices Q y/o R en el cuerpo de la solicitud" });
    }

    // Calcular estadísticas para cada matriz
    const statsQ = calculateMatrixStats(Q);
    const statsR = calculateMatrixStats(R);

    // Devolver las estadísticas junto con las matrices al cliente
    res.json({
        RotatedMatrix: rotated, // Matriz rotada recibida de la API en Go
        QStats: statsQ,         // Estadísticas de la matriz Q
        RStats: statsR,         // Estadísticas de la matriz R
        QMatrix: Q,             // Matriz Q
        RMatrix: R              // Matriz R
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express => http://localhost:${PORT}`);
});
