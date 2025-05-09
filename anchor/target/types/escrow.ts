/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/escrow.json`.
 */
export type Escrow = {
  "address": "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF",
  "metadata": {
    "name": "escrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closeEscrow",
      "discriminator": [
        139,
        171,
        94,
        146,
        191,
        91,
        144,
        50
      ],
      "accounts": [
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "escrow_account.buyer",
                "account": "escrowAccount"
              },
              {
                "kind": "account",
                "path": "escrow_account.seller",
                "account": "escrowAccount"
              },
              {
                "kind": "account",
                "path": "escrow_account.order_details",
                "account": "escrowAccount"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrowAccount"
              }
            ]
          }
        },
        {
          "name": "receiver",
          "docs": [
            "Can be buyer or a refund receiver"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "confirmOrder",
      "discriminator": [
        142,
        28,
        201,
        134,
        143,
        201,
        118,
        244
      ],
      "accounts": [
        {
          "name": "escrowAccount",
          "writable": true
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true,
          "relations": [
            "escrowAccount"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "failOrder",
      "discriminator": [
        49,
        50,
        169,
        114,
        198,
        90,
        92,
        111
      ],
      "accounts": [
        {
          "name": "escrowAccount",
          "writable": true
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrowAccount"
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "arg",
                "path": "orderDetails"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrowAccount"
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "seller",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "orderDetails",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "refundOrder",
      "discriminator": [
        164,
        168,
        47,
        144,
        154,
        1,
        241,
        255
      ],
      "accounts": [
        {
          "name": "escrowAccount",
          "writable": true
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrowAccount"
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "withdrawFunds",
      "discriminator": [
        241,
        36,
        29,
        111,
        208,
        31,
        104,
        217
      ],
      "accounts": [
        {
          "name": "escrowAccount",
          "writable": true
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrowAccount"
              }
            ]
          }
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true,
          "relations": [
            "escrowAccount"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "discriminator": [
        36,
        69,
        48,
        18,
        128,
        225,
        125,
        135
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "orderDetailsTooLong",
      "msg": "Order details exceed maximum length of 100 characters"
    },
    {
      "code": 6001,
      "name": "zeroAmount",
      "msg": "Escrow amount must be greater than zero"
    },
    {
      "code": 6002,
      "name": "onlyBuyerAllowed",
      "msg": "Only the buyer can perform this operation"
    },
    {
      "code": 6003,
      "name": "onlySellerAllowed",
      "msg": "Only the seller can perform this operation"
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "Unauthorized access: signer is neither buyer nor seller"
    },
    {
      "code": 6005,
      "name": "invalidStatusForConfirmation",
      "msg": "Cannot confirm escrow that is not in Initialized state"
    },
    {
      "code": 6006,
      "name": "invalidStatusForRefund",
      "msg": "Cannot refund escrow that is not in Initialized state"
    },
    {
      "code": 6007,
      "name": "invalidStatusForFailure",
      "msg": "Cannot mark as failed if escrow is not in Initialized state"
    },
    {
      "code": 6008,
      "name": "invalidStatusForWithdrawal",
      "msg": "Cannot withdraw funds if escrow is not in Confirmed state"
    },
    {
      "code": 6009,
      "name": "invalidStatusForClose",
      "msg": "Cannot close escrow that is not in Completed, Refunded, or Failed state"
    },
    {
      "code": 6010,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in escrow account"
    },
    {
      "code": 6011,
      "name": "alreadyWithdrawn",
      "msg": "Funds have already been withdrawn"
    },
    {
      "code": 6012,
      "name": "transferFailed",
      "msg": "Fund transfer failed"
    },
    {
      "code": 6013,
      "name": "pdaDerivationError",
      "msg": "Failed to calculate PDA for escrow account"
    },
    {
      "code": 6014,
      "name": "vaultDerivationError",
      "msg": "Failed to calculate PDA for vault account"
    },
    {
      "code": 6015,
      "name": "escrowExpired",
      "msg": "Escrow has expired and can no longer be confirmed"
    },
    {
      "code": 6016,
      "name": "escrowLocked",
      "msg": "Escrow is locked due to an ongoing dispute"
    },
    {
      "code": 6017,
      "name": "internalError",
      "msg": "An unexpected error occurred in the escrow program"
    }
  ],
  "types": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "orderDetails",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "escrowStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "escrowStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "initialized"
          },
          {
            "name": "confirmed"
          },
          {
            "name": "completed"
          },
          {
            "name": "refunded"
          },
          {
            "name": "failed"
          }
        ]
      }
    }
  ]
};
