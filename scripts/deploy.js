const hre = require("hardhat");

async function main() {
  const [owner, alice] = await hre.ethers.getSigners();

  // console.log(signers);
  const send = await alice.sendTransaction({
    to: "0x2E57b1AD12CEc57FE1C5E54D20D6f662C4743124",
    value: hre.ethers.utils.parseEther("100"), // 1 ether
  });

  await send.wait();

  const Credentia = await hre.ethers.getContractFactory("CreadentialManagement");
  const credentia = await Credentia.deploy();
  await credentia.deployed();

  console.log("CreadentialManagement deployed to:", credentia.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
