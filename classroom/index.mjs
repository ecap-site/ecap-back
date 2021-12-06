import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import { json } from 'express';
import { storeCourse } from '../src/db/db.mjs';
import { auth } from 'googleapis-common/node_modules/google-auth-library/build/src/index.js';




// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses', 'https://www.googleapis.com/auth/classroom.profile.emails', 'https://www.googleapis.com/auth/classroom.profile.photos', 'https://www.googleapis.com/auth/classroom.rosters', 'https://www.googleapis.com/auth/classroom.rosters.readonly',];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './classroom/token.json';

// Load client secrets from a local file.
fs.readFile('./classroom/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), listCourses);
});


function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}


function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


/*===========================================================================================================*/
//List courses

export async function listCourses(auth) {
  
  function call(){
    listCourses(auth)
  }
  
  setInterval(call,86400000)
  
  const classroom = google.classroom({ version: 'v1', auth });
  google.options({ auth: auth });

  await classroom.courses.list({
    pageSize: 99,
    courseStates: "ACTIVE"
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const courses = res.data.courses;
    if (courses && courses.length) {
      courses.forEach((course) => {
        let nome = course.name
        let idC = course.id
        let desc = course.description
        let enroll = course.alternateLink + '?cjc=' +course.enrollmentCode
        let students =  istStudents(idC).then((results) =>{

          let curso = {
            title: nome,
            id: idC,
            students: JSON.parse(results),
            description: desc,
            enrollmentCode: enroll,
          }
          storeCourse(curso)
        }).catch(e => {throw e})
        

        
        
        
        
      });

    } else {
      console.log('No courses found.');
    }


    /*===========================================================================================================*/
    //List students
    async function istStudents(x) {

      const resStudents = await classroom.courses.students.list({
        // Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
        courseId: x,
        // Maximum number of items to return. The default is 30 if unspecified or `0`. The server may return fewer than the specified number of results.
        pageSize: 999,
        // nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
        pageToken: '',
      });
      let data = resStudents.data;
      let studentsListed = JSON.stringify(data) 
      return studentsListed
    }
    
  });

}



/*===========================================================================================================*/
//create courses on classroom and Mongo

export async function createCourse(course){
fs.readFile('./classroom/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), realizeCourse);
});

var courseInfo = course
async function realizeCourse(auth, courseInfo){
  const classroom = google.classroom({ version: 'v1', auth });
  google.options({ auth: auth }); 

  await classroom.courses.create({
       requestBody: {
        //   "alternateLink": "my_alternateLink",
        //   "calendarId": "my_calendarId",
        //   "courseGroupEmail": "my_courseGroupEmail",
        //   "courseMaterialSets": [],
        courseState: "active",
        //   "creationTime": "my_creationTime",
        description : course.description,
        //   "descriptionHeading": "my_descriptionHeading",
        //   "enrollmentCode": "my_enrollmentCode",
        //   "guardiansEnabled": false,
        //   "id": "my_id",
        name: course.name,
        ownerId: "ecapacitacao.fic.araquari@ifc.edu.br",
        //   "room": "my_room",
        section: course.section,
        //   "teacherFolder": {},
        //   "teacherGroupEmail": "my_teacherGroupEmail",
        //   "updateTime": "my_updateTime"
        }
        
      }).then(res => {
        console.log(res.data)
        if(course.type == false){
          storeCourse(course)
          listCourses(auth)
        }
        else{
        listCourses(auth)
      }
      }).catch(e => {throw e})

}
}


/*===========================================================================================================*/
//Export everything


