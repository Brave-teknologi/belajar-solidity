---
sidebar_position: 2
---

# Mengenal Solidity

## Apa itu Solidity?

**Solidity** adalah bahasa pemrograman tingkat tinggi yang bersifat **static-typing**, dirancang untuk mengembangkan **smart contract** pada blockchain Ethereum. Bahasa ini dipengaruhi oleh **JavaScript**, **Python**, dan **C++**, sehingga memudahkan pengembang menulis kode untuk menerapkan logika bisnis secara aman dan terdesentralisasi.

## Fitur Utama Solidity

-  **Static-typing** yabg berarti setiap variabel dan tipe data nya diketahui sebelum waktu kompilasi. Ini bisa membantu mengetahui error lebih awal dalam proses pengembangan, mengurangi risiko kesalahan saat runtime.

-  **Pewarisan** memungkinkan sebuah kontrak untuk mewarisi dari satu kontrak induk, di Solidity struktur pewarisan sangat mudah untuk dikelola.

-  **Library** adalah potongan kode yang dapat digunakan kembali yang dapat dipanggil tanpa harus terhubung ke instance kontrak tertentu. Library menyediakan cara untuk berbagi function di berbagai kontrak, mempermudah pengembang untuk memakai dan maintain dengan lebih efektif.

-  **Modifier** di Solidity digunakan untuk mengubah perilaku function dengan cara deklaratif. Mereka sangat berguna untuk menambahkan prasyarat atau aturan dan batasan lain pada tingkat function tanpa mengacaukan logika utama di dalam function tersebut.

-  **Event** di Solidity digunakan untuk mencatat kejadian tertentu di dalam blockchain, yang kemudian dapat di listen oleh aplikasi eksternal. Event berfungsi sebagai mekanisme komunikasi antara blockchain dan sistem di luar blockchain (off-chain).

## Menulis Smart Contract Pertama

### Siapkan Project

1. **Buat folder baru untuk project:**

   ```bash
   mkdir MySolidityProject
   cd MySolidityProject
   ```

2. **Inisialisasi Truffle:**

   ```bash
   truffle init
   ```

   Dengan menjalankan perintah di atas, semua file konfigurasi dan struktur folder akan dibuatkan secara otomatis.

### Membuat Smart Contract Sederhana

1. **Buat file Solidity:**

   Di dalam folder `contracts`, buat file baru bernama `SimpleStorage.sol`.

   Tulis kode berikut:

   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.7.0;

   contract SimpleStorage {
       uint256 public storedData;

       function set(uint256 x) public {
           storedData = x;
       }

       function get() public view returns (uint256) {
           return storedData;
       }
   }
   ```

## Melakukan Kompilasi dan Deploy Contract

### Kompilasi Contract

1. Jalankan perintah berikut untuk mengkompilasi kode Solidity:

   ```bash
   truffle compile
   ```

   Perintah ini akan mengkompilasi kode Solidity dan menghasilkan **artifact** yang digunakan untuk proses deployment atau pengiriman smart contract ke blockchain.

### Buat Script Deployment

1. Di dalam folder `migrations`, buat file baru bernama `1_deploy_contracts.js`.
2. Tulis kode berikut di dalam file tersebut:

   ```javascript
   const SimpleStorage = artifacts.require("SimpleStorage");

   module.exports = function (deployer) {
      deployer.deploy(SimpleStorage);
   };
   ```

### Deploy Contract

1. Jalankan perintah berikut untuk mendepoy smart contract ke blockchain lokal (Ganache):

   ```bash
   truffle migrate
   ```

   Pastikan program **Ganache** sudah berjalan sebelum menjalankan perintah ini.

### Berinteraksi dengan Contract yang Sudah di Deploy

1. **Buka Truffle Console:**

   ```bash
   truffle console
   ```

2. **Berinteraksi dengan Contract:**

   ```javascript
   // Mendapatkan instance dari contract yang sudah di-deploy
   let instance = await SimpleStorage.deployed();

   // Menyimpan nilai ke dalam contract
   await instance.set(42);

   // Mengambil nilai dari contract
   let value = await instance.get();

   // Menampilkan nilai dalam bentuk string
   value.toString(); // Should print '42'
   ```
