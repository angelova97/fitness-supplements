"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var router = express.Router();

var fs = require("fs");

var session = require("express-session");

var bcrypt = require("bcryptjs");

var users = require("./passwd.json");

var supplements = require("./supplements.json");

var _require = require("vm"),
    Script = _require.Script; // Инициализира сесията


router.use(session({
  secret: "random string",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 7200000
  } // expires after 2 hours

})); // Инициализира количката в сесията

router.use(function (req, res, next) {
  if (!req.session.cart) {
    req.session.cart = []; // Създава празна количка ако не съществува
  }

  if (!req.session.favorites) {
    req.session.favorites = []; // Създава празна количка ако не съществува
  }

  next();
});
var todo = new Array();
var filename = ""; // Маршрути

router.get("/login", function (req, res) {
  res.render("login", {
    info: "МОЛЯ ВЛЕЗТЕ В СИСТЕМАТА"
  });
});
router.post("/login", function (req, res) {
  bcrypt.compare(req.body.password, users[req.body.username] || "", function (err, is_match) {
    if (err) throw err;

    if (is_match === true) {
      req.session.username = req.body.username; // Запазва потребителското име в сесията

      req.session.count = 0;
      res.redirect("/todo/");
    } else {
      res.render("login", {
        warn: "ОПИТАЙТЕ ОТНОВО"
      });
    }
  });
});
router.get("/logout", function (req, res) {
  req.session.destroy(); // Унищожава сесията

  res.redirect("/todo/");
});
router.all("/", function (req, res, next) {
  if (!req.session.username) {
    res.redirect("/todo/login"); // Пренасочва към входа, ако потребителят не е в сесия

    return;
  }

  console.log(req.session);
  filename = req.session.username + ".txt";
  fs.readFile(filename, function (err, data) {
    if (err) todo = new Array(); // Създава нов списък ако има грешка
    else {
        todo = data.toString().split("\n").filter(function (s) {
          return s.length > 0;
        });
      }
    next();
  });
});
router.get("/", function (req, res) {
  req.session.count++;
  var s = "Потребител: " + req.session.username + " Брой: " + req.session.count + " " + new Date(); // Информация за потребителя и брояч на заявки
  // Представя шаблона със списък за изпълнение и добавки

  res.render("todo", {
    info: s,
    todo: todo,
    supplements: supplements,
    cart: req.session.cart
  });
});
router.post("/", function (req, res) {
  var q = req.body;
  if (q.action == "add") todo.push(q.todo); // Добавя в списъка за изпълнение

  if (q.action == "del") todo.splice(q.todo, 1); // Изтрива от списъка за изпълнение

  if (q.action == "add" || q.action == "del") {
    var txt = "";
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = todo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;
        txt += v + "\n";
      } // Създава текстова версия на спис
      // ка за запис

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    fs.writeFile(filename, txt, function (err) {
      if (err) throw err;
      console.log("Файлът е запазен!"); // Логва в конзолата, че файлът е успешно запазен
    });
  }

  res.redirect("/todo/"); // Пренасочва обратно към основната страница
}); // Добавя продукт в количката

router.post("/add-to-cart", function (req, res) {
  var supplementId = req.body.id; // Взима ID на добавката

  var supplement = supplements.find(function (sup) {
    return sup.id == supplementId;
  }); // Намира добавката по ID

  if (supplement) {
    // Check if the item is already in the cart
    var cartItem = req.session.cart.find(function (item) {
      return item.id == supplementId;
    });

    if (cartItem) {
      // If the item is already in the cart, increment the quantity
      cartItem.quantity += 1;
    } else {
      // Добавя добавката в количката с начално количество 1
      req.session.cart.push(_objectSpread({}, supplement, {
        quantity: 1
      }));
    }
  }

  res.redirect("/todo/"); // Пренасочва обратно към основната страница
}); // Показва количката

router.get("/cart", function (req, res) {
  res.render("cart", {
    cart: req.session.cart || []
  }); // Представя страницата на количката с текущите продукти в нея
}); // Премахва продукт от количката

router.post("/remove-from-cart", function (req, res) {
  var itemId = req.body.id; // Взима ID на продукта за премахване

  var index = req.session.cart.findIndex(function (item) {
    return item.id == itemId;
  }); // Намира индекса на продукта в количката

  if (index !== -1) {
    req.session.cart.splice(index, 1); // Премахва продукта от количката
  }

  res.redirect("/todo/cart"); // Пренасочва обратно към страницата на количката
});
router.post("/update-cart-item", function (req, res) {
  var _req$body = req.body,
      id = _req$body.id,
      action = _req$body.action;
  var productIndex = req.session.cart.findIndex(function (p) {
    return p.id == id;
  });

  if (productIndex !== -1) {
    if (action === "increase") {
      req.session.cart[productIndex].quantity += 1;
    } else if (action === "decrease" && req.session.cart[productIndex].quantity > 1) {
      req.session.cart[productIndex].quantity -= 1;
    }

    res.json({
      success: true
    });
  } else {
    res.json({
      success: false
    });
  }
});
module.exports = router; // Експортира рутера за използване в основния файл на приложението

/* Fix the issue in the code */

router.post("/add-to-cart", function (req, res) {
  var supplementId = req.body.id;
  var supplement = supplements.find(function (sup) {
    return sup.id == supplementId;
  });

  if (supplement) {
    req.session.cart.push(supplement);
    req.session.cartMessage = "".concat(supplement.name, " added to cart!");
  }

  res.redirect("/todo/");
});
router.get("/", function (req, res) {
  res.render("todo", {
    info: s,
    todo: todo,
    supplements: supplements,
    cart: req.session.cart,
    message: req.session.cartMessage || ''
  });
  req.session.cartMessage = null; // Clear message after displaying it
});