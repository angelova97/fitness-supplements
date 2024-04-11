let express = require("express");
let router = express.Router();
const fs = require("fs");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const users = require("./passwd.json");
const supplements = require("./supplements.json");
const { Script } = require("vm");

// Инициализира сесията
router.use(
  session({
    secret: "random string",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 7200000 }, // expires after 2 hours
  }),
);

// Инициализира количката в сесията
router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = []; // Създава празна количка ако не съществува
  }

  if (!req.session.favorites) {
    req.session.favorites = []; // Създава празна количка ако не съществува
  }
  next();
});

let todo = new Array();
let filename = "";

// Маршрути
router.get("/login", function (req, res) {
  res.render("login", { info: "МОЛЯ ВЛЕЗТЕ В СИСТЕМАТА" });
});

router.post("/login", function (req, res) {
  bcrypt.compare(
    req.body.password,
    users[req.body.username] || "",
    function (err, is_match) {
      if (err) throw err;
      if (is_match === true) {
        req.session.username = req.body.username; // Запазва потребителското име в сесията
        req.session.count = 0;
        res.redirect("/todo/");
      } else {
        res.render("login", { warn: "ОПИТАЙТЕ ОТНОВО" });
      }
    },
  );
});

router.get("/logout", (req, res) => {
  req.session.destroy(); // Унищожава сесията
  res.redirect("/todo/");
});

router.all("/", function (req, res, next) {
  filename = req.session.username + ".txt";
  fs.readFile(filename, (err, data) => {
    if (err) todo = new Array(); // Създава нов списък ако има грешка
    else {
      todo = data
        .toString()
        .split("\n")
        .filter((s) => s.length > 0);
    }
    next();
  });
});

router.get("/", function (req, res) {
  req.session.count++;
  let s =
    "Потребител: " +
    req.session.username +
    " Брой: " +
    req.session.count +
    " " +
    new Date(); // Информация за потребителя и брояч на заявки
  // Представя шаблона със списък за изпълнение и добавки
  res.render("todo", {
    info: s,
    todo: todo,
    supplements: supplements,
    cart: req.session.cart,
  });
});

router.post("/", function (req, res) {
  let q = req.body;
  if (q.action == "add") todo.push(q.todo); // Добавя в списъка за изпълнение
  if (q.action == "del") todo.splice(q.todo, 1); // Изтрива от списъка за изпълнение
  if (q.action == "add" || q.action == "del") {
    let txt = "";
    for (let v of todo) txt += v + "\n"; // Създава текстова версия на спис
    // ка за запис
    fs.writeFile(filename, txt, (err) => {
      if (err) throw err;
      console.log("Файлът е запазен!"); // Логва в конзолата, че файлът е успешно запазен
    });
  }
  res.redirect("/todo/"); // Пренасочва обратно към основната страница
});

// Добавя продукт в количката
router.post("/add-to-cart", function (req, res) {
  const supplementId = req.body.id; // Взима ID на добавката
  const supplement = supplements.find((sup) => sup.id == supplementId); // Намира добавката по ID
  if (supplement) {
    // Check if the item is already in the cart
    const cartItem = req.session.cart.find((item) => item.id == supplementId);

    if (cartItem) {
      // If the item is already in the cart, increment the quantity
      cartItem.quantity += 1;
    } else {
      // Добавя добавката в количката с начално количество 1
      req.session.cart.push({ ...supplement, quantity: 1 });
    }
  }
  res.redirect("/todo/"); // Пренасочва обратно към основната страница
});

// Показва количката
router.get("/cart", function (req, res) {
  res.render("cart", { cart: req.session.cart || [] }); // Представя страницата на количката с текущите продукти в нея
});

// Премахва продукт от количката
router.post("/remove-from-cart", function (req, res) {
  const itemId = req.body.id; // Взима ID на продукта за премахване
  const index = req.session.cart.findIndex((item) => item.id == itemId); // Намира индекса на продукта в количката

  if (index !== -1) {
    req.session.cart.splice(index, 1); // Премахва продукта от количката
  }

  res.redirect("/todo/cart"); // Пренасочва обратно към страницата на количката
});

router.post("/update-cart-item", function (req, res) {
  const { id, action } = req.body;
  const productIndex = req.session.cart.findIndex((p) => p.id == id);
  if (productIndex !== -1) {
    if (action === "increase") {
      req.session.cart[productIndex].quantity += 1;
    } else if (
      action === "decrease" &&
      req.session.cart[productIndex].quantity > 1
    ) {
      req.session.cart[productIndex].quantity -= 1;
    }
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
module.exports = router; // Експортира рутера за използване в основния файл на приложението

/* Fix the issue in the code */
router.post("/add-to-cart", function (req, res) {
  const supplementId = req.body.id;
  const supplement = supplements.find((sup) => sup.id == supplementId);
  if (supplement) {
    req.session.cart.push(supplement);
    req.session.cartMessage = `${supplement.name} added to cart!`;
  }
  res.redirect("/todo/");
});

router.get("/", function (req, res) {
  res.render("todo", {
    info: s,
    todo: todo,
    supplements: supplements,
    cart: req.session.cart,
    message: req.session.cartMessage || "",
  });
  req.session.cartMessage = null; // Clear message after displaying it
});
