---
sidebar_position: 2
---

# Error Handling di Solidity

Error handling memastikan bahwa smart contract berperilaku sesuai yang diharapkan dan memberikan umpan balik yang jelas ketika terjadi kesalahan. Solidity menyediakan beberapa mekanisme untuk error handling, termasuk `require`, `assert`, `revert`, dan custom errors.

## require

Fungsi `require` digunakan untuk memvalidasi kondisi yang seharusnya terpenuhi. Jika kondisi tersebut gagal, transaksi akan di-revert, dan semua perubahan dibatalkan.

Contoh:

```solidity
function withdraw(uint _amount) public {
    require(balances[msg.sender] >= _amount, "Insufficient balance");
    balances[msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
}
```

## assert

Fungsi `assert` digunakan untuk memeriksa kesalahan internal. Fungsi ini hanya digunakan untuk kondisi yang seharusnya tidak pernah gagal. Jika `assert` gagal, hal itu menunjukkan adanya bug serius, dan eksekusi kontrak akan dihentikan.

Contoh:

```solidity
function increment(uint _value) public {
    uint newValue = storedData + _value;
    assert(newValue >= storedData); // Overflow check
    storedData = newValue;
}
```

## revert

Fungsi `revert` digunakan untuk membatalkan eksekusi kode dan mengembalikan perubahan state, kemudian akan mengembalikan pesan error.

Contoh:

```solidity
function transfer(address _to, uint _amount) public {
    if (balances[msg.sender] < _amount) {
        revert("Insufficient balance");
    }
    balances[msg.sender] -= _amount;
    balances[_to] += _amount;
}
```

## Custom Error

Pada Solidity versi 0.8.4, diperkenalkan custom errors yang lebih efisien dalam penggunaan gas dibandingkan dengan `revert` yang berbentuk string. Custom error memungkinkan kita mendefinisikan tipe-tipe error dan menggunakannya bersama dengan fungsi `revert`.

Contoh:

```solidity
error InsufficientBalance(uint requested, uint available);

function withdraw(uint _amount) public {
    if (balances[msg.sender] < _amount) {
        revert InsufficientBalance(_amount, balances[msg.sender]);
    }
    balances[msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
}
```

## Best Practices untuk Error Handling

-  **Gunakan `require` untuk user input**: validasi inputan user dan kondisi dari sumber external dengan `require` untuk memastikan bahwa memenuhi kondisi yang diharapkan.

   ```solidity
   require(msg.sender != address(0), "Invalid address");
   ```

-  **Gunakan `assert` untuk invariants**: periksa kondisi yang seharusnya tidak pernah gagal dengan `assert` untuk menangkap bug serius.

   ```solidity
   assert(totalSupply == balances[msg.sender] + balances[_to]);
   ```

-  **Berikan pesan yang informatif**: saat menggunakan `require` atau `revert`, sertakan pesan error yang membantu pengguna memahami apa yang salah.

   ```solidity
   require(balances[msg.sender] >= _amount, "Balance too low");
   ```

-  **Gunakan custom error untuk efisiensi gas**: definisikan custom error untuk pemeriksaan sebagai upaya menghemat gas dan memberikan informasi error yang lebih rinci.

   ```solidity
   error Unauthorized(address caller);

   function restrictedFunction() public {
       if (msg.sender != owner) {
           revert Unauthorized(msg.sender);
       }
   }
   ```

## Contoh: Menggabungkan Event dan Error Handling

Mari kita gabungkan events dan error handling dalam contoh yang lebih komprehensif dari kontrak bernama crowdfunding.

### Crowdfunding Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Campaign {
        address payable creator;
        uint goal;
        uint pledged;
        uint deadline;
        bool claimed;
    }

    mapping(uint => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(
        uint indexed id,
        address indexed creator,
        uint goal,
        uint deadline
    );
    event Pledged(uint indexed campaignId, address indexed backer, uint amount);
    event Claimed(
        uint indexed campaignId,
        address indexed creator,
        uint amount
    );

    error GoalNotMet(uint goal, uint pledged);
    error NotCreator(address caller);
    error CampaignEnded(uint deadline);

    // Create a new campaign with a goal and duration
    function createCampaign(uint _goal, uint _duration) public returns (uint256) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        campaignCount++;
        Campaign storage newCampaign = campaigns[campaignCount] = Campaign({
            creator: payable(msg.sender),
            goal: _goal,
            pledged: 0,
            deadline: block.timestamp + _duration,
            claimed: false
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _goal,
            newCampaign.deadline
        );

        return campaignCount;
    }

    // Pledge funds to a campaign
    function pledge(uint _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");

        campaign.pledged += msg.value;
        emit Pledged(_campaignId, msg.sender, msg.value);
    }

    // Claim funds after campaign ends if goal is met
    function claimFunds(uint _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        if (msg.sender != campaign.creator) {
            revert NotCreator(msg.sender);
        }

        if (campaign.pledged < campaign.goal) {
            revert GoalNotMet(campaign.goal, campaign.pledged);
        }

        require(!campaign.claimed, "Funds already claimed");

        campaign.claimed = true;
        campaign.creator.transfer(campaign.pledged);

        emit Claimed(_campaignId, msg.sender, campaign.pledged);
    }
}
```

Dalam contoh ini, kontrak Crowdfunding memungkinkan pengguna untuk membuat kampanye, menyimpan dana, dan mengklaim dana jika target tercapai. Kontrak ini terdapat event untuk mencatat tindakan-tindakan penting dan menggunakan berbagai teknik error handling.
