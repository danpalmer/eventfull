/*
 * Time calculation:
 * 2012.04.13 00:00 - 2012.04.15 23:59
 * 1. timeDiffInMinute: calculate minutes difference(4319mins = 2*24*60+23*60+59)
 * 2. ll: calculate timeDiffInMinute/1000 => 4.319
 * 3. timelineTimeDiffInMinute = ll*slideValue (5000)
 * 
 * 4. timelineAddToMinutes(20) = timelineTimeDiffInMinute%60 (5000%60 = 20mins)
 * 		timelineTotalHours = Math.floor(timelineTimeDiffInMinute/60) (1000/60=83hours) (5000minutes = 83h20m)
 * 5. timelineAddToHour(11) = timelineTotalHours%24 () (83h%24=11h)
 * 6. timelineAddToDay(3) = Math.floor(timelineTotalHours/24); (83h/24=3days) (5000m = 3d11h20m)
 * 
 * 7. 13+3 = 16; 00+11 = 11; 00+20 = 20
 * 8. 2012.04.16 11:20
 * 
 */


function changeBackground(){
//	make variables to get the values from the slicder
	var sliderValue = parseInt(document.getElementById('slider').value);
	var maxOfSlice = 1000;

	var eventName = "London Real Time";
	var startTime = "April 13th";
	var endTime = "April 15th";

	var startTimeFormat = 201204130000;// may use other format
	var endTimeFormat = 201204152359;

//	Calculate endTime-startTime
	var twoTimeDiff = endTimeFormat - startTimeFormat;//22359 => 2 days, 23 hours, 59 mins

	var timeDiffInMinutes = 4319;//Equation need to be done when I am not sleepy.
	var ll = timeDiffInMinutes/1000;// 4.319
	var timelineTimeDiffInMinute = ll*sliderValue;// eg 5000
	var timelineAddToMinutes = Math.floor(timelineTimeDiffInMinute%60);//71
	var timelineTotalHours = Math.floor(timelineTimeDiffInMinute/60);//71
	var timelineAddToHour = timelineTotalHours%24;
	var timelineAddToDay = Math.floor(timelineTotalHours/24);

	var newYear = 2012;
	var newMonth = 04;
	var newDay = timelineAddToDay + 13;
	var newHour = timelineAddToHour + 0;
	var newMinute = timelineAddToMinutes + 0;

	var newTime = newYear+"."+newMonth+"."+newDay+"."+newHour+":"+newMinute;
//	return right current time on timeline


////	var numberOfDays = Math.floor(timeDiffInSecond/10000);
//	var numberOfDays = 2;

//	var numberOfHours = 23;

//	var numberOfMinutes = 59;

//	var timeDiffInMinutes = numberOfDays*24*60+numberOfHours*60+numberOfMinutes;

////	return time in timeline
//	var ll = timeDiffInMinutes/maxOfSlice;

//	var addTimeInMinutes = 500*ll;

//	var addNumberOfHours = Math.floor(addTimeInMinutes/60);
//	var addNumberOfMinutes60 = addTimeInMinutes%60

//	var addNumberOfHours24 = Math.floor(addNumberOfHours)

	document.getElementById('timeline_date').innerHTML = newTime;

	return newTime;
}// end of function