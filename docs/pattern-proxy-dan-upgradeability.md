---
sidebar_position: 14
---

# 12. Pattern Proxy dan Upgradeability

Seiring dengan berkembangnya teknologi blockchain, kebutuhan akan smart contract yang dapat beradaptasi dan di-upgrade menjadi semakin penting. Berbeda dengan perangkat lunak tradisional, smart contract bersifat tidak dapat diubah setelah di-deploy. Untuk mengatasi keterbatasan ini, para pengembang menggunakan pattern proxy untuk memungkinkan upgrade kontrak. Pada bab ini kita akan membahas konsep, implementasi, dan berbagai jenis pola proxy, dengan fokus pada proxy Transparent dan UUPS.

Kontrak proxy menyediakan mekanisme untuk mendelegasikan panggilan fungsi ke kontrak lain, yang disebut sebagai kontrak implementasi. Hal ini memungkinkan pengembang untuk mengubah logika implementasi tanpa mengubah state atau alamat kontrak. Kontrak proxy bertindak sebagai mediator, meneruskan panggilan dan mempertahankan data sebelumnya.

## 2 komponen utama dalam pattern Proxy:

-  **Proxy Contract**: menyimpan data dan mendelegasikan panggilan fungsi ke kontrak implementasi.
-  **Implementation Contract**: menyimpan logika dan fungsionalitas, yang dapat di-upgrade dari waktu ke waktu.

### Berikut manfaat utama dari Proxy Contract:

-  **Upgradeability**: memungkinkan merubah (update) logika kontrak tanpa perlu re-deploy dan kehilangan data.
-  **Modularitas**: memisahkan logika dari penyimpanan data, meningkatkan kemudahan pemeliharaan.
-  **Efisiensi Biaya**: mengurangi biaya deployment dengan menggunakan ulang kontrak proxy yang sama, sementara hanya memperbarui kontrak implementasi.

## Transparent vs UUPS Proxy

Dua jenis pattern yang paling umum adalah Transparent dan UUPS (Universal Upgradeable Proxy Standard) Proxy.

### Pattern Transparent Proxy

Pattern Transparent Proxy adalah salah satu yang paling banyak digunakan, terutama ketika menggunakan library OpenZeppelin. Pattern ini melibatkan pemisahan tanggung jawab, di mana kontrak proxy dan kontrak logika terpisah, sehingga memastikan bahwa fungsi administratif tidak dapat diakses melalui proxy.

**Karakteristik:**

-  **Pemisahan Peran**: proxy memiliki peran admin terpisah yang bertanggung jawab atas upgrade, berbeda dari peran pengguna biasa.
-  **Manajemen Slot Penyimpanan**: dengan menggunakan slot penyimpanan khusus agar menghindari konflik antara proxy dan kontrak implementasi.

**Contoh implementasi:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract ProxyDeployer {
    address public admin;
    address public proxy;

    constructor(address _implementation) {
        ProxyAdmin adminInstance = new ProxyAdmin(msg.sender);
        admin = address(adminInstance);
        TransparentUpgradeableProxy proxyInstance = new TransparentUpgradeableProxy(_implementation, admin, "");
        proxy = address(proxyInstance);
    }
}
```

Pada kontrak ini, kita bisa melihat cara menerapkan Transparent Upgradeable Proxy menggunakan library dari OpenZeppelin. Pertama kontrak ini menginisialisasi instance baru dari ProxyAdmin, kemudian memberikan hak administratif kepada peng-deploy (msg.sender) untuk mengelola upgrade. Selanjutnya, kontrak ini membuat instance dari TransparentUpgradeableProxy yang menunjuk ke kontrak implementasi yang ditentukan dari parameter \_implementation. ProxyAdmin akan mengelola proxy, yang memungkinkan upgrade tanpa mempengaruhi state atau alamat proxy.

### Pattern UUPS Proxy

Pattern UUPS (Universal Upgradeable Proxy Standard) adalah upgradeability pattern yang lebih fleksibel dan hemat gas, di mana logika upgrade berada dalam kontrak implementasi itu sendiri.

**Karakteristik Utama:**

-  **Fungsi Upgrade di Implementasi**: kontrak implementasi terdapat fungsi untuk meng-upgrade dirinya sendiri.
-  **Kesederhanaan dan Efisiensi**: biaya gas lebih hemat dibandingkan dengan Transparent Proxy dengan menghindari penyimpanan dan pemanggilan fungsi yang tidak perlu.

**Contoh implementasi:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UpgradableContract is UUPSUpgradeable, OwnableUpgradeable {
    uint8 private changeId;
    uint public number;

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // The initialize function will be used to set up the initial state of the contract.
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        number = 10;
    }

    function updateNumber(uint _number) public returns (uint, uint) {
        number = _number;
        changeId += 1;
        uint id = changeId;
        return (number, id);
    }
}
```

Contoh kontrak UpgradableContract menunjukkan cara mengimplementasikan kontrak yang dapat diperbarui menggunakan pola UUPS (Universal Upgradeable Proxy Standard) dengan library OpenZeppelin. Kontrak ini memanfaatkan beberapa modul OpenZeppelin: UUPSUpgradeable untuk kemampuan upgrade dan OwnableUpgradeable untuk kontrol akses.

**Penjelasan komponen pada kontrak:**

1. **Inheritance dan Inisialisasi**:

   -  Kontrak mewarisi fungsi dari UUPSUpgradeable dan OwnableUpgradeable, sehingga memungkinkan dukungan untuk fungsionalitas upgrade dan manajemen kepemilikan.
   -  Fungsi initialize mengatur state awal kontrak. Fungsi ini akan menginisialisasi kepemilikan, kemampuan upgrade, dan menetapkan nilai default untuk variabel number. Fungsi ini menggunakan modifier initializer untuk memastikan hanya dapat dipanggil sekali.

2. **Variabel State**:

   -  `number`: variabel state yang bersifat publik untuk menyimpan sebuah angka.
   -  `changeId`: sebuah variabel penghitung untuk melacak berapa kali number telah diperbarui.

3. **Otorisasi Upgrade**:

   -  Fungsi \_authorizeUpgrade akan menimpa (override) yang ada di UUPSUpgradeable dan membatasi otorisasi upgrade hanya kepada pemilik kontrak, memastikan hanya pemilik yang dapat memperbarui implementasi kontrak.

4. **Fungsionalitas**:
   -  Fungsi updateNumber memperbarui variabel status number, menambah penghitung changeId, dan mengembalikan nilai number yang baru serta changeId saat ini. Dengan ini akan menunjukkan bagaimana state kontrak dapat berubah dan dilacak seiring dengan pembaruan.

Dengan menggunakan pattern proxy UUPS, kontrak UpgradableContract memungkinkan logika kontrak diperbarui tanpa kehilangan state (data), sehingga memberikan fleksibilitas untuk upgrade kedepannya.
