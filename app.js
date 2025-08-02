let fs = require("fs"); // JSON dosyasına veri ekleme çıkarma
let path = require("path"); // Dosyaları birleştirme

const filePath = path.join(__dirname, "users.json"); // json dosyasını buldu

// Json dosyasıdaki verileri okuyor ve Jsona çeviriyor
function readUsers() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]"); /// Dosya var mı diye kontrol eder
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Users dizisini yazar
function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");
}

// User ekliyor isim mail şifre şeklinde
function addUser(name, email, password) {
  const emailkontrol = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // MAİLİ KONTROL EDİYOR @ .COM İÇERSİN

  if (!emailkontrol.test(email)) {
    console.log(" Geçerli bir e-posta adresi girin.");
    return;
  }

  let users = readUsers(); // mevcut verileri okuyor

  if (users.find((u) => u.email === email)) {
    /// Find ile aynı mail var mı diye kontrol eder
    console.log(" Bu e-posta zaten kayıtlı."); /// Aynı mail varsa bunu yazdırıyor eğer yoksa kullanıcıyı ekliyor
    return;
  }
  users.push({ name, email, password });
  writeUsers(users);
  console.log(" Kullanıcı eklendi.");
}

// Kullanıcı sil
function deleteUser(email) {
  let users = readUsers();
  const newUsers = users.filter((u) => u.email !== email);
  if (users.length === newUsers.length) {
    console.log(" Kullanıcı bulunamadı.");
    return;
  }
  writeUsers(newUsers);
  console.log(" Kullanıcı silindi.");
}

// Kullanıcıyı güncelliyor
function updateUser(email, newName, newPassword) {
  let users = readUsers();
  const index = users.findIndex((u) => u.email === email);
  if (index === -1) {
    console.log(" Güncellenecek kullanıcı bulunamadı.");
    return;
  }
  users[index].name = newName || users[index].name;
  users[index].password = newPassword || users[index].password;
  writeUsers(users);
  console.log(" Kullanıcı güncellendi.");
}

// Kullanıcıları listeliyor
function listUsers() {
  const users = readUsers();
  console.log(" Kayıtlı Kullanıcılar:");
  users.forEach((u, i) => console.log(`${i + 1}. ${u.name} (${u.email})`));
}

let [, , command, ...args] = process.argv; // Komutları algılıyor ve args (isim , mail,şifre )

switch (command) {
  case "add":
    addUser(args[0], args[1], args[2]);
    break;
  case "delete":
    deleteUser(args[0]);
    break;
  case "update":
    updateUser(args[0], args[1], args[2]);
    break;
  case "list":
    listUsers();
    break;
  default:
    console.log(`
Kullanımı şöyle :
  node app add isim-mail-şifre
  node app delete email
  node app update mail-yeni_isim-yeni_şifre
  node app list
`);
}
