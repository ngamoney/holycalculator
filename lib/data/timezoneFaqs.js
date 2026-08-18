export const TIMEZONE_FAQS = [
  {
    question: "What is the difference between GMT and UTC?",
    answer:
      "Greenwich Mean Time (GMT) is a time zone originally based on astronomical solar time measured at the Royal Observatory in Greenwich, London. Coordinated Universal Time (UTC) is a precise scientific time standard maintained by atomic clocks. While GMT and UTC share the exact same solar time with zero offset difference, UTC is used as the global standard reference point for setting all official time zones."
  },
  {
    question: "Does this calculator account for Daylight Saving Time (DST)?",
    answer:
      "No. This calculator operates on a fixed standard UTC-offset model (UTC-12:00 through UTC+14:00). Standard UTC offsets do not automatically adjust for Daylight Saving Time (DST) shifts because summer/winter transitions occur on different dates across individual countries and local municipalities. To convert times during DST, select the active daylight offset for your target region (e.g. UTC-04:00 for Eastern Daylight Time instead of UTC-05:00 for Eastern Standard Time)."
  },
  {
    question: "How many time zones exist in the world?",
    answer:
      "There are 24 theoretical hourly time zones spaced 15 degrees of longitude apart around Earth. However, due to political boundaries, fractional offsets (half-hour and quarter-hour zones), and island nations near the International Date Line, there are actually over 38 distinct standard UTC offsets used globally ranging from UTC-12:00 to UTC+14:00."
  },
  {
    question: "Why do some countries have half-hour or quarter-hour time zone offsets?",
    answer:
      "Time zones are established by local governments rather than strictly following longitudinal boundaries. Countries such as India (UTC+05:30), Iran (UTC+03:30), and Afghanistan (UTC+04:30) adopt half-hour offsets to align national standard time more closely with solar noon across their central territories. Nepal (UTC+05:45) and the Chatham Islands (UTC+12:45) use quarter-hour offsets based on historical meridian alignment."
  },
  {
    question: "How do I calculate a time zone conversion manually?",
    answer:
      "To manually convert time between two locations, subtract the source zone's UTC offset from the source local time to find the UTC time, then add the target zone's UTC offset. For example, to convert 3:00 PM (15:00) in New York (UTC-05:00) to Tokyo (UTC+09:00): convert 15:00 to UTC by adding 5 hours (20:00 UTC), then add 9 hours for Tokyo (29:00 UTC = 5:00 AM the next day)."
  }
];
