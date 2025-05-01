/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/transaction.json`.
 */
export type Transaction = {
  "address": "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF",
  "metadata": {
    "name": "transaction",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
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
          "name": "seller",
          "writable": true,
          "signer": true,
          "relations": [
            "checkout"
          ]
        },
        {
          "name": "checkout",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  101,
                  99,
                  107,
                  111,
                  117,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "checkout.buyer",
                "account": "checkout"
              },
              {
                "kind": "account",
                "path": "checkout.product_id",
                "account": "checkout"
              }
            ]
          }
        },
        {
          "name": "escrow",
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
                "path": "checkout.buyer",
                "account": "checkout"
              },
              {
                "kind": "account",
                "path": "checkout.product_id",
                "account": "checkout"
              }
            ]
          }
        },
        {
          "name": "sellerFund",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeCheckout",
      "discriminator": [
        37,
        241,
        186,
        13,
        235,
        246,
        224,
        90
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "seller"
        },
        {
          "name": "checkout",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  101,
                  99,
                  107,
                  111,
                  117,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "arg",
                "path": "productId"
              }
            ]
          }
        },
        {
          "name": "escrow",
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
                "kind": "arg",
                "path": "productId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productId",
          "type": "u64"
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
          "name": "buyer",
          "writable": true,
          "signer": true,
          "relations": [
            "checkout"
          ]
        },
        {
          "name": "checkout",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  101,
                  99,
                  107,
                  111,
                  117,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "checkout.product_id",
                "account": "checkout"
              }
            ]
          }
        },
        {
          "name": "escrow",
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
                "path": "checkout.product_id",
                "account": "checkout"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "checkout",
      "discriminator": [
        40,
        241,
        164,
        89,
        151,
        55,
        71,
        136
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyConfirmed",
      "msg": "Order already confirmed"
    },
    {
      "code": 6001,
      "name": "alreadyRefunded",
      "msg": "Order already refunded"
    }
  ],
  "types": [
    {
      "name": "checkout",
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
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "productId",
            "type": "u64"
          },
          {
            "name": "isConfirmed",
            "type": "bool"
          },
          {
            "name": "isRefunded",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
