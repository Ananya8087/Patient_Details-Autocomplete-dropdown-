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

        // Add event listener to handle input events
        document.addEventListener('input', function(event) {
            const inputField = event.target;

            // Check if the input field matches the specific selector criteria
            if (inputField.matches('input[data-v-d19b1848].p-inputtext.p-component.subm_field.form-control')) {
                console.log('Input event detected');
                const query = inputField.value.toLowerCase().trim();
                console.log('Query:', query);
                createDropdown(inputField, query);
            }
        });

        // Add event listener to handle focus events
        document.addEventListener('focusin', function(event) {
            const inputField = event.target;

            // Check if the input field matches the specific selector criteria
            if (inputField.matches('input[data-v-d19b1848].p-inputtext.p-component.subm_field.form-control')) {
                console.log('Focus event detected');
                createDropdown(inputField, ''); // Pass an empty string to show all options
            }
        });

        // Add event listener to handle clicks on the document
        document.addEventListener('mousedown', function(event) {
            const target = event.target;
            console.log('Document mousedown event:', target);

            // Check if the click target is the specific input field or an item in the dropdown
            const isInputField = target.matches('input[data-v-d19b1848].p-inputtext.p-component.subm_field.form-control');
            const isDropdownItem = target.closest('.autocomplete-dropdown li');

            console.log('Is input field:', isInputField);
            console.log('Is dropdown item:', isDropdownItem);

            // If neither the specific input field nor the dropdown item was clicked, remove the dropdown
            if (!isInputField && !isDropdownItem) {
                console.log('Click outside input field and dropdown, removing dropdown');
                const dropdowns = document.querySelectorAll('.autocomplete-dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.remove(); // Remove the dropdown
                    console.log('Dropdown removed');
                });
            } else {
                console.log('Click inside input field or dropdown item, not removing dropdown');
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
