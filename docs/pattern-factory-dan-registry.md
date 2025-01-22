---
sidebar_position: 15
---

# 13. Pattern Factory dan Registry

Dalam aplikasi terdesentralisasi (dApp), mengelola banyak instance kontrak dan memastikan semua terlacak (tracking) sangat penting. Pattern Factory dan Registry adalah teknik yang membantu pengembang membuat, mengelola, dan mengatur banyak instance kontrak secara efisien. Pada chapter ini kita akan mengeksplorasi pattern tersebut, bagaimana implementasinya, serta kasus penggunaannya.

## Pattern Factory

Pattern Factory adalah design pattern yang menyediakan cara untuk membuat objek (dalam hal ini, smart contract) tanpa menentukan kelas objek yang akan dibuat secara spesifik. Pattern ini sangat berguna dalam aplikasi blockchain di mana banyak instance kontrak dengan struktur serupa diperlukan.

Pattern Factory melibatkan kontrak factory yang bertanggung jawab untuk menerapkan instance baru dari kontrak tertentu dan menyimpan instance tersebut. Dengan memusatkan logika pembuatan ini akan menyederhanakan proses penerapan dan memastikan konsistensi di seluruh instance.

### Implementasi sederhana dari kontrak Factory

#### Mendefinisikan kontrak

Pertama, kita akan mendefinisikan kontrak yang akan dibuat berulang kali.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    address public owner;
    uint256 public data;

    constructor(address _owner, uint256 _data) {
        owner = _owner;
        data = _data;
    }
}
```

#### Buat kontrak Factory

Selanjutnya, buat kontrak factory yang menerapkan instance dari `MyContract`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyContract.sol";

contract MyFactory {
    MyContract[] public contracts;

    event ContractCreated(address contractAddress);

    function createContract(uint256 _data) public {
        MyContract newContract = new MyContract(msg.sender, _data);
        contracts.push(newContract);
        emit ContractCreated(address(newContract));
    }

    function getContracts() public view returns (MyContract[] memory) {
        return contracts;
    }
}
```

#### Penjelasan

Kontrak Factory memiliki beberapa fitur penting, di antaranya adalah pembuatan kontrak melalui fungsi `createContract` yang menerapkan instance baru dari `MyContract`. Semua instance yang dibuat dilacak menggunakan array `contracts`, sehingga memudahkan pengelolaan banyak instance kontrak. Selain itu, setiap kali kontrak baru dibuat, event `ContractCreated` di-trigger untuk memudahkan pelacakan dan pencatatan secara real-time.

## Implementasi Kontrak Registry

While the Factory pattern helps in creating contracts, the Registry pattern helps in organizing and managing these contracts, making them easily discoverable.

### Memahami Pattern Registry

Registry adalah kontrak terpusat yang menyimpan daftar kontrak, biasanya dengan metadata tambahan. Pattern ini menyediakan fungsi untuk menambah, menghapus, dan mengambil kontrak, memastikan bahwa sistem mengetahui semua kontrak yang relevan berserta detailnya.

### Implementasi dari Simple Registry

#### Mendefinisikan Kontrak Registry

Kontrak registry akan menyimpan alamat-alamat kontrak lain beserta metadata-nya.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyRegistry {
    struct ContractDetails {
        address contractAddress;
        string description;
    }

    mapping(address => ContractDetails) public registry;
    address[] public contractList;

    event ContractRegistered(address indexed contractAddress, string description);
    event ContractRemoved(address indexed contractAddress);

    function registerContract(address _contractAddress, string memory _description) public {
        require(_contractAddress != address(0), "Invalid contract address");
        ContractDetails memory details = ContractDetails(_contractAddress, _description);
        registry[_contractAddress] = details;
        contractList.push(_contractAddress);
        emit ContractRegistered(_contractAddress, _description);
    }

    function removeContract(address _contractAddress) public {
        require(registry[_contractAddress].contractAddress != address(0), "Contract not registered");
        delete registry[_contractAddress];

        // Remove from contractList
        for (uint256 i = 0; i < contractList.length; i++) {
            if (contractList[i] == _contractAddress) {
                contractList[i] = contractList[contractList.length - 1];
                contractList.pop();
                break;
            }
        }

        emit ContractRemoved(_contractAddress);
    }

    function getContractDetails(address _contractAddress) public view returns (ContractDetails memory) {
        return registry[_contractAddress];
    }

    function getAllContracts() public view returns (address[] memory) {
        return contractList;
    }

    function getTotalContract() public view returns (uint128) {
        return uint128(contractList.length);
    }
}
```

#### Fitur yang terdapat di Registry Contract

-  **Registration**: fungsi `registerContract` menambahkan kontrak baru ke dalam registry.
-  **Removal**: fungsi `removeContract` menghapus kontrak dari registry.
-  **Metadata Management**: Menyimpan informasi tambahan tentang setiap kontrak.
-  **Retrieval**: fungsi untuk mengambil detail kontrak tertentu atau menampilkan semua kontrak yang terdaftar.

### Contoh Penerapan

#### Use Case: Token Factory

Salah satu penggunaan umum untuk pattern Factory adalah membuat token ERC20 atau ERC721. Sebuah factory dapat melakukan deploy token baru dengan parameter unik seperti nama, simbol, dan suplai awal, serta memasukkan token-token ini ke dalam sebuah registry untuk memudahkan pengelolaan.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyRegistry.sol";

contract MyToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract TokenFactory {
    MyRegistry public registry;

    constructor(address _registryAddress) {
        registry = MyRegistry(_registryAddress);
    }

    event TokenCreated(address tokenAddress);

    function createToken(string memory name, string memory symbol, uint256 initialSupply, string memory description) public {
        MyToken newToken = new MyToken(name, symbol, initialSupply);
        newToken.transferOwnership(msg.sender);
        registry.registerContract(address(newToken), description);
        emit TokenCreated(address(newToken));
    }
}
```

Dengan menggunakan pattern Factory dan Registry, pengembang dapat mengelola pembuatan dan pengorganisasian beberapa instance kontrak secara efisien, sehingga memastikan bahwa kontrak-kontrak tersebut mudah ditemukan dan dikelola.
