// 選擇 DOM 元素
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const checkoutButton = document.querySelector('.checkout');
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');
const loginButton = document.getElementById('login-btn');

// 購物車對象
const cart = {};

// 新增商品到購物車
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const product = e.target.closest('.product-item');
        const id = product.dataset.id;
        const name = product.dataset.name;
        const price = parseInt(product.dataset.price, 10);
        let quantity = parseInt(product.querySelector('.quantity').value, 10);

        // 防呆檢查
        if (isNaN(quantity) || quantity <= 0) {
            alert('請輸入有效的數量！');
            return;
        }

        if (!cart[id]) {
            cart[id] = { name, price, quantity };
        } else {
            cart[id].quantity += quantity;
        }
        updateCart();
    });
});

// 更新購物車畫面
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    for (const id in cart) {
        const { name, price, quantity } = cart[id];
        total += price * quantity;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${price}</td>
            <td>
                <button class="btn btn-sm btn-secondary decrease" data-id="${id}">-</button>
                <span>${quantity}</span>
                <button class="btn btn-sm btn-secondary increase" data-id="${id}">+</button>
            </td>
            <td>${price * quantity}</td>
            <td><button class="btn btn-sm btn-danger remove" data-id="${id}">移除</button></td>
        `;
        cartItemsContainer.appendChild(row);
    }

    totalPriceElement.textContent = `總金額：NT$${total}`;
    attachQuantityButtons();
}

// 綁定增加、減少和移除按鈕的事件
function attachQuantityButtons() {
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            cart[id].quantity++;
            updateCart();
        });
    });

    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            if (cart[id].quantity > 1) {
                cart[id].quantity--;
            } else {
                delete cart[id];
            }
            updateCart();
        });
    });

    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            delete cart[id];
            updateCart();
        });
    });
}

// 結帳功能
checkoutButton.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
        alert('購物車為空！');
        return;
    }

    let receipt = '購物明細：\n\n';
    let total = 0;

    for (const id in cart) {
        const { name, price, quantity } = cart[id];
        receipt += `${name} x ${quantity} = NT$${price * quantity}\n`;
        total += price * quantity;
    }

    receipt += `\n總金額：NT$${total}`;
    alert(receipt);
    cartItemsContainer.innerHTML = '';
    totalPriceElement.textContent = '總金額：NT$0';
    Object.keys(cart).forEach(id => delete cart[id]);
});

// 密碼顯示/隱藏功能
togglePasswordButton.addEventListener('click', () => {
    const isPasswordVisible = passwordInput.type === 'text';

    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    togglePasswordButton.textContent = isPasswordVisible ? '顯示密碼' : '隱藏密碼';
});

// 登入/登出功能
loginButton.addEventListener('click', () => {
    if (loginButton.textContent === '登入') {
        const enteredPassword = passwordInput.value;

        if (enteredPassword === 'abc123') {
            loginButton.textContent = '登出';
            loginButton.classList.add('online');
            alert('登入成功！');
        } else {
            alert('密碼錯誤，請重新輸入！');
        }
    } else {
        loginButton.textContent = '登入';
        loginButton.classList.remove('online');
        alert('已登出！');
    }
});
