import foodImage from "../assets/PerkImage/salmon-with-ingredients-table_1220-5155.avif";
import gymImage from "../assets/PerkImage/1078069.jpg";
import healthImage from "../assets/PerkImage/1.webp";

export const perks = [
  {
    id: "food-1",
    title: "Healthy Lunch Deal",
    companyName: "FreshFork",
    price: 12,
    discount: 25,
    image: foodImage,
    tags: ["Food", "Dining", "Lunch"],
  },
  {
    id: "gym-1",
    title: "Gym Day Pass",
    companyName: "IronPulse Gym",
    price: 30,
    discount: 40,
    image: gymImage,
    tags: ["Gym", "Fitness", "Health"],
  },
  {
    id: "health-1",
    title: "Wellness Checkup",
    companyName: "CareBloom Clinic",
    price: 50,
    discount: 20,
    image: healthImage,
    tags: ["Health", "Wellness", "Recovery"],
  },
];
