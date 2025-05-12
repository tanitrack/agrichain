# Solana Escrow Program

## Overview

The Solana Escrow Program is a smart contract that facilitates the secure exchange of assets between a buyer and a seller. It ensures that the buyer's funds are held in escrow until the seller fulfills their part of the agreement. The program allows for the following states:

```mermaid
stateDiagram-v2
    [*] --> Initialized: initialize(amount, details)
    Initialized --> Confirmed: confirm_order()
    Initialized --> Refunded: refund_order()
    Initialized --> Failed: fail_order()
    Confirmed --> Completed: withdraw_funds()
    Completed --> [*]: close_escrow()
    Refunded --> [*]: close_escrow()
    Failed --> [*]: close_escrow()

    note right of Initialized
      Buyer creates escrow and deposits funds
    end note

    note right of Confirmed
      Seller confirms they'll fulfill the order
    end note

    note right of Completed
      Funds transferred to seller
    end note

    note right of Refunded
      Funds returned to buyer before confirmation
    end note

    note right of Failed
      Either party cancels the order
    end note
```
