require("dotenv").config({ path: "../.env" });
const { ethers } = require("ethers");
const { Wallet, Contract, utils, BigNumber } = require("ethers").ethers;
const { EvmRpcProvider, calcEthereumTransactionParams } = require("@selendra/eth-providers");
// const { txParams } = require("./utils/transactionHelper");
const artifact = require("../artifacts/contracts/Identity.sol/Identity.json");

const txFeePerGas = "199999946752";
const storageByteDeposit = "100000000000000";

async function main() {
  const { ALICE, BOB } = process.env;
  const contractAddress = "0x223190e4e6A3E8bc85D47aAC761cff7bd61F063B";
  const network = "wss://rpc-testnet.selendra.org";

  const provider = EvmRpcProvider.from(network);
  await provider.isReady();

  const blockNumber = await provider.getBlockNumber();

  const ethParams = calcEthereumTransactionParams({
    gasLimit: "2100001",
    validUntil: (blockNumber + 100).toString(),
    storageLimit: "64001",
    txFeePerGas,
    storageByteDeposit,
  });

  // provider.getFeeData = async () => ({
  //   gasPrice: ethParams.txGasPrice,
  // });

  // const ethParams = await txParams(provider);
  const contract = new Contract(contractAddress, artifact.abi, provider);

  const _alice = new Wallet(ALICE, provider);
  const alice = contract.connect(_alice);

  // alice.estimateGas = async (transaction) => {
  //   return ethParams.txGasLimit;
  // };

  const _bob = new Wallet(BOB, provider);
  const bob = contract.connect(_bob);
  const _gass = {
    gasPrice: ethParams.txGasPrice,
    gasLimit: ethParams.txGasLimit,
  };

  // bob.estimateGas = async (transaction) => {
  //   return ethParams.txGasLimit;
  // };

  // console.log(contract);

  // const increase = await contract.inc({
  //   gasPrice: ethParams.txGasPrice,
  //   gasLimit: ethParams.txGasLimit,
  // });

  // const contract = new ethers.Contract(addressBsc, abi, provider);
  // const brilliatWallet = new ethers.Wallet(BRILLIANT, provider);
  // const nathWallet = new ethers.Wallet(NATH, provider);

  // const alice = contract.connect(nathWallet);
  // const bob = contract.connect(brilliatWallet);

  // const org = await alice.mintOrganization("QmYZTHgCMRN2ZSTJhKAonZqvMbFfnDNezJVToB9DDGczPz");
  // await org.wait();
  const orgName = await contract.getContentOf(0);
  const orgMeta = await contract.getMetaOf(0);
  const orgOwner = await contract.getOwnerOf(0);

  // await alice.mintOrganization("smallworld").then(async (tx, error) => {
  //   if (error) {
  //     throw error;
  //   }

  //   await tx.wait();
  //   console.log(tx);
  // });

  console.log("MINTING ORG ==============");
  console.log("Org name: ", orgName);
  console.log("Org meta: ", orgMeta);
  console.log("Org owner: ", orgOwner);

  // const schema = await alice.estimateGas.mintSchema("Master ID", 1, 0);
  // console.log(schema.toNumber());
  // await schema.wait();

  // alice.mintSchema("Master ID", 1, 0).then(async (tx, er) => {
  //   if (er) console.log(er);

  //   await tx.wait();
  //   console.log(tx);
  // });

  // const schemaName = await contract.getContentOf(1);
  // const schemaMeta = await contract.getMetaOf(1);
  // const schemaOwner = await contract.getOwnerOf(1);

  // console.log("MINTING SCHEMA ==============");
  // console.log("Schema name: ", schemaName);
  // console.log("Schema meta: ", schemaMeta);
  // console.log("Schema owner: ", schemaOwner);

  // const _id = await bob.mintDocument("bob", 1, _gass);
  // await _id.wait();

  // const DocName = await contract.getContentOf(1);
  // const DocMeta = await contract.getMetaOf(1);
  // const DocOwner = await contract.getOwnerOf(1);

  // console.log("MINTING DOC ==============");
  // console.log("Doc name: ", DocName);
  // console.log("Doc meta: ", DocMeta);
  // console.log("Doc owner: ", DocOwner);

  // const request = await bob.attestRequest(2, 0, _gass);
  // await request.wait();

  // const requestList = await alice.getRequests(0, _gass);
  // console.log("ATTESTING ==============");
  // console.log("Doc name: ", requestList);

  // const confirm = await alice.attestValidate(2, 0, 3, _gass);
  // await confirm.wait();

  // const validAfterConfirm = await bob.verify(2);

  // console.log("VERIFYING ==============");
  // console.log("Doc name: ", validAfterConfirm);

  // const revoke = await alice.attestValidate(2, 0, 2, _gass);
  // await revoke.wait();

  // const validAfterRevoke = await bob.verify(2);

  // console.log("VERIFYING ==============");
  // console.log("Doc name: ", validAfterRevoke);
}

main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
