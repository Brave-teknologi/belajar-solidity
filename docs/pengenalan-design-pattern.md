---
sidebar_position: 12
---

# 10. Pengenalan Design Pattern di Solidity

Desain pola (design patterns) di Solidity adalah solusi standar serta menjadi best practice dalam pengembangan smart contract di Ethereum. Memahami dan menerapkan pola-pola ini dapat membantu kamu menulis kode yang lebih aman, efisien, dan mudah dikelola (maintainable). Pada bab ini, kita akan mengeksplorasi beberapa design pattern penting di Solidity, serta bagaimana penerapannya pada skenario di project sungguhan.

![design-pattern](./img/5.png)

## Apa itu Design Pattern?

Design pattern adalah solusi yang bisa digunakan kembali untuk mengatasi masalah umum yang muncul dalam desain perangkat lunak. Pola-pola ini menyediakan template untuk menulis kode yang sudah teruji, scalable, dan mudah dipahami. Dalam konteks Solidity dan pengembangan smart contract, design pattern bisa menangani tantangan spesifik seperti keamanan, efisiensi gas, dan manajemen kontrak.

## Design Pattern yang umum di Solidity

### 1. Ownable Pattern

Ownable pattern membatasi penggunaan fungsi-fungsi tertentu hanya untuk pemilik kontrak, sehingga memberikan struktur administratif yang jelas. Pola ini penting untuk tugas-tugas seperti menghentikan sementara (pausing) atau memperbarui kontrak, memastikan bahwa hanya pemilik yang diberi wewenang yang memiliki kendali atas fungsi-fungsi vital tersebut.

**Contoh implementasi:**

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

### 2. Pausable Pattern

Pausable pattern memungkinkan kontrak untuk dihentikan sementara dan dilanjutkan kembali, sehingga memberikan mekanisme untuk menghentikan semua fungsi dalam keadaan darurat atau selama pemeliharaan (maintenance). Hal ini penting untuk mengurangi risiko dan melindungi kontrak dari error yang tidak terduga.

**Implementasi Contract:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract Pausable is Ownable {
    bool public paused = false;

    event Paused();
    event Unpaused();

    modifier whenNotPaused() {
        require(!paused, "Pausable: paused");
        _;
    }

    modifier whenPaused() {
        require(paused, "Pausable: not paused");
        _;
    }

    function pause() public onlyOwner whenNotPaused {
        paused = true;
        emit Paused();
    }

    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpaused();
    }
}
```

### 3. Circuit Breaker Pattern

Circuit Breaker Pattern merupakan pengembangan dari Pausable Pattern dengan menambahkan kondisi di mana operasi dapat dihentikan, berfungsi sebagai saklar pengaman. Hal ini memastikan bahwa fungsi-fungsi penting dapat dihentikan jika terjadi pemicu tertentu, memberikan keamanan tambahan.

**Implementation:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Pausable.sol";

contract CircuitBreaker is Pausable {
    function emergencyWithdraw() public onlyOwner whenPaused {
        // Logic for emergency withdrawal
    }

    function safeFunction() public whenNotPaused {
        // Logic for normal operations
    }
}
```

### 4. Pull Payment Pattern

Pull Payment pattern memastikan bahwa pengguna harus secara aktif menarik (pull) dana mereka, daripada kontrak yang mendorong (push) dana kepada mereka. Ini mengurangi risiko serangan reentrancy, karena penarikan yang diinisiasi oleh pengguna meminimalkan celah serangan untuk kerentanan semacam itu.

**Implementasi:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PullPayment {
    mapping(address => uint) public payments;

    function asyncTransfer(address dest, uint amount) internal {
        payments[dest] += amount;
    }

    function withdrawPayments() public {
        uint payment = payments[msg.sender];
        require(payment > 0, "No payments available");
        payments[msg.sender] = 0;
        payable(msg.sender).transfer(payment);
    }
}
```

### 5. Factory Pattern

Factory pattern memfasilitasi pembuatan instance kontrak baru dari kontrak utama. Pattern ini sangat berguna untuk mengelola beberapa instance kontrak, seperti saat melakukan deploy beberapa instance kontrak turunan.

**Kode Implementasi:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Product {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }
}

contract ProductFactory {
    Product[] public products;

    function createProduct() public {
        Product newProduct = new Product(msg.sender);
        products.push(newProduct);
    }
}
```

### 6. Proxy Pattern

Proxy pattern memungkinkan kontrak yang dapat diperbarui dengan memisahkan logika dari data. Pattern ini memungkinkan logika kontrak diperbarui tanpa mempengaruhi data yang disimpan, memberikan cara untuk mempertahankan dan memperbarui kontrak seiring waktu.

**Contoh:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public implementation;

    function upgradeTo(address newImplementation) public {
        implementation = newImplementation;
    }

    fallback() external payable {
        address impl = implementation;
        require(impl != address(0));
        (bool success, bytes memory data) = impl.delegatecall(msg.data);
        require(success, string(data));
    }
}
```

Design pattern ini sangat membantu untuk mengembangkan kontrak Solidity yang aman dan mudah di maintenance. Dengan menerapkan pattern ini, para pengembang dapat meningkatkan fleksibilitas dalam smart contract mereka.

## Penggunaan secara praktis

### Ownable dan Pausable pada Token Contract

Kontrak token dapat menggunakan pattern Ownable dan Pausable untuk membatasi fungsi tertentu hanya pemilik yang memungkinkan kontrak di jeda dalam keadaan darurat.

**Contoh implementasi:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./Pausable.sol";

contract Token is Ownable, Pausable {
    mapping(address => uint) public balances;

    function transfer(address to, uint amount) public whenNotPaused {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function mint(address to, uint amount) public onlyOwner {
        balances[to] += amount;
    }
}
```

### Pull Payments pada Crowdfunding

Kontrak crowdfunding dapat menggunakan pattern Pull Payment untuk memungkinkan kontributor menarik dana mereka jika tujuan pendanaan tidak tercapai.

**Implementation:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    uint public goal;
    uint public deadline;
    bool public goalReached;

    constructor(uint _goal, uint _duration) {
        goal = _goal;
        deadline = block.timestamp + _duration;
    }

    function contribute() public payable {
        require(block.timestamp < deadline, "Crowdfunding ended");
        payments[msg.sender] += msg.value;
    }

    function finalize() public {
        require(block.timestamp >= deadline, "Crowdfunding not ended yet");
        if (address(this).balance >= goal) {
            goalReached = true;
        }
    }

    function withdraw() public {
        require(block.timestamp >= deadline, "Crowdfunding not ended yet");
        require(!goalReached, "Goal reached, no withdrawal allowed");
        payable(msg.sender).transfer(address(this).balance);
    }
}
```
