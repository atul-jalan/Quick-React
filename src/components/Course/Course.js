import React from 'react';
import "rbx/index.css";
import {Button} from "rbx";
import firebase from "firebase/app"
import "firebase/database";
import "firebase/auth";
import timeConflict from "./time.js"

const firebaseConfig = {
    apiKey: "AIzaSyC92ibMYKmZdyz7m_HLbpcDGaEwm5aXw_s",
    authDomain: "scheduler-df880.firebaseapp.com",
    databaseURL: "https://scheduler-df880.firebaseio.com",
    projectId: "scheduler-df880",
    storageBucket: "scheduler-df880.appspot.com",
    messagingSenderId: "808753340706",
    appId: "1:808753340706:web:09dc1bb3d17b069445857b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();
const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const Course = ({ course, state, user }) => (
    <Button color={ buttonColor(state.selected.includes(course)) }
      onClick={ () => state.toggle(course) }
      onDoubleClick={ user ? () => moveCourse(course) : null }
      disabled={ hasConflict(course, state.selected) }
      >
      { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
    </Button>
);

const timeParts = meets => {
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
      days,
      hours: {
        start: hh1 * 60 + mm1 * 1,
        end: hh2 * 60 + mm2 * 1
      }
    };
};

const moveCourse = course => {
    const meets = prompt('Enter new meeting data, in this format:', course.meets);
    if (!meets) return;
    const {days} = timeParts(meets);
    if (days) saveCourse(course, meets); 
    else moveCourse(course);
};

const saveCourse = (course, meets) => {
    db.child('courses').child(course.id).update({meets})
      .catch(error => alert(error));
};

const buttonColor = selected => (
    selected ? 'success' : null
)

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};


const hasConflict = (course, selected) => (
    selected.some(selection => course !== selection && courseConflict(course, selection))
);
const getCourseNumber = course => (
    course.id.slice(1, 4)
)

  const courseConflict = (course1, course2) => (
    course1 !== course2
    && getCourseTerm(course1) === getCourseTerm(course2)
    && timeConflict(course1, course2)
);


const getCourseTerm = course => (
    terms[course.id.charAt(0)]
  );



export default Course