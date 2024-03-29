const icsTemplateHeader = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Europe/Berlin
LAST-MODIFIED:20201011T015911Z
X-LIC-LOCATION:Europe/Berlin
BEGIN:DAYLIGHT
TZNAME:CEST
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:CET
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
`;

const icsTemplateEvent1 = `BEGIN:VEVENT
DTSTART;TZID=Europe/Berlin:`;

const icsTemplateEvent2 = 'DTEND;TZID=Europe/Berlin:';

const icsTemplateEvent3 = 'SUMMARY:';

const icsTemplateEvent4 = `BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:St. Pauli
TRIGGER:-PT30M
END:VALARM
END:VEVENT`;

const icsTemplateFooter = 'END:VCALENDAR';