import React from "react";
import { useState, useEffect } from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

import "./userForm.css";
import moment, { now } from "moment";

function UserForm() {
  //fetching and updating public holiday array state from publicHoliday.json file
  const [publicHoliday, setPublicHoliday] = useState([]);

  //state for user input dates
  const [userInputDate, setUserInputDate] = useState({
    startDate: "",
    endDate: "",
  });
  //state to manage/calculate total no of allowed holidays
  const [totalHolidays, setTotalHolidays] = useState(0);

  const start = new Date(userInputDate.startDate);
  const end = new Date(userInputDate.endDate);

  //check if the dates are in chronological order(end date is later than start date)
  const isChronological = (startDate, endDate) => {
    return startDate > endDate;
  };
  // check if max number of holiday allowed is within limit
  const isAllowedHoliday = (noOfDays) => {
    return noOfDays >= 50;
  };
  //check if the requested holiday dates fall in same annual year
  const isSameAnnualYear = (startDate, endDate) => {
    return (
      moment(startDate).format("MM-DD") < "03-31" &&
      moment(endDate).format("MM-DD") > "03-31"
    );
  };

  //fetch data and assign to state for usage
  useEffect(() => {
    fetch("/publicHoliday.json")
      .then((resp) => resp.json())
      .then((data) => setPublicHoliday(data));
  }, []);

  //total days excluding holiday and sunday
  const getTotalHolidays = (startDate, endDate) => {
    let loop = new Date(startDate);
    let newEndDate = new Date(endDate);
    let totalDays = 0;

    while (loop <= newEndDate) {
      //if not sunday and not holiday then count total days. Here, 0 = Sunday
      if (!isSunday(loop) && !isHoliday(loop)) {
        totalDays += 1;
      }
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }

    return totalDays;
  };

  //check if day is sunday
  const isSunday = (sourceDate) => {
    return moment(sourceDate).weekday() === 0;
  };

  //check if input is same as holiday date
  const isHoliday = (inputDate) => {
    let holidayCheck = false;
    // console.log("input Date: ", moment(inputDate).format("LL"));
    publicHoliday.forEach((holiday) => {
      if (
        moment(new Date(holiday)).format("LL") ===
        moment(inputDate).format("LL")
      ) {
        holidayCheck = true;
      }
    });
    return holidayCheck;
  };

  //handel input values from user
  const handleInput = (e) => {
    e.preventDefault();
    setUserInputDate((input) => ({
      ...userInputDate,
      [e.target.name]: e.target.value,
    }));
  };

  //handle Submit click
  function handleSubmit() {
    if (isChronological(start, end)) {
      alert(
        "End date cannot be later than start date, please check input dates!!!"
      );
    }
    if (isAllowedHoliday(totalHolidays)) {
      alert(
        "the total number of holiday exceeds allowed Holiday quota, please check you dates !!!"
      );
    }
    if (isSameAnnualYear(userInputDate.startDate, userInputDate.endDate)) {
      alert(
        "Holiday can only be taken with same annual year, please check your dates!!!"
      );
    }

    //setting total holiday number
    setTotalHolidays(
      getTotalHolidays(userInputDate.startDate, userInputDate.endDate)
    );
  }

  return (
    <>
      <p className="para">Holiday Planner</p>
      <div className="container">
        <div>
          <label className="label">Start Date</label>
          <Input
            name="startDate"
            value={userInputDate.startDate}
            className="input"
            type="date"
            onChange={handleInput}
          />
        </div>
        <div>
          <label className="label">End Date</label>
          <Input
            name="endDate"
            value={userInputDate.endDate}
            className="input"
            type="date"
            onChange={handleInput}
          />
        </div>
        <br />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!userInputDate.startDate || !userInputDate.endDate}
        >
          SUBMIT
        </Button>
      </div>
      <div> Your total no of usable holiday is : {totalHolidays} days</div>
    </>
  );
}

export default UserForm;
