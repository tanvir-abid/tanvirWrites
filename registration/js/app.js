import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore,collection, addDoc,getDoc,updateDoc,doc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

//=================================================//

async function fetchData() {
    const response = await fetch('https://tanvir-abid.github.io/tanvirWrites/data/data.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// document.addEventListener('DOMContentLoaded', retrievePackageData);

document.addEventListener('DOMContentLoaded',async ()=>{
    const container = document.querySelector('main');
    container.innerHTML = "";

    const main_container = document.createElement('div');
    main_container.id = 'main-container';
    container.appendChild(main_container);

    const authorDiv = createAuthorContainer();
    main_container.appendChild(authorDiv);


    const urlParams = new URLSearchParams(window.location.search);
    const planID = urlParams.get('id');

    if (planID) {
        try {
            const data = await fetchData();
            let matchingPackage = null;
            data.services.forEach(service => {
                service.price_tables.forEach(plan => {
                    if (plan.ID === planID) {
                        matchingPackage = plan;
                    }
                });
            });

            const formElement = createForm(matchingPackage);
            main_container.appendChild(formElement);
        } catch (error) {
            console.error('Error parsing package data:', error);
            createModal("There might be a network issue. Please, check internet connection and reload the page. Thank you.")
        }
    } else {
        const warningMessage = `
            <h3>No Plan Selected</h3>
            <p>You have not selected any plan.</p>
            <p>Please go back to the home page and choose a plan to proceed with your registration.</p>
            <p class="gotoHome"><a href="../index.html">Go to Home Page</a></p>
        `;

        createModal(warningMessage);

        const formElement = createForm();
        main_container.appendChild(formElement);
    }
    
});

//==========================//
function createAuthorContainer() {
    // Create the main author container
    const authorContainer = document.createElement('div');
    authorContainer.className = 'author-container';

    // Create the logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';

    // Create and append the image to logo container
    const logoImg = document.createElement('img');
    logoImg.src = 'img/ink.png'; 
    logoImg.alt = 'Author Logo';
    logoContainer.appendChild(logoImg);

    // Create the info container
    const infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';

    // Create and append the heading for name
    const nameHeader = document.createElement('h2');
    nameHeader.textContent = 'Tanvir Writes'; 
    infoContainer.appendChild(nameHeader);

    const authorInfo = document.createElement('div');
    authorInfo.innerHTML = `
        <p><i class="fa-solid fa-user"></i> Tanvir Abid</p>
        <p><i class="fa-solid fa-mug-hot"></i> SEO Expert & Content Writer</p>
        <p><strong><i class="fa-solid fa-signal"></i> Mobile:</strong> <a href="tel:+8801521200315">+8801521200315</a>, <a href="tel:+8801854702384">+8801854702384</a></p>
        <p><strong><i class="fa-solid fa-at"></i> Email:</strong> <a href="mailto:Tanvir.writes.content@gmail.com">Tanvir.writes.content@gmail.com</a></p>

    `;
    infoContainer.appendChild(authorInfo);

    const socialMediaContainer = createSocialMediaContainer();
    infoContainer.appendChild(socialMediaContainer);

    // Append logo container and info container to the author container
    authorContainer.appendChild(logoContainer);
    authorContainer.appendChild(infoContainer);

    // Return the complete author container
    return authorContainer;
}

//=======================//
function createForm(plan) {
    // Create the form element
    const form = document.createElement('form');

    if(plan){
        // Create the personal container
        const planContainer = document.createElement('div');
        planContainer.className = 'plan-container column';
        form.appendChild(planContainer);

        // Create a header for the personal information section
        const planHeader = document.createElement('h2');
        planHeader.textContent = 'Plan Details';
        planContainer.appendChild(planHeader);

        const planInputGroupContainer = document.createElement('div');
        planInputGroupContainer.className = 'input-group-container';
        planContainer.appendChild(planInputGroupContainer);

        planInputGroupContainer.innerHTML = `
            <div class="input-group"><h3><i class="fa-solid fa-briefcase"></i> ${plan.serviceName}</h3></div>
            <div class="input-group"><label><i class="fa-regular fa-folder-open"></i> <strong>Plan:</strong> ${plan.package_name}</label></div>
            <div class="input-group"><label><i class="fa-solid fa-bars-progress"></i> <strong>Cover: </strong> ${plan.slogan}</label></div>
            <div class="input-group" id='price'><label><i class="fa-solid fa-money-bill-wave"></i> <strong>Price (TK.):  </strong> ${plan.price}</label></div>
            <div class="input-group"><label><i class="fa-solid fa-layer-group"></i> <strong>Category:  </strong> ${plan.plan_category.toUpperCase()}</label></div>
            <div class="input-group"><label><i class="fa-solid fa-list-check"></i> <strong>Features: </strong></label></div>
        `;
        const packageDetailsList = createPackageDetailsList(plan.package_details);
        planInputGroupContainer.appendChild(packageDetailsList);

        // Create the coupon-container div
        const couponContainer = document.createElement('div');
        couponContainer.className = 'coupon-container';
        // Create the p tag
        const pTag = document.createElement('p');
        pTag.textContent = 'Have a coupon? ';
        // Create the span tag
        const spanTag = document.createElement('span');
        spanTag.textContent = 'Click here to apply';
        // Add click event to span tag
        spanTag.addEventListener('click', () => {
            // Remove the p tag
            couponContainer.removeChild(pTag);
            // Create the coupon-inputs div
            const couponInputsDiv = document.createElement('div');
            couponInputsDiv.className = 'coupon-inputs';
            // Create the text input for coupon code
            const couponInput = document.createElement('input');
            couponInput.type = 'text';
            couponInput.name = 'couponCode';
            couponInput.placeholder = 'Enter coupon code';
            couponInputsDiv.appendChild(couponInput);
            // Create the apply button
            const applyButton = document.createElement('button');
            applyButton.type = 'button'; // Changed to 'button' to prevent form submission
            applyButton.innerHTML = 'Apply';
            couponInputsDiv.appendChild(applyButton);
            // Add click event to the apply button
            applyButton.addEventListener('click',async () => {
                applyButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                const couponCode = couponInput.value;

                const docRef = doc(db, "Coupons", couponCode);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let priceElm = document.getElementById('price');
                    let couponDetail =  docSnap.data();

                    if(!couponDetail.isUsed){
                        let newPrice;
                        if(couponDetail.category === "amount"){
                            newPrice = plan.price.replace(/[^0-9.-]+/g, '') - couponDetail.value;

                        }else{
                            newPrice = plan.price.replace(/[^0-9.-]+/g, '') - (plan.price.replace(/[^0-9.-]+/g, '')*(couponDetail.value/100));
                        }

                        plan.price = `৳${newPrice}`;
                        plan.couponCode = couponDetail.id;
                        priceElm.innerHTML = `<label><i class="fa-solid fa-money-bill-wave"></i> <strong>Price (TK.):  </strong> ৳ ${newPrice}</label>`;
                        
                        couponInputsDiv.innerHTML = "Code applied successfully.";

                        const couponDocRef = doc(db, "Coupons", couponDetail.id);
                        await updateDoc(couponDocRef, {
                            isUsed: true
                        });
                        setTimeout(() => {
                            couponInputsDiv.remove();
                        }, 2000);
                    }else{
                        createModal("Sorry, This coupon has already been used.");
                        applyButton.innerHTML = 'Apply';
                    }
                } else {
                    createModal("No Coupon Code Found");
                    applyButton.innerHTML = 'Apply';
                }
                //console.log(`Coupon code: ${couponCode}, ${plan.price.replace(/[^0-9.-]+/g, '')}`);
                
            });
            // Append the coupon-inputs div to the coupon-container
            couponContainer.appendChild(couponInputsDiv);
        });

        // Append the span tag to the p tag
        pTag.appendChild(spanTag);

        // Append the p tag to the coupon-container
        couponContainer.appendChild(pTag);
        if(plan.price !== 'Variable'){
            planContainer.appendChild(couponContainer);
        }

        form.appendChild(planContainer);
    }
    // Create the personal container
    const personalContainer = document.createElement('div');
    personalContainer.className = 'personal-container column';
    form.appendChild(personalContainer);

    // Create a header for the personal information section
    const personalHeader = document.createElement('h2');
    personalHeader.textContent = 'Personal Information';
    personalContainer.appendChild(personalHeader);

    // Create a container for input groups in personal container
    const personalInputGroupContainer = document.createElement('div');
    personalInputGroupContainer.className = 'input-group-container';
    personalContainer.appendChild(personalInputGroupContainer);

    // Create input groups for personal information
    const personalFields = [
        { type: 'text', label: 'Full Name', name: 'name', icon: '<i class="fa-regular fa-user"></i>' },
        { type: 'email', label: 'Email', name: 'email', icon: '<i class="fa-regular fa-envelope"></i>' },
        { type: 'tel', label: 'Mobile', name: 'mobile', icon: '<i class="fa-solid fa-headset"></i>' },
        { type: 'text', label: 'Institute', name: 'institute', icon: '<i class="fa-solid fa-building-columns"></i>' },
        { type: 'select', label: 'Gender', name: 'gender', options: ['Male', 'Female', 'Other'], icon: '<i class="fa-solid fa-venus-mars"></i>' }
    ];

    personalFields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const label = document.createElement('label');
        label.innerHTML = `${field.icon} ${field.label}`;
        group.appendChild(label);

        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
        }
        input.required = true;
        group.appendChild(input);

        personalInputGroupContainer.appendChild(group);
    });

    // Create the project container
    const projectContainer = document.createElement('div');
    projectContainer.className = 'project-container column';
    form.appendChild(projectContainer);

    // Create a header for the project information section
    const projectHeader = document.createElement('h2');
    projectHeader.textContent = 'Project Information';
    projectContainer.appendChild(projectHeader);

    // Create a container for input groups in project container
    const projectInputGroupContainer = document.createElement('div');
    projectInputGroupContainer.className = 'input-group-container';
    projectContainer.appendChild(projectInputGroupContainer);

    // Create input groups for project information
    const projectFields = [
        { type: 'text', label: 'Project Title', name: 'projectTitle', icon: '<i class="fa-solid fa-atom"></i>' },
        { type: 'date', label: 'Estimated End/Defense Date', name: 'defenseDate', icon: '<i class="fa-regular fa-calendar-days"></i>' },
        { type: 'textarea', label: 'Project Synopsis', name: 'projectSynopsis', icon: '<i class="fa-solid fa-austral-sign"></i>' }
    ];

    projectFields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const label = document.createElement('label');
        label.innerHTML = `${field.icon} ${field.label}`;
        group.appendChild(label);

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.name = field.name;
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.required = true;
        }
        group.appendChild(input);

        projectInputGroupContainer.appendChild(group);
    });

    // Create the termGroup div
    const termGroup = document.createElement('div');
    termGroup.classList.add('input-group', 'terms');

    // Create the checkbox input element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'terms-checkbox';
    checkbox.name = 'terms';

    // Create the label element for the checkbox
    const label = document.createElement('label');
    label.htmlFor = 'terms-checkbox';
    label.innerHTML = `I agree to the <a href="#">Terms & Conditions</a>`;

    // Append the checkbox and label to the termGroup div
    termGroup.appendChild(checkbox);
    termGroup.appendChild(label);

    // Append the termGroup to the body or any other container
    projectContainer.appendChild(termGroup);
    
    const btn_container = document.createElement('div');
    btn_container.classList.add('btn-container');

    const button = document.createElement('button');
    button.type = 'submit'
    button.innerHTML = '<i class="fa-solid fa-user-pen"></i> Register';
    btn_container.appendChild(button);
    projectContainer.appendChild(btn_container);

    form.addEventListener('submit',async (e) => {
        e.preventDefault();
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering';

        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData);

        if (checkbox.checked) {
            const currentTimestamp = new Date().toISOString();
            const registrationData = {
                client: {
                    clientName: formObject.name,
                    timestamp: currentTimestamp,
                    email: formObject.email,
                    institute: formObject.institute,
                    mobile: formObject.mobile,
                    ...(plan && plan.couponCode && { couponCode: plan.couponCode }) // Add couponCode if it exists in the plan object
                },
                progress: {
                    projectName: formObject.projectTitle,
                    startDate: formObject.defenseDate,
                    status: {
                        statusTitle: "Not started",
                        timestamp: currentTimestamp,
                        percentage: 0
                    }
                },
                budget: {
                    due: plan ? Number(plan.price.replace(/[^\d]/g, '')) : 0,
                    paid: 0
                },
                package: plan ? {
                    serviceName: plan.serviceName,
                    package_name: plan.package_name,
                    price: plan.price,
                    category: plan.plan_category,
                    cover: plan.slogan
                } : {
                    serviceName: '',
                    package_name: '',
                    price: 0,
                    category: '',
                    cover: ''
                }
            };
            
            try {
                const docRef = await addDoc(collection(db, "Projects"), registrationData);
                createModal('success', true);
                button.innerHTML = '<i class="fa-solid fa-user-pen"></i> Register';
            } catch (error) {
                console.error("Error adding document:", error);
                button.innerHTML = '<i class="fa-solid fa-user-pen"></i> Register';
            }
              
        } else {
            createModal('Please, agree with the terms and conditions.');
            button.innerHTML = '<i class="fa-solid fa-user-pen"></i> Register';
        }
    });

    // Return the form element
    return form;
}

function createPackageDetailsList(packageInfo) {
  // Create a new unordered list element
  const ol = document.createElement('ol');

  // Loop through the package details and create list items for each detail
  packageInfo.forEach(detail => {
    const li = document.createElement('li');
    li.textContent = detail;
    ol.appendChild(li);
  });

  return ol;
}

//==========================//
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
//=============================//
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
        <h2>Registration Successful!</h2>
        <p>Thank you for registering with us.</p>
        <p>Your information has been successfully recorded.</p>
        <p>We look forward to providing you with excellent service and support.</p>
        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
    `;

  } else {
    headerText.innerHTML = '<i class="fa-solid fa-circle-radiation"></i> Warning';
    const bodyText = document.createElement('div');
    bodyText.innerHTML = text;  // Append body text to body
    modalBody.appendChild(bodyText);
  }



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

  function closeModal(){
    modal.classList.add('hide');
    modalContent.classList.add('hide');
    setTimeout(() => {
        modal.remove();
    }, 499);
  }
}




