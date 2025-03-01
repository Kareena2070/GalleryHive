document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("imageUpload");
    const gallery = document.getElementById("gallery");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const categoryContainer = document.getElementById("category-container");

    let firstUpload = true;
    let imageCount = 0;
    let categoryButton = null;
    let uploadedImages = []; // Store uploaded images
    let currentCategory = null; // Store category name

    document.querySelector(".upload-btn").addEventListener("click", function () {
        fileInput.click();
    });

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const index = uploadedImages.findIndex(img => img === event.target.previousSibling.src);
            if (index !== -1) uploadedImages.splice(index, 1);
            event.target.closest(".image-container").remove();
            imageCount--;
            checkImageCount();
        }
    });

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

    function checkImageCount() {
        if (imageCount >=  5 ) {
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

    function createCategory() {
        let categoryName = prompt("Enter a name for this category:");
        if (!categoryName) return; 

        currentCategory = categoryName;
        dropdownMenu.innerHTML = ""; 

        const newCategory = document.createElement("a");
        newCategory.classList.add("block", "px-4", "py-2", "hover:bg-gray-200");
        newCategory.href = "#";
        newCategory.textContent = categoryName;
        newCategory.addEventListener("click", function () {
            displayCategoryImages();
        });

        dropdownMenu.appendChild(newCategory);

        moveImagesToCategory();
        categoryButton.remove();
        categoryButton = null;
        imageCount = 0;
    }

    function moveImagesToCategory() {
        gallery.innerHTML = ""; // Remove all images from home
    }

    function displayCategoryImages() {
        gallery.innerHTML = ""; // Clear gallery

        uploadedImages.forEach(imageUrl => {
            const imageCard = document.createElement("div");
            imageCard.classList.add("image-container");

            const img = document.createElement("img");
            img.src = imageUrl;

            imageCard.appendChild(img);
            gallery.appendChild(imageCard);
        });
    }
});

// Toggle dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
    const categoryBtn = document.getElementById("category-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");

    categoryBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    dropdownMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        dropdownMenu.classList.remove("show");
    });
});
