import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [userType, setUserType] = useState("");
  const [teacherAvailability, setTeacherAvailability] = useState([]);
  const [bookedClasses, setBookedClasses] = useState([]);
  const [teacherCredentials, setTeacherCredentials] = useState({
    username: "",
    password: ""
  });
  const [studentCredentials, setStudentCredentials] = useState({
    username: "",
    password: ""
  });
  const [loginError, setLoginError] = useState(false);

  const handleTeacherLogin = () => {
    setUserType("teacher");
    setLoginError(false);
  };

  const handleStudentLogin = () => {
    setUserType("student");
    setLoginError(false);
  };

  const handleTeacherSelect = ({ start, end }) => {
    if (userType === "teacher") {
      const availability = {
        start,
        end,
        title: "Teacher Availability"
      };
      setTeacherAvailability([...teacherAvailability, availability]);
    } else {
      alert("You are not authorized to set availability.");
    }
  };

  const handleStudentSelect = ({ start }) => {
    if (userType === "student") {
      const selectedAvailability = teacherAvailability.find(
        (availability) =>
          moment(start).isBetween(
            moment(availability.start),
            moment(availability.end),
            "minutes",
            "[]"
          )
      );
      if (selectedAvailability) {
        const bookedClass = {
          start: selectedAvailability.start,
          end: selectedAvailability.end,
          title: "Booked Class"
        };
        setBookedClasses([...bookedClasses, bookedClass]);
        alert("Class booked successfully!");
      } else {
        alert("The selected time slot is not available.");
      }
    } else {
      alert("You are not authorized to book classes.");
    }
  };

  const handleTeacherCredentialsChange = (e) => {
    setTeacherCredentials({
      ...teacherCredentials,
      [e.target.name]: e.target.value
    });
  };

  const handleStudentCredentialsChange = (e) => {
    setStudentCredentials({
      ...studentCredentials,
      [e.target.name]: e.target.value
    });
  };

  const handleTeacherLoginSubmit = (e) => {
    e.preventDefault();
    if (
      teacherCredentials.username === "teacher" &&
      teacherCredentials.password === "teacher123"
    ) {
      handleTeacherLogin();
    } else {
      setLoginError(true);
    }
  };

  const handleStudentLoginSubmit = (e) => {
    e.preventDefault();
    if (
      studentCredentials.username === "student" &&
      studentCredentials.password === "student123"
    ) {
      handleStudentLogin();
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="app">
      {userType === "" ? (
        <div className="login">
          <h2>Login</h2>
          <form onSubmit={handleTeacherLoginSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Teacher Username"
              value={teacherCredentials.username}
              onChange={handleTeacherCredentialsChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Teacher Password"
              value={teacherCredentials.password}
              onChange={handleTeacherCredentialsChange}
            />
            <button type="submit">Teacher Login</button>
          </form>
          <form onSubmit={handleStudentLoginSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Student Username"
              value={studentCredentials.username}
              onChange={handleStudentCredentialsChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Student Password"
              value={studentCredentials.password}
              onChange={handleStudentCredentialsChange}
            />
            <button type="submit">Student Login</button>
          </form>
          {loginError && <p className="error">Invalid username or password</p>}
        </div>
      ) : (
        <div className="calendar">
          <h2>{userType === "teacher" ? "Teacher" : "Student"} Calendar</h2>
          {userType === "teacher" && (
            <Calendar
              localizer={localizer}
              events={teacherAvailability}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleTeacherSelect}
              style={{ height: "500px" }}
            />
          )}
          {userType === "student" && (
            <Calendar
              localizer={localizer}
              events={teacherAvailability.concat(bookedClasses)}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleStudentSelect}
              style={{ height: "500px" }}
            />
          )}
          <button onClick={() => setUserType("")} className="logout">Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
