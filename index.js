
const express = require("express");
const app = express();

app.use(express.json());

let users = [];
let products = [];
let productId = 1;
let userId = 1;

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).send("Email band");
  }
  users.push({ id: userId++, email, password });
  res.send("Ro'yxatdan o'tdingiz");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).send("Email yoki parol noto'g'ri");
  res.send("Tizimga kirdingiz");
});

app.post("/products", (req, res) => {
  const { name, price, brand } = req.body;
  if (!name || !price || !brand) {
    return res.status(400).send("Malumot yetishmayapti");
  }
  const product = { id: productId++, name, price, brand };
  products.push(product);
  res.send(product);
});

app.get("/products", (req, res) => {
  let { brand, page = 1, limit = 5 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let filter = products;
  if (brand) filter = filter.filter(p => p.brand === brand);

  const start = (page - 1) * limit;
  const paginated = filter.slice(start, start + limit);

  res.send({
    total: filter.length,
    page,
    limit,
    data: paginated,
  });
});

app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).send("Topilmadi");
  res.send(product);
});

app.patch("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).send("Topilmadi");
  Object.assign(product, req.body);
  res.send(product);
});

app.delete("/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).send("Topilmadi");
  products.splice(index, 1);
  res.send({ message: "O'chirildi" });
});

app.listen(3000, () => console.log("Server 3000-portda ishlayapti"));
