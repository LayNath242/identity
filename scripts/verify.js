require("dotenv").config();
const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/Identity.sol/Identity.json");

async function test() {
  const NATH = process.env.NATH || "";
  const BRILLIANT = process.env.BRILLIANT || "";

  console.log(NATH);
  console.log(BRILLIANT);

  const addressBsc = "0xA2D89f7DCfC1C5C642f17B7f4B8A406FA01caAab";

  const provider = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  );

  const contract = new ethers.Contract(addressBsc, abi, provider);
  const brilliatWallet = new ethers.Wallet(BRILLIANT, provider);
  const nathWallet = new ethers.Wallet(NATH, provider);

  const nath = contract.connect(nathWallet);
  const brilliant = contract.connect(brilliatWallet);

  const org = await nath.mintOrganization("selendra");
  await org.wait();
  const orgName = await contract.getContentOf(0);
  const orgMeta = await contract.getMetaOf(0);
  const orgOwner = await contract.getOwnerOf(0);

  console.log("MINTING ORG ==============");
  console.log("Org name: ", orgName);
  console.log("Org meta: ", orgMeta);
  console.log("Org owner: ", orgOwner);

  const schema = await nath.mintSchema("Master ID", 1, 0);
  await schema.wait();

  const schemaName = await contract.getContentOf(1);
  const schemaMeta = await contract.getMetaOf(1);
  const schemaOwner = await contract.getOwnerOf(1);

  console.log("MINTING SCHEMA ==============");
  console.log("Schema name: ", schemaName);
  console.log("Schema meta: ", schemaMeta);
  console.log("Schema owner: ", schemaOwner);

  const _id = await brilliant.mintDocument("brilliant", 1);
  await _id.wait();

  const DocName = await contract.getContentOf(1);
  const DocMeta = await contract.getMetaOf(1);
  const DocOwner = await contract.getOwnerOf(1);

  console.log("MINTING DOC ==============");
  console.log("Doc name: ", DocName);
  console.log("Doc meta: ", DocMeta);
  console.log("Doc owner: ", DocOwner);

  const request = await brilliant.attestRequest(2, 0);
  await request.wait();

  const requestList = await nath.getRequests(0);
  console.log("ATTESTING ==============");
  console.log("Doc name: ", requestList);

  const confirm = await nath.attestValidate(2, 0, 3);
  await confirm.wait();

  const validAfterConfirm = await brilliant.verify(2);

  console.log("VERIFYING ==============");
  console.log("Doc name: ", validAfterConfirm);

  const revoke = await nath.attestValidate(2, 0, 2);
  await revoke.wait();

  const validAfterRevoke = await brilliant.verify(2);

  console.log("VERIFYING ==============");
  console.log("Doc name: ", validAfterRevoke);
}

function main() {
  try {
    test()
      .then(() => console.log("DONE"))
      .catch((error) => console.log(error));
  } catch (error) {
    return error;
  }
}

main();
