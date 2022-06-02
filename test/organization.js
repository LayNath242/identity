const { expect } = require("chai");
const { ethers } = require("hardhat");

const ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const VERYFY_ROLE =
  "0xd16fc3b90ee4c6cd928f9a255fb3210447747361802de487637095cf8348da67";

describe("Test Creare Organazation", function () {
  it("Should create Organazation", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // expect not own any organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(0);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    // expect own 1 organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(1);

    // expect not own anyorganazation
    expect(await organazations.organizationOf(SecondUser.address)).to.equal(0);
  });
});

describe("Test Transfer Organazation", function () {
  it("Should success transfer Organazation", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // expect not own any organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(0);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    // expect own 1 organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(1);

    // expect ot own anyorganazation
    expect(await organazations.organizationOf(SecondUser.address)).to.equal(0);

    // initial transfer from non owner excecute
    await organazations.transferOrg(SecondUser.address, 0);

    // expect own 1 organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(0);

    // expect ot own anyorganazation
    expect(await organazations.organizationOf(SecondUser.address)).to.equal(1);
  });

  it("Should fail to transfer Organazation", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // expect not own any organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(0);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    // expect own 1 organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(1);

    // expect ot own anyorganazation
    expect(await organazations.organizationOf(SecondUser.address)).to.equal(0);

    // initial transfer from non owner excecute
    await expect(
      organazations.connect(SecondUser).transferOrg(SecondUser.address, 0)
    ).to.be.revertedWith("must have Admin role to transfer orgazaion");
  });
});

describe("Test Delete Organazation", function () {
  it("Should success delete Organazation", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // expect not own any organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(0);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    // expect own 1 organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(1);

    // initial transfer from non owner excecute
    await organazations.deleteOrg(0);

    // expect own 1 organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(0);
  });

  it("Should fail to delete Organazation", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // expect not own any organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(0);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    // expect own 1 organazation
    expect(await organazations.organizationOf(firstUser.address)).to.equal(1);

    // initial transfer from non owner excecute
    await expect(
      organazations.connect(SecondUser).deleteOrg(0)
    ).to.be.revertedWith("must have Admin role to delete orgazaion");
  });
});

describe("Test Grand Role", function () {
  it("Should success to gran new role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    const ADMIN_ROLE =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const VERYFY_ROLE =
      "0xd16fc3b90ee4c6cd928f9a255fb3210447747361802de487637095cf8348da67";

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await organazations.grantRole(VERYFY_ROLE, SecondUser.address, 0);
    await organazations.grantRole(ADMIN_ROLE, SecondUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(true);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(true);
  });

  it("should fail to gran new role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await expect(
      organazations
        .connect(SecondUser)
        .grantRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.be.revertedWith(
      "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });

  it("Admin should success gran new role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser, ThirdUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await organazations.grantRole(ADMIN_ROLE, SecondUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(true);

    await organazations
      .connect(SecondUser)
      .grantRole(VERYFY_ROLE, ThirdUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, ThirdUser.address, 0)
    ).to.equal(true);

    expect(
      await organazations.hasRole(ADMIN_ROLE, ThirdUser.address, 0)
    ).to.equal(false);
  });

  it("Veryfier should fail to gran new role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser, ThirdUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await organazations.grantRole(VERYFY_ROLE, SecondUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(true);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    await expect(
      organazations
        .connect(SecondUser)
        .grantRole(VERYFY_ROLE, ThirdUser.address, 0)
    ).to.be.revertedWith(
      "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });
});

describe("Test Revoke Role", function () {
  it("Should success to revoke role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await organazations.grantRole(VERYFY_ROLE, SecondUser.address, 0);
    await organazations.grantRole(ADMIN_ROLE, SecondUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(true);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(true);

    // revoke

    await organazations.revokeRole(VERYFY_ROLE, SecondUser.address, 0);
    await organazations.revokeRole(ADMIN_ROLE, SecondUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);
  });

  it("should fail to revoke role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await expect(
      organazations
        .connect(SecondUser)
        .revokeRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.be.revertedWith(
      "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });

  it("Admin should success to revoke role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser, ThirdUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await organazations.grantRole(ADMIN_ROLE, SecondUser.address, 0);
    await organazations.grantRole(VERYFY_ROLE, ThirdUser.address, 0);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(true);

    await organazations
      .connect(SecondUser)
      .revokeRole(VERYFY_ROLE, ThirdUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, ThirdUser.address, 0)
    ).to.equal(false);
  });

  it("Veryfier should fail to revoke role", async function () {
    const Organazations = await hre.ethers.getContractFactory("ORGManagement");
    const organazations = await Organazations.deploy();
    await organazations.deployed();

    // call excecute account
    [firstUser, SecondUser, ThirdUser] = await ethers.getSigners();

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    // initial create organazation for contract excecute
    await organazations.createOrg("hello", "say hello", "http://hello.com");

    await organazations.grantRole(VERYFY_ROLE, SecondUser.address, 0);
    await organazations.grantRole(VERYFY_ROLE, ThirdUser.address, 0);

    expect(
      await organazations.hasRole(VERYFY_ROLE, SecondUser.address, 0)
    ).to.equal(true);

    expect(
      await organazations.hasRole(ADMIN_ROLE, SecondUser.address, 0)
    ).to.equal(false);

    await expect(
      organazations
        .connect(SecondUser)
        .revokeRole(VERYFY_ROLE, ThirdUser.address, 0)
    ).to.be.revertedWith(
      "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });
});
