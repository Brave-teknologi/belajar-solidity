---
sidebar_position: 1
---

# Struct di Solidity

Struct adalah tipe data custom yang memungkinkan kita untuk mengelompokkan variabel yang terkait. Hal ini sangat berguna untuk merepresentasikan model data yang kompleks.

## Mendefinisikan Struct

Sebuah struct didefinisikan menggunakan kata kunci `struct`, diikuti dengan nama struct dan propertinya.

```solidity
struct Person {
    string name;
    uint age;
    address wallet;
}
```

## Contoh Kontrak

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract People {
    struct Person {
        string name;
        uint age;
        address wallet;
    }

    Person[] public people;

    function addPerson(string memory _name, uint _age, address _wallet) public {
        Person memory newPerson = Person({
            name: _name,
            age: _age,
            wallet: _wallet
        });
        people.push(newPerson);
    }

    function getPerson(uint _index) public view returns (string memory, uint, address) {
        Person storage person = people[_index];
        return (person.name, person.age, person.wallet);
    }
}
```

## Nested Struct

Struct juga dapat berisi struct lainnya, memungkinkan model data yang lebih kompleks.

### Contoh

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Company {
    struct Employee {
        string name;
        uint age;
        address wallet;
    }

    struct Department {
        string name;
        Employee[] employees;
    }

    Department[] public departments;

    function addDepartment(string memory _name) public {
        Department memory newDept = Department({
            name: _name,
            employees: new Employee[](0)
        });
        departments.push(newDept);
    }

    function addEmployeeToDepartment(uint _deptIndex, string memory _name, uint _age, address _wallet) public {
        Employee memory newEmployee = Employee({
            name: _name,
            age: _age,
            wallet: _wallet
        });
        departments[_deptIndex].employees.push(newEmployee);
    }

    function getEmployee(uint _deptIndex, uint _empIndex) public view returns (string memory, uint, address) {
        Employee storage employee = departments[_deptIndex].employees[_empIndex];
        return (employee.name, employee.age, employee.wallet);
    }
}
```
