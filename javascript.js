const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos MongoDB
mongoose.connect("mongodb://localhost/encuestas", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir un modelo de datos para las respuestas de la encuesta
const respuestaSchema = new mongoose.Schema({
  full_name: String,
  phone_number: String,
  start_date: Date,
  preferred_language: String,
  how_found: String,
  newsletter_subscription: Boolean,
});

const Respuesta = mongoose.model("Respuesta", respuestaSchema);

// Configurar middleware para analizar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar ruta para manejar las solicitudes POST desde el formulario
app.post("/enviar-respuesta", (req, res) => {
  const respuestaData = req.body; // Datos de la respuesta desde el formulario

  // Crea una nueva instancia de Respuesta y guárdala en la base de datos
  const nuevaRespuesta = new Respuesta(respuestaData);

  nuevaRespuesta.save((err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send("Error al guardar la respuesta en la base de datos.");
    } else {
      res.status(200).send("Respuesta guardada con éxito en la base de datos.");
    }
  });
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
