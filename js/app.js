import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore,collection, addDoc,getDocs,updateDoc,doc,query, where,} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// import { getAuth,signInWithEmailAndPassword,signOut  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJfEIaHcrdMo3EJ6rwrv29GMGla1ULt_M",
  authDomain: "tanvirwrites-85a40.firebaseapp.com",
  projectId: "tanvirwrites-85a40",
  storageBucket: "tanvirwrites-85a40.appspot.com",
  messagingSenderId: "456490820085",
  appId: "1:456490820085:web:39582a011f49d8149cc0bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//===========================//
async function fetchData() {
    try {
        const response = await fetch('https://tanvir-abid.github.io/tanvirWrites/data/data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}
//===========================//
document.addEventListener('DOMContentLoaded', async ()=>{
    createSlider();

    const container = document.querySelector('main');
    const data = await fetchData();

    const navbar = createNavbar(data.services);
    container.appendChild(navbar);

    const main_container = document.createElement('div');
    main_container.id = 'main-container';
    container.appendChild(main_container);

    createHomeSection();
    // createTestimonySection();

    if(window.innerWidth <= 768){
        main_container.addEventListener('click', () => {
            let menuContents = document.querySelector('.menu-contents');
            let icon = document.querySelector('.toggle i');
            if(menuContents){
                menuContents.classList.remove('show');
                icon.className = 'fa-solid fa-bars';
            }

        });
    }
    
});

// Create and append the slider container and slides
function createSlider() {
    let images = [
        'https://i.postimg.cc/jSnbXbfn/bg1.jpg', 
        'https://i.postimg.cc/k5rdYpN1/bg2.jpg', 
        'https://i.postimg.cc/Dzq39PB2/bg3.jpg', 
        'https://i.postimg.cc/XJ464Bz9/bg4.jpg', 
        'https://i.postimg.cc/V6gQ6sxp/bg5.jpg'
    ];

    const sliderContainer = document.createElement('div');
    sliderContainer.classList.add('slider-container');

    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) {
            slide.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = src;
        slide.appendChild(img);
        sliderContainer.appendChild(slide);
    });

    document.body.appendChild(sliderContainer);

    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Function to show the next slide
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }

    setInterval(showNextSlide, 8000);
}

//===================//
function createNavbar(data) {
    const menuData = [
        {icon: '<i class="fa-solid fa-home"></i>', text: "Home"},
        {icon: '<i class="fa-solid fa-book-open-reader"></i>', text: "Thesis Writing"},
        {icon: '<i class="fa-regular fa-file-lines"></i>', text: "Content Writing"},
        {icon: '<i class="fa-solid fa-award"></i>', text: "Testimonials"},
        {icon: '<i class="fa-solid fa-paper-plane"></i>', text: "Contact"}
    ];

    const navbar = document.createElement('div');
    navbar.classList.add('navbar');

    const logoContainer = document.createElement('div');
    logoContainer.classList.add('logo-container');

    const logo = document.createElement('img');
    logo.src = 'img/ink.png';
    logoContainer.appendChild(logo);

    const logoText = document.createElement('h1');
    logoText.textContent = 'Tanvir Writes';
    logoContainer.appendChild(logoText);
    navbar.appendChild(logoContainer);

    const menuItemsContainer = document.createElement('div');
    menuItemsContainer.classList.add('menu-items-container');

    const menuContents = document.createElement('div');
    menuContents.classList.add('menu-contents');

    menuData.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        if (index === 0) {
            menuItem.classList.add('active'); 
        }

        const icon = document.createElement('span');
        icon.innerHTML = item.icon;

        const text = document.createElement('span');
        text.textContent = item.text;

        menuItem.appendChild(icon);
        menuItem.appendChild(text);

        menuItem.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            menuItem.classList.add('active');

            let section = document.querySelector('.section');
            section.classList.add('hide');

            setTimeout(() => {
                if(item.text === 'Home'){
                    createHomeSection();
               }else if(item.text === 'Contact'){
                    createContactSection();
               }else if(item.text === 'Testimonials'){
                    createTestimonySection();
               }else{
                    const service = data.find(service => service.service_name === item.text);
                    if (service) {
                        createServiceSection(service);
                       
                    }
               }
            }, 490);
        });

        menuContents.appendChild(menuItem);
    });

    menuItemsContainer.appendChild(menuContents);

    if (window.innerWidth <= 768) {
        const toggleSpan = document.createElement('span');
        toggleSpan.className = 'toggle';
        toggleSpan.innerHTML = '<i class="fa-solid fa-bars"></i>';
        menuItemsContainer.appendChild(toggleSpan);

        toggleSpan.addEventListener('click', () => {
            menuContents.classList.toggle('show');

            const icon = toggleSpan.querySelector('i');
            if (menuContents.classList.contains('show')) {
                icon.className = 'fa-solid fa-x';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    navbar.appendChild(menuItemsContainer);

    return navbar;
}

//=======================//
function createHomeSection() {
    showLoadingSpinner();

    const homeSection = document.createElement('section');
    homeSection.classList.add('home-section','section');
    
    // Create caption-container
    const captionContainer = document.createElement('div');
    captionContainer.classList.add('caption-container');
    
    const captionH1 = document.createElement('h1');
    captionH1.textContent = 'Welcome to Our Service';
    captionContainer.appendChild(captionH1);
    
    const captionP = document.createElement('p');
    captionContainer.appendChild(captionP);
    
    homeSection.appendChild(captionContainer);

    const socialMediaContainer = createSocialMediaContainer();
    captionContainer.appendChild(socialMediaContainer);
    
    // Create completed-job-container
    const completedJobContainer = document.createElement('div');
    completedJobContainer.classList.add('completed-job-container');
    
    const jobCardsData = [
        { icon:'<i class="fa-solid fa-book-open-reader"></i>', number: 44, title: 'Thesis Writing' },
        { icon: '<i class="fa-regular fa-file-lines"></i>', number: 1720, title: 'Content Writing' },
        { icon: '<i class="fa fa-newspaper-o"></i>', number: 23, title: 'Research Article' }
    ];
    
    jobCardsData.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-card');
        
        const icon = document.createElement('span');
        icon.innerHTML = job.icon;
        
        const number = document.createElement('span');
        number.className = 'animate-number';
        number.textContent = '0';
        number.dataset.target = job.number;
        
        const title = document.createElement('h3');
        title.textContent = job.title;
        
        jobCard.appendChild(icon);
        jobCard.appendChild(number);
        jobCard.appendChild(title);
        
        completedJobContainer.appendChild(jobCard);
    });
    
    homeSection.appendChild(completedJobContainer);
    
    // Function to create typewriter effect
    function typeWriterEffect(element, texts, speed) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = speed;
        const deletingSpeed = speed / 2;
    
        function type() {
            const currentText = texts[textIndex];
    
            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex);
                charIndex--;
                if (charIndex < 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500); // Pause before starting to type next text
                } else {
                    setTimeout(type, deletingSpeed);
                }
            } else {
                element.textContent = currentText.substring(0, charIndex);
                charIndex++;
                if (charIndex > currentText.length) {
                    isDeleting = true;
                    setTimeout(type, 2000); // Pause before starting to delete
                } else {
                    setTimeout(type, typingSpeed);
                }
            }
        }
        type();
    }
    
    hideLoadingSpinner();
    // Texts for the typewriter effect
    const texts = [
        'Providing quality thesis writing services.',
        'Delivering top-notch research articles.',
        'Expert content writing solutions.'
    ];

    typeWriterEffect(captionP, texts, 100);

    const main_container = document.getElementById('main-container');
    main_container.innerHTML = "";
    main_container.appendChild(homeSection);
    
    animateNumbers()
}
//========================//
function createServiceSection(sectionData) {
    // console.log(sectionData);
    showLoadingSpinner();

    const section = document.createElement('section');
    let section_classes = sectionData.service_name.split(" ");
    section.classList.add(`${section_classes[0].toLowerCase()}-section`, 'section');

    const section_header_container = document.createElement('div');
    section_header_container.className = 'section-header-container';

    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.innerHTML = sectionData.thumbnail;
    section_header_container.appendChild(thumbnail);

    const header_contents = document.createElement('div');
    header_contents.className = 'header-contents';
    header_contents.innerHTML = `
        <h1>${sectionData.service_name}</h1>
        <p>${sectionData.tagline}<p>
    `;
    section_header_container.appendChild(header_contents);

    const plan_container = document.createElement('div');
    plan_container.classList.add('plans-container');

    let currentIndex = 0;
    const plansPerPage = 4;

    function displayPlans(startIndex) {
        plan_container.innerHTML = '';
        const endIndex = Math.min(startIndex + plansPerPage, sectionData.price_tables.length);
        for (let i = startIndex; i < endIndex; i++) {
            const planDiv = createPlanDiv(sectionData.price_tables[i], sectionData.service_name);
            plan_container.appendChild(planDiv);
        }
    }

    displayPlans(currentIndex);

    const navButton = document.createElement('button');
    navButton.classList.add('nav-button');
    const nextIcon = document.createElement('i');
    nextIcon.classList.add('fa-solid', 'fa-chevron-right');
    const prevIcon = document.createElement('i');
    prevIcon.classList.add('fa-solid', 'fa-chevron-left');
    navButton.appendChild(nextIcon);

    navButton.addEventListener('click', () => {
        if (navButton.contains(nextIcon)) {
            currentIndex += plansPerPage;
            displayPlans(currentIndex);
            if (currentIndex + plansPerPage >= sectionData.price_tables.length) {
                navButton.removeChild(nextIcon);
                navButton.appendChild(prevIcon);
            }
        } else {
            currentIndex -= plansPerPage;
            displayPlans(currentIndex);
            if (currentIndex === 0) {
                navButton.removeChild(prevIcon);
                navButton.appendChild(nextIcon);
            }
        }
    });


    section.appendChild(section_header_container);
    section.appendChild(plan_container);
    if (sectionData.price_tables.length > plansPerPage) {
        section.appendChild(navButton);
    }

    hideLoadingSpinner();

    const main_container = document.getElementById('main-container');
    main_container.innerHTML = "";
    main_container.appendChild(section);
}

function createPlanDiv(plan, serviceName) {
    // Create the outer plan div
    const planDiv = document.createElement('div');
    planDiv.classList.add('plan');
    if (plan.plan_category) {
        planDiv.classList.add(plan.plan_category);
    }
    
    // Create the inner plan div
    const planInnerDiv = document.createElement('div');
    planInnerDiv.classList.add('plan-inner');
    
    // Create the entry title div
    const entryTitleDiv = document.createElement('div');
    entryTitleDiv.classList.add('entry-title');
    
    // Create the title container div
    const titleContainerDiv = document.createElement('div');
    titleContainerDiv.classList.add('title-container');
    
    // Create the h3 and p elements for the title and slogan
    const titleH3 = document.createElement('h3');
    titleH3.textContent = plan.package_name;
    const sloganP = document.createElement('p');
    sloganP.textContent = plan.slogan;
    
    // Append h3 and p to title container
    titleContainerDiv.appendChild(titleH3);
    titleContainerDiv.appendChild(sloganP);
    
    // Create the price div
    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price');
    priceDiv.innerHTML = `${plan.price}<span>Taka</span>`;
    
    // Append title container and price to entry title
    entryTitleDiv.appendChild(titleContainerDiv);
    entryTitleDiv.appendChild(priceDiv);
    
    // Create the entry content div
    const entryContentDiv = document.createElement('div');
    entryContentDiv.classList.add('entry-content');
    
    // Create the ul element for package details
    const ul = document.createElement('ul');
    plan.package_details.forEach(detail => {
        const li = document.createElement('li');
        li.textContent = detail;
        ul.appendChild(li);
    });
    
    // Append ul to entry content
    entryContentDiv.appendChild(ul);
    
    // Create the button div
    const btnDiv = document.createElement('div');
    btnDiv.classList.add('btn');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Order Now';
    btnDiv.appendChild(button);

    button.addEventListener('click', ()=>{
        createModal(plan,serviceName);
    })
    
    // Append all to plan inner div
    planInnerDiv.appendChild(entryTitleDiv);
    planInnerDiv.appendChild(entryContentDiv);
    planInnerDiv.appendChild(btnDiv);
    
    // Append plan inner to plan div
    planDiv.appendChild(planInnerDiv);
    
    return planDiv;
}

function createContactSection() {
    // Create the contact-section
    const contactSection = document.createElement('section');
    contactSection.classList.add('contact-section','section');

    const head1 = document.createElement('div');
    head1.classList.add('head');
    head1.innerHTML = `Contact`;
    contactSection.appendChild(head1);
    
    // Create the contacts-container
    const contactsContainer = document.createElement('div');
    contactsContainer.classList.add('contacts-container');

    // Create the contact-info-container
    const contactInfoContainer = document.createElement('div');
    contactInfoContainer.classList.add('contact-info-container');

    // Create the contact-info div
    const contactInfo = document.createElement('div');
    contactInfo.classList.add('contact-info');
    const ul = document.createElement('ul');

    // Adding contact details
    // Adding contact details
    const contactDetails = [
        { label: 'Phone:', values: ['+8801521200315', '+8801854702384'], icon: '<i class="fa-solid fa-signal"></i>' },
        { label: 'Email:', value: 'tanvir.writes.content@gmail.com', icon: '<i class="fa-solid fa-at"></i>'},
        { label: 'Address:', value: 'Dhaka, Bangladesh', icon: '<i class="fa-solid fa-map-location-dot"></i>' }
    ];

    contactDetails.forEach(detail => {
        const li = document.createElement('li');
        if (detail.label === 'Phone:') {
            li.innerHTML = `<span class='list-icon'>${detail.icon}</span> <span class='list-text'><strong>${detail.label}</strong> 
                            ${detail.values.map(phone => `<a href="tel:${phone}">${phone}</a>`).join(' , ')}</span>`;
        } else if (detail.label === 'Email:') {
            li.innerHTML = `<span class='list-icon'>${detail.icon}</span> <span class='list-text'><strong>${detail.label}</strong> 
                            <a href="mailto:${detail.value}">${detail.value}</a></span>`;
        } else {
            li.innerHTML = `<span class='list-icon'>${detail.icon}</span> <span class='list-text'><strong>${detail.label}</strong> ${detail.value}</span>`;
        }
        ul.appendChild(li);
    });

    contactInfo.appendChild(ul);

    // Create the social-media-container
    const socialMediaContainer = createSocialMediaContainer(); // Reuse the function from earlier
    
    // Create the credit div
    const credit = document.createElement('div');
    credit.classList.add('credit');
    let creditDate = new Date();
    credit.textContent = `Tanvir Writes © ${creditDate.getFullYear()} All rights reserved.`;

    // Append all info to contact-info-container
    contactInfoContainer.appendChild(contactInfo);
    contactInfoContainer.appendChild(socialMediaContainer);
    contactInfoContainer.appendChild(credit);
    
    // Create the contact-form-container
    const contactFormContainer = document.createElement('div');
    contactFormContainer.classList.add('contact-form-container');
    
    // Creating the contact form
    const contactForm = createContactForm(); // Assuming the createContactForm function is defined

    contactFormContainer.appendChild(contactForm);

    // Append both containers to the contacts-container
    contactsContainer.appendChild(contactInfoContainer);
    contactsContainer.appendChild(contactFormContainer);

    // Append the contacts-container to the contact section
    contactSection.appendChild(contactsContainer);

    const main_container = document.getElementById('main-container');
    main_container.innerHTML = "";
    main_container.appendChild(contactSection);
}

function createContactForm(selectedPlan) {
    // Create the form element
    const form = document.createElement('form');
    form.classList.add('contact-form');

    const accessInput = document.createElement('input');
    accessInput.type = "hidden";
    accessInput.name = "access_key";
    accessInput.value = "a147ee20-caf0-4d1a-8584-c38d8231a9fd";

    const subject = document.createElement('input');
    subject.type = "hidden";
    subject.name = "subject";
    subject.value = "New Order";

    const formName = document.createElement('input');
    formName.type = "hidden";
    formName.name = "from_name";
    formName.value = "New Order";

    // Create the name input
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('id', 'name');
    nameInput.setAttribute('name', 'name');
    nameInput.setAttribute('placeholder', 'Type your full name');
    nameInput.setAttribute('required', 'required');

    // Create the contact number input
    const contactInput = document.createElement('input');
    contactInput.setAttribute('type', 'tel');
    contactInput.setAttribute('id', 'contact');
    contactInput.setAttribute('name', 'contact');
    contactInput.setAttribute('placeholder', 'Type your mobile number');
    contactInput.setAttribute('required', 'required');

    // Create the email input
    const emailInput = document.createElement('input');
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('id', 'email');
    emailInput.setAttribute('name', 'email');
    emailInput.setAttribute('placeholder', 'Type your email address');
    emailInput.setAttribute('required', 'required');

    // Create the message textarea
    const messageTextarea = document.createElement('textarea');
    messageTextarea.setAttribute('id', 'message');
    messageTextarea.setAttribute('name', 'message');
    messageTextarea.setAttribute('placeholder', 'Start writing here...');
    messageTextarea.setAttribute('required', 'required');

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.innerHTML = "<i class='fa-solid fa-truck-fast'></i> Submit";

    // Append all elements to the form
    form.appendChild(accessInput);
    form.appendChild(subject);
    form.appendChild(formName);
    form.appendChild(nameInput);
    form.appendChild(contactInput);
    form.appendChild(emailInput);
    form.appendChild(messageTextarea);
    form.appendChild(submitButton);

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        object.subject = `New Order from ${object.name}`;

        const mergedObject = { ...object, ...selectedPlan };
        const json = JSON.stringify(mergedObject);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                submitButton.innerHTML = "<i class='fa-solid fa-truck-fast'></i> Submit";
                createWarningModal("Your order is placed successfully.",'<i class="fa-regular fa-thumbs-up"></i> Sent Successfully');
            } else {
                console.log(response);
                submitButton.innerHTML = "<i class='fa-solid fa-truck-fast'></i> Submit";
                createWarningModal("Something went wrong. Your message has not been sent. Try again.");
            }
        })
        .catch(error => {
            console.log(error);
        })
    });


    return form;
}
//=======================//
async function createTestimonySection() {
    showLoadingSpinner();

    const main_container = document.getElementById('main-container');
    main_container.innerHTML = "";

    let data = [];
    const q = query(collection(db, "testimonials"), where("shouldUse", "==", true));
    const querySnapshott = await getDocs(q);
    querySnapshott.forEach((doc) => {
        let testy = doc.data();
        data.push(testy);
    });

    let avatars = [
        {gender: "male", avatar: "img/avatar/man.png"},
        {gender: "male", avatar: "img/avatar/man1.png"},
        {gender: "male", avatar: "img/avatar/man2.png"},
        {gender: "male", avatar: "img/avatar/man3.png"},
        {gender: "female", avatar: "img/avatar/woman.png"},
        {gender: "female", avatar: "img/avatar/woman1.png"},
        {gender: "female", avatar: "img/avatar/woman2.png"},
    ];
  // Create the section element
  const section = document.createElement('section');
  section.className = 'testimony-section section';

  const section_header_container = document.createElement('div');
    section_header_container.className = 'section-header-container';

    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.innerHTML = '<i class="fa-solid fa-award"></i>';
    section_header_container.appendChild(thumbnail);

    const header_contents = document.createElement('div');
    header_contents.className= 'header-contents';
    header_contents.innerHTML = `
        <h1>Testimonials</h1>
        <p>See what our clients say<p>
    `;
    section_header_container.appendChild(header_contents);
    section.appendChild(section_header_container);

  // Create the container for the testimonies
  const testimonyContainer = document.createElement('div');
  testimonyContainer.className = 'testimony-container';

    // Create the dot container
    const dotContainer = document.createElement('div');
    dotContainer.className = 'dot-container';

  // Create the testimony divs and add them to the container
  data.forEach((item, index) => {
    // Create the testimony div
    const testimonyDiv = document.createElement('div');
    testimonyDiv.className = 'testimony';
    if (index !== 0) {
      testimonyDiv.style.display = 'none'; 
    }else{
        testimonyDiv.classList.add('show');
    }

    // Create the client div
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client';

    // Create the image element
    const img = document.createElement('img');
    if(item.client_img){
        img.src = item.client_img;
    }else{
        // Filter avatars by gender
        const genderAvatars = avatars.filter(avatar => avatar.gender === item.gender.toLowerCase());
        // Pick a random avatar
        const randomAvatar = genderAvatars[Math.floor(Math.random() * genderAvatars.length)];
        img.src = randomAvatar.avatar;
    }
    img.alt = `${item.name}'s picture`;

    // Create the h2 element
    const h2 = document.createElement('h2');
    h2.textContent = item.name;

    const instP = document.createElement('em');
    instP.innerHTML = item.institute;
    // Create the rating div
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating';

    // Add star icons to the rating div
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      if (i < item.rating) {
        star.classList.add('filled');
        star.innerHTML = '<i class="fa-solid fa-star"></i>';
      }else{
        star.innerHTML = '<i class="fa-regular fa-star"></i>'; 
      }
      ratingDiv.appendChild(star);
    }

    const clientInfoContainer = document.createElement('div');
    clientInfoContainer.className = "client-info-container";
    // Append img, h2, and rating div to client div
    clientDiv.appendChild(img);
    clientInfoContainer.appendChild(h2);
    clientInfoContainer.appendChild(instP);
    clientInfoContainer.appendChild(ratingDiv);
    clientDiv.appendChild(clientInfoContainer);
    // Create the comment div
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    // Create the blockquote element
    const blockquote = document.createElement('blockquote');
    blockquote.textContent = item.comment;

    // Append blockquote to comment div
    commentDiv.appendChild(blockquote);

    // Append client div and comment div to testimony div
    testimonyDiv.appendChild(clientDiv);
    testimonyDiv.appendChild(commentDiv);

    // Append testimony div to the testimony container
    testimonyContainer.appendChild(testimonyDiv);

      // Create dot (span) for navigation
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => {
        showTestimony(index);
    });
    dotContainer.appendChild(dot);
  });


  // Create the navigation buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'prev-button';
  prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

  const centerButton = document.createElement('button');
  centerButton.className = 'play-pause-button';
  centerButton.innerHTML = '<i class="fa-solid fa-pause"></i>';

  const nextButton = document.createElement('button');
  nextButton.className = 'next-button';
  nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

  // Append the container and buttons to the section
  section.appendChild(testimonyContainer);
  section.appendChild(dotContainer);
  section.appendChild(prevButton);
  section.appendChild(centerButton);
  section.appendChild(nextButton);

  // Add event listeners to the buttons
  let currentIndex = 0;
  const testimonies = testimonyContainer.getElementsByClassName('testimony');

  nextButton.addEventListener('click', () => {
    showTestimony((currentIndex + 1) % testimonies.length);
  });

  prevButton.addEventListener('click', () => {
    showTestimony((currentIndex - 1 + testimonies.length) % testimonies.length);
  });

    // Variable to hold the interval reference
    let testimonialInterval;

    // Function to start the interval
    function startTestimonialInterval() {
    testimonialInterval = setInterval(() => {
        nextButton.click();
    }, 8000);
    }

    // Start the interval initially
    startTestimonialInterval();

    // Add event listeners to pause and resume the interval on hover
    testimonyContainer.addEventListener('mouseover', () => {
        clearInterval(testimonialInterval); // Pause the interval on hover
        centerButton.classList.add('pop');
        centerButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        setTimeout(() => {
            centerButton.classList.remove('pop');
        }, 500);
    });

    testimonyContainer.addEventListener('mouseout', () => {
        startTestimonialInterval(); // Resume the interval on hover out
        centerButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    });


  function showTestimony(index) {
      // Hide the current testimony
      testimonies[currentIndex].classList.remove('show');
      testimonies[currentIndex].classList.add('hide');
  
      // Wait for the hide animation to finish before hiding it completely
      setTimeout(() => {
        testimonies[currentIndex].style.display = 'none';
        // Remove active class from current dot
        dotContainer.children[currentIndex].classList.remove('active');
        currentIndex = index;
        
        // Show the new testimony
        testimonies[currentIndex].classList.remove('hide');
        testimonies[currentIndex].classList.add('show');
        testimonies[currentIndex].style.display = 'flex';
        // Add active class to new dot
        dotContainer.children[currentIndex].classList.add('active');
      }, 600); // Duration should match the CSS transition duration
  }

  // Return the section element
  hideLoadingSpinner();
  
  main_container.appendChild(section);
}
//=======================//
// Function to animate numbers using IntersectionObserver
function animateNumbers() {
    const counters = document.querySelectorAll('.job-card .animate-number');
    const observerOptions = {
        root: null,
        threshold: 0.9
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.dataset.target;
                const isSlow = target < 100;
                const updateCounter = () => {
                    const count = +counter.innerText;
                    let increment;
                    let delay;

                    if (isSlow) {
                        increment = target / 400; // Smaller increment for slower animation
                        delay = 40; // Longer delay for slower animation
                    } else {
                        increment = target / 200;
                        delay = 10;
                    }

                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCounter, delay);
                    } else {
                        counter.innerText = target;
                        observer.unobserve(counter);
                    }
                };
                updateCounter();
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

//====================//
function createSocialMediaContainer() {
    const socialMediaData = [
        {
          "icon": '<i class="fa-solid fa-phone-volume"></i>',
          "name": "Phone",
          "url": "tel:+8801521200315"
        },
        {
          "icon": '<i class="fa-brands fa-whatsapp"></i>',
          "name": "Whatsapp",
          "url": "https://wa.me/8801521200315"
        },
        {
            "icon": '<i class="fa-brands fa-facebook-messenger"></i>',
            "name": "Messenger",
            "url": "https://www.messenger.com/t/100009197401971/"
        },
        {
            "icon": '<i class="fa-solid fa-paper-plane"></i>',
            "name": "Telegram",
            "url": "https://t.me/writertanvir"
        },
        {
          "icon": '<i class="fa-brands fa-upwork"></i>',
          "name": "Upwork",
          "url": "https://www.instagram.com/yourprofile"
        }
    ];

    // Create the social-media-container div
    const socialMediaContainer = document.createElement('div');
    socialMediaContainer.classList.add('social-media-container');

    // Iterate over the social media data to create media-item divs
    socialMediaData.forEach(media => {
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');

        // Create an anchor element for the media link
        const mediaLink = document.createElement('a');
        mediaLink.href = media.url;
        mediaLink.setAttribute('data-label',media.name.toLocaleLowerCase());
        mediaLink.target = media.name !== "Phone" ? '_blank' : '_self';
        
        // Create span for the icon
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = media.icon;

        // Append icon to mediaLink
        mediaLink.appendChild(iconSpan);

        // Append mediaLink to media-item
        mediaItem.appendChild(mediaLink);

        // Append media-item to social-media-container
        socialMediaContainer.appendChild(mediaItem);
    });

    return socialMediaContainer;
}

function createModal(packageData, serviceName) {
    // Create the modal container
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Create the modal header
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    // Create the modal title
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Place Order';

    // Create the close button
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';

    // Append title and close button to header
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Create the modal body
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    // Create the selected-package div
    const selectedPackage = document.createElement('div');
    selectedPackage.classList.add('selected-package');
    selectedPackage.innerHTML = `
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Package:</strong> ${packageData.package_name}</p>
        <p><strong>Package included:</strong> ${packageData.slogan}</p>
        <p><strong>Price:</strong> ${packageData.price} TK.</p>
    `;


    // Create the order-form-container div
    const orderFormContainer = document.createElement('div');
    orderFormContainer.classList.add('order-form-container');

    // Create whatsapp-order div
    const whatsappOrder = document.createElement('div');
    whatsappOrder.classList.add('whatsapp-order');
    const whatsappIcon = document.createElement('span');
    whatsappIcon.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    const whatsappText = document.createElement('span');
    whatsappText.textContent = 'Order via WhatsApp';
    whatsappOrder.appendChild(whatsappIcon);
    whatsappOrder.appendChild(whatsappText);
    whatsappOrder.addEventListener('click', () => {
         // Constructing the text message
        let text = `Hello, I'm interested in the ${packageData.package_name} package of ${serviceName} service.\n\n`;
        text += `Service: ${serviceName}\n`;
        text += `Package: ${packageData.package_name}\n`;
        text += `Package included: ${packageData.slogan}\n`;
        text += `Price: ${packageData.price}\n\n`;
        text += "Package Details:\n";
        packageData.package_details.forEach(detail => {
            text += `• ${detail}\n`;
        });

        // Encode the text message for the URL
        const encodedText = encodeURIComponent(text);

        // Open WhatsApp link with the constructed text message
        window.open(`https://wa.me/8801521200315?text=${encodedText}`, '_blank');
    });

    // Create email-order div
    const emailOrder = document.createElement('div');
    emailOrder.classList.add('email-order');
    const emailIcon = document.createElement('span');
    emailIcon.innerHTML = '<i class="fa-solid fa-envelope-open-text"></i>';
    const emailText = document.createElement('span');
    emailText.textContent = 'Order via Email';
    emailOrder.appendChild(emailIcon);
    emailOrder.appendChild(emailText);
    emailOrder.addEventListener('click', () => {
        // Constructing the email body
        let subject = encodeURIComponent(`Interested in ${packageData.package_name} Package of ${serviceName} service`).replace(/%20/g, ' ');
        let body = `Service: ${serviceName}\n`;
        body += `Package: ${packageData.package_name}\n`;
        body += `Package included: ${packageData.slogan}\n`;
        body += `Price: ${packageData.price}\n\n`;
        body += "Package Details:\n";
        packageData.package_details.forEach(detail => {
            body += `- ${detail}\n`;
        });
        body = encodeURIComponent(body);

        // Open email client with the constructed email
        window.location.href = `mailto:tanvir.writes.content@gmail.com?subject=${subject}&body=${body}`;
    });
    // Create form-order div
    const formOrder = document.createElement('div');
    formOrder.classList.add('form-order');
    const formIcon = document.createElement('span');
    formIcon.innerHTML = '<i class="fa-solid fa-file-pen"></i>';
    const formText = document.createElement('span');
    formText.textContent = 'Order via Form';
    formOrder.appendChild(formIcon);
    formOrder.appendChild(formText);

    // Add click event to form-order to remove other order options
    formOrder.addEventListener('click', () => {
        window.location.href = `https://tanvir-abid.github.io/tanvirWrites/registration/index.html?id=${packageData.ID}`;
    });

    // Append order options to order-form-container
    orderFormContainer.appendChild(whatsappOrder);
    orderFormContainer.appendChild(emailOrder);
    orderFormContainer.appendChild(formOrder);
    // Append selected-package and order-form-container to modal body
    modalBody.appendChild(selectedPackage);
    modalBody.appendChild(orderFormContainer);

    // Append header and body to modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    // Append modal content to modal
    modal.appendChild(modalContent);

    // Add event listener to close button to close the modal
    closeButton.addEventListener('click', () => {
        closeModal();
    });

    // Add event listener to window to close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Return the modal element
    document.body.appendChild(modal);

    function closeModal() {
        modal.style.animation = 'fadeOut 0.5s forwards';
        modalContent.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => {
            modal.remove();
        }, 500);
    }
}

function showLoadingSpinner() {
    // Create the loading container div
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    
    // Create multiple loading dots for the animation
    for (let i = 0; i < 4; i++) {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loadingContainer.appendChild(loading);
    }
    
    // Append the loading container to the body
    document.body.appendChild(loadingContainer);
}

// Function to remove the loading spinner
function hideLoadingSpinner() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        document.body.removeChild(loadingContainer);
    }
}

function createWarningModal(text,header) {
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';

    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    // Create header text
    const headerText = document.createElement('h3');

    // Create close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
    closeButton.onclick = function() {
        closeModal();
    };

    // Append header text and close button to header
    modalHeader.appendChild(headerText);
    modalHeader.appendChild(closeButton);

    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body warning';

    // headerText.innerHTML = header || '<i class="fa-solid fa-circle-radiation"></i> Warning';
    // Determine the content of the header
    if (typeof header === 'string') {
        headerText.innerHTML = header;
    } else {
        headerText.innerHTML = '<i class="fa-solid fa-circle-radiation"></i> Warning';
    }
    
    const bodyText = document.createElement('div');
    bodyText.innerHTML = text;  // Append body text to body
    modalBody.appendChild(bodyText);

    // Append header and body to content container
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    // Append content container to modal
    modal.appendChild(modalContent);

    // Append modal to document body
    document.body.appendChild(modal);

    // Close modal when clicking outside of the modal content
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    function closeModal() {
        modal.style.animation = 'fadeOut 0.5s forwards';
        modalContent.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => {
            modal.remove();
        }, 499);
    }
}


