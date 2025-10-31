// Import only used assets
import workio_logo from "./workio_logo.png";
import add_icon from "./add_icon.svg";
import company_icon from "./company.webp";
import counter_image from "./counter.webp";
import facebook_icon from "./facebook_icon.svg";
import home_icon from "./home_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import person_tick_icon from "./person_tick_icon.svg";
import profile_img from "./profile_img.png";
import profile_upload_icon from "./profile_upload_icon.svg";
import suitcase_icon from "./suitcase_icon.svg";
import twitter_icon from "./twitter_icon.svg";
import work_1 from "./work-1.webp";
import work_2 from "./work-2.webp";
import work_3 from "./work-3.webp";

// Category icons
import marketing from "./bullhorn.png";
import programming from "./code.png";
import cyber_security from "./cyber-security.png";
import network from "./global-connection.png";
import data_scince from "./intelligence.png";
import management from "./project.png";
import designing from "./web-design.png";

export const assets = {
  workio_logo,
  company_icon,
  suitcase_icon,
  facebook_icon,
  instagram_icon,
  twitter_icon,
  home_icon,
  add_icon,
  person_tick_icon,
  profile_img,
  profile_upload_icon,
  counter_image,
  work_1,
  work_2,
  work_3,
  // Default profile image
  default_profile: profile_img,
  avatarPlaceholder: profile_img,
};

export const categoryIcon = [
  {
    icon: programming,
    name: "Programming",
  },
  {
    icon: data_scince,
    name: "Data Science",
  },
  {
    icon: designing,
    name: "Designing",
  },
  {
    icon: network,
    name: "Networking",
  },
  {
    icon: management,
    name: "Management",
  },
  {
    icon: marketing,
    name: "Marketing",
  },
  {
    icon: cyber_security,
    name: "Cybersecurity",
  },
  {
    icon: person_tick_icon,
    name: "Customer Support",
  },
];

export const faqs = [
  {
    id: 1,
    title: "Terms",
    description1:
      "Nulla pharetra, ullamcorper sit lectus. Fermentum mauris pellentesque nec nibh sed et, vel diam, massa. Placerat quis vel fames interdum urna lobortis sagittis sed pretium. Aliquam eget posuere sit enim elementum nulla vulputate magna. Morbi sed arcu proin quis tortor non risus.",
    description2:
      "Elementum lectus a porta commodo suspendisse arcu, aliquam lectus faucibus. Nisl malesuada tortor, ligula aliquet felis vitae enim. Mi augue aliquet mauris non elementum tincidunt eget facilisi. Pellentesque massa ipsum tempus vel aliquam massa eu pulvinar eget.",
  },
  {
    id: 2,
    title: "Limitations",
    description1:
      "Nulla pharetra, ullamcorper sit lectus. Fermentum mauris pellentesque nec nibh sed et, vel diam, massa. Placerat quis vel fames interdum urna lobortis sagittis sed pretium. Aliquam eget posuere sit enim elementum nulla vulputate magna. Morbi sed arcu proin quis tortor non risus.",
    description2:
      "Elementum lectus a porta commodo suspendisse arcu, aliquam lectus faucibus. Nisl malesuada tortor, ligula aliquet felis vitae enim. Mi augue aliquet mauris non elementum tincidunt eget facilisi. Pellentesque massa ipsum tempus vel aliquam massa eu pulvinar eget.",
  },
  {
    id: 3,
    title: "Revisions and Errata",
    description1:
      "Nulla pharetra, ullamcorper sit lectus. Fermentum mauris pellentesque nec nibh sed et, vel diam, massa. Placerat quis vel fames interdum urna lobortis sagittis sed pretium. Aliquam eget posuere sit enim elementum nulla vulputate magna. Morbi sed arcu proin quis tortor non risus.",
    description2:
      "Elementum lectus a porta commodo suspendisse arcu, aliquam lectus faucibus. Nisl malesuada tortor, ligula aliquet felis vitae enim. Mi augue aliquet mauris non elementum tincidunt eget facilisi. Pellentesque massa ipsum tempus vel aliquam massa eu pulvinar eget.",
  },
  {
    id: 4,
    title: "Site Terms of Use Modifications",
    description1:
      "Nulla pharetra, ullamcorper sit lectus. Fermentum mauris pellentesque nec nibh sed et, vel diam, massa. Placerat quis vel fames interdum urna lobortis sagittis sed pretium. Aliquam eget posuere sit enim elementum nulla vulputate magna. Morbi sed arcu proin quis tortor non risus.",
    description2:
      "Elementum lectus a porta commodo suspendisse arcu, aliquam lectus faucibus. Nisl malesuada tortor, ligula aliquet felis vitae enim. Mi augue aliquet mauris non elementum tincidunt eget facilisi. Pellentesque massa ipsum tempus vel aliquam massa eu pulvinar eget.",
  },
];

export const testimonials = [
  {
    title: "An Incredible Experience!",
    description:
      "Using this platform made my job search so much easier. The recommendations were spot on and the user experience.",
    image: "https://placehold.co/200x200/2563eb/white?text=JL", // Jessica Lee initials
    name: "Jessica Lee",
    position: "Frontend Developer",
  },
  {
    title: "Highly Recommended",
    description:
      "I found the perfect job within a week. The interface is clean and the support team is super responsive. Couldn't ask for more!",
    image: "https://randomuser.me/api/portraits/men/32.jpg", // Daniel Thompson photo
    name: "Daniel Thompson",
    position: "Digital Marketing Manager",
  },
  {
    title: "Seamless and Efficient",
    description:
      "From creating a profile to applying for jobs, everything was quick and easy. The listings are well curated too.",
    image: "https://placehold.co/200x200/2563eb/white?text=SA", // Sara Ahmed initials
    name: "Sara Ahmed",
    position: "UI/UX Designer",
  },
  {
    title: "A Game-Changer for Job Seekers",
    description:
      "I've used many job portals before, but this one stands out with its simplicity and effectiveness. Found a great opportunity !",
    image: "https://randomuser.me/api/portraits/men/75.jpg", // Kevin Brooks photo
    name: "Kevin Brooks",
    position: "Software Engineer",
  },
];

export const JobCategories = [
  "Programming",
  "Data Science",
  "Designing",
  "Networking",
  "Management",
  "Marketing",
  "Cybersecurity",
  "Customer Support",
];

export const JobLocations = [
  "Hyderabad",
  "Chennai",
  "Pune",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Jaipur",
  "Lucknow",
  "Remote",
];