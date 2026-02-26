const testimonials = [
  {
    name: "Daniel Clifford",
    status: "Verified Graduate",
    title: "I received my job offer mid-course, and the subjects I learned were current, if not more so, in the company I joined. I honestly feel I got every penny's worth.",
    quote: "I was an EMT for many years before I joined the bootcamp. I've been looking to make a transition and have heard some people who had an amazing experience here. I signed up for the free intro course and found it incredibly fun! I enrolled shortly thereafter. The next 12 weeks was the best - and most grueling - time of my life. Since completing the course, I've successfully switched careers, working as a Software Engineer at a VR startup.",
    image: "./res/daniel-clifford.png",
    cardClass: "card-daniel"
  },
  {
    name: "Jonathan Walters",
    status: "Verified Graduate",
    title: "The team was very supportive and kept me motivated",
    quote: "I started as a total newbie with virtually no coding skills. I now work as a mobile engineer for a big company. This was one of the best investments I've made in myself.",
    image: "./res/jonathan-walters.png",
    cardClass: "card-jonathan"
  },
  {
    name: "Jeanette Harmon",
    status: "Verified Graduate",
    title: "An overall wonderful and rewarding experience",
    quote: "Thank you for the wonderful experience! I now have a job I really enjoy, and make a good living while doing something I love.",
    image: "./res/jeanette-harmon.png",
    cardClass: "card-jeanette"
  },
  {
    name: "Patrick Abrams",
    status: "Verified Graduate",
    title: "Awesome teaching support from TAs who did the bootcamp themselves. Getting guidance from them and learning from their experiences was easy.",
    quote: "The staff seem genuinely concerned about my progress which I find really refreshing. The program gave me the confidence necessary to be able to go out in the world and present myself as a capable junior developer. The standard is above the rest. You will get the personal attention you need from an incredible community of smart and amazing people.",
    image: "./res/patrick-abrams.png",
    cardClass: "card-patrick"
  },
  {
    name: "Kira Whittle",
    status: "Verified Graduate",
    title: "Such a life-changing experience. Highly recommended!",
    quote: "Before joining the bootcamp, I've never written a line of code. I needed some structure from professionals who can help me learn programming step by step. I was encouraged to enroll by a former student of theirs who can only say wonderful things about the program. The entire curriculum and staff did not disappoint. They were very hands-on and I never had to wait long for assistance. The agile team project, in particular, was outstanding. It took my learning to the next level in a way that no tutorial could ever have. In fact, I've often referred to it during interviews as an example of my development experience. It certainly helped me land a job as a full-stack developer after receiving multiple offers. 100% recommend!",
    image: "./res/kira-whittle.png",
    cardClass: "card-kira"
  }
];

const container = document.getElementById('testimonials-grid');

testimonials.forEach(testimonial => {
  const card = document.createElement('article');
  card.className = `card ${testimonial.cardClass}`;
  
  card.innerHTML = `
    <div class="user-info">
      <img src="${testimonial.image}" alt="${testimonial.name}" class="user-image">
      <div class="user-details">
        <h2 class="user-name">${testimonial.name}</h2>
        <p class="user-status">${testimonial.status}</p>
      </div>
    </div>
    <p class="quote-title">${testimonial.title}</p>
    <p class="quote-text">" ${testimonial.quote} "</p>
  `;
  
  container.appendChild(card);
});
