document.addEventListener("DOMContentLoaded", function () {
    // Display the welcome message if the user is logged in
    const userName = localStorage.getItem('loggedInUser');
    if (userName) {
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.textContent = `Welcome ${userName}, let's make memories!`;
        welcomeMessage.style.display = "block"; // Show the welcome message

        // Hide the welcome message after 3 seconds
        setTimeout(() => {
            welcomeMessage.style.display = "none";
        }, 3000);
    }

    const fileInput = document.getElementById("imageUpload");
    const gallery = document.getElementById("gallery");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const categoryContainer = document.getElementById("category-container");

    let firstUpload = true;
    let imageCount = 0;
    let categoryButton = null;
    let uploadedImages = []; // Stores images before categorization
    let categories = {}; // Stores categories with their images

    // Trigger file input when upload button is clicked
    document.querySelector(".upload-btn").addEventListener("click", function () {
        fileInput.click();
    });

    // Remove image when 'X' button is clicked
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const index = uploadedImages.findIndex(img => img === event.target.previousSibling.src);
            if (index !== -1) uploadedImages.splice(index, 1);
            event.target.closest(".image-container").remove();
            imageCount--;
            checkImageCount();
        }
    });

    // Handle image upload
    fileInput.addEventListener("change", function (event) {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            if (imageCount >= 30) {
                alert("You can upload a maximum of 30 images.");
                break;
            }

            const file = files[i];
            const reader = new FileReader();

            reader.onload = function (e) {
                const imageUrl = e.target.result;
                uploadedImages.push(imageUrl);

                if (firstUpload) {
                    document.querySelectorAll(".example-image").forEach(img => img.remove());
                    firstUpload = false;
                }

                const imageCard = document.createElement("div");
                imageCard.classList.add("image-container");

                const img = document.createElement("img");
                img.src = imageUrl;

                const removeBtn = document.createElement("button");
                removeBtn.classList.add("remove-btn");
                removeBtn.textContent = "X";

                imageCard.appendChild(img);
                imageCard.appendChild(removeBtn);
                gallery.appendChild(imageCard);

                imageCount++;
                checkImageCount();
            };
            reader.readAsDataURL(file);
        }
    });

    // Check if the number of uploaded images is enough to create a category
    function checkImageCount() {
        if (imageCount >= 5) {
            if (!categoryButton) {
                categoryButton = document.createElement("button");
                categoryButton.textContent = "Create Category";
                categoryButton.classList.add("bg-lime-500", "text-white", "px-4", "py-2", "rounded-full", "mt-4");
                categoryButton.addEventListener("click", createCategory);
                categoryContainer.appendChild(categoryButton);
            }
        } else {
            if (categoryButton) {
                categoryButton.remove();
                categoryButton = null;
            }
        }
    }

    // Create a new category from uploaded images
    function createCategory() {
        let categoryName = prompt("Enter a name for this category:");
        if (!categoryName || categories.hasOwnProperty(categoryName)) return; // Prevent duplicates

        categories[categoryName] = [...uploadedImages]; // Store images for the category
        uploadedImages = []; // Reset for new uploads
        imageCount = 0;
        gallery.innerHTML = ""; // Clear gallery for the next uploads

        updateCategoryDropdown(); // Update dropdown
        categoryButton.remove();
        categoryButton = null;
    }

    // Update the dropdown menu with created categories
    function updateCategoryDropdown() {
        dropdownMenu.innerHTML = ""; // Clear dropdown before repopulating

        Object.keys(categories).forEach(categoryName => {
            const existingCategory = document.querySelector(`[data-category="${categoryName}"]`);
            if (!existingCategory) {
                const categoryItem = document.createElement("a");
                categoryItem.classList.add("block", "px-4", "py-2", "hover:bg-gray-200");
                categoryItem.href = "#";
                categoryItem.textContent = categoryName;
                categoryItem.setAttribute("data-category", categoryName); // Unique identifier

                categoryItem.addEventListener("click", function () {
                    displayCategoryImages(categoryName);
                });

                dropdownMenu.appendChild(categoryItem);
            }
        });
    }

    // Display images from a selected category
    function displayCategoryImages(categoryName) {
        gallery.innerHTML = ""; // Clear gallery
        categories[categoryName].forEach(imageUrl => {
            const imageCard = document.createElement("div");
            imageCard.classList.add("image-container");

            const img = document.createElement("img");
            img.src = imageUrl;

            imageCard.appendChild(img);
            gallery.appendChild(imageCard);
        });
    }

    // Toggle dropdown menu visibility
    const categoryBtn = document.getElementById("category-btn");

    categoryBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    dropdownMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Close dropdown menu when clicking outside
    document.addEventListener("click", function () {
        dropdownMenu.classList.remove("show");
    });
});
