const productContainer = document.getElementById("productContainer");
let newArrivals = document.getElementById("newArrivals");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi"); 
    return text.replace(regex, `<span class="highlight">$1</span>`);
}


function displayProducts(showProducts, container, query) {
    container.innerHTML = "";
    showProducts.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-3";
        const newP = product.isNew
            ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">New</span>`
            : "";

        col.innerHTML = `
            <div class="card rounded-4 mx-auto position-relative">
                ${newP}
                <img src="${product.img}"class="card-img-top p-3 rounded-5 "  style ="height: 20rem">
                <div class="card-body">
                    <span class="text-muted fw-medium">${highlightMatch(product.brand, query)}</span> 
                    <span class="text-muted fw-medium"> • ${highlightMatch(product.gender, query)}</span>
                    <h6 class="fw-bold">${highlightMatch(product.name, query)}</h6>
                    <div class="d-flex gap-2">
                        <div class="text-warning fs-5">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bolder">${formatPrice(product.price)}</span>
                        <div>
                            <a href = "productDetails.html?id=${product.id}"><button class = "btn btn-info p-1 text-white fw-medium">View Details</button></a>
                            <button style="width: 40px; height: 40px; border-radius: 50px" class="btn bg-info text-info text-center bg-opacity-25 p-1 add-to-cart toggle-cart icon-bold" data-id = "${product.id}">
                            <i class="bi bi-cart2 fs-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;


        const btn = col.querySelector(".toggle-cart");
        const inCart = cart.some(p => p.id == product.id);

        if (inCart) {
            btn.classList.remove("bg-info", "text-info");
            btn.classList.add("bg-danger", "text-danger");
            btn.innerHTML = `<i class="bi bi-trash3 fs-5"></i>`;
        } else {
            btn.classList.remove("bg-danger", "text-danger");
            btn.classList.add("bg-info", "text-info");
            btn.innerHTML = `<i class="bi bi-cart2 fs-5"></i>`;
        }
        btn.addEventListener("click", function () {
            let productId = this.getAttribute("data-id");

            if (this.classList.contains("bg-info")) {
                let product = allProducts.find(p => p.id == productId);
                if (product) {
                    addToCart(product);
                }
                this.classList.remove("bg-info", "text-info");
                this.classList.add("bg-danger", "text-danger", "icon-bold");
                this.innerHTML = `<i class="bi bi-trash3 fs-5"></i>`;
            } else {
                cart = cart.filter(p => p.id != productId);
                saveCart();
                this.classList.remove("bg-danger", "text-danger");
                this.classList.add("bg-info", "text-info");
                this.innerHTML = `<i class="bi bi-cart2 fs-5"></i>`;
            }
            renderCart();
        });

        container.appendChild(col);
    });

}
const featuredProducts = allProducts.filter(p => p.isFeat);
const arrivals = allProducts.filter(p => p.isNew);

displayProducts(featuredProducts, productContainer);
displayProducts(arrivals, newArrivals);

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}



function loadCart() {
    let storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart)
    }
}

function addToCart(product) {
    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    renderCart();
}


function formatPrice(value) {
    return `$${value.toLocaleString()}`;
}

function renderCart() {
    const clearCart = document.getElementById("clearCart");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
        <div class="d-flex flex-column align-items-center mt-5">
    <div class="bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center"
        style="width: 80px; height: 80px; border-radius: 50%;">
        <i class="bi bi-cart4 text-mute text-secondary display-5"></i>
    </div>
    <div class="d-flex text-center mt-3 flex-column text-secondary fw-medium">
        <span>Your cart is empty</span>
        <span>Add some products to get started</span>
    </div>
</div>
        `;
        document.querySelectorAll(".cart-count").forEach(el => {
            el.textContent = "";
            el.style.display = "none";
        });

        document.getElementById("cartFooter").style.display = "none";

        document.querySelectorAll(".toggle-cart").forEach(btn => {
            btn.classList.remove("bg-danger", "text-danger");
            btn.classList.add("bg-info", "text-info");
            btn.innerHTML = `<i class="bi bi-cart2 fs-5"></i>`;
        });

        return;
    } else {
        document.querySelectorAll(".cart-count").forEach(el => {
            el.textContent = cart.length;
            el.style.display = "block"
        });
        document.getElementById("cartFooter").style.display = "block";
    }

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;

        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
    <div class="d-flex gap-2 mt-3 border rounded-3 w-100 p-3">
        <img src="${item.img}" alt="" style="width: 70px; height: 70px;">
        <div>
            <h6 class="fw-bold">${item.name}</h6>
            <p class="text-success fw-bold">${formatPrice(item.price)}</p>
            <div class="d-flex gap-3 align-items-center">
                <button class="btn btn-sm btn-outline-info icon-bold reduceItem"><i class="bi bi-dash-lg"></i></button>
                <span class="fw-medium">${item.qty}</span>
                <button class="btn btn-sm btn-outline-info icon-bold increaseItem"><i class="bi bi-plus-lg"></i></button>
                <button class="btn btn-sm btn-outline-danger icon-bold deleteItem"><i class="bi bi-trash3"></i></button>
            </div>
        </div>
    </div>
        `;

        li.querySelector(".increaseItem").addEventListener("click", () => {
            item.qty++;
            saveCart();
            renderCart();
        });

        li.querySelector(".reduceItem").addEventListener("click", () => {
            if (item.qty > 1) {
                item.qty--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            renderCart();
        });

        li.querySelector(".deleteItem").addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItems.appendChild(li)
    });

    cartTotal.textContent = formatPrice(total);

    document.querySelectorAll(".cart-count").forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? "inline-block" : "none";
    });
    clearCart.addEventListener("click", () => {
        cart = [];
        saveCart();
        renderCart();
    });

}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();

    const productBtn = document.querySelector(`button[data-id='${productId}']`);
    if (productBtn) {
        productBtn.classList.remove("bg-danger", "text-danger");
        productBtn.classList.add("bg-info", "text-info");
        productBtn.innerHTML = `<i class="bi bi-cart2 fs-5"></i>`;
    }
}
loadCart();
renderCart();


function loadComponent(id, file) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            console.log(file + " loaded successfully");

        })
        .catch(err => console.error("Error loading " + file, err));

}


