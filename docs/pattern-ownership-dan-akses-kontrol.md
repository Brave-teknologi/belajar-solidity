---
sidebar_position: 13
---

# 11. Pattern Ownership dan Access Control

Ownership dan kontrol akses adalah aspek fundamental dalam pengembangan smart contract. Pattern ini memastikan bahwa hanya pengguna yang berwenang yang dapat mengeksekusi fungsi tertentu, melindungi kontrak dari akses tidak sah dan potensi tindakan berbahaya. Dalam bab ini, kita akan menjelaskan lebih detail mengenai pattern ownership dan kontrol akses yang umum digunakan, bagaimana implementasinya, serta contoh kasus penggunaannya.

Pattern ownership dan access control membantu mengelola izin dalam smart contract. Pattern ini akan mendefinisikan siapa saja yang dapat melakukan tindakan tertentu, seperti memperbarui kontrak, menghentikan operasinya, atau mengelola data sensitif.

## Pattern Ownership dan Access Control yang umum

### 1. Ownable Pattern

Pattern Ownable adalah salah satu pattern kontrol akses yang paling sederhana dan paling sering digunakan di Solidity. Pattern ini menetapkan satu akun (pemilik) dengan akses eksklusif ke fungsi-fungsi tertentu. Pattern ini biasanya digunakan untuk tujuan administratif, memastikan bahwa hanya pemilik kontrak yang dapat melakukan tindakan-tindakan penting.

**Implementasi Contract:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
```

**Poin penting:**

-  **Penetapan Kepemilikan:** pembuat kontrak ditetapkan sebagai pemilik awal.
-  **Transfer Kepemilikan:** pemilik dapat mentransfer kepemilikan ke alamat lain.
-  **Kontrol Akses:** modifier `onlyOwner` membatasi akses ke fungsi-fungsi tertentu yang hanya bisa diakses oleh pemilik.

### 2. Pattern Role-Based Access Control (RBAC)

Role-Based Access Control (RBAC) memungkinkan kontrol yang lebih terperinci dengan memberikan peran kepada alamat yang berbeda. Setiap peran dapat memiliki izin yang berbeda, menjadikan pattern ini cocok untuk sistem kompleks di mana banyak pengguna memerlukan tingkat akses yang bervariasi.

**Kode Implementasi:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyRBAC is AccessControl, ERC20 {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not Admin");
        _;
    }

    function addMinter(address account) public onlyAdmin {
        _grantRole(MINTER_ROLE, account);
    }

    function removeMinter(address account) public onlyAdmin {
        _revokeRole(MINTER_ROLE, account);
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "You are not allowed to mint");
        _mint(to, amount);
    }
}
```

**Poin penting:**

-  **Multiple Role:** mendefinisikan peran berbeda seperti `ADMIN_ROLE` dan `MINTER_ROLE`.
-  **Penugasan Role:** memberikan dan mencabut peran secara dinamis.
-  **Kontrol Akses:** Menggunakan modifier `onlyAdmin` untuk membatasi akses fungsi berdasarkan peran.

### 3. Pattern Pausable

Pausable memungkinkan kontrak dihentikan sementara dan dilanjutkan kembali, yang mana memberikan kendali ekstra selama keadaan darurat atau ketika maintenance. Pattern ini sangat berguna untuk kontrak yang menangani dana dalam jumlah besar atau operasi penting.

**Contoh implementasi:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "./Ownable.sol";

contract MyPausableContract is Ownable, Pausable {
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function performAction() public whenNotPaused {
        // Action logic here
    }
}
```

**Poin penting:**

-  **Pause dan Unpause:** Pemilik kontrak dapat menghentikan sementara dan melanjutkan operasi kontrak.
-  **Eksekusi Bersyarat:** Gunakan modifier `whenNotPaused` untuk membatasi eksekusi fungsi saat kontrak sedang dihentikan sementara.

## Penggunaan Praktis

### Ownable untuk Fungsi Administratif

Dalam banyak kasus smart contract, fungsi administratif seperti memperbarui kontrak, menghentikan operasi sementara, atau mengatur parameter penting harus dibatasi hanya untuk pemilik kontrak.

**Contoh:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract AdminControlled is Ownable {
    uint256 public importantParameter;

    function setImportantParameter(uint256 newValue) public onlyOwner {
        importantParameter = newValue;
    }
}
```

### RBAC pada Decentralized Application

Dalam aplikasi terdesentralisasi (dApps), peran atau roles yang berbeda untuk mengelola bagian-bagian dari sistem. Sebagai contoh, sebuah dApp marketplace mungkin memiliki peran seperti ADMIN, PENJUAL (SELLER), dan PEMBELI (BUYER).

**Contoh penerapan:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Marketplace is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address seller;
    }

    mapping(uint256 => Product) public products;
    uint256 public nextProductId;

    constructor() {
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function addSeller(address account) public onlyRole(ADMIN_ROLE) {
        _grantRole(SELLER_ROLE, account);
    }

    function addProduct(
        string memory name,
        uint256 price
    ) public onlyRole(SELLER_ROLE) {
        products[nextProductId] = Product(
            nextProductId,
            name,
            price,
            msg.sender
        );
        nextProductId++;
    }
}
```

### Pausable untuk kondisi Emergency

Kontrak yang biasa menangani jumlah dana yang besar atau operasi vital dapat memanfaatkan mekanisme yang bisa dihentikan sementara (pausable), sehingga memungkinkan pemilik untuk menghentikan operasi dalam kasus pelanggaran keamanan atau keadaan darurat lainnya.

**Contoh penggunaan:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "./Ownable.sol";

contract EmergencyStop is Ownable, Pausable {
    mapping(address => uint256) public balances;

    function deposit() public payable whenNotPaused {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public whenNotPaused {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
```
