const hre = require("hardhat");

async function main() {
  const Credentia = await hre.ethers.getContractFactory(
    "CreadentialManagement"
  );
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
