const shopContainer = document.getElementById("shopProducts");
const search = document.getElementById("search")
const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
const sortSelect = document.getElementById("sortSelect");
const pagination = document.getElementById("pagination");

let savedPage = localStorage.getItem("currentPage");
let currentPage = savedPage ? parseInt(savedPage, 10) : 1;
const productsPerPage = 12;

function filters() {
    const selected = Array.from(filterCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const genders = selected.filter(v => v === "men" || v === "women");
    const categories = selected.filter(v => v !== "men" && v !== "women");

    const query = search.value.toLowerCase().trim();

    let filtered = allProducts.filter(p => {
        const matchGender = genders.length === 0 || genders.includes(p.gender);
        const matchCategory = categories.length === 0 || categories.includes(p.type);
        const matchSearch = query === "" || p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) || p.type.toLowerCase().includes(query) ||
            p.gender.toLowerCase().includes(query);
        return matchGender && matchCategory && matchSearch;
    });



    if (sortSelect.value === "max") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "min") {
        filtered.sort((a, b) => a.price - b.price);
    }

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = filtered.slice(start, end);

    displayProducts(paginatedProducts, shopContainer, query);
    renderPagination(filtered);
}

const resetBtn = document.getElementById("resetFilters");

resetBtn.addEventListener("click", () => {

    filterCheckboxes.forEach(cb => cb.checked = false);
    currentPage = 1;
    filters();

});

function renderPagination(products) {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(products.length / productsPerPage);
    if (totalPages <= 1) return;

    const prev = document.createElement("li");
    prev.className = `page-item ${currentPage === 1 ? "disabled" : ""} `;
    prev.innerHTML = `<a class="page-link" href="#">Prev</a>`;
    prev.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            localStorage.setItem("currentPage", currentPage);
            filters();
            saveCart();
            renderCart();
            window.scrollTo({
                top: 390,
                behavior: "smooth"
            });
        }
    });
    pagination.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            localStorage.setItem("currentPage", currentPage);
            filters();
            saveCart();
            renderCart();
            window.scrollTo({
                top: 390,
                behavior: "smooth"
            });
        });
        pagination.appendChild(li);
    }

    const next = document.createElement("li");
    next.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    next.innerHTML = `<a class = "page-link" href = "#">Next</a>`;
    next.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            localStorage.setItem("currentPage", currentPage);
            filters();
            saveCart();
            renderCart();
            window.scrollTo({
                top: 390,
                behavior: "smooth"
            });
        }
    });
    pagination.appendChild(next);
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
}

search.addEventListener("input", () => {
    currentPage = 1;
    localStorage.setItem("currentPage", currentPage);
    filters();
    saveCart();
    renderCart();
})
filterCheckboxes.forEach(cb => cb.addEventListener("change", () => {
    currentPage = 1;
    localStorage.setItem("currentPage", currentPage);
    filters();
    saveCart();
    renderCart();
}));
sortSelect.addEventListener("change", () => {
    currentPage = 1;
    localStorage.setItem("currentPage", currentPage);
    filters();
    saveCart();
    renderCart();
});

loadCart();
renderCart();
filters();
