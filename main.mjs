/*===========================================Requires===============================================================*/
import express from 'express' //Módulo criador de rotas
const app = express() //Inicia-se a instância do Express()
 
import cors from 'cors'


const port = 8087 //Porta onde fica hospedado o localhost

import { createUser, log, isAdm, findCourses, getCourseX} from './src/db/db.mjs'
import { createCourse } from "./classroom/index.mjs"


var Created = null

/*===========================================Requires===============================================================*/

/*===========================================Middlewares============================================================*/

//middlewares, connect all the things together
app.use(express.urlencoded({ extended: true })); //Url codificado se for extendido.

app.use(express.json()); 

app.use(cors())

//allow cors for all origins
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/*===========================================Middlewares============================================================*/

/*===========================================adm router============================================================*/

app.get('/cursos', (req, res) => {

  var cursos = findCourses().then(res => {
    console.log(res)
    send(res)
  }).catch(e => { throw e })

  function send(x){
    res.send(x)
  }
})

//Rota para retornar apenas 1 curso
app.get('/infoCourse/:id', (req, res) => {
  console.log("we received your request and we're working on it")
  var id = req.params
  console.log(id.id)
  var curso = getCourseX(id.id).then(res => {
    sendInfo(res)
  }).catch(e => { throw e })
  function sendInfo(x){
    res.send(x)
  }
})


app.post('/createCourse',(req,res)=>{

  createCourse(req.body).then(()=>{
    res.send({status:200})
  })

})

app.get('/msg', (req, res)=>{
  if(Created == true){
  res.send("Curso criado!")
  }else if(Created == null){
    res.send("Até o momento, o curso parece não ter sido criado. Verifique no classroom")
  }else{
    res.send("Curso não criado!")
  }
})


/*===========================================adm router============================================================*/

/*===========================================auth Controllers======================================================*/


/*===========================================auth Controllers======================================================*/



/*===========================================Miscellaneous=========================================================*/

//A escuta do site se dá em 8087, porta definida nos requires
//este deve ser o último pedaço do código, tudo escrito depois não é 'ouvido' pelo site
app.listen(process.env.PORT || port, () => {
  console.log(`Servidor de testes rodando em: http://localhost:${port}`);
});
