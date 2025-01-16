---
sidebar_position: 2
---

# Enum di Solidity

Enum adalah tipe yang terdiri dari serangkaian value yang disebut elemen. Enum berguna untuk merepresentasikan state atau opsi yang sudah ditentukan.

## Cara Mendefinisikan Enum

Sebuah enum didefinisikan menggunakan kata kunci `enum`, diikuti dengan nama enum dan elemennya.

```solidity
enum Status {
    Pending,
    Shipped,
    Delivered,
    Cancelled
}
```

## Menggunakan Enum

Enum dapat digunakan untuk membuat variabel dan mengelola state dalam kontrak seperti menentukan status order apa saja yang akan digunakan.

**Contoh**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Order {
    enum Status {
        Pending,
        Shipped,
        Delivered,
        Cancelled
    }

    struct OrderDetails {
        uint id;
        Status status;
    }

    OrderDetails[] public orders;

    function createOrder(uint _id) public {
        orders.push(OrderDetails({
            id: _id,
            status: Status.Pending
        }));
    }

    function updateOrderStatus(uint _orderId, Status _status) public {
        orders[_orderId].status = _status;
    }

    function getOrderStatus(uint _orderId) public view returns (Status) {
        return orders[_orderId].status;
    }
}
```

Contoh di atas merupakan penerapan struct dan enum dalam sebuah kontrak yang memungkinkan kita mengelola order sederhana seperti menambahkan, update status order dan melihat status order.

## Konversi Enum

Enum dapat dikonversi dari dan ke nilai `uint`, yang dapat berguna untuk interoperabilitas dengan sistem lain atau untuk menyimpan nilai enum dengan lebih efisien.

**Contoh**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnumConversion {
    enum Status {
        Pending,
        Shipped,
        Delivered,
        Cancelled
    }

    Status public status;

    function setStatus(Status _status) public {
        status = _status;
    }

    function getStatus() public view returns (Status) {
        return status;
    }

    function getStatusAsUint() public view returns (uint) {
        return uint(status);
    }

    function setStatusFromUint(uint _status) public {
        status = Status(_status);
    }
}
```

## Contoh: Supply Chain Contract

Menggabungkan struct dan enum dapat membantu kita membuat model data yang lebih baik. Mari kita buat contoh kasus di mana kita bisa melacak status pesanan dalam rantai pasokan.

**Contoh kode**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum Status {
        Pending,
        Shipped,
        Delivered,
        Cancelled
    }

    struct Order {
        uint id;
        string item;
        uint quantity;
        Status status;
    }

    Order[] public orders;

    function createOrder(uint _id, string memory _item, uint _quantity) public returns (uint256) {
        orders.push(Order({
            id: _id,
            item: _item,
            quantity: _quantity,
            status: Status.Pending
        }));

        return orders.length - 1;
    }

    function updateOrderStatus(uint _orderId, Status _status) public {
        require(_orderId < orders.length, "Invalid order ID");
        orders[_orderId].status = _status;
    }

    function getOrder(uint _orderId) public view returns (uint, string memory, uint, Status) {
        require(_orderId < orders.length, "Invalid order ID");
        Order storage order = orders[_orderId];
        return (order.id, order.item, order.quantity, order.status);
    }
}
```

Dalam contoh ini, kita mendefinisikan sebuah struct `Order` yang berisi `id`, `item`, `quantity`, dan `status`. Status direpresentasikan oleh sebuah enum. Kontrak ini memungkinkan untuk melakukan pembuatan pesanan baru dan pembaruan status.
