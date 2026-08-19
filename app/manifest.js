export default function manifest() {
  return {
    name: "Holy Calculator",
    short_name: "HolyCalculator",
    description: "One engine for every number you need — practical and otherwise.",
    start_url: "/",
    display: "standalone",
    background_color: "#14171F",
    theme_color: "#14171F",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
