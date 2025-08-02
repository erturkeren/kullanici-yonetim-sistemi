const fs = require("fs"); // senkron
let fs1 = require("fs").promises; // JSON dosyasına veri ekleme çıkarma async
let path = require("path"); // Dosyaları birleştirme

const filePath = path.join(__dirname, "users.json"); // json dosyasını buldu

// Json dosyasıdaki verileri okuyor ve Jsona çeviriyor
function readUsers() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]"); /// Dosya var mı diye kontrol eder
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Users dizisini yazar
async function writeUsers(users) {
  await fs1.writeFile(filePath, JSON.stringify(users, null, 2), "utf8");
}

// User ekliyor isim mail şifre şeklinde
async function addUser(name, email, password) {
  const emailkontrol = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // MAİLİ KONTROL EDİYOR @ .COM İÇERSİN

  if (!emailkontrol.test(email)) {
    console.log(" Geçerli bir e-posta adresi girin.");
    return;
  }
  email = email.toLowerCase();
  name = name.toUpperCase();
  let users = readUsers(); // mevcut verileri okuyor

  if (users.find((u) => u.email === email)) {
    /// Find ile aynı mail var mı diye kontrol eder
    console.log(" Bu e-posta zaten kayıtlı."); /// Aynı mail varsa bunu yazdırıyor eğer yoksa kullanıcıyı ekliyor
    return;
  }
  users.push({ name, email, password });
  await writeUsers(users);
  console.log(" Kullanıcı eklendi.");
}

// Kullanıcı sil
async function deleteUser(email) {
  email = email.toLowerCase();
  let users = readUsers();
  let newUsers = users.filter((u) => u.email !== email);
  if (users.length === newUsers.length) {
    console.log(" Kullanıcı bulunamadı.");
    return;
  }
  await writeUsers(newUsers);
  console.log(" Kullanıcı silindi.");
}

// Kullanıcıyı güncelliyor
async function updateUser(email, newName, newPassword) {
  email = email.toLowerCase();
  let users = readUsers();
  const index = users.findIndex((u) => u.email === email);
  if (index === -1) {
    console.log(" Güncellenecek kullanıcı bulunamadı.");
    return;
  }
  users[index].name = newName || users[index].name;
  users[index].password = newPassword || users[index].password;
  await writeUsers(users);
  console.log(" Kullanıcı güncellendi.");
}

// Kullanıcıları listeliyor
function listUsers() {
  const users = readUsers();
  console.log(" Kayıtlı Kullanıcılar:");
  users.forEach((u, i) => console.log(`${i + 1}. ${u.name} (${u.email})`));
}

let [, , command, ...args] = process.argv; // Komutları algılıyor ve args (isim , mail,şifre )

(async () => {
  switch (command) {
    case "add":
      await addUser(args[0], args[1], args[2]);
      break;
    case "delete":
      await deleteUser(args[0]);
      break;
    case "update":
      await updateUser(args[0], args[1], args[2]);
      break;
    case "list":
      listUsers();
      break;
    default:
      console.log(`
Kullanımı şöyle :
  EKLEMEK       :  node app add   isim  -  mail  -  şifre
  SİLMEK        :  node app delete   email
  GÜNCELLEMEK   :  node app update   mail  - yeni_isim  -  yeni_şifre
  LİSTELEMEK    :  node app  list
`);
  }
})();
