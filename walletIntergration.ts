import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { Buffer } from 'node:buffer';

// Create a connector to the Wallet
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

if (!connector.connected) {
  // Check if connection is already established and create a new session
  connector.createSession();
}

connector.on("connect", (error, payload) => {
  // Subscribe to connection events and throw an error if detected
  if (error) {
    throw error;
  }

  // Get provided accounts
  const { accounts } = payload.params[0];
});

connector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts 
  const { accounts } = payload.params[0];
});

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }
});

// Draft transaction
const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  from: "ALICEU3WMO5XYJVSODKJSYLFILIXXBEXHKIVSMX7GMGXJAYGFCJKVSQTUE",
  to: "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA",
  amount: 100000,
  suggestedParams,
});

// Sign transaction
// txns is an array of algosdk.Transaction like below
// i.e txns = [txn, ...someotherTxns], but we've only built one transaction in our case
const txns = [txn]
const txnsToSign = txns.map(txn => {
const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");

return {
  txn: encodedTxn,
  message: 'Description of transaction being signed',
  // Note: if the transaction does not need to be signed (because it's part of an atomic group
  // that will be signed by another party), specify an empty singers array like so:
  // signers: [],
};
});

const requestParams = [txnsToSign];

const request = formatJsonRpcRequest("algo_signTxn", requestParams);
const result: Array<string | null> = await this.connector.sendCustomRequest(request);
const decodedResult = result.map(element => {
return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
});

// Delete connector
connector.killSession();