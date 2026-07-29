/**
 * config/personal.js
 * -------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for the entire portfolio.
 * Edit values here and every page (nav, hero, projects, footer, SEO tags,
 * structured data) updates automatically. No other file should hardcode
 * personal info, links, or project data.
 * -------------------------------------------------------------------------
 */

window.PERSONAL = {
  name: "Chintapalli V S S Ramachandra Reddy",
  role: "Aspiring Full Stack Web Dev",
  // The hero typewriter cycles through these roles one after another.
  // Keep "role" above as the plain-text fallback used in meta tags / SEO.
  roles: ["Aspiring Full Stack Web Dev", "Aspiring Data Scientist"],
  tagline: "I build fast, accessible web apps end to end — from database to pixel — and I love turning messy data into clear insight.",
  university: "Lovely Professional University (LPU)",
  degree: "B.Tech Computer Science & Engineering",
  location: "Phagwara, Punjab, India",
  locationCoords: { lat: 31.2469, lng: 75.7046 },

  photo: "assets/images/profile.png",
  photoPlaceholder: "assets/images/profile-placeholder.png",
  resumePath: "public/resume.pdf",

  email: "chintapalliramchandrareddy@gmail.com",
  phone: "+919391890852",

  social: {
    github: "https://github.com/Ramchandra405",
    linkedin: "https://www.linkedin.com/in/-ramchandrareddy/",
    leetcode: "",
    gfg: "",
    instagram: "",
    twitter: "",
    portfolio: "https://your-domain.vercel.app"
  },

  githubUsername: "Ramchandra405",

  skills: [
    { name: "Python", level: "Core language" },
    { name: "C", level: "Core language" },
    { name: "C++", level: "Core language" },
    { name: "Java", level: "Core language" },
    { name: "NumPy / Pandas", level: "Data Science" },
    { name: "Scikit-learn", level: "Data Science" },
    { name: "EDA", level: "Data Science" },
    { name: "Matplotlib / Seaborn", level: "Visualization" },
    { name: "Power BI", level: "Visualization" },
    { name: "Excel", level: "Visualization" },
    { name: "MySQL", level: "Database" },
    { name: "HTML / CSS / JavaScript", level: "Web Technologies" },
    { name: "Data Structures & Algorithms", level: "Core Competency" },
    { name: "Problem-Solving", level: "Soft Skill" },
    { name: "Team Player", level: "Soft Skill" },
    { name: "Adaptability", level: "Soft Skill" }
  ],

  experience: [
    {
      role: "Machine Learning & Data Science Training",
      org: "CipherSchools",
      period: "Jun 2025 — Jul 2025",
      description:
        "Completed a summer training program in Machine Learning and Data Science. Performed data cleaning and feature engineering on customer records, and built a Product Purchase Likelihood Predictor as a capstone project applying supervised learning techniques. Key skills: Python, Pandas, Scikit-learn, Classification, Feature Engineering, Gradio model deployment."
    }
  ],

  certificates: [
    { name: "Digital Skills: Social Media", issuer: "Accenture (FutureLearn)", year: "Mar 2026", url: "", image: "assets/certificates/digital-skills-social-media.png" },
    { name: "Data Analytics Job Simulation", issuer: "Deloitte (Forage)", year: "Dec 2025", url: "", image: "assets/certificates/deloitte.png" },
    { name: "Master Generative AI & Generative AI Tools (ChatGPT & more)", issuer: "Infosys Springboard", year: "Aug 2025", url: "", image: "" },
    { name: "Privacy and Security in Online Social Media", issuer: "NPTEL", year: "May 2025", url: "", image: "" },
    { name: "Responsive Web Design", issuer: "freeCodeCamp", year: "Dec 2023", url: "", image: "" },
    { name: "A Guide to Machine Learning with Data Science", issuer: "CipherSchools", year: "Jul 2025", url: "", image: "assets/certificates/cipherschools.png" },
    { name: "Code Off Duty — Web Hackathon", issuer: "Coding Wise", year: "Mar 2024", url: "", image: "assets/certificates/code-off-duty.png" }
  ],

  // Powers the 3D tech orbit. level: 0-100 used for the hover progress ring.
  // icon: slug from simpleicons.org (used to fetch the real brand logo,
  // rendered onto each sphere's label). Leave blank to fall back to text only.
  techOrbit: [
    { name: "Python", level: 85, color: "#FFD54A", icon: "python" },
    { name: "JavaScript", level: 70, color: "#F7DF1E", icon: "javascript" },
    { name: "Java", level: 65, color: "#E76F00", icon: "openjdk" },
    { name: "C++", level: 65, color: "#5AD1B8", icon: "cplusplus" },
    { name: "HTML", level: 85, color: "#FF6B6B", icon: "html5" },
    { name: "CSS", level: 80, color: "#5AD1B8", icon: "css3" },
    { name: "MySQL", level: 70, color: "#82AAFF", icon: "mysql" },
    { name: "Pandas", level: 80, color: "#C792EA", icon: "pandas" },
    { name: "Scikit-learn", level: 75, color: "#FF9F5A", icon: "scikitlearn" },
    { name: "Git", level: 70, color: "#FF6B6B", icon: "git" },
    { name: "GitHub", level: 75, color: "#E6E8EB", icon: "github" },
    { name: "Power BI", level: 65, color: "#FFC94A", icon: "powerbi" }
  ],

  education: [
    { school: "Lovely Professional University", location: "Phagwara, Punjab", detail: "B.Tech — Computer Science & Engineering, CGPA: 7.12", period: "Since Aug 2023" },
    { school: "Tirumala Junior College", location: "Rajahmundry, Andhra Pradesh", detail: "Intermediate — 84%", period: "Jun 2021 – May 2023" },
    { school: "Sri Prakash Vidya Niketan", location: "Payakaraopeta, Andhra Pradesh", detail: "SSC — 99%", period: "Jun 2020 – May 2021" }
  ],

  achievements: [
    "Qualified the final round of Code Off Duty — a web development hackathon by Coding Wise (Mar 2024)"
  ],

  projects: [
    {
      id: "purchase-likelihood",
      name: "Product Purchase Likelihood Prediction",
      image: "assets/projects/purchase-likelihood.png",
      description:
        "A classification model that predicts whether a customer will make a purchase, deployed as an interactive AI-powered dashboard for marketing teams to explore live predictions and model performance.",
      stack: ["Python", "Scikit-learn", "Gradio", "Pandas"],
      features: [
        "Data cleaning and preprocessing across 200+ customer records",
        "Feature importance analysis (time on site, age, previous purchases) to explain conversion drivers",
        "Deployed as an interactive Gradio app for non-technical stakeholders"
      ],
      challenges:
        "Turning raw, inconsistent customer records into clean model-ready features, then packaging the model behind a simple UI so marketing could use it without touching code.",
      githubUrl: "https://github.com/Ramchandra405",
      demoUrl: "",
      caseStudyUrl: ""
    },
    {
      id: "commodity-price-trends",
      name: "Commodity Price Trend Analysis & Market Visualization",
      image: "assets/projects/commodity-price-trends.png",
      description:
        "An interactive market-insights dashboard analyzing 7,000+ commodity price records across 36 Indian markets, surfacing regional pricing trends for crops like tomato and turmeric.",
      stack: ["Python", "Pandas", "Matplotlib", "Seaborn", "Excel"],
      features: [
        "Cleaned and explored 7,000+ records across multiple Indian markets",
        "Visualized Minimum, Maximum, and Modal price by state and commodity",
        "Insights aimed at supporting procurement and inventory planning decisions"
      ],
      challenges:
        "Reconciling inconsistent price reporting across states and commodities into a single, comparable structure for meaningful visual analysis.",
      githubUrl: "https://github.com/Ramchandra405",
      demoUrl: "",
      caseStudyUrl: ""
    }
  ],

  // Contact form backend. "formsubmit" works immediately with zero setup —
  // it POSTs to FormSubmit.co using your email address below, no API keys
  // needed (first submission triggers a one-time confirmation email you
  // must click to activate it). Set to "emailjs" instead if you'd rather
  // use EmailJS — then fill in the emailjs block below.
  contactMethod: "formsubmit", // "formsubmit" | "emailjs"

  emailjs: {
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
  },

  analytics: {
    googleAnalyticsId: "",
    vercelAnalytics: true
  },

  seo: {
    siteTitle: "Chintapalli V S S Ramachandra Reddy — Full Stack Web Developer",
    siteDescription:
      "Portfolio of Chintapalli V S S Ramachandra Reddy, an aspiring full stack web developer studying B.Tech CSE at Lovely Professional University, specializing in Python, data science, and web technologies.",
    siteUrl: "https://your-domain.vercel.app",
    ogImage: "assets/images/og-cover.png"
  }
};
