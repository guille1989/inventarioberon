const express  = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const mongose = require('mongoose')

//Importamos Rutas
const AuthenticationUser = require('./routes/authentication');
const NewUserRegistration = require('./routes/new_user');
const NewMateriaPrima = require('./routes/materiaPrima/materiaPrimaCrudes');
//Validar si MT existe
const MtValidationNew = require('./routes/materiaPrima/materiaPrimaValidarSiExiste');
const GraficasMateriaPrima = require('./routes/materiaPrima/materiaPrimaGrafica');

//Receteas
const LeerMateriaPrima = require('./routes/recetas/leermateriaprima');

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(bodyParser.json());

//Conexion con base de datos
mongose.connect('mongodb+srv://root:123@cluster0.jwxt0.mongodb.net/inventarios_beron?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado con DB'))
    .catch(() => console.log('No se puedo conectar con DB'))

mongose.set('strictQuery', true);

//Ajustamos Rutas
app.use('/api/auth', AuthenticationUser);
app.use('/api/newuser', NewUserRegistration);
app.use('/api/newmp', NewMateriaPrima);
app.use('/api/mpvalidate', MtValidationNew)
app.use('/api/mpgraficas', GraficasMateriaPrima)
app.use('/api/leermp', LeerMateriaPrima);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server por puerto ${port}`)
})