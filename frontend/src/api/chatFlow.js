const chatFlow = {
    start: {
      content:
        "Hi! I’m your travel assistant. I can tell you about our site features. Are you a registered user or exploring public trips?",
      options: ["Registered User", "Explore Trips"],
    },
  
    "Registered User": {
      content:
        "As a registered user, you have a private dashboard where you can:\n• Pin trips\n• Add, edit, or delete trips\n• Upload photos per trip\n• Track your travel activities",
      options: ["How do I register?", "How do I log in?", "Back"],
    },
  
    "How do I register?": {
      content: "Click 'Sign Up' on the top right corner and fill in your details.",
      options: ["Back"],
    },
  
    "How do I log in?": {
      content: "Click 'Log In' and enter your credentials to access your dashboard.",
      options: ["Back"],
    },
  
    "Explore Trips": {
      content:
        "Even without an account, you can see public trips logged by other travelers. You can:\n• Browse recent trips\n• Search trips by city or country\n• See photos shared by travelers",
      options: ["How do I search trips?", "Can I pin trips without an account?", "Back"],
    },
  
    "How do I search trips?": {
      content: "Use the search bar in the Explore Trips page to find trips by city or country.",
      options: ["Back"],
    },
  
    "Can I pin trips without an account?": {
      content: "No, pinning trips requires a registered account so your favorites are saved privately.",
      options: ["Back"],
    },
  
    Back: {
      redirect: "start",
    },
  };
  
  export default chatFlow;
  