---
sidebar_position: 2
---

# Menulis Smart Contract yang Efisien

Untuk memberikan gambaran seperti apa penerapan dalam penulisan smart contract yang sudah dioptimalkan, kita akan mencoba beberapa contoh penerapannya.

## Contoh 1: Penyimpanan Data yang Efisien

### Penyimpanan yang Tidak Efisien

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InefficientStorage {
    uint256[] public data;

    function addData(uint256 value) public {
        data.push(value);
    }
}
```

Dalam contoh penyimpanan yang tidak efisien ini, sebuah array data digunakan untuk menyimpan nilai integer tanpa tanda. Setiap kali fungsi `addData` dipanggil, elemen baru ditambahkan di akhir array. Meskipun mudah, pendekatan seperti ini bisa menjadi tidak efisien dalam hal penggunaan gas, terutama ketika ukuran array semakin besar. Setiap penambahan ke array menyebabkan biaya gas tambahan, karena semakin banyak data yang harus disimpan dan dikelola di blockchain.

### Penyimpanan yang Dioptimalkan dengan Mapping

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EfficientStorage {
    mapping(uint256 => uint256) public data;
    uint256 public dataCount;

    function addData(uint256 value) public {
        data[dataCount] = value;
        dataCount++;
    }
}
```

Untuk mengoptimalkan penyimpanan dan mengurangi biaya gas, kita menggunakan mapping alih-alih array. Dalam versi yang sudah dioptimalkan ini, sebuah mapping data digunakan untuk menyimpan nilai integer, di mana setiap nilai diasosiasikan dengan angka indeks yang unik. Selain itu, variabel `dataCount` digunakan untuk melacak jumlah elemen yang disimpan dalam mapping. Saat menambahkan data baru, nilai disimpan di mapping pada indeks `dataCount` saat ini, kemudian nilai penghitung tersebut ditambahkan. Dengan menggunakan mapping, kita menghilangkan kebutuhan untuk mengelola array, sehingga penyimpanan lebih efisien dan biaya gas lebih rendah.

## Contoh 2: Mengurangi Write pada Storage

### Write Berulang

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultipleWrites {
    uint256 public a;
    uint256 public b;

    function updateValues(uint256 _a, uint256 _b) public {
        a = _a;
        b = _b;
    }
}
```

Dalam contoh ini, fungsi `updateValues` memperbarui dua variabel status, `a` dan `b`, dengan nilai baru masing-masing `_a` dan `_b`. Setiap pernyataan `a = _a;` dan `b = _b;` menghasilkan operasi penulisan penyimpanan yang terpisah, yang mengonsumsi gas untuk setiap operasi menyimpan.

### Operasi Write Tunggal

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SingleWrite {
    struct Values {
        uint256 a;
        uint256 b;
    }

    Values public values;

    function updateValues(uint256 _a, uint256 _b) public {
        values = Values(_a, _b);
    }
}
```

Untuk mengurangi biaya gas, kita dapat mengoptimalkan penulisan ke penyimpanan dengan menggabungkan beberapa variabel status ke dalam satu operasi penulisan. Pada versi yang sudah dioptimalkan ini, fungsi `updateValues` menerima dua parameter `_a` dan `_b`, yang digunakan untuk membuat struktur `values` baru dengan nilai yang diperbarui. Dengan menetapkan struktur baru ini ke variabel status `values` dalam satu operasi, yaitu `values = Values(_a, _b)`, kita bisa meminimalkan penulisan ke penyimpanan dan mengurangi biaya gas.

## Contoh 3: Perhitungan yang Lebih Efisien

### Perulangan yang Tidak Efisien

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InefficientLoop {
    uint256[] public data;

    function calculateSum() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum;
    }
}
```

Contoh ini menunjukkan loop yang tidak efisien yang mana menghitung jumlah semua elemen dalam array `data`. Meskipun sederhana, iterasi pada setiap elemen dalam array menggunakan loop `for` bisa sangat mahal dalam hal konsumsi gas, terutama untuk array yang besar. Setiap iterasi loop menyebabkan biaya gas tambahan, yang mengakibatkan penggunaan gas keseluruhan yang lebih tinggi.

### Loop yang Dioptimalkan

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OptimizedLoop {
    uint256[] public data;

    function calculateSum() public view returns (uint256) {
        uint256 sum = 0;
        uint256 length = data.length;
        for (uint256 i = 0; i < length; i++) {
            sum += data[i];
        }
        return sum;
    }
}
```

Untuk mengoptimalkan loop dan mengurangi biaya gas, kita dapat menghitung panjang array di luar loop terlebih dahulu dan menyimpannya dalam variabel lokal `length`. Dengan cara ini, kita menghindari perhitungan ulang panjang array di setiap iterasi loop, yang dapat menghasilkan penghematan gas yang signifikan, terutama untuk array yang besar. Optimasi ini meminimalkan konsumsi gas sambil tetap mempertahankan fungsionalitas perhitungan jumlah elemen array.

## Contoh 4: Struct Packing

### Contoh yang Tidak Efisien

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InefficientStruct {
    struct Data {
        uint256 value1;
        uint256 value2;
    }

    Data public data;

    function setData(uint256 _value1, uint256 _value2) public {
        data.value1 = _value1;
        data.value2 = _value2;
    }
}
```

Dalam contoh struct yang tidak efisien ini, sebuah struct `Data` didefinisikan dengan dua variabel `uint256` (`value1` dan `value2`). Setiap variabel `uint256` menempati 32 byte penyimpanan, sehingga totalnya menjadi 64 byte untuk struct tersebut. Solidity menyimpan variabel-variabel struct secara berurutan dalam penyimpanan, yang berarti setiap variabel dimulai dari slot penyimpanan baru.

### Packed Struct yang Sudah Dioptimasi

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PackedStruct {
    struct Data {
        uint128 value1;
        uint128 value2;
    }

    Data public data;

    function setData(uint128 _value1, uint128 _value2) public {
        data.value1 = _value1;
        data.value2 = _value2;
    }
}
```

Untuk mengoptimalkan penggunaan penyimpanan dan mengurangi biaya gas, kita dapat menggabungkan beberapa variabel ke dalam satu slot penyimpanan dengan menggunakan tipe data yang lebih kecil. Dalam versi yang dioptimalkan ini, struct `Data` didefinisikan dengan dua variabel `uint128` (`value1` dan `value2`). Setiap variabel `uint128` menempati 16 byte penyimpanan, sehingga totalnya menjadi 32 byte.
