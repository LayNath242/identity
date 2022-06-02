const hre = require("hardhat");

async function main() {
  const Organazations = await hre.ethers.getContractFactory("CTypeManagement");
  const organazations = await Organazations.deploy();
  await organazations.deployed();

  console.log("CTypeManagement deployed to:", organazations.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
