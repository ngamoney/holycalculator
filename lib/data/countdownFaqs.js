export const COUNTDOWN_FAQS = [
  {
    question: "How does the online countdown calculator work?",
    answer:
      "The countdown calculator computes the exact time difference in milliseconds between your current device time and the target event date and time. It dynamically updates every second to display remaining days, hours, minutes, and seconds."
  },
  {
    question: "Does the countdown adjust for different time zones?",
    answer:
      "The countdown runs based on local device time settings. When sharing a countdown link, the target date and time remain fixed to the specific local or UTC time chosen, ensuring accurate synchronization across device locations."
  },
  {
    question: "Can I create and share a custom countdown link with friends?",
    answer:
      "Yes! Type your custom event title, pick a target date and time, and click 'Share Countdown URL'. The generated link contains encoded event parameters that instantly recreate your custom live ticking countdown clock on any device."
  },
  {
    question: "What happens when the countdown reaches zero?",
    answer:
      "When the countdown reaches zero, the live ticking clock stops, and an event arrival notification banner ('Target Date & Time Has Arrived!') is displayed alongside total elapsed time."
  },
  {
    question: "How are total equivalent hours, minutes, and seconds calculated?",
    answer:
      "In addition to the standard Days:Hours:Mins:Secs clock breakdown, the calculator converts the total remaining duration into single-unit metrics (such as total hours, total minutes, total seconds, or total weeks) by dividing total milliseconds by the respective unit constant."
  }
];
