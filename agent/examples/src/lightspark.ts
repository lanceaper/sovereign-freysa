import {
  AccountTokenAuthProvider,
  BitcoinNetwork,
  LightsparkClient,
} from "@lightsparkdev/lightspark-sdk"

import dotenv from "dotenv"
dotenv.config()

const API_TOKEN_CLIENT_ID = process.env.LIGHTSPARK_API_TOKEN_CLIENT_ID!
const API_TOKEN_CLIENT_SECRET = process.env.LIGHTSPARK_API_TOKEN_CLIENT_SECRET!

// Create an API client
const client = new LightsparkClient(
  new AccountTokenAuthProvider(API_TOKEN_CLIENT_ID, API_TOKEN_CLIENT_SECRET)
)

const NODE_ID = process.env.LIGHTSPARK_NODE_ID!
const NODE_PASSWORD = "1234!@#$"
client.loadNodeSigningKey(NODE_ID, { password: NODE_PASSWORD })

async function fundNode() {
  //   const fundingAddress = await client.createNodeWalletAddress(NODE_ID)

  // Simulate funding from L1 to the address created earlier
  const fundNodeOutput = await client.fundNode(NODE_ID, 200000)
  if (!fundNodeOutput) {
    throw new Error("Unable to fund node")
  }
  console.log(`Funded amount: ${fundNodeOutput.originalValue}`)
}

export async function sendPayment(reason: string = "example payment") {
  // Simulate receiving an invoice
  const testInvoice = await client.createTestModeInvoice(
    NODE_ID,
    20_000,
    reason
  )
  if (!testInvoice) {
    throw new Error("Unable to create test invoice")
  }
  console.log(`Invoice created: ${testInvoice}\n`)

  // Pay the invoice
  const payInvoice = await client.payInvoice(NODE_ID, testInvoice, 1000)
  if (!payInvoice) {
    throw new Error("Payment failed")
  }
  console.log(`Payment done with ID = ${JSON.stringify(payInvoice, null, 2)}\n`)
  return payInvoice;
}

async function main() {
  try {
    // await fundNode()
    await sendPayment()
  } catch (err) {
    console.error(err)
  }
}

// main()
