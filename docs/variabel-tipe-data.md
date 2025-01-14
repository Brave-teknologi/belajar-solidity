---
sidebar_position: 5
---

# 3. Variabel dan Tipe data

Memahami variabel dan tipe data di Solidity sangat penting untuk menulis smart contract yang efektif dan aman. Pada bagian ini, kita akan membahas berbagai jenis variabel dan tipe data yang tersedia di Solidity, mulai dari bagaimana data disimpan, dimanipulasi, dan diakses dalam smart contract.

## Variabel di Solidity

Variabel di Solidity dapat berupa berbagai jenis dan fungsi yang berbeda dalam smart contract. Berikut adalah 3 jenis variabel:

1. State Variable:
   State variable disimpan secara permanen di blockchain dan dideklarasikan di dalam kontrak tetapi di luar dari function manapun. Mereka mewakili storage dalam kontrak dan akan mempertahankan nilainya ketika memanggil function. Hal ini penting untuk menyimpan data-data yang akan selalu dipakai. Contoh:

   ```solidity
   uint256 public data;
   bool public locked = false;
   ```

2. Local Variable:
   Local variable dideklarasikan di dalam function dan hanya ada selama function tersebut dieksekusi. Data tidak akan disimpan di blockchain, artinya nilainya sementara dan dibuang setelah eksekusi function selesai. Variabel-variabel ini digunakan untuk perhitungan sementara dan penyimpanan sementara di dalam function. Contoh:

   ```solidity
   function example() public {
       uint localData = 10;
   }
   ```

3. Global Variable:
   Global variable adalah variabel dan function khusus yang memberikan informasi yang berkaitan dengan blockchain dan transaksi. Sudah ada secara default seperti data alamat pengirim, nomor blok saat ini, dan harga gas. Contoh adalah msg.sender, yang mengembalikan alamat entitas yang memanggil function tersebut:

   ```solidity
   function getSender() public view returns (address) {
       return msg.sender;
   }
   ```

## Tipe data di Solidity

Solidity mendukung beberapa tipe data dasar dan kompleks, masing-masing dengan kasus penggunaan dan karakteristiknya sendiri:

1. **Boolean:**
   Tipe data Boolean mewakili nilai true atau false. Tipe data ini sederhana namun penting untuk alur kontrol dan operasi logika di dalam smart contract. Booleans digunakan dalam kondisi dan memerlukan sedikit penyimpanan. Contohnya:

   ```solidity
   bool public flag = true;
   ```

2. **Integer:**
   Solidity mendukung integer (int) dan unsigned integer (uint). unsigned integer (uint) dapat menampung berkisar dari 0 hingga 2256-1, sedangkan integer (int) berkisar dari -2255 hingga 2255-1. Tipe data ini digunakan untuk operasi numerik dan menyimpan data numerik. Contohnya:

   ```solidity
   int public signedInt = -1;
   uint public unsignedInt = 1;
   ```

3. **Address:**
   Tipe data address menyimpan nilai 20-byte yang mewakili alamat Ethereum, yang digunakan untuk mengidentifikasi alamat akun user atau smart contract. Alamat ini sangat penting untuk mengirim dan menerima dana serta untuk berinteraksi dengan kontrak lain. Contohnya:

   ```solidity
   address public wallet = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
   ```

4. **String:**
   Tipe data string mewakili kumpulan karakter. String digunakan untuk menyimpan dan memanipulasi data teks. Meskipun string di Solidity kurang efisien dibandingkan tipe data lainnya, mereka berguna untuk menyimpan informasi yang dapat dibaca. Contohnya:

   ```solidity
   string public name = "Alice";
   ```

5. **Bytes and Fixed-Size Byte Arrays:**
   bytes mewakili array dinamis dari byte, sedangkan array byte dengan ukuran tetap (misalnya, bytes32) mewakili urutan byte dengan panjang tetap. Tipe data ini digunakan untuk menyimpan data byte mentah dan informasi biner. Contohnya:

   ```solidity
   bytes public data = "Hello";
   bytes32 public fixedData = "Hello";
   ```

6. **Array:**
   Solidity mendukung array dengan fixed-size dan dynamic, yang bisa digunakan untuk menyimpan kumpulan elemen. Array pada dasarkan digunakan untuk mengelola urutan data agar teratur. Contohnya:

   ```solidity
   uint[] public dynamicArray;
   uint[5] public fixedArray;
   ```

7. **Mapping:**
   Mapping adalah sebuah tipe data key-value untuk menyimpan dan mengambil nilai yang berdasarkan key nya. Tipe data ini sangat berguna untuk mengakses data menggunakan key unik dengan nilai tertentu. Contohnya:

   ```solidity
   mapping(address => uint) public balances;
   ```

## Menggunakan Array dan Mapping

Array di Solidity dapat bersifat dinamis atau tetap ukurannya. Array dinamis dapat bertambah atau berkurang ukurannya, sedangkan array dengan ukuran tetap memiliki panjang yang sudah ditentukan.

### Dynamic Array:

```solidity
uint[] public dynamicArray;

function addElement(uint element) public {
    dynamicArray.push(element);
}

function getElement(uint index) public view returns (uint) {
    return dynamicArray[index];
}
```

### Fixed-Size Arrays:

```solidity
uint[5] public fixedArray;

function setElement(uint index, uint element) public {
    fixedArray[index] = element;
}

function getElement(uint index) public view returns (uint) {
    return fixedArray[index];
}
```

Dengan Mapping kita bisa mengaitkan nilai dengan sebuah unique key seperti ID, address atau bahkan string. Mirip seperti hash table yang bisa mengelola asosiasi data secara efisien. Contohnya:

### Basic Mapping:

```solidity
mapping(address => uint) public balances;

function updateBalance(address user, uint amount) public {
    balances[user] = amount;
}

function getBalance(address user) public view returns (uint) {
    return balances[user];
}
```

### Contoh kasus: Simple Bank Contract

Mari kita gabungkan apa yang telah kita pelajari sejauh ini ke dalam sebuah kontrak bank sederhana yang memungkinkan pengguna untuk menyetor dan menarik Ether. Contoh ini akan menunjukkan penggunaan mapping untuk mengelola saldo pengguna, state variable untuk penyimpanan permanen, dan function untuk user berinteraksi dengan kontrak.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank {
    mapping(address => uint) public balances;

    // Deposit function to add balance
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Withdraw function to reduce balance
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    // Get balance of the caller
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}
```

### Melakukan Test

Kita akan mendeploy kontrak SimpleBank menggunakan Hardhat dan berinteraksi langsung melalui konsol Hardhat.

#### Compile dan Deploy:

Jalankan perintah berikut:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js
```

#### Kode script untuk mendeploy:

```javascript
const { ethers } = require("hardhat");

async function main() {
   const SimpleBank = await ethers.getContractFactory("SimpleBank");
   const bank = await SimpleBank.deploy();
   console.log("SimpleBank deployed to:", bank.target);

   // Deposit 1 Ether
   await bank.deposit({ value: ethers.parseEther("1.0") });

   // Get balance
   let balance = await bank.getBalance();
   console.log(balance.toString()); // Should print '1000000000000000000' (1 Ether in Wei)

   // Withdraw 0.5 Ether
   await bank.withdraw(ethers.parseEther("0.5"));
   balance = await bank.getBalance();
   console.log(balance.toString()); // Should print '500000000000000000' (0.5 Ether in Wei)
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

Kamu juga bisa menggunakan Truffle untuk berinteraksi langsung dengan contract melalui console.

#### Compile dan Deploy:

Jalankan perintah berikut:

```bash
truffle migrate
truffle console
```

#### Berinteraksi dengan Truffle:

```javascript
let bank = await SimpleBank.deployed();
await bank.deposit({
   value: web3.utils.toWei("1", "ether"),
   from: accounts[0],
});
let balance = await bank.getBalance({ from: accounts[0] });
console.log(balance.toString());

await bank.withdraw(web3.utils.toWei("0.5", "ether"), { from: accounts[0] });
balance = await bank.getBalance({ from: accounts[0] });
console.log(balance.toString());
```
