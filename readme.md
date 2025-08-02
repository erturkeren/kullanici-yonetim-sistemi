# Kullanıcı Kayıt Uygulaması

Sadece `fs` ve `path` modülleri kullanılarak oluşturulmuş basit bir kullanıcı yönetim sistemidir. Veriler `users.json` dosyasında tutulur.

## Özellikler

- Kullanıcı ekle, sil, güncelle, listele
- Aynı e-posta ile tekrar kayıt engellenir
- E-posta @ ve . içermeli

## Kullanımı

1. Kullanıcı ekle

node app add isim - mail - şifre

2. Kullanıcı silme

node app delete mail

3. Kullanıcı güncelleme

node app update mail - yeni isim - yeni şifre

4. Kullanıcıları Listele

node app list
