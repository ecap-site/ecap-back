/*===========================================Requires===============================================================*/
import express from 'express' //Módulo criador de rotas
const app = express() //Inicia-se a instância do Express()
 
import cors from 'cors'


const port = 8087 //Porta onde fica hospedado o localhost

import { createUser, log, isAdm, findCourses, userRegModel} from './src/db/db.mjs'
import { createCourse } from "./classroom/index.mjs"


var Created = null

/*===========================================Requires===============================================================*/

/*===========================================Middlewares============================================================*/

//middlewares, connect all the things together
app.use(express.urlencoded({ extended: true })); //Url codificado se for extendido.

app.use(express.json()); 

app.use(cors())

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

app.post('/createCourse',(req,res)=>{

  createCourse(req.body).then(()=>{
    //MANDAR UMA MENSAGEM PARA O REACT INDICANDO CRIAÇÃO DO CURSO.
    Created = true
  }).catch(() =>{
    Created = false
  })
   //NAO ESTA FUNCIONANDO, MAS EU VOU TENTAR FAZER FUNCIONAR (งツ)ว
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
app.listen(port, () => {
  console.log(`Servidor de testes rodando em: http://localhost:${port}`);
});
