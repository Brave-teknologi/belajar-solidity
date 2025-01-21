---
sidebar_position: 2
---

# Best Practice Security yang Sudah Umum

Memastikan keamanan smart contract sangat penting untuk mencegah eksploitasi dan kerentanan. Berikut adalah beberapa best practice yang harus diikuti oleh setiap developer:

1. **Gunakan Library yang Standar**  
   Menggunakan library yang telah diaudit dengan baik seperti OpenZeppelin untuk fungsi-fungsi umum seperti kontrol akses, standar token, dan lainnya. Library ini telah diuji secara ketat dan banyak digunakan berbagai project crypto.

2. **Hindari Floating Pragma**  
   Tetapkan versi Solidity di dalam kontrak kamu untuk menghindari masalah ketidakcocokan dan behaviour yang tidak terduga akibat perbedaan versi atau update compiler. Menggunakan pragma yang tetap memastikan bahwa kontrak kamu compatible dengan environment project yang sudah ditetapkan.  
   _Good practice_:

   ```solidity
   pragma solidity ^0.8.0;
   ```

3. **Lakukan Audit Security**  
   Secara rutin audit smart contract kamu dengan perusahaan keamanan profesional untuk mengidentifikasi dan memperbaiki kerentanan. Audit keamanan memberikan tinjauan secara detail dan komprehensif terhadap kode kamu, sehingga dapat membantu menemukan masalah atau bug tersembunyi yang mungkin terlewat.

4. **Tulis Unit Test**  
   Pastikan terdapat unit test yang lengkap untuk mencakup berbagai skenario dan use case. Gunakan framework seperti Truffle atau Hardhat. Pengujian bisa sangat membantu memvalidasi fungsionalitas dan keamanan smart contract.

5. **Ikuti Best Practice untuk Mendesain Contract**  
   Gunakan best practice yang sudah ada seperti:

   -  **Checks-Effects-Interactions Pattern**: Pattern ini meminimalkan risiko reentrancy dengan terlebih dahulu memeriksa kondisi, kemudian memperbarui status, dan akhirnya berinteraksi dengan kontrak eksternal.
   -  **Pull over Push Pattern**: Untuk menangani yang berhubungan dengan dana (fund), gunakan pattern ini di mana pengguna menarik dana mereka sendiri alih-alih kontrak yang mengirimkan dana secara otomatis. Ini mengurangi risiko serangan reentrancy.

6. **Implementasi Circuit Breaker**  
   Gunakan circuit breaker untuk menghentikan operasi kontrak dalam keadaan darurat. Ini dapat mencegah dampak buruk yang lebih lanjut jika suatu kerentanan ditemukan.  
   Contoh penggunaan Circuit Breaker:

   ```solidity
   // Circuit breaker pattern
   contract EmergencyStop {
        bool private stopped = false;
        address private owner;

        modifier stopInEmergency() {
             require(!stopped, "Stopped in emergency");
             _;
        }

        modifier onlyOwner() {
             require(msg.sender == owner, "Not the owner");
             _;
        }

        constructor() {
             owner = msg.sender;
        }

        function toggleContractActive() public onlyOwner {
             stopped = !stopped;
        }

        function deposit() public payable stopInEmergency {
             // deposit logic
        }

        function withdraw(uint amount) public stopInEmergency {
             // withdraw logic
        }
   }
   ```

   Berikut penjelasan pada contract EmergencyStop:

   -  Variabel state `stopped` untuk menunjukkan apakah kontrak sedang dijeda.
   -  Modifier `stopInEmergency` dapat mencegah fungsi-fungsi untuk dieksekusi jika kontrak sedang dijeda.
   -  Modifier `onlyOwner` digunakan untuk membatasi fungsi tertentu hanya bisa dipanggil oleh pemilik kontrak.
   -  Fungsi `toggleContractActive` yang dapat digunakan oleh owner untuk menjeda atau melanjutkan kontrak.

7. **Berhati-hatilah Ketika Memanggil Contract Eksternal**  
   Untuk meminimalisir, harap hati-hati ketika memanggil contract external untuk mencegah behaviour yang tidak terduga yang bisa menjadi celah keamanan.
