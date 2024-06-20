import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore,collection, addDoc,getDocs,updateDoc,doc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", function() {
    // Create main-container div
    var mainContainer = document.createElement("div");
    mainContainer.id = "main-container";

       // Create author-container div
    const authorContainer = document.createElement("div");
    authorContainer.id = "author-container";

    const info_container = document.createElement('div');
    info_container.className = 'info-container';

        const logo_container = document.createElement('div');
        logo_container.className = 'logo';
    logo_container.innerHTML = `
        <img src="img/typewriter.png">
    `;
    info_container.appendChild(logo_container);

    const info_list = document.createElement('div');
    
    // Create heading for author name
    const authorNameHeading = document.createElement("h1");
    authorNameHeading.textContent = "Tanvir Writes";
    info_list.appendChild(authorNameHeading);

    // Define author information

   const author_info_list = document.createElement('ul');
   author_info_list.innerHTML = `
            <li>
                <strong><i class="fa-solid fa-user-graduate"></i> Tanvir Abid</strong>
            </li>
            <li>
                <em><i class="fa-solid fa-mug-saucer"></i> SEO Expert & Content Writer</em>
            </li>
            <li>
                <strong><i class="fa-solid fa-phone-volume"></i> Mobile:</strong> <a href="tel:+8801521200315">+8801521200315</a>,<a href="tel:+8801854702384">+8801854702384</a>
            </li>
            <li>
                <strong><i class="fa-solid fa-at"></i> Email:</strong> <a href="mailto:tanvir.writes.content@gmail.com">Tanvir.writes.content@gmail.com</a>
            </li>
   `;
    info_list.appendChild(author_info_list);
    info_container.appendChild(info_list);

    const social_media = createSocialMediaContainer();
    info_container.appendChild(social_media);
    // Append author-container before the form
    mainContainer.appendChild(info_container);
    
    const form_container = document.createElement('div');
    form_container.className = 'form-container';

    const form_header = document.createElement('div');
    form_header.className = 'form-header';
    form_header.innerHTML = `
        <h2>We care your feedback</h2>
        <p>write your opinion, suggestion or any comment on our services.</p>
    `;
    
    form_container.appendChild(form_header)
    // Create form element
    let form = document.createElement("form");
    form.id = "feedback-form";

    // Define input groups
    let inputGroups = [
        { label: "Name", type: "text", name: "name", required: true, icon:'<i class="fa-regular fa-user"></i>' },
        { label: "Email", type: "email", name: "email", required: true, icon: '<i class="fa-regular fa-envelope"></i>' },
        { label: "Institute", type: "text", name: "institute", required: true, icon:'<i class="fa-solid fa-building-columns"></i>' },
        { label: "Gender", type: "select", name: "gender", required: true, options: ["Male", "Female", "Other"], icon: '<i class="fa-solid fa-venus-mars"></i>' },
        { label: "Comment", type: "textarea", name: "comment", required: true, icon:'<i class="fa-regular fa-comment-dots"></i>' }
    ];

    // Variable to store user rating
    let userRating = 0;

    // Create input groups
    inputGroups.forEach(function(inputGroup) {
        let groupDiv = document.createElement("div");
        groupDiv.classList.add("input-group","inputs");

        let label = document.createElement("label");
        label.innerHTML = `<span>${inputGroup.icon} ${inputGroup.label}</span>`;
        groupDiv.appendChild(label);

        if(inputGroup.label === 'Name' || inputGroup.label === 'Email' || inputGroup.label === 'Institute'){
            label.className = `${inputGroup.label.toLowerCase()}-label`;
        }
        
        let input;
        if(inputGroup.type === 'textarea'){
            input = document.createElement("textarea");
            input.name = inputGroup.name;
            groupDiv.classList.add("comment");
            input.required = true;
            label.className = `${inputGroup.label.toLowerCase()}-label`;
        }else if (inputGroup.type === 'select') {
            input = document.createElement("select");
            input.name = inputGroup.name;
            input.required = true;
            // Create options for select
            inputGroup.options.forEach(function(optionValue) {
                var option = document.createElement("option");
                option.text = optionValue;
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = inputGroup.type;
            input.name = inputGroup.name;
            if (inputGroup.required) {
                input.required = true;
            }
        }
        groupDiv.appendChild(input);

        if (inputGroup.type === 'textarea') {
            let charCount = document.createElement("span");
            const maxCharacters = 600;
            charCount.textContent = `${maxCharacters} Characters`;
            charCount.classList.add("char-count");
            label.appendChild(charCount);
        
            input.addEventListener("input", () => {
                const remainingCharacters = maxCharacters - input.value.length;
                charCount.textContent = `${remainingCharacters} Characters`;
        
                if (input.value.length > maxCharacters) {
                    createModal('You have exceeded the 600 characters limit.');
                    input.value = input.value.substring(0, maxCharacters);
                    charCount.textContent = `0 Characters`;
                }
            });
        }
        
        
        // Add focus and blur event listeners
        input.addEventListener('focus', function() {
            groupDiv.classList.add('active');
        });
        input.addEventListener('blur', function() {
            groupDiv.classList.remove('active');
        });

        // Add input event listener to handle 'selected' class
        input.addEventListener('input', function() {
            if (input.value !== "") {
                groupDiv.classList.add('selected');
            } else {
                groupDiv.classList.remove('selected');
            }
        });

        form.appendChild(groupDiv);
    });

    // Create rating input group and add to form
    const ratingInputGroup = createRatingInputGroup("Rating:");
    form.appendChild(ratingInputGroup);

    // Create submit button
    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.setAttribute('data-text', 'Submit Your Feedback');
    submitButton.innerHTML = `<span><i class="fa-solid fa-paper-plane"></i> Your Feedback Is Important</span>`;
    btnContainer.appendChild(submitButton)
    form.appendChild(btnContainer);

    // Append form to main container
    form_container.appendChild(form);
    mainContainer.appendChild(form_container);
    document.querySelector('main').appendChild(mainContainer);

    // Add event listener for form submission
    form.addEventListener("submit",async function(event) {
        event.preventDefault();
        submitButton.setAttribute('data-text', 'Submitting');
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting';
        // Collect form data
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);

        // Add user rating to form data object
        if(userRating !== 0){
            object.rating = userRating;
            object.shouldUse = false;

            try {
                // Add a new document with a generated id.
                const docRef = await addDoc(collection(db, "testimonials"),object);
                console.log("Document written with ID: ", docRef.id);

                createModal('Thank You for submitting your feedback.', true);
                submitButton.setAttribute('data-text', 'Submit Your Feedback');
                submitButton.innerHTML = `<span><i class="fa-solid fa-paper-plane"></i> Your Feedback Is Important</span>`;
            } catch (e) {
                console.error("Error adding document: ", e);
                createModal('Please, rate the service.');
                submitButton.setAttribute('data-text', 'Submit Your Feedback');
                submitButton.innerHTML = `<span><i class="fa-solid fa-paper-plane"></i> Your Feedback Is Important</span>`;
            }
            
        }else{
            createModal('Please, rate the service.');
            submitButton.setAttribute('data-text', 'Submit Your Feedback');
            submitButton.innerHTML = `<span><i class="fa-solid fa-paper-plane"></i> Your Feedback Is Important</span>`;
        }


    });

    function createRatingInputGroup(labelText) {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("input-group","rating-group");

        const label = document.createElement("label");
        label.innerHTML = `<i class="fa-brands fa-gratipay"></i> ${labelText}`;
        groupDiv.appendChild(label);

        const ratingDiv = document.createElement("div");
        ratingDiv.classList.add("rating");

        let stars = [];
        // Create 5 spans for star icons
        for (let i = 1; i <= 5; i++) {
            const starSpan = document.createElement("span");
            starSpan.innerHTML = '<i class="fa-solid fa-star"></i>'; // Star icon
            starSpan.dataset.rating = i;
            stars.push(starSpan);

            starSpan.addEventListener("click", function() {
                const clickedRating = parseInt(this.dataset.rating);
                userRating = clickedRating;
                for (let j = 1; j <= 5; j++) {
                    if (j <= clickedRating) {
                        stars[j - 1].classList.add("selected");
                    } else {
                        stars[j - 1].classList.remove("selected");
                    }
                }
                console.log("User rated: " + clickedRating + " stars");
            });
            ratingDiv.appendChild(starSpan);
        }

        groupDiv.appendChild(ratingDiv);
        return groupDiv;
    }

});



const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];
const numberOfSnowflakes = 100;

class Snowflake {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.wind = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speed;
        this.x += this.wind;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

function init() {
    for (let i = 0; i < numberOfSnowflakes; i++) {
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speed = Math.random() * 1 + 0.5;
        snowflakes.push(new Snowflake(x, y, radius, speed));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach(snowflake => {
        snowflake.update();
        snowflake.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

init();
animate();
//===================//
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
          "url": "https://www.upwork.com/freelancers/~01eed48e0b0dbcd41b"
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
//===================//
function createModal(text, status = false) {
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
  const headerText = document.createElement('p');
  

  // Create close button
  const closeButton = document.createElement('span');
  closeButton.className = 'close';
  closeButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
  closeButton.onclick = function() {
    closeModal();
  };

  // Append header text and close button to header
  modalHeader.appendChild(headerText);
  modalHeader.appendChild(closeButton);

  // Create modal body
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';

  // Create body text
  
  if (status) {
    headerText.innerHTML = '<i class="fa-solid fa-heart-circle-check"></i> Thank You';
    modalBody.innerHTML = `
        <h2>Feedback is submitted successfully.</h2>
        <p>Thank you for staying with us.</p>
        <p>We value your input and will use it to improve our services.</p>
        <p>If you have any further questions or comments, please feel free to reach out to us.</p>
    `;
  } else {
    headerText.innerHTML = '<i class="fa-solid fa-circle-radiation"></i> Warning';
    const bodyText = document.createElement('p');
    bodyText.innerHTML = text;  // Append body text to body
    modalBody.appendChild(bodyText);
  }



  // Append header and body to content container
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);

  // Append content container to modal
  modal.appendChild(modalContent);

  // Append modal to document body
  if (!document.getElementById('myModal')) {
    document.body.appendChild(modal);
  }

  // Close modal when clicking outside of the modal content
  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  };

  function closeModal(){
    modal.classList.add('hide');
    modalContent.classList.add('hide');
    setTimeout(() => {
        modal.remove();
    }, 499);
  }
}
