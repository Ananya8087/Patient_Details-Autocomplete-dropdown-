// Fetch the medicines data
fetch(chrome.runtime.getURL('medicines.json'))
    .then(response => {
        console.log('Fetched medicines.json');
        return response.json();
    })
    .then(medicines => {
        console.log('Medicines data parsed', medicines);

        // Function to create and display the dropdown
        function createDropdown(inputField, query) {
            let dropdown = inputField.parentElement.querySelector('.autocomplete-dropdown');
            if (!dropdown) {
                dropdown = document.createElement('ul');
                dropdown.classList.add('autocomplete-dropdown');
                inputField.parentElement.appendChild(dropdown); // Append to the parent of the input field
                console.log('Dropdown created and appended to parent');
            }

            dropdown.innerHTML = ''; // Clear previous dropdown items

            const filteredMedicines = medicines.filter(medicine =>
                medicine.toLowerCase().includes(query)
            );

            console.log('Filtered medicines:', filteredMedicines);

            filteredMedicines.forEach(medicine => {
                const item = document.createElement('li');
                item.textContent = medicine;
                item.addEventListener('click', () => {
                    console.log('Medicine selected:', medicine);
                    inputField.value = medicine; // Set the value of the input field to the selected medicine
                    dropdown.remove(); // Remove the dropdown after selecting
                    inputField.dispatchEvent(new Event('input')); // Dispatch an input event on the input field to trigger any associated event listeners
                });
                dropdown.appendChild(item);
            });

            // Position the dropdown
            dropdown.style.position = 'absolute';
            dropdown.style.left = `${inputField.offsetLeft}px`;
            dropdown.style.top = `${inputField.offsetTop + inputField.offsetHeight}px`;
            dropdown.style.width = `${inputField.offsetWidth}px`;

            console.log('Dropdown positioned');
        }

        // Function to handle showing dropdown
        function showDropdown(inputField, query = '') {
            if (!inputField.matches('input[data-v-d19b1848].p-inputtext.p-component.subm_field.form-control')) {
                return; // Exit if input field doesn't match selector
            }

            console.log('Show dropdown for input field:', inputField);
            createDropdown(inputField, query);
        }

        // Add event listener to handle input events
        document.addEventListener('input', function(event) {
            const inputField = event.target;
            showDropdown(inputField, inputField.value.toLowerCase().trim());
        });

        // Add event listener to handle focus events
        document.addEventListener('focusin', function(event) {
            const inputField = event.target;
            showDropdown(inputField, '');
        });

        // Handle clicks on the document to keep dropdown open
        document.addEventListener('click', function(event) {
            const target = event.target;
            const isInputField = target.matches('input[data-v-d19b1848].p-inputtext.p-component.subm_field.form-control');
            const isDropdownItem = target.closest('.autocomplete-dropdown li');

            if (!isInputField && !isDropdownItem) {
                // Clicked outside input field and dropdown
                const dropdowns = document.querySelectorAll('.autocomplete-dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.remove(); // Remove all dropdowns
                    console.log('Dropdown removed');
                });
            }
        });

    })
    .catch(error => {
        console.error('Error fetching or parsing medicines.json:', error);
    });

// Add CSS for the dropdown directly within content.js
const style = document.createElement('style');
style.innerHTML = `
.autocomplete-dropdown {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.autocomplete-dropdown li {
    padding: 8px;
    cursor: pointer;
}

.autocomplete-dropdown li:hover {
    background-color: #f0f0f0;
}
`;
document.head.appendChild(style);
