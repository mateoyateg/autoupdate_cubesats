/*
Function: PrefixChar()
Description:
Returns:
History:
20040217 1219UTC	v1	Andrew Urquhart		Created
*/
function PrefixChar(strValue, strCharPrefix, intLength) {
	var intStrValue_length = String(strValue).length;
	if (intStrValue_length < intLength) {
		for (var intI=0; intI<(intLength-intStrValue_length); ++intI) {
			strValue = strCharPrefix + strValue;
		}
	}
	return strValue;
}

/*
Function: GetTimezoneString()
Description:
Returns:
History:
20040217 1219UTC	v1	Andrew Urquhart		Created
*/
function GetTimezoneString(objInputDate, blnJsDateCompat) {
	var objDate = new Date(objInputDate);

	var intDateTZ				= objDate.getTimezoneOffset();
	var strDateTZ_sign			= (intDateTZ > 0 ? "-" : "+")
	var intDateTZ_hours			= Math.floor(Math.abs(intDateTZ) / 60);
	var intDateTZ_minutes		= Math.abs(intDateTZ_hours - (Math.abs(intDateTZ) / 60)) * 60;
	var strDateTZ_normalised	= (blnJsDateCompat ? "UTC" : "GMT") + strDateTZ_sign + PrefixChar(intDateTZ_hours, "0", 2) + (blnJsDateCompat ? "" : ":") + PrefixChar(intDateTZ_minutes, "0", 2);

	return strDateTZ_normalised;
}

/*
Function: GetDaylightSavingDay()
Description:
Returns:
History:
20040217 1219UTC	v1	Andrew Urquhart		Created
*/
function GetDaylightSavingDay(objIterationMin, objIterationMax) {
	var objTestDateOld	= new Date(objIterationMin);
	var objTestDate		= new Date(objIterationMax);

	while(Math.abs(objTestDate.valueOf() - objTestDateOld.valueOf()) > 0) {
		objTestDateOld = objTestDate;
		objTestDate = new Date(objIterationMin.valueOf() + Math.round((objIterationMax.valueOf() - objIterationMin.valueOf()) / 2));
		if (objTestDate.getTimezoneOffset() == objIterationMin.getTimezoneOffset()) {
			objIterationMin = objTestDate;
		}
		else {
			objIterationMax = objTestDate;
		}
	}
	return objTestDate;
}


/*
Function: GetCDDate()
Description: Formats a Date() object into a string for use with the countdown script demos. Date can be parsed back into a Date() object using CD_Parse(). intTzOffset is the number of minutes ahead of GMT that should appear in the timezone part of the date - e.g. to make a local-looking date for a non-GMT timezone
Returns: String() in the form "YYYY-MM-DD HH:MM:SS GMT±HH:MM"
History:
	20051231 0023 GMT	v1	Andrew Urquhart		Created
Bugs:
	intTzOffset is offset behind GMT, rather than offset ahead of GMT - needs to be switched and re-tested
*/
function GetCDDate(objDate, intTzOffset, blnTzCompensate) {
	var objTzD	= new Date(objDate);
	var tz	= (!isNaN(parseInt(intTzOffset, 10)) ? -intTzOffset : objTzD.getTimezoneOffset());
	var tzs	= (tz < 0 ? "-" : "+")
	var tzh	= PrefixChar(Math.floor(Math.abs(tz)/60), "0", 2);
	var tzm	= PrefixChar(Math.abs(tz%60), "0", 2);

	if (blnTzCompensate) {
		// Deduct the timezone offset from the specified date
		objTzD.setUTCMinutes(objTzD.getUTCMinutes() + tz);
	}

	return objTzD.getUTCFullYear() + "-" + PrefixChar(objTzD.getUTCMonth()+1, "0", 2) + "-" + PrefixChar(objTzD.getUTCDate(), "0", 2) + " " + PrefixChar(objTzD.getUTCHours(), "0", 2) + ":" + PrefixChar(objTzD.getUTCMinutes(), "0", 2) + ":" + PrefixChar(objTzD.getUTCSeconds(), "0", 2) + " GMT" + tzs + tzh + ":" + tzm;
}


/*
Function: DisplayTimezoneInfo()
Description:
Returns:
History:
20040217 1219UTC	v1	Andrew Urquhart		Created
*/
function DisplayTimezoneInfo() {
	var objDate_now = new Date();
	var intTimezone_now	= objDate_now.getTimezoneOffset();
	var intFullYear_now	= objDate_now.getFullYear();

	var intTimezone_now_tzstring = GetTimezoneString(objDate_now, false);

	var objO = [];
	var intO = 0;
	objO[intO++] = "<p class=\"info\">The following information has been determined from your computer's operating system and web browser, it may not be accurate!</p><dl class=\"mapstartnode\">";
	objO[intO++] = "<dt>The Time Now</dt><dd><code>" + GetCDDate(objDate_now, intTimezone_now, true) + "</code></dd>";
	if (intTimezone_now != 0) {
		objO[intO++] = "<dd>(<code>" + GetCDDate(objDate_now, 0, false) + "</code>)</dd>";
	}
	objO[intO++] = "<dt>Your Current Timezone</dt><dd><code>" + intTimezone_now_tzstring + "</code></dd>";


	var objDate_month1	= new Date("1 Jan " + intFullYear_now + " 00:00:00 " + GetTimezoneString(objDate_now, true));
	var objDate_month7	= new Date("1 Jul " + intFullYear_now + " 00:00:00 " + GetTimezoneString(objDate_now, true));
	var objDate_month12	= new Date("1 Dec " + intFullYear_now + " 00:00:00 " + GetTimezoneString(objDate_now, true));

	var intTimezone_month1	= objDate_month1.getTimezoneOffset();
	var intTimezone_month7	= objDate_month7.getTimezoneOffset();
	var intNSHemisphere		= null;
	var blnDaylightSaving	= null;

	objO[intO++] = "<dt>Is Daylight Saving Currently in Force?</dt>";
	if (intTimezone_month1 != intTimezone_month7) {
		intNSHemisphere = intTimezone_month1 > intTimezone_month7 ? 1 : 2;

		// Calculate boths dates at which clocks change
		var objDaylightStart	= intNSHemisphere == 1 ? GetDaylightSavingDay(objDate_month1, objDate_month7) : GetDaylightSavingDay(objDate_month7, objDate_month12);
		var objDaylightEnd		= intNSHemisphere == 1 ? GetDaylightSavingDay(objDate_month7, objDate_month12) : GetDaylightSavingDay(objDate_month1, objDate_month7);

		// Work out then if daylight saving is currently in force
		if (objDaylightStart.getTimezoneOffset() == objDate_now.getTimezoneOffset()) {
			objO[intO++] = "<dd>Yes</dd>";
			blnDaylightSaving = true;
		}
		else {
			objO[intO++] = "<dd>No, not at the moment</dd>";
			blnDaylightSaving = false;
		}
		objO[intO++] = "<dt>Daylight Saving For " + objDaylightStart.getUTCFullYear() + " " + (+objDate_now >= +objDaylightStart ? "Began" : "Begins") + "</dt><dd><code>" + GetCDDate(objDaylightStart, objDaylightEnd.getTimezoneOffset(), true) + "</code> &mdash; after this date the timezone is: <code>" + GetTimezoneString(objDaylightStart, false) + "</code></dd>";
		objO[intO++] = "<dt>Daylight Saving For " + objDaylightEnd.getUTCFullYear() + " " + (+objDate_now >= +objDaylightEnd ? "Ended" : "Ends") + "</dt><dd><code>" + GetCDDate(objDaylightEnd, objDaylightStart.getTimezoneOffset(), true) + "</code> &mdash; after this date the timezone is: <code>" + GetTimezoneString(objDaylightEnd, false) + "</code></dd>";

		// If start-date is after end date then swop displayed results around
		if (+objDaylightStart > +objDaylightEnd) {
			var temp = objO[intO-1];
			objO[intO-1] = objO[intO-2];
			objO[intO-2] = temp;
		}
	}
	else {
		objO[intO++] = "<dd>No &mdash; Daylight Saving does not appear to apply where you live</dd>";
	}


	var dblLongitude = (intTimezone_now + (blnDaylightSaving ? 60 : 0)) / 4;
	var strLongitude = "" + Math.abs(dblLongitude) + "&deg; " + (dblLongitude >= 0 ? "West" : "East");


	objO[intO++] = "<dt>Latitude</dt><dd>You live " + (intNSHemisphere == null ? "in the equatorial region, more or less" : "in the " + (intNSHemisphere == 1 ? "northern" : "southern") + " hemisphere") + "</dd>";
	objO[intO++] = "<dt>Longitude</dt><dd>Approximately <code>" + strLongitude + " ± 15&deg;</code></dd>";
	objO[intO++] = "</dl>";
	return objO.join("\r\n");
}

// new function
function getDaylightInfo()
{
	var objDate_now = new Date();
	var intTimezone_now	= objDate_now.getTimezoneOffset();
	var intFullYear_now	= objDate_now.getFullYear();

	var intTimezone_now_tzstring = GetTimezoneString(objDate_now, false);

	var objO = [];
	var intO = 0;
	objO[intO++] = "<p class=\"info\">The following information has been determined from your computer's operating system and web browser, it may not be accurate!</p><dl class=\"mapstartnode\">";
	objO[intO++] = "<dt>The Time Now</dt><dd><code>" + GetCDDate(objDate_now, intTimezone_now, true) + "</code></dd>";
	if (intTimezone_now != 0) {
		objO[intO++] = "<dd>(<code>" + GetCDDate(objDate_now, 0, false) + "</code>)</dd>";
	}
	objO[intO++] = "<dt>Your Current Timezone</dt><dd><code>" + intTimezone_now_tzstring + "</code></dd>";


	var objDate_month1	= new Date("1 Jan " + intFullYear_now + " 00:00:00 " + GetTimezoneString(objDate_now, true));
	var objDate_month7	= new Date("1 Jul " + intFullYear_now + " 00:00:00 " + GetTimezoneString(objDate_now, true));
	var objDate_month12	= new Date("1 Dec " + intFullYear_now + " 00:00:00 " + GetTimezoneString(objDate_now, true));

	var intTimezone_month1	= objDate_month1.getTimezoneOffset();
	var intTimezone_month7	= objDate_month7.getTimezoneOffset();
	var intNSHemisphere		= null;
	var blnDaylightSaving	= null;

	objO[intO++] = "<dt>Is Daylight Saving Currently in Force?</dt>";
	if (intTimezone_month1 != intTimezone_month7) {
		intNSHemisphere = intTimezone_month1 > intTimezone_month7 ? 1 : 2;

		// Calculate boths dates at which clocks change
		var objDaylightStart	= intNSHemisphere == 1 ? GetDaylightSavingDay(objDate_month1, objDate_month7) : GetDaylightSavingDay(objDate_month7, objDate_month12);
		var objDaylightEnd		= intNSHemisphere == 1 ? GetDaylightSavingDay(objDate_month7, objDate_month12) : GetDaylightSavingDay(objDate_month1, objDate_month7);

		// Work out then if daylight saving is currently in force
		if (objDaylightStart.getTimezoneOffset() == objDate_now.getTimezoneOffset()) {
			objO[intO++] = "<dd>Yes</dd>";
			blnDaylightSaving = true;
		}
		else {
			objO[intO++] = "<dd>No, not at the moment</dd>";
			blnDaylightSaving = false;
		}
	}
	return blnDaylightSaving;
}
/*
Function: DisplayServerTimeDifference()
Description:
Returns:
History:
20060207 2020GMT	v1		Andrew Urquhart		Created
*/
function DisplayServerTimeDifference(objDteServer) {
	var objO		= [];
	var intO		= 0;
	var intDteNow	= new Date().valueOf()

	var ms = objDteServer.valueOf() - intDteNow;
	if (ms <= 0) {
		ms *= -1;
		ms += 500; // Compensate for floor so that the result is equivalent to ceil when negative
	}
	var d = Math.floor(ms/864E5);
	ms -= d*864E5;
	var h = Math.floor(ms/36E5);
	ms -= h*36E5;
	var m = Math.floor(ms/6E4);
	ms -= m*6E4;
	var s = Math.floor(ms/1E3);

	objO[intO++] = "<p class=\"info\">The following information has been calculated using the webserver's internal clock, it also may not be accurate!</p>";
	objO[intO++] = "<dl class=\"mapstartnode\"><dt>The Time Now According to the Computer That Serves This Website</dt><dd><code>";
	objO[intO++] = GetCDDate(objDteServer, objDteServer.getTimezoneOffset(), true);
	objO[intO++] = "</code></dd><dt>If the Webserver's Clock is Correct, then your Computer's Clock is off by</dt><dd><code>";
	objO[intO++] = (d ? d + " day" + (d == 1 ? " " : "s ") : "") + (h ? PrefixChar(h, "0", 2) + "h " : "") + (m ? PrefixChar(m, "0", 2) + "m " : "") + PrefixChar(s, "0", 2) + "s";
	objO[intO++] = "</code></dd></dl>";

	return objO.join("");
}

