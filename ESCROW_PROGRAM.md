# Solana Escrow Program

## Overview

````mermaid
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
````
