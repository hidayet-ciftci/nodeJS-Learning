const express = require("express");
const router = express.Router();
const contacts = [
  { id: 1, name: "Alice", email: "user@gmail.com", phone: "1234567890" },
  { id: 2, name: "Bob", email: "user2@gmail.com", phone: "0987654321" },
  { id: 3, name: "Charlie", email: "user3@gmail.com", phone: "1122334455" },
];

router.get("/contacts", (req, res) => {
  res.send(
    /* "<h1>Contacts Page</h1>" +
      contacts.map((c) => `<p>${c.name} - ${c.email} - ${c.phone}</p>`).join("") */ contacts
  );
});

router.post("/contacts", (req, res) => {
  const newContact = { id: contacts.length + 1, ...req.body }; //date.now() func'ı yerine length+1 kullanmak daha mantıklı
  const index = contacts.findIndex((item) => item.id === newContact.id);
  if (
    index !== -1 ||
    contacts.findIndex((item) => item.email === newContact.email) !== -1
  )
    return res.status(400).json({ error: "This Contact already exists" });

  contacts.push(newContact);
  console.log("Contact added");
  res.status(201).json(newContact); //oluşturulan yeni objeyi döndür
});

router.delete("/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Contact not found" });
  contacts.splice(index, 1);
  console.log("Contact deleted");
  res.status(204).end();
});

router.put("/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Contact not found" });
  contacts[index] = { ...contacts[index], ...req.body }; // yeni contacts oluştururken hem eskisini hem yenisini gönder,
  console.log("updated contact");
  res.json(contacts[index]); //204 kodu no content demek , put'da kullanma
});

module.exports = router;
