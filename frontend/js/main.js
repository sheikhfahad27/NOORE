/* =========================
   PREMIUM ALERT POPUP
========================= */

window.alert = function(message) {

  const oldPopup = document.getElementById("nooreAlertPopup");

  if (oldPopup) {
    oldPopup.remove();
  }

  const popup = document.createElement("div");

  popup.id = "nooreAlertPopup";
  popup.className = "noore-alert-popup";

  popup.innerHTML = `
    <div class="noore-alert-icon">✓</div>

    <div class="noore-alert-content">
      <div class="noore-alert-title">
        Added to Cart
      </div>

      <div class="noore-alert-message">
        ${escapeHTML(String(message))}
      </div>
    </div>

    <button
      type="button"
      class="noore-alert-close"
      onclick="closeNooreAlert()"
    >
      ×
    </button>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("show");
  }, 30);

  setTimeout(() => {
    closeNooreAlert();
  }, 3500);
};


function closeNooreAlert() {

  const popup = document.getElementById("nooreAlertPopup");

  if (!popup) return;

  popup.classList.remove("show");

  setTimeout(() => {
    popup.remove();
  }, 350);
}

      const API_URL = "https://noore-n2oa.vercel.app/api";
      let products = [];
      let cart = JSON.parse(localStorage.getItem("nooreCart") || "[]");
      /* ========================= ESCAPE HTML ========================= */ function escapeHTML(
        value,
      ) {
        if (value === null || value === undefined) {
          return "";
        }
        return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }
      /* ========================= LOAD PRODUCTS ========================= */ async function loadProducts() {
        const container = document.getElementById("products");
        try {
          const response = await fetch(`${API_URL}/products`);
          if (!response.ok) {
            throw new Error("Failed to load products");
          }
          products = await response.json();

displayProducts(products);
updateProductSchema(products);
        } catch (error) {
          console.error("Product API Error:", error);
          container.innerHTML = ` <div style=" grid-column:1/-1; text-align:center; padding:40px; color:#766b6e; "> <h3>Unable to load products</h3> <p>Products could not be loaded.</p> </div> `;
        }
      }
    /* ========================= DISPLAY PRODUCTS ========================= */
function displayProducts(productList = products) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  if (productList.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:50px;color:#766b6e;"><h3>No products available</h3><p>Products will appear here once added to database.</p></div>`;
    return;
  }
  productList.forEach((product, index) => {
    const imageHTML = product.image && product.image.trim() !== ""
      ? `<img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">`
      : `Product Image ${index + 1}<br>Add product photo`;
    container.innerHTML += `
      <div class="product-card" onclick="openProduct(${product.id})" style="cursor:pointer;">
        <div class="product-image">${imageHTML}</div>
        <div class="product-info">
          <div class="product-category">${escapeHTML(product.category)}</div>
          <div class="product-name">${escapeHTML(product.name)}</div>
          <div class="product-price">Rs. ${Number(product.price).toLocaleString()}</div>
          <button class="primary-btn order-btn" onclick="event.stopPropagation(); addToCart(${product.id})">🛒 Add to Cart</button>
        </div>
      </div>`;
  });
}


/* =========================
   PRODUCT SEO SCHEMA
========================= */

function updateProductSchema(products) {
  const oldSchema = document.getElementById("product-schema");

  if (oldSchema) {
    oldSchema.remove();
  }

  if (!products || products.length === 0) {
    return;
  }

  const schemaProducts = products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
   "name": product.name,
"image": product.image ? [product.image] : [],
"description":
  product.description ||
  `${product.name} available at Sheikh Brothers.`,
"brand": {
  "@type": "Brand",
  "name": "Sheikh Brothers"
},
    "offers": {
      "@type": "Offer",
      "url": "https://sheikh-brothers.vercel.app/",
      "priceCurrency": "PKR",
      "price": Number(product.price).toFixed(2),
      "availability":
        Number(product.stock) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock"
    }
  }));

  const schema = document.createElement("script");

  schema.type = "application/ld+json";
  schema.id = "product-schema";
  schema.textContent = JSON.stringify(schemaProducts);

  document.head.appendChild(schema);
}

/* ========================= FILTER PRODUCTS ========================= */ function filterProducts(
        category,
        button,
      ) {
        document
          .querySelectorAll(".filter-btn")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        if (category === "All") {
          displayProducts(products);
        } else {
          const filtered = products.filter(
            (product) => product.category === category,
          );
          displayProducts(filtered);
        }
      }
      /* ========================= ADD TO CART ========================= */ function addToCart(
        productId,
      ) {
        const product = products.find((item) => item.id == productId);
        if (!product) {
          alert("Product not found.");
          return;
        }
        const existing = cart.find((item) => item.id == product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || "",
            quantity: 1,
          });
        }
        saveCart();
        updateCartCount();
        
      }

      /* ========================= PRODUCT DETAILS + SIZE ========================= */

function openProduct(productId) {
  const product = products.find((item) => item.id == productId);
  if (!product) { alert("Product not found."); return; }

  const modal = document.getElementById("productDetailsModal");
  const content = document.getElementById("productDetailsContent");
  if (!modal || !content) return;

  const image = product.image
    ? `<img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">`
    : `<div class="product-details-no-image">NOORÉ</div>`;

  content.innerHTML = `
    <div class="product-details-image">${image}</div>
    <div class="product-details-info">
      <div class="product-details-category">${escapeHTML(product.category)}</div>
      <h2>${escapeHTML(product.name)}</h2>
      <div class="product-details-price">Rs. ${Number(product.price).toLocaleString()}</div>
      <p class="product-details-description">${escapeHTML(product.description || "Beautiful ladies suit from NOORÉ collection.")}</p>
      <div class="product-details-stock">
        ${Number(product.stock) > 0 ? "✓ In Stock" : "Currently unavailable"}
      </div>

      <div class="product-size-box">
        <label class="product-size-label">Select Size</label>
        <div class="product-size-options">
          <button type="button" class="size-option" onclick="selectProductSize(this, 'UT')">UT</button>
          <button type="button" class="size-option" onclick="selectProductSize(this, 'Small')">Small</button>
          <button type="button" class="size-option" onclick="selectProductSize(this, 'Medium')">Medium</button>
          <button type="button" class="size-option" onclick="selectProductSize(this, 'Large')">Large</button>
          <button type="button" class="size-option" onclick="selectProductSize(this, 'XL')">XL</button>
        </div>
        <input type="hidden" id="productSizeSelect" value="">
      </div>

      <button type="button" class="primary-btn" style="margin-top:12px;width:100%;"
        onclick="addProductWithSize(${product.id})" ${Number(product.stock) <= 0 ? "disabled" : ""}>
        ${Number(product.stock) > 0 ? "🛒 Add to Cart" : "Out of Stock"}
      </button>
    </div>`;

  modal.classList.add("active");
}

function selectProductSize(button, size) {
  document.querySelectorAll('.size-option').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  const sizeInput = document.getElementById('productSizeSelect');
  if (sizeInput) sizeInput.value = size;
}

function addProductWithSize(productId) {
  const product = products.find((item) => item.id == productId);
  if (!product) { alert("Product not found."); return; }
  if (Number(product.stock) <= 0) { alert("This product is currently out of stock."); return; }

  const sizeSelect = document.getElementById("productSizeSelect");
  const size = sizeSelect ? sizeSelect.value : "";
  if (!size) { alert("Please select a size first."); return; }

  const existing = cart.find((item) => item.id == product.id && item.size === size);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || "",
      quantity: 1,
      size: size
    });
  }

  saveCart();
  updateCartCount();
  closeProduct();
  alert(`${product.name} (${size}) added to cart!`);
}

function closeProduct() {
  const modal = document.getElementById("productDetailsModal");
  if (modal) modal.classList.remove("active");
}

/* ========================= SAVE CART ========================= */ function saveCart() {
        localStorage.setItem("nooreCart", JSON.stringify(cart));
      }
      /* ========================= CART COUNT ========================= */ function updateCartCount() {
        const countElement = document.getElementById("cartCount");
        if (!countElement) {
          return;
        }
        const count = cart.reduce(
          (total, item) => total + Number(item.quantity),
          0,
        );
        countElement.textContent = count;
      }
      /* ========================= OPEN CART ========================= */ function openCart() {
        const modal = document.getElementById("cartModal");
        if (!modal) {
          return;
        }
        renderCart();
        modal.classList.add("active");
      }
      /* ========================= CLOSE CART ========================= */ function closeCart() {
        const modal = document.getElementById("cartModal");
        if (modal) {
          modal.classList.remove("active");
        }
      }
      /* ========================= RENDER CART ========================= */ function renderCart() {
        const itemsContainer = document.getElementById("cartItems");
        const totalElement = document.getElementById("cartTotal");
        if (!itemsContainer || !totalElement) {
          return;
        }
        if (cart.length === 0) {
          itemsContainer.innerHTML = ` <div class="empty-cart"> <div style=" font-size:50px; margin-bottom:10px; "> 🛒 </div> <h3>Your cart is empty</h3> <p> Add some beautiful NOORÉ suits to your cart. </p> </div> `;
          totalElement.textContent = "Rs. 0";
          return;
        }
        let total = 0;
        itemsContainer.innerHTML = cart
          .map((item, index) => {
            const itemTotal = Number(item.price) * Number(item.quantity);
            total += itemTotal;
            return ` <div class="cart-item"> <div class="cart-item-image"> ${item.image ? ` <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" > ` : ` <div style=" height:100%; display:flex; align-items:center; justify-content:center; font-weight:700; "> NOORÉ </div> `} </div> <div class="cart-item-info"> <div class="cart-item-name"> ${escapeHTML(item.name)} </div> <div class="cart-item-price"> Rs. ${Number(item.price).toLocaleString()} </div>
<div style="font-size:12px;color:#766b6e;margin-top:3px;">Size: ${escapeHTML(item.size || "Not specified")}</div> <div class="quantity-control"> <button type="button" onclick="changeQuantity(${index}, -1)" > − </button> <span> ${item.quantity} </span> <button type="button" onclick="changeQuantity(${index}, 1)" > + </button> </div> </div> <div style=" margin-left:auto; text-align:right; "> <strong> Rs. ${itemTotal.toLocaleString()} </strong> <br> <button type="button" class="remove-cart" onclick="removeFromCart(${index})" > × </button> </div> </div> `;
          })
          .join("");
        totalElement.textContent = `Rs. ${total.toLocaleString()}`;
      }
      /* ========================= CHANGE QUANTITY ========================= */ function changeQuantity(
        index,
        change,
      ) {
        if (!cart[index]) {
          return;
        }
        cart[index].quantity = Number(cart[index].quantity) + change;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        saveCart();
        updateCartCount();
        renderCart();
      }
      /* ========================= REMOVE CART ITEM ========================= */ function removeFromCart(
        index,
      ) {
        if (!cart[index]) {
          return;
        }
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCart();
      }
      /* ========================= OPEN CHECKOUT ========================= */ function openCheckout() {
        if (cart.length === 0) {
          alert("Your cart is empty.");
          return;
        }
        closeCart();
        const summary = document.getElementById("checkoutSummary");
        let total = 0;
        const itemsHTML = cart
          .map((item) => {
            const itemTotal = Number(item.price) * Number(item.quantity);
            total += itemTotal;
            return ` <div style=" display:flex; justify-content:space-between; gap:15px; margin-bottom:8px; "> <span> ${escapeHTML(item.name)} × ${item.quantity}<small style="display:block;color:#766b6e;margin-top:2px;">Size: ${escapeHTML(item.size || "Not specified")}</small> </span> <strong> Rs. ${itemTotal.toLocaleString()} </strong> </div> `;
          })
          .join("");
        summary.innerHTML = ` ${itemsHTML} <div style=" border-top:1px solid #eadfdb; margin-top:10px; padding-top:10px; display:flex; justify-content:space-between; "> <strong>Total</strong> <strong> Rs. ${total.toLocaleString()} </strong> </div> `;
        document.getElementById("checkoutModal").classList.add("active");
      }
      /* ========================= CLOSE CHECKOUT ========================= */ function closeCheckout() {
        const modal = document.getElementById("checkoutModal");
        if (modal) {
          modal.classList.remove("active");
        }
      }
      /* ========================= PREMIUM ORDER SUCCESS ========================= */ function showOrderSuccess(
        orderId,
        name,
        phone,
        totalPrice,
      ) {
        const successDetails = document.getElementById("successOrderDetails");
        if (successDetails) {
          successDetails.innerHTML = ` <div class="success-order-row"> <span>Order ID</span> <strong class="success-order-id"> #${escapeHTML(orderId)} </strong> </div> <div class="success-order-row"> <span>Customer</span> <strong> ${escapeHTML(name)} </strong> </div> <div class="success-order-row"> <span>Payment</span> <strong> Cash on Delivery </strong> </div> <div class="success-order-row"> <span>Total Amount</span> <strong> Rs. ${Number(totalPrice).toLocaleString()} </strong> </div> `;
        }
        const successModal = document.getElementById("orderSuccessModal");
        if (successModal) {
          successModal.classList.add("active");
        }
      }
      /* ========================= CLOSE SUCCESS ========================= */ function closeOrderSuccess() {
        const modal = document.getElementById("orderSuccessModal");
        if (modal) {
          modal.classList.remove("active");
        }
      }
      /* ========================= TRACK NEW ORDER ========================= */ function trackNewOrder() {
        const lastOrder = JSON.parse(
          localStorage.getItem("nooreLastOrder") || "null",
        );
        if (!lastOrder) {
          alert("Order information not found.");
          return;
        }
        window.location.href = `track-order.html?orderId=${lastOrder.id}&phone=${encodeURIComponent(lastOrder.phone)}`;
      }
      /* ========================= CONTINUE SHOPPING ========================= */ function continueShopping() {
        closeOrderSuccess();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      /* ========================= SUBMIT CART ORDER ========================= */ async function submitCartOrder(
        event,
      ) {
        event.preventDefault();
        if (cart.length === 0) {
          alert("Your cart is empty.");
          return;
        }
        /* CUSTOMER DETAILS */ const name = document
          .getElementById("checkoutName")
          .value.trim();
        const phone = document.getElementById("checkoutPhone").value.trim();
        const city = document.getElementById("checkoutCity").value.trim();
        const address = document.getElementById("checkoutAddress").value.trim();
        const size = document.getElementById("checkoutSize").value;
        /* VALIDATION */ if (!name || !phone || !city || !address || !size) {
          alert("Please fill all required fields.");
          return;
        }
        /* TOTAL */ const totalPrice = cart.reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0,
        );
        /* TOTAL QUANTITY */ const totalQuantity = cart.reduce(
          (total, item) => total + Number(item.quantity),
          0,
        );
        /* PRODUCTS */ const productText = cart
          .map((item) => `${item.name} x${item.quantity} (Size: ${item.size || "Not specified"})`)
          .join(", ");
        /* ORDER DATA */ const orderData = {
          customerName: name,
          phone: phone,
          city: city,
          address: address,
          product: productText,
          productId: cart.length === 1 ? cart[0].id : null,
          size: cart.length === 1 ? (cart[0].size || size) : cart.map((item) => item.size || "Not specified").join(", "),
          quantity: totalQuantity,
          totalPrice: totalPrice,
        };
        console.log("Sending Order:", orderData);
        try {
          /* SAVE TO MYSQL */ const response = await fetch(
            `${API_URL}/orders`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            },
          );
          const result = await response.json();
          console.log("Server Response:", result);
          if (!response.ok) {
            throw new Error(result.message || "Order could not be saved");
          }
          /* SAVE LAST ORDER */ localStorage.setItem(
            "nooreLastOrder",
            JSON.stringify({
              id: result.id,
              phone: phone,
              name: name,
              total: totalPrice,
            }),
          );
          /* WHATSAPP PRODUCTS */ const whatsappProducts = cart
            .map(
              (item) =>
                `• ${item.name} x${item.quantity} - Rs. ${(Number(item.price) * Number(item.quantity)).toLocaleString()}`,
            )
            .join("\n");
          /* WHATSAPP MESSAGE */ const message = `New Order - NOORÉ Products: ${whatsappProducts} Total: Rs. ${totalPrice.toLocaleString()} Customer Name: ${name} Phone: ${phone} City: ${city} Address: ${address} Sizes: ${cart.map((item) => `${item.name}: ${item.size || "Not specified"}`).join(" | ")} Total Quantity: ${totalQuantity} Payment: Cash on Delivery Order ID: #${result.id}`;
          /* WHATSAPP NUMBER */ const whatsappNumber = "923172606993";
          const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);
          /* OPEN WHATSAPP */ window.open(whatsappURL, "_blank");
          /* CLEAR CART */ cart = [];
          saveCart();
          updateCartCount();
          /* RESET FORM */ const form = document.querySelector(
            "#checkoutModal form",
          );
          if (form) {
            form.reset();
          }
          /* CLOSE CHECKOUT */ closeCheckout();
          /* SHOW PREMIUM SUCCESS */ showOrderSuccess(
            result.id,
            name,
            phone,
            totalPrice,
          );
        } catch (error) {
          console.error("Order Error:", error);
          alert("Order confirm nahi ho saka.\n\n" + "Error: " + error.message);
        }
      }
      /* ========================= INITIAL LOAD ========================= */ loadProducts();
      updateCartCount();
      /* ========================= CART OUTSIDE CLICK ========================= */ const cartModal =
        document.getElementById("cartModal");
      if (cartModal) {
        cartModal.addEventListener("click", function (event) {
          if (event.target === this) {
            closeCart();
          }
        });
      }
      /* ========================= CHECKOUT OUTSIDE CLICK ========================= */ const checkoutModal =
        document.getElementById("checkoutModal");
      if (checkoutModal) {
        checkoutModal.addEventListener("click", function (event) {
          if (event.target === this) {
            closeCheckout();
          }
        });
      }
      /* ========================= SUCCESS OUTSIDE CLICK ========================= */ const orderSuccessModal =
        document.getElementById("orderSuccessModal");
      if (orderSuccessModal) {
        orderSuccessModal.addEventListener("click", function (event) {
          if (event.target === this) {
            closeOrderSuccess();
          }
        });
      }

      /* =========================
   MOBILE MENU
========================= */

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");

  if (!menu) return;

  menu.classList.toggle("active");
}


function closeMobileMenu() {
  const menu = document.getElementById("mobileMenu");

  if (!menu) return;

  menu.classList.remove("active");
}


