//=====================//
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore,collection,setDoc ,addDoc,getDocs,updateDoc,doc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth,signInWithEmailAndPassword,onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoadingSpinner();
    createSidebarAndMainContainer();
  } else {
    createSignInContainer();
  }
});


//=====================//
function createSignInContainer() {
    // Create the signIn-container div
    const signInContainer = document.createElement('div');
    signInContainer.className = 'signIn-container';

    // Create the h2 tag
    const heading = document.createElement('h2');
    heading.textContent = 'Sign In';
    signInContainer.appendChild(heading);

    // Create the form element
    const form = document.createElement('form');

    // Create the email input
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = "Enter your email here...";
    emailInput.required = true;
    form.appendChild(emailInput);

    // Create the password input
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.required = true;
    passwordInput.placeholder = "Wnter your password here..."
    form.appendChild(passwordInput);

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Sign In';
    form.appendChild(submitButton);

    // Append the form to the signIn-container
    signInContainer.appendChild(form);

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        showLoadingSpinner();

        const formData = new FormData(form);
        const formObj = Object.fromEntries(formData);

        signInWithEmailAndPassword(auth, formObj.email, formObj.password)
            .then((userCredential) => {
                createSidebarAndMainContainer();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                createModal(errorCode);
                hideLoadingSpinner();
            });
    })

    // Append the signIn-container to the main tag
    const mainTag = document.querySelector('main');
    if (mainTag) {
        mainTag.innerHTML = "";
        mainTag.appendChild(signInContainer);
    } else {
        console.error('No <main> tag found in the document.');
    }
}

//====================//
function createSidebarAndMainContainer() {
    hideLoadingSpinner();

    const container = document.querySelector('main');
    container.innerHTML = "";
    // Create sidebar-container
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'sidebar-container';
    
    // Create main-container
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';

    // Append sidebar-container and main-container to the body
    container.appendChild(sidebarContainer);
    container.appendChild(mainContainer);
    //----------------------//
    // Create logo-container
    const logoContainer = document.createElement('div');
    logoContainer.id = 'logo-container';

    const logoTitle = document.createElement('h1');
    logoTitle.textContent = 'Tanvir Writes';
    const logoSubtitle = document.createElement('p');
    logoSubtitle.textContent = 'Manage Your Clients';

    logoContainer.appendChild(logoTitle);
    logoContainer.appendChild(logoSubtitle);

    // Create menu-container
    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';

    const menuList = document.createElement('ul');
    menuList.id = 'menu-list';

    const menuItems = [
        {item: 'Home', icon:'<i class="fa-solid fa-house-flag"></i>'}, 
        {item: 'Order', icon:'<i class="fa-solid fa-cart-plus"></i>'}, 
        {item: 'Clients', icon:'<i class="fa-solid fa-users-line"></i>'}, 
        {item: 'Archieve', icon:'<i class="fa-solid fa-file-zipper"></i>'}, 
        {item: 'Setting', icon:'<i class="fa-solid fa-sliders"></i>'}, 
        {item: 'Sign Out', icon:'<i class="fa-solid fa-arrow-right-from-bracket"></i>'}
    ];

    menuItems.forEach((item, index) => {
        const menuItem = document.createElement('li');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `${item.icon} ${item.item}`;
        menuItem.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));

            // Add active class to the clicked item
            menuItem.classList.add('active');

            if(item.item === 'Home'){
                displayHome();
            }else if(item.item === 'Order'){
                displayOrders();
            }else if(item.item === 'Clients'){
                displayClients();
            }else if(item.item === 'Archieve'){
                displayArchieve();
            }else if(item.item === 'Setting'){
                displaySetting();
            }else if(item.item === 'Sign Out'){
                letSignOut();
            }
        });
        menuList.appendChild(menuItem);
        
        if(index === 0){
            menuItem.click();
        }
    });

    menuContainer.appendChild(menuList);

    // Append logo-container and menu-container to sidebar-container
    sidebarContainer.appendChild(logoContainer);
    sidebarContainer.appendChild(menuContainer);

    if(window.innerWidth <= 768){
        const toggle = document.createElement('div');
        toggle.classList.add('toggle');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.appendChild(toggle);

        toggle.addEventListener('click', ()=>{
            sidebarContainer.classList.toggle('active');
        });

        mainContainer.addEventListener('click', ()=>{
            if(sidebarContainer.classList.contains('active')){
                sidebarContainer.classList.remove('active');
            };
        });

    };
};

async function displayHome(){
    showLoadingSpinner();

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = "";

    let projects = [];

    const querySnapshot = await getDocs(collection(db, "Projects"));
    if (querySnapshot.empty) {
        let warning = createWarningContainer('No project is active now.');
        mainContainer.appendChild(warning);
        alert("No documents found in the 'cities' collection!");
    } else {
      querySnapshot.forEach((doc) => {
        projects.push(doc.data());
      });
    }

    const homeContainer = document.createElement('div');
    homeContainer.className = "home-container";

    const gradients = [
        "linear-gradient(to top, rgba(0, 128, 255, 0.3), rgba(224, 255, 255, 0.3))", // Soft Blue to Light Cyan
        "linear-gradient(to top, rgba(128, 0, 128, 0.3), rgba(255, 192, 203, 0.3))", // Purple to Pink
        "linear-gradient(to top, rgba(0, 128, 128, 0.3), rgba(144, 238, 144, 0.3))", // Teal to Light Green
        "linear-gradient(to top, rgba(0, 0, 139, 0.3), rgba(173, 216, 230, 0.3))", // Dark Blue to Light Blue
        "linear-gradient(to top, rgba(255, 140, 0, 0.3), rgba(255, 255, 224, 0.3))" // Dark Orange to Light Yellow
    ];
    let currentIndex = 0;
    
    projects.forEach(project => {
        let clientCard = createCard(project, gradients[currentIndex]);
        homeContainer.appendChild(clientCard);
        // Increment the index and wrap around if necessary
        currentIndex = (currentIndex + 1) % gradients.length;
    });    

    hideLoadingSpinner();

    mainContainer.appendChild(homeContainer);
}

function createCard(data, gradient) {
    // Create the main card container
    const card = document.createElement('div');
    card.className = 'card';

    // Create the background div
    const bgDiv = document.createElement('div');
    bgDiv.className = 'bg-div';
    bgDiv.style.background = gradient;
    bgDiv.style.height = data.progress.status.percentage+'%';
    card.appendChild(bgDiv);

    // Create the info container
    const infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';
    card.appendChild(infoContainer);

    // Create the client info div
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client';

    const clientName = document.createElement('h2');
    clientName.textContent = `${data.client.clientName}`;
    clientDiv.appendChild(clientName);

    const clientEmail = document.createElement('p');
    clientEmail.innerHTML = `Email: <a href="mailto:${data.client.email}">${data.client.email}</a>`;
    clientDiv.appendChild(clientEmail);

    const clientInstitute = document.createElement('p');
    clientInstitute.textContent = `Institute: ${data.client.institute}`;
    clientDiv.appendChild(clientInstitute);

    const clientMobile = document.createElement('p');
    clientMobile.innerHTML = `Mobile: <a href="tel:${data.client.mobile}">${data.client.mobile}</a>`;
    clientDiv.appendChild(clientMobile);

    infoContainer.appendChild(clientDiv);

    // Create the budget info div
    const budgetDiv = document.createElement('div');
    budgetDiv.className = 'budget';

    const budgetDue = document.createElement('p');
    if(isNaN(data.budget.due)){
        budgetDue.textContent = `Budget: Not Decided Yet`;
    }else{
        budgetDue.textContent = `Budget: ৳ ${data.budget.due}`;
    }
    budgetDiv.appendChild(budgetDue);

    const budgetPaid = document.createElement('p');
    budgetPaid.textContent = `Paid: ৳ ${data.budget.paid}`;
    budgetDiv.appendChild(budgetPaid);

    infoContainer.appendChild(budgetDiv);

    // Create the current status div
    const statusDiv = document.createElement('div');
    statusDiv.className = 'current-status';

    const statusTitle = document.createElement('p');
    statusTitle.textContent = `Status: ${data.progress.status.statusTitle}`;
    statusDiv.appendChild(statusTitle);

    const statusPercentage = document.createElement('p');
    statusPercentage.textContent = `Progress: ${data.progress.status.percentage}%`;
    statusDiv.appendChild(statusPercentage);

    infoContainer.appendChild(statusDiv);

    return card;
}

//====================================//
async function displayOrders(){
    showLoadingSpinner();

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = "";

    let projects = [];

    const querySnapshot = await getDocs(collection(db, "Projects"));
    if (querySnapshot.empty) {
        let warning = createWarningContainer('No project is active now.');
        mainContainer.appendChild(warning);
        alert("No documents found in the 'cities' collection!");
    } else {
      querySnapshot.forEach((doc) => {
        let project = doc.data();
        project.client.id = doc.id;
        projects.push(project);
      });
    }

    const orderContainer = document.createElement('div');
    orderContainer.className = 'order-container';

    const orderHeaderDiv = document.createElement('div');
    orderHeaderDiv.className = 'order-header';
    orderContainer.appendChild(orderHeaderDiv);

    const orderDetailContainer = document.createElement('div');
    orderDetailContainer.className = 'order-detail-container';
    orderContainer.appendChild(orderDetailContainer);

    projects.forEach((project, index) => {
        const clientNameSpan = document.createElement('span');
        clientNameSpan.textContent = project.client.clientName;
        orderHeaderDiv.appendChild(clientNameSpan);
    
        clientNameSpan.addEventListener('click', () => {
            // Remove 'active' class from all spans
            document.querySelectorAll('.order-header span').forEach(span => span.classList.remove('active'));
    
            // Add 'active' class to the clicked span
            clientNameSpan.classList.add('active');
    
            fetch('https://tanvir-abid.github.io/tanvirWrites/data/data.json')
                .then(response => response.json())
                .then(data => {
                    createDivForOrder(project, data.services);
                })
                .catch(error => console.error(error));
        });
    
        // Simulate click on the first span
        if (index === 0) {
            clientNameSpan.click();
        }
    });
    

    function createDivForOrder(data, services) {
        orderDetailContainer.innerHTML = "";
    
        // Create and populate the client info container
        const clientInfoContainer = document.createElement('div');
        clientInfoContainer.className = 'client-info-container  item-container';
        clientInfoContainer.setAttribute('data-title', 'Client Details');
    
        const clientName = document.createElement('h2');
        clientName.textContent = data.client.clientName;
        clientInfoContainer.appendChild(clientName);
    
        const clientProperties = ['timestamp', 'email', 'institute', 'mobile'];
        clientProperties.forEach(property => {
            const p = document.createElement('p');
            if(property === 'timestamp'){
                p.innerHTML = `<strong>Created on:</strong> ${formatTimestamp(data.client[property])}`;
            }else{
                p.innerHTML = `<strong>${property.charAt(0).toUpperCase() + property.slice(1)}:</strong> ${data.client[property]}`;
            }
            
            clientInfoContainer.appendChild(p);
        });
    
        // Create and populate the progress container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container item-container';
        progressContainer.setAttribute('data-title', 'Progress Status');
    
        const progressForm = document.createElement('form');
        const progressProperties = ['projectName', 'startDate', 'status.statusTitle', 'status.timestamp', 'status.percentage'];
    
        progressProperties.forEach(property => {
            const formGroup = document.createElement('div');
            formGroup.className = 'input-group';
            const label = document.createElement('label');
            label.textContent = property.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
            if (property === 'status.statusTitle') {
                const select = document.createElement('select');
                select.name = property;
                const options = ['Not Started (0%)', 'Initiated (25%)', 'Half Done (50%)', 'One-third Done (75%)', 'Completed (100%)'];
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.toLowerCase();
                    opt.textContent = option;
                    if (option.toLowerCase() === data.progress.status.statusTitle.trim()) {
                        opt.selected = true;
                    }
                    select.appendChild(opt);
                });
                formGroup.appendChild(label);
                formGroup.appendChild(select);
            } else if (property === 'status.percentage') {
                const select = document.createElement('select');
                select.name = property;
                const options = [0, 25, 50, 75, 100];
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = `${option}%`;
                    if (option === data.progress.status.percentage) {
                        opt.selected = true;
                    }
                    select.appendChild(opt);
                });
                formGroup.appendChild(label);
                formGroup.appendChild(select);
            } else {
                const input = document.createElement('input');
                input.name = property;
                if(property === 'status.timestamp'){
                    input.value = formatTimestamp(data.progress.status.timestamp);
                }else{
                    input.value = property.split('.').reduce((o, i) => o[i], data.progress);
                }
                formGroup.appendChild(label);
                formGroup.appendChild(input);
                if(property === 'startDate' || property === 'status.timestamp'){
                    input.disabled = true;
                }
            }
    
            progressForm.appendChild(formGroup);
        });
    
        const progressSubmit = document.createElement('button');
        progressSubmit.type = 'submit';
        progressSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
        progressForm.appendChild(progressSubmit);
        progressForm.addEventListener('submit',async (e)=>{
            e.preventDefault(); 
            progressSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            const formData = new FormData(progressForm);
            const progressData = {
                projectName: formData.get('projectName'),
                status: {
                    statusTitle: formData.get('status.statusTitle'),
                    timestamp: new Date().toISOString(),
                    percentage: parseInt(formData.get('status.percentage'))
                }
            };

            try{
                const washingtonRef = doc(db, "Projects", data.client.id);

                // Set the "capital" field of the city 'DC'
                await updateDoc(washingtonRef, {
                    "progress.status.percentage": progressData.status.percentage,
                    "progress.status.statusTitle": progressData.status.statusTitle,
                    "progress.projectName": progressData.projectName,
                    "progress.status.timestamp": progressData.status.timestamp,
                });
                progressSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
                createModal('Successfully updated');
            }
            catch(err){
                createModal(err);
                progressSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
            }
        });

        progressContainer.appendChild(progressForm);
    
        // Create and populate the budget container
        const budgetContainer = document.createElement('div');
        budgetContainer.className = 'budget-container item-container';
        budgetContainer.setAttribute('data-title', 'Budget Details');

        const budgetForm = document.createElement('form');
        const budgetProperties = ['due', 'paid'];

        budgetProperties.forEach(property => {
            const formGroup = document.createElement('div');
            formGroup.className = 'input-group';
            const label = document.createElement('label');
            const input = document.createElement('input');
            
            input.type = 'number';
            input.name = property;
            formGroup.appendChild(label);
            formGroup.appendChild(input);

            if (property === 'due') {
                formGroup.classList.add('due-group');
                label.textContent = 'Budget';
                if(isNaN(data.budget[property])){
                    input.value = 0;
                }else{
                    input.value = data.budget[property];
                }

                input.disabled = true;

                const editButton = document.createElement('button');
                editButton.type = 'button';
                editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
                editButton.className = 'edit-button';
                editButton.addEventListener('click', () => {
                    input.disabled = false;
                    input.focus();
                    editButton.disabled = true;
                });

                formGroup.appendChild(editButton);
            }else{
                label.textContent = property.charAt(0).toUpperCase() + property.slice(1);
                input.value = data.budget[property];
            }

            budgetForm.appendChild(formGroup);
        });

        const budgetSubmit = document.createElement('button');
        budgetSubmit.type = 'submit';
        budgetSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
        budgetForm.appendChild(budgetSubmit);

        budgetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            budgetSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            let formData = new FormData(budgetForm);
            let budgetObj = Object.fromEntries(formData);
            try {
                const washingtonRef = doc(db, "Projects", data.client.id);

                // Set the "budget" fields of the document
                await updateDoc(washingtonRef, {
                    "budget.paid": parseInt(budgetObj.paid),
                    "budget.due": parseInt(budgetObj.due)
                });
                budgetSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
                createModal('Successfully updated');
            } catch (err) {
                console.log(err);
                budgetSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
            }
        });

        budgetContainer.appendChild(budgetForm);

    
        // Create and populate the active plan container
        // Create and populate the active plan container
        const activePlanContainer = document.createElement('div');
        activePlanContainer.className = 'active-plan-container item-container';
        activePlanContainer.setAttribute('data-title', 'Plan Details');

        const activePlanForm = document.createElement('form');

        // Service Name Select
        const serviceFormGroup = document.createElement('div');
        serviceFormGroup.className = 'input-group';
        const serviceLabel = document.createElement('label');
        serviceLabel.textContent = 'Service Name';
        const serviceSelect = document.createElement('select');
        serviceSelect.name = 'serviceName';

        services.forEach(service => {
            const opt = document.createElement('option');
            opt.value = service.service_name;
            opt.textContent = service.service_name;
            if (data.package.serviceName === service.service_name) {
                opt.selected = true;
            }
            serviceSelect.appendChild(opt);
        });

        serviceFormGroup.appendChild(serviceLabel);
        serviceFormGroup.appendChild(serviceSelect);
        activePlanForm.appendChild(serviceFormGroup);

        // Package Name Select
        const packageFormGroup = document.createElement('div');
        packageFormGroup.className = 'input-group';
        const packageLabel = document.createElement('label');
        packageLabel.textContent = 'Package Name';
        const packageSelect = document.createElement('select');
        packageSelect.name = 'package_name';
        packageFormGroup.appendChild(packageLabel);
        packageFormGroup.appendChild(packageSelect);
        activePlanForm.appendChild(packageFormGroup);

        // Other fields (Price, Category, Cover)
        const fields = ['price', 'category', 'cover'];
        const fieldInputs = {};

        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'input-group';
            const label = document.createElement('label');
            const input = document.createElement('input');
            label.textContent = field.charAt(0).toUpperCase() + field.slice(1);
            input.id = field; // 
            input.name = field;
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            activePlanForm.appendChild(formGroup);
            fieldInputs[field] = input; 
            input.disabled = true;
        });

        // Submit Button
        const activePlanSubmit = document.createElement('button');
        activePlanSubmit.type = 'submit';
        activePlanSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
        activePlanForm.appendChild(activePlanSubmit);

        activePlanContainer.appendChild(activePlanForm);

        // Event Listener for Service Select
        serviceSelect.addEventListener('change', () => {
            const selectedService = services.find(service => service.service_name === serviceSelect.value);
            packageSelect.innerHTML = '';
            selectedService.price_tables.forEach(pack => {
                const opt = document.createElement('option');
                opt.value = pack.package_name;
                opt.textContent = pack.package_name;
                packageSelect.appendChild(opt);
            });
            const selectedPackage = selectedService.price_tables.find(pack => pack.package_name === data.package.packageName);
            if (selectedPackage) {
                packageSelect.value = selectedPackage.package_name;
                updatePackageDetails(selectedPackage);
            } else {
                updatePackageDetails(selectedService.price_tables[0]); // Update with first package details
            }
        });

        // Event Listener for Package Select
        packageSelect.addEventListener('change', () => {
            const selectedService = services.find(service => service.service_name === serviceSelect.value);
            const selectedPackage = selectedService.price_tables.find(pack => pack.package_name === packageSelect.value);
            updatePackageDetails(selectedPackage);
        });

        // Function to Update Package Details
        function updatePackageDetails(pack) {
            fieldInputs.price.value = pack.price;
            fieldInputs.category.value = pack.category || pack.plan_category; // Use pack.category if available, otherwise use pack.plan_category
            fieldInputs.cover.value = pack.cover || pack.slogan; // Use pack.cover if available, otherwise use pack.slogan
        }
        

        // Initialize with data package values if available
        if (services.length > 0) {
            const initialService = services.find(service => service.service_name === data.package.serviceName) || services[0];
            serviceSelect.value = initialService.service_name;
            initialService.price_tables.forEach(pack => {
                const opt = document.createElement('option');
                opt.value = pack.package_name;
                opt.textContent = pack.package_name;
                packageSelect.appendChild(opt);
            });
            const initialPackage = data.package;
            packageSelect.value = initialPackage.package_name;
            updatePackageDetails(initialPackage);
        };

        activePlanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            activePlanSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            
            const formData = {};
            
            // Collect values from all input elements
            activePlanForm.querySelectorAll('input').forEach(input => {
                let value = input.value;
                if (input.name === 'price') {
                    // Remove non-numeric characters from the price value and convert it to a number
                    value = parseFloat(value.replace(/[^\d.-]/g, ''));
                }
                formData[input.name] = value;
            });
        
            // Collect values from all select elements
            activePlanForm.querySelectorAll('select').forEach(select => {
                formData[select.name] = select.value;
            });
        
            try{
                const washingtonRef = doc(db, "Projects", data.client.id);
                // Set the "capital" field of the city 'DC'
                await updateDoc(washingtonRef, {
                    package: formData
                });
                activePlanSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
                createModal('Successfully updated.')
            }
            catch(err){
                console.log(err);
                activePlanSubmit.innerHTML = '<i class="fa-solid fa-eraser"></i> Update';
            }
        });
        

    
        // Append all containers to the order detail container
        orderDetailContainer.appendChild(clientInfoContainer);
        orderDetailContainer.appendChild(progressContainer);
        orderDetailContainer.appendChild(budgetContainer);
        orderDetailContainer.appendChild(activePlanContainer);
    
    }

    hideLoadingSpinner();

    mainContainer.appendChild(orderContainer);
}
//====================================//
async function displayClients(){
    showLoadingSpinner();

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = "";

    let projects = [];

    const querySnapshot = await getDocs(collection(db, "Projects"));
    if (querySnapshot.empty) {
        let warning = createWarningContainer('No projects found.');
        mainContainer.appendChild(warning);
        hideLoadingSpinner();
        return
    } else {
      querySnapshot.forEach((doc) => {
        let project = doc.data();
        project.client.id = doc.id;
        projects.push(project);
      });
    }

    const clientContainer = document.createElement('div');
    clientContainer.className = "client-container";
    mainContainer.appendChild(clientContainer);

    const summaryContainer = createSummaryContainer(projects);
    clientContainer.appendChild(summaryContainer);

    

    let table = createProjectsTable(projects);
    clientContainer.appendChild(table);

    hideLoadingSpinner();
}

function createProjectsTable(dataArray, isFromArchive=false) {
    // Create a table element
    const table = document.createElement('table');
    table.className = 'projects-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // Create table headers
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Client Name', 'Mobile', 'Email', 'Project Title', 'Budget', 'Paid', 'Status', 'Service Name', 'Package Name', 'Actions'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table rows from the data array
    const tbody = document.createElement('tbody');
    dataArray.forEach(data => {
        const row = document.createElement('tr');

        // Helper function to create a cell with data-label attribute
        const createCell = (text, label) => {
            const cell = document.createElement('td');
            cell.textContent = text;
            cell.setAttribute('data-label', label);
            return cell;
        };

        // Create and append each cell
        row.appendChild(createCell(data.client.clientName, 'Client Name'));
        row.appendChild(createCell(data.client.mobile, 'Mobile'));
        row.appendChild(createCell(data.client.email, 'Email'));
        row.appendChild(createCell(data.progress.projectName, 'Project Title'));
        row.appendChild(createCell(`৳${data.budget.due}`, 'Budget'));
        row.appendChild(createCell(`৳${data.budget.paid}`, 'Paid'));
        row.appendChild(createCell(`${data.progress.status.statusTitle} (${data.progress.status.percentage}%)`, 'Status'));
        row.appendChild(createCell(data.package.serviceName, 'Service Name'));
        row.appendChild(createCell(data.package.package_name, 'Package Name'));

        const actionsCell = createCell('', 'Actions');
        actionsCell.style.display = 'flex';

        if (isFromArchive) {
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
            deleteButton.onclick = () => handleDelete(data, row); // Define handleDelete function
            actionsCell.appendChild(deleteButton);
        } else {
            const archiveButton = document.createElement('button');
            archiveButton.className = 'archiveBtn';
            archiveButton.title = 'Move to archive';
            archiveButton.innerHTML = '<i class="fa-solid fa-boxes-packing"></i>';
            archiveButton.onclick = () => handleArchive(data, row); // Define handleArchive function
            actionsCell.appendChild(archiveButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteButton.onclick = () => handleDelete(data, row); // Define handleDelete function
            actionsCell.appendChild(deleteButton);
        }

        row.appendChild(actionsCell);


        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return table;
}


function createSummaryContainer(dataArray) {
    // Create the summary container div
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'summary-container';

    // Initialize counters
    let totalRunningProjects = 0;
    let totalBudget = 0;
    let totalPaid = 0;

    // Iterate through the data array to calculate the totals
    dataArray.forEach(data => {
        totalRunningProjects += 1; // Count each project
        totalBudget += data.budget.due;
        totalPaid += data.budget.paid;
    });

    // Helper function to create a summary div with two spans
    const createSummaryDiv = (label, value) => {
        const summaryDiv = document.createElement('div');
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.className = 'label-span';

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueSpan.className = 'value-span';

        summaryDiv.appendChild(labelSpan);
        summaryDiv.appendChild(valueSpan);

        return summaryDiv;
    };

    // Create and append each summary div
    summaryContainer.appendChild(createSummaryDiv('Total Running Projects: ', totalRunningProjects));
    summaryContainer.appendChild(createSummaryDiv('Total Budget: $', totalBudget));
    summaryContainer.appendChild(createSummaryDiv('Total Paid: $', totalPaid));

    return summaryContainer;
}

//=========================//

function handleArchive(data, elm) {
    createModal('Are you sure you want to move this project to archive?', async () => {
        try {
            // Set the document in the "Archive" collection
            await setDoc(doc(db, "Archive", data.client.id), data);
            
            // Delete the document from the "Projects" collection
            await deleteDoc(doc(db, "Projects", data.client.id));
            
            // Remove the element from the DOM
            elm.remove();
            
            createModal('Project is moved to archive.');
        } catch (error) {
            console.error('Error archiving project:', error);
        }
    });
}


//=====================================//
async function displayArchieve(){
    showLoadingSpinner();

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = "";

    let projects = [];

    const querySnapshot = await getDocs(collection(db, "Archive"));
    if (querySnapshot.empty) {
        let warning = createWarningContainer('No projects found.');
        mainContainer.appendChild(warning);
        hideLoadingSpinner();
        return
    } else {
      querySnapshot.forEach((doc) => {
        let project = doc.data();
        projects.push(project);
      });
    }

    const archiveProjectsTable = createProjectsTable(projects, true);
    mainContainer.appendChild(archiveProjectsTable);

    hideLoadingSpinner();
}

async function handleDelete(data, elm) {
    createModal('Are you sure you want to delete this project ?', async () => {
        try {
            await deleteDoc(doc(db, "Archive", data.client.id));
            
            // Remove the element from the DOM
            elm.remove();
            
            createModal('Project is deleted.');
        } catch (error) {
            console.error('Error archiving project:', error);
        }
    });
}
//=================================//
async function displaySetting() {
    showLoadingSpinner();

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = "";

    // Create setting-container
    const settingContainer = document.createElement('div');
    settingContainer.className = 'setting-container';

    // Create coupon-container
    const couponContainer = document.createElement('div');
    couponContainer.className = 'coupons-container';

    // Create used-coupons-container
    const usedCouponsContainer = document.createElement('div');
    usedCouponsContainer.className = 'used-coupons-container coupon-container';

    // Create unused-coupons-container
    const unusedCouponsContainer = document.createElement('div');
    unusedCouponsContainer.className = 'unused-coupons-container coupon-container';

    // Create addNew-container
    const addNewContainer = document.createElement('div');
    addNewContainer.className = 'addNew-container';

    // Array of coupon objects
    const coupons = [];
    const querySnapshot = await getDocs(collection(db, "Coupons"));
    querySnapshot.forEach((doc) => {
        coupons.push(doc.data());
    });



    // Helper function to create a coupon list item
    function createCouponListItem(coupon) {
        const li = document.createElement('li');
        li.innerHTML = `<span>Coupon ID: ${coupon.id}, Value: ${coupon.category === 'amount' ? '৳ ' + coupon.value : coupon.value + '%'}</span>`;
        const buttonContainer = document.createElement('div');
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
        copyButton.onclick = (event) => {
            event.stopPropagation(); // Prevent li click event
            navigator.clipboard.writeText(coupon.id).then(() => {
                createModal(`Coupon ID ${coupon.id} copied to clipboard!`);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        };
        buttonContainer.appendChild(copyButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteButton.onclick = async () => {
            deleteButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            try {
                await deleteDoc(doc(db, "Coupons", coupon.id));
                createModal('Coupon deleted.');
                deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } catch (err) {
                console.log(err);
                deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            }
            li.remove();
        };

        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);
        return li;
    }

    // Create the ul elements for used and unused coupons
    const usedUl = document.createElement('ul');
    const unusedUl = document.createElement('ul');

    // Add each coupon to the appropriate ul list
    if (coupons.length > 0) {
        let usedCouponsCount = 0;
        let unusedCouponsCount = 0;
    
        coupons.forEach(coupon => {
            if (coupon.isUsed) {
                usedUl.appendChild(createCouponListItem(coupon));
                usedCouponsCount++;
            } else {
                unusedUl.appendChild(createCouponListItem(coupon));
                unusedCouponsCount++;
            }
        });
    
        if (usedCouponsCount === 0) {
            const li = document.createElement('li');
            li.textContent = 'No Used Coupons';
            usedUl.appendChild(li);
        }
    
        if (unusedCouponsCount === 0) {
            const li = document.createElement('li');
            li.textContent = 'No Unused Coupons';
            unusedUl.appendChild(li);
        }
    
    }else {
    
        const liUsed = document.createElement('li');
        liUsed.textContent = 'No Used Coupons';
        usedUl.appendChild(liUsed);
    
        const liUnused = document.createElement('li');
        liUnused.textContent = 'No Unused Coupons';
        unusedUl.appendChild(liUnused);
    }
    

    // Create titles and append lists to their respective containers
    const usedTitle = document.createElement('h2');
    usedTitle.textContent = "Used Coupons";
    usedCouponsContainer.appendChild(usedTitle);
    usedCouponsContainer.appendChild(usedUl);

    const unusedTitle = document.createElement('h2');
    unusedTitle.textContent = "Unused Coupons";
    unusedCouponsContainer.appendChild(unusedTitle);
    unusedCouponsContainer.appendChild(unusedUl);

    // Append both used and unused coupons containers
    couponContainer.appendChild(usedCouponsContainer);
    couponContainer.appendChild(unusedCouponsContainer);

    // Create the form for adding new coupons
    const formTitle = document.createElement('h2');
    formTitle.textContent = "Add New Coupon";
    addNewContainer.appendChild(formTitle);

    const form = document.createElement('form');

    // ID input
    const idInput = document.createElement('input');
    idInput.type = 'text';
    idInput.name = 'id';
    idInput.placeholder = 'Enter coupon ID';
    form.appendChild(idInput);

    // Category select
    const categorySelect = document.createElement('select');
    categorySelect.name = 'category';

    const amountOption = document.createElement('option');
    amountOption.value = 'amount';
    amountOption.textContent = 'Amount';
    categorySelect.appendChild(amountOption);

    const percentageOption = document.createElement('option');
    percentageOption.value = 'percentage';
    percentageOption.textContent = 'Percentage';
    categorySelect.appendChild(percentageOption);

    form.appendChild(categorySelect);

    // Value input
    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.name = 'value';
    valueInput.placeholder = 'Enter coupon value';
    form.appendChild(valueInput);

    // Submit button
    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerHTML = 'Add Coupon';
    btnContainer.appendChild(submitButton);

    const generateIDBtn = document.createElement('button');
    generateIDBtn.type = 'button';
    generateIDBtn.textContent = 'Generate ID';
    btnContainer.appendChild(generateIDBtn);
    form.appendChild(btnContainer);

    generateIDBtn.addEventListener('click', () => {
        idInput.value = generateReadableUniqueID();
    });

    // Form submit event
    form.onsubmit = async (event) => {
        event.preventDefault();
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        const newCoupon = {
            id: idInput.value,
            category: categorySelect.value,
            value: parseInt(valueInput.value),
            isUsed: false
        };

        try {
            await setDoc(doc(db, "Coupons", newCoupon.id), newCoupon);
            createModal('New coupon added.');
            submitButton.innerHTML = 'Add Coupon';
        } catch (err) {
            console.log(err);
            createModal('Something went wrong.');
            submitButton.innerHTML = 'Add Coupon';
        }
        // Check if 'No Unused Coupons' exists and remove it
        const unusedListItems = unusedUl.getElementsByTagName('li');
        if (unusedListItems.length === 1 && unusedListItems[0].textContent === 'No Unused Coupons') {
            unusedUl.removeChild(unusedListItems[0]);
        }
        unusedUl.appendChild(createCouponListItem(newCoupon));

        // Reset form fields
        idInput.value = '';
        categorySelect.value = 'amount';
        valueInput.value = '';
    };

    addNewContainer.appendChild(form);

    // Append containers
    couponContainer.appendChild(addNewContainer);
    settingContainer.appendChild(couponContainer);
    //-----------------------------------------//
    const testimonials = [];
    const testimonialsRef = await getDocs(collection(db, "testimonials"));
    testimonialsRef.forEach((doc) => {
        let testimonial = doc.data();
        testimonial.id = doc.id;
        testimonials.push(testimonial);
    });
    const testimonialContainer = document.createElement('div');
    testimonialContainer.className = 'testimonial-container';

    const testimoyH1 = document.createElement('h2');
    testimoyH1.textContent = "All testimonials";
    testimonialContainer.appendChild(testimoyH1);
    // Function to create table
    let table = createTable(testimonials);
    // Append table to container
    testimonialContainer.appendChild(table);

    hideLoadingSpinner();
    //-----------------------------------------//
    mainContainer.appendChild(settingContainer);
    mainContainer.appendChild(testimonialContainer);
}

function createTable(data) {
    const table = document.createElement('table');
    table.className = 'projects-table';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Gender', 'Institute', 'Email', 'Rate', 'Comment', 'Action'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');

        // Function to create a cell
        const createCell = (text, label) => {
            const cell = document.createElement('td');
            cell.textContent = text;
            cell.setAttribute('data-label', label);
            return cell;
        };

        // Create cells in the specified order using createCell function
        row.appendChild(createCell(item.name, 'Name'));
        row.appendChild(createCell(item.gender, 'Gender'));
        row.appendChild(createCell(item.institute, 'Institute'));
        row.appendChild(createCell(item.email, 'Email'));
        row.appendChild(createCell(item.rating, 'Rate'));

        const commentCell = document.createElement('td');
        commentCell.textContent = item.comment;
        commentCell.setAttribute('data-label', "Comment");
        row.appendChild(commentCell);
        commentCell.addEventListener('click', ()=>{
            createModal('Comment',item.comment);
        });

        // Create toggle switch
        const toggleTd = document.createElement('td');
        toggleTd.setAttribute('data-label', "Action");
        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'switch';
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = item.shouldUse;
        toggleInput.addEventListener('change',async () => {
            item.shouldUse = toggleInput.checked;
            console.log(item);
            const washingtonRef = doc(db, "testimonials", item.id);
            await updateDoc(washingtonRef, {
                shouldUse: toggleInput.checked
            });

            createModal(`Testimonial from ${item.name} has been ${toggleInput.checked ? 'shown' : 'hidden'}.`,'Updated'); 
        });
        const toggleSpan = document.createElement('span');
        toggleSpan.className = 'slider';

        toggleLabel.appendChild(toggleInput);
        toggleLabel.appendChild(toggleSpan);
        toggleTd.appendChild(toggleLabel);
        row.appendChild(toggleTd);

        // Create delete button
        const actionTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            console.log(item);
            createModal('Are you sure you want to delete this testimony ?','Confirm', async () => {
                try {
                    await deleteDoc(doc(db, "testimonials", item.id));
                    
                    // Remove the element from the DOM
                    row.remove();
                    
                    createModal('Testimony is deleted.');
                } catch (error) {
                    console.error('Error archiving project:', error);
                }
            });
        });
        toggleTd.appendChild(deleteButton);


        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table
}
// ====================//
// Function to generate a readable and unique coupon code
function generateReadableUniqueID() {
    const adjectives = [
        'Insightful', 'Brilliant', 'Thorough', 'Creative', 'Detailed', 
        'Comprehensive', 'Innovative', 'Critical', 'Analytical', 'Meticulous',
        'Thoughtful', 'Perceptive', 'Articulate', 'Eloquent', 'Astute', 
        'Vivid', 'Profound', 'Lucid', 'Coherent', 'Concise'
    ];
    
    const nouns = [
        'Writer', 'Researcher', 'Analyst', 'Scholar', 'Author', 
        'Editor', 'Reviewer', 'Critic', 'Strategist', 'Planner',
        'Scribe', 'Narrator', 'Essayist', 'Wordsmith', 'Linguist',
        'Thinker', 'Commentator', 'Storyteller', 'Reporter', 'Historian'
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const uniqueNumber = Date.now().toString(36).toUpperCase().slice(-4);
    const randomString = Math.random().toString(36).substr(2, 4).toUpperCase();

    return `TANVIR-${adjective}-${noun}-${uniqueNumber}-${randomString}`;
}

//================================//
// Function to create and show the loading spinner
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

function createWarningContainer(text) {
    // Create the div element
    const warningContainer = document.createElement('div');
    warningContainer.id = "warning-container";

    // Create the h1 element
    const warningText = document.createElement('h1');
    warningText.innerHTML = text;  

    // Append h1 to the div
    warningContainer.appendChild(warningText);

    return warningContainer;
}

function letSignOut(){
    signOut(auth).then(() => {
        console.log('sign out successfully.')
      }).catch((error) => {
        // An error happened.
      });
}


function createModal(text,header, callback) {
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

    // Check if a callback function is provided
    if (callback) {
        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';

        // Create confirm button
        const confirmButton = document.createElement('button');
        confirmButton.className = 'confirm-button';
        confirmButton.innerHTML = 'Confirm';
        confirmButton.onclick = function() {
            callback();
            closeModal();
        };

        // Append buttons to footer
        modalFooter.appendChild(confirmButton);

        // Append footer to content container
        modalContent.appendChild(modalFooter);
    }

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
        modal.classList.add('hide');
        modalContent.classList.add('hide');
        setTimeout(() => {
            modal.remove();
        }, 499);
    }
}

function formatTimestamp(timestamp) {
    const options = {
        weekday: 'long',  // "Saturday"
        year: 'numeric',  // "2024"
        month: 'long',    // "May"
        day: 'numeric',   // "11"
        hour: '2-digit',  // "7"
        minute: '2-digit', // "22"
        second: '2-digit', // "19"
        hour12: true      // "PM"
    };

    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

