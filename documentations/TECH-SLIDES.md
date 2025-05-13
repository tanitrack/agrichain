---
marp: true
---

<!--
-->

# **TaniTrack Agrichain: Technical Deep Dive**

Building a Hybrid Web3 Agricultural Marketplace

---

## Project Overview & Goal

**TaniTrack:** Streamlining agricultural trade by securely connecting farmers and buyers.

**Technical Goal:**

- Combine robust off-chain data management with a seamless UX.
- Utilize on-chain financial integrity via Solana for secure transactions.
- Abstract Web3 complexities for non-technical users (farmers).

---

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Shadcn/UI, Tailwind CSS
- **Backend (Off-Chain):** Convex (Real-time Database & Serverless Functions)
- **Blockchain:** Solana (Anchor & Rust for Smart Contracts)
- **Authentication & Wallet:** Dynamic.xyz (Embedded Wallets)
- **Deployment:** Cloudflare Pages (Frontend), Convex Cloud
- **Dev Tools:** VS Code, AI (ChatGPT/Claude), Lovable (template generation)

---

## Key Technical Decisions

- **React + Vite + Shadcn:**
  - Robust and mature frontend tooling
- **Dynamic.xyz:**
  - Simplifies Web3 for non-technical users (e.g., farmers).
  - Robust auth and future potential for gasless transactions.
- **Convex + Solana Hybrid:**
  - **Convex:** Rapid development, real-time UX for off-chain data.
  - **Solana:** Security and trust for financial escrow.

---

## Architecture: The Hybrid Approach

---

![bg 75%](./tech-slides-images/architecture-overview.png)

<!--
TaniTrack separates concerns for optimal performance, user experience, and security.
- **Convex:** Manages application data, user profiles, listings, off-chain order states.
- **Dynamic.xyz:** Simplifies auth & provides embedded Solana wallets.
- **Solana:** Secures financial transactions via an escrow smart contract.

-->

---

## User Experience Flow

---

![bg 95%](./tech-slides-images/frontend-backend-solana.png)

<!--

The system we build create a seamless experience for users, abstracting the complexities of Web3 while ensuring security and trust in transactions.
The user will use the app through the frontend, which will communicate with the backend (Convex) to get the data and then use the Solana blockchain to make the transactions.
-->

---

## Agrichain Escrow Program: Overview

---

![bg 95%](./tech-slides-images/escrow-states.png)

<!--

The Solana Escrow Program is a smart contract that facilitates the secure exchange of assets between a buyer and a seller. It ensures that the buyer's funds are held in escrow until the seller fulfills their part of the agreement. -->
