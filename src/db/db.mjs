import mongoose from 'mongoose';
import { listCourses } from '../../classroom/index.mjs';
mongoose.Promise = global.Promise

mongoose.connect('mongodb+srv://ecap:RFzvyusK3w44QxSR@ecap.fkrml.mongodb.net/ecap?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected')
});
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
const user = mongoose.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true },
    passwordResetToken:{ type: String , select: false},
    passwordResetExpires:{type: Date, select: false},
    Usrname: { type: String, require: true},
    isStudent:{type: Boolean, require: true, default: true},
    coursePermissions:{type: Array, require: true, default: []},
    date: {type: Date, default: Date.now}
})

export const userRegModel = mongoose.model('User', user)

const course = mongoose.Schema({
    title: {type: String, require: true},
    id: {type: Number, require: true},
    students: {type: Object, require: true},
    desc:{type:String, require: false},
    isPublic: {type: Boolean, require:true, default: true},
    inviteLink: {type: String, require:true}
})

const courseModel = mongoose.model('Course', course)
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/

export async function storeCourse(x){

    const query = { title: x.title, id: x.id}
    const find = courseModel.find(query).exec()

    if ((await find).length > 0) {
        console.log('Curso já está armazenado')
        return 
    } else {

        let crs = new courseModel({ title: x.title, id: x.id, students: x.students, link: x.link, isPublic: x.type, desc: x.description, inviteLink: x.enrollmentCode })

        crs.save().then(() => {
            
        console.log(`Salvo, ${crs}`)
    
        }).catch(e => console.log(e))
        
        
    }


}

/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
export async function createUser(x) {

    const query = { email: x.email }
    const find = userRegModel.find(query).exec()

    if ((await find).length >0) {
        console.log('we cant put two equal people here!')
        return false   
    } else {

        let usr = new userRegModel({ email: x.email, password: x.password, Usrname: x.Usrname})

        usr.save().then(() => {
            
        console.log(`Salvo, ${usr}`)
        return true
    
        }).catch(e => console.log(e))
        
        
    }
}

export async function log(x) {

    const query = { email: x.email, password: x.password}
    const find = userRegModel.find(query).exec()

    if ((await find).length === 1) {
        console.log("Enter, you're a homie here!")
        return true
    } else {
        console.log(`Try to make your register first, fool!`)
        return false
    }

}

export async function isAdm(x) {

    const query = { email: x.email}
    const find = userRegModel.find({query, "isStudent": false}).exec()

    if ((await find).length === 1) {
        console.log("Enter, you're a homie here!")
        return true
    } else {
        console.log(`Try to make your register first, fool!`)
        return false
    }

}
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/
/*===============================================================================================================================================================*/

export async function findCourses(){

   var coursesCreated = await courseModel.find() //encontra todos os cursos

   return coursesCreated
}
