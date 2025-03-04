#!/bin/bash

echo "🚀 Deploy süreci başlatılıyor..."

# 1. Git'ten en son kodları çek
echo "📦 Yeni kodlar çekiliyor..."
git pull origin main

# 2. Bağımlılıkları yükle
echo "📦 Bağımlılıklar yükleniyor..."
yarn install --frozen-lockfile

# 4. Build al
echo "🛠️ Proje derleniyor..."
npm run build

# 5. Build klasörünü site dizinine kopyala
echo "🚚 Build klasörü site dizinine kopyalanıyor...
cp -r dist/* /home/app.registate.com/public_html/"


echo "✅ Deploy tamamlandı!"
