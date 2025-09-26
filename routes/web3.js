require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const { Web3 } = require("web3"); // Correct import for Web3.js v4
const router = express.Router();

// Initialize Web3 instance using Infura URL with the Project ID from .env
const web3 = new Web3("https://mainnet.infura.io/v3/5500db821c9f4d2394049f0f6e65a057");

// Add your test account (TESTING ONLY - Never do this in production!)
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Add this to your .env file
if (PRIVATE_KEY) {
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
}

// Route to get the balance of a wallet address
router.get("/get-balance/:address", async (req, res) => {
  const { address } = req.params;

  try {
    // Ensure the address is valid
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    // Get balance in wei and convert to ether
    const balanceWei = await web3.eth.getBalance(address);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");

    return res.json({ balance: balanceEth });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// New Route to send a payment (Ethereum)
router.post("/send-payment", async (req, res) => {
  const { recipient, amount } = req.body; // Expect recipient address and amount from frontend

  // Validate recipient and amount
  if (!web3.utils.isAddress(recipient)) {
    return res.status(400).json({ error: "Invalid recipient address" });
  }

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!PRIVATE_KEY) {
    return res.status(500).json({ error: "Private key not configured" });
  }

  try {
    // Use the configured test account
    const sender = web3.eth.accounts.wallet[0].address;
    const amountInWei = web3.utils.toWei(amount.toString(), "ether"); // Convert Ether to Wei

    // Check sender balance
    const senderBalance = await web3.eth.getBalance(sender);
    if (BigInt(senderBalance) < BigInt(amountInWei)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Send the transaction
    const tx = await web3.eth.sendTransaction({
      from: sender,
      to: recipient,
      value: amountInWei,
    });

    // Transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);

    if (receipt.status) {
      return res.json({ message: "Payment successful", txHash: tx.transactionHash });
    } else {
      return res.status(500).json({ error: "Transaction failed" });
    }
  } catch (error) {
    console.error("Error sending payment:", error);
    return res.status(500).json({ error: "Failed to send payment" });
  }
});

module.exports = router;