const categories = {
    PLACE: "場所・旅行",
    FOOD: "カフェ・レストラン",
    MOVIE: "映画・ドラマ",
    YOUTUBE: "YouTube",
    DO: "食",
    OTHER: "その他"
};

const STORAGE_KEY = "collectMomentsItems";

let items = [];

try {
    items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!Array.isArray(items)) items = [];
} catch (error) {
    items = [];
}

let selectedDate = "2026-12-01";


// ----------------------------------------
// ELEMENTS
// ----------------------------------------

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("month-year");
const selectedDateElement = document.getElementById("selected-date");
const selectedList = document.getElementById("selected-list");

const itemInput = document.getElementById("item-input");
const categoryInput = document.getElementById("category-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const formMessage = document.getElementById("form-message");

const wishlist = document.getElementById("wishlist");
const completedList = document.getElementById("completed-list");

const wishlistFilter = document.getElementById("wishlist-filter");
const completedFilter = document.getElementById("completed-filter");


// ----------------------------------------
// SAVE DATA
// ----------------------------------------

function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}


// ----------------------------------------
// DATE FORMAT
// ----------------------------------------

function formatDate(date) {
    const parts = date.split("-");
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
}


// ----------------------------------------
// CALENDAR
// ----------------------------------------

function renderCalendar() {

    calendar.innerHTML = "";

    monthYear.textContent = "2026年12月";

    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    weekdays.forEach(day => {
        const element = document.createElement("div");
        element.className = "weekday";
        element.textContent = day;
        calendar.appendChild(element);
    });

    const firstDay = new Date(2026, 11, 1).getDay();
    const daysInMonth = 31;

    // Empty spaces before the first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        calendar.appendChild(empty);
    }

    // Calendar dates
    for (let day = 1; day <= daysInMonth; day++) {

        const date = `2026-12-${String(day).padStart(2, "0")}`;

        const button = document.createElement("button");
        button.className = "day";
        button.type = "button";

        if (date === selectedDate) {
            button.classList.add("selected");
        }

        const number = document.createElement("span");
        number.className = "day-number";
        number.textContent = day;

        button.appendChild(number);

        const count = items.filter(item => item.date === date).length;

        if (count > 0) {
            const countElement = document.createElement("span");
            countElement.className = "day-count";
            countElement.textContent = `● ${count}`;
            button.appendChild(countElement);
        }

        button.addEventListener("click", () => {
            selectedDate = date;
            dateInput.value = date;
            renderAll();
        });

        calendar.appendChild(button);
    }
}


// ----------------------------------------
// SELECTED DATE LIST
// ----------------------------------------

function renderSelectedList() {

    selectedDateElement.textContent = formatDate(selectedDate);

    selectedList.innerHTML = "";

    const selectedItems = items.filter(
        item => item.date === selectedDate
    );

    if (selectedItems.length === 0) {
        showEmpty(
            selectedList,
            "この日の予定はまだありません"
        );
        return;
    }

    selectedItems.forEach(item => {
        selectedList.appendChild(createItemCard(item));
    });
}


// ----------------------------------------
// WISHLIST
// ----------------------------------------

function renderWishlist() {

    wishlist.innerHTML = "";

    const filter = wishlistFilter.value;

    const filteredItems = items.filter(item => {
        return !item.completed &&
            (filter === "ALL" || item.category === filter);
    });

    if (filteredItems.length === 0) {
        showEmpty(
            wishlist,
            "追加しよう"
        );
        return;
    }

    filteredItems.forEach(item => {
        wishlist.appendChild(createItemCard(item));
    });
}


// ----------------------------------------
// COMPLETED LIST
// ----------------------------------------

function renderCompleted() {

    completedList.innerHTML = "";

    const filter = completedFilter.value;

    const filteredItems = items.filter(item => {
        return item.completed &&
            (filter === "ALL" || item.category === filter);
    });

    if (filteredItems.length === 0) {
        showEmpty(
            completedList,
            "追加しよう"
        );
        return;
    }

    filteredItems.forEach(item => {
        completedList.appendChild(createItemCard(item));
    });
}


// ----------------------------------------
// CREATE ITEM CARD
// ----------------------------------------

function createItemCard(item) {

    const card = document.createElement("article");
    card.className = "item-card";

    if (item.completed) {
        card.classList.add("is-completed");
    }

    const info = document.createElement("div");
    info.className = "item-info";

    const category = document.createElement("p");
    category.className = "item-category";
    category.textContent = categories[item.category] || "その他";

    const title = document.createElement("h3");
    title.className = "item-title";
    title.textContent = item.title;

    const date = document.createElement("p");
    date.className = "item-date";
    date.textContent = formatDate(item.date);

    info.appendChild(category);
    info.appendChild(title);
    info.appendChild(date);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const completeButton = document.createElement("button");

    completeButton.textContent = item.completed
        ? "未完了に戻す"
        : "達成！";

    completeButton.addEventListener("click", () => {
        toggleComplete(item.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";

    deleteButton.addEventListener("click", () => {
        deleteItem(item.id);
    });

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);

    card.appendChild(info);
    card.appendChild(actions);

    return card;
}


// ----------------------------------------
// EMPTY MESSAGE
// ----------------------------------------

function showEmpty(container, message) {

    const element = document.createElement("p");

    element.className = "empty-message";
    element.innerHTML = message;

    container.appendChild(element);
}


// ----------------------------------------
// ADD ITEM
// ----------------------------------------

addButton.addEventListener("click", addItem);

function addItem() {

    const title = itemInput.value.trim();
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!date || date < "2026-12-01" || date > "2026-12-31") {
        formMessage.textContent = "2026年12月の日付を選択してください。";
        return;
    }

    const newItem = {
        id: Date.now() + Math.random(),
        title: title,
        category: category,
        date: date,
        completed: false
    };

    items.push(newItem);

    saveItems();

    selectedDate = date;

    itemInput.value = "";
    dateInput.value = selectedDate;

    renderAll();
}


// ----------------------------------------
// COMPLETE / UNCOMPLETE
// ----------------------------------------

function toggleComplete(id) {

    const item = items.find(item => item.id === id);

    if (!item) return;

    item.completed = !item.completed;

    saveItems();
    renderAll();
}


// ----------------------------------------
// DELETE ITEM
// ----------------------------------------

function deleteItem(id) {

    const confirmed = confirm("この項目を削除しますか？");

    if (!confirmed) return;

    items = items.filter(item => item.id !== id);

    saveItems();
    renderAll();
}


// ----------------------------------------
// FILTERS
// ----------------------------------------

wishlistFilter.addEventListener("change", renderWishlist);

completedFilter.addEventListener("change", renderCompleted);


// ----------------------------------------
// RENDER ALL
// ----------------------------------------

function renderAll() {

    renderCalendar();
    renderSelectedList();
    renderWishlist();
    renderCompleted();
}


// ========================================
// DOG PAW STAMP SCROLL EFFECT
// ========================================

const pawContainer = document.getElementById("paw-container");

const MAX_PAWS = 100;
const SCROLL_INTERVAL = 55;

let pawCount = 0;
let lastPawScroll = window.scrollY;
let lastSide = "right";

const pawSVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="67" rx="25" ry="21"/>
    <ellipse cx="20" cy="35" rx="10" ry="14"/>
    <ellipse cx="40" cy="20" rx="10" ry="14"/>
    <ellipse cx="62" cy="20" rx="10" ry="14"/>
    <ellipse cx="82" cy="35" rx="10" ry="14"/>
</svg>
`;


// ページの高さを取得

function updatePawContainerHeight() {
    pawContainer.style.height =
        document.documentElement.scrollHeight + "px";
}


// 肉球を作る

function createPaw() {

    if (pawCount >= MAX_PAWS) return;

    const paw = document.createElement("div");

    paw.className = "paw-stamp";
    paw.innerHTML = pawSVG;

    // 左右交互に配置

    const side = lastSide === "left" ? "right" : "left";
    lastSide = side;

    let randomX;

    if (side === "left") {
        randomX = Math.random() * 5 + 1;
    } else {
        randomX = Math.random() * 5 + 94;
    }

    // 現在のスクロール位置付近に配置

    const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - 40
    );

    const randomY = Math.min(
        maxY,
        window.scrollY + Math.random() * window.innerHeight * 0.6
    );

    // サイズと角度をランダムにする

    const rotation = Math.random() * 70 - 35;
    const size = Math.random() * 10 + 23;

    paw.style.left = randomX + "%";
    paw.style.top = randomY + "px";

    paw.style.width = size + "px";
    paw.style.height = size + "px";

    paw.style.setProperty(
        "--rotation",
        rotation + "deg"
    );

    pawContainer.appendChild(paw);

    pawCount++;

    // 約1.3秒後に肉球を削除

    setTimeout(() => {
        paw.remove();
        pawCount--;
    }, 1400);
}


// スクロールすると肉球を追加

window.addEventListener("scroll", () => {

    const currentScroll = window.scrollY;

    if (
        currentScroll - lastPawScroll >= SCROLL_INTERVAL &&
        pawCount < MAX_PAWS
    ) {

        createPaw();

        lastPawScroll = currentScroll;
    }

}, { passive: true });


// ページサイズ更新

window.addEventListener("load", updatePawContainerHeight);
window.addEventListener("resize", updatePawContainerHeight);


// ========================================
// INITIALIZE
// ========================================

// Initial date

dateInput.value = selectedDate;

// Initial rendering

renderAll();

// Initial paw container size

updatePawContainerHeight();
