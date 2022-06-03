const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const VERYFY_ROLE =
  "0xd16fc3b90ee4c6cd928f9a255fb3210447747361802de487637095cf8348da67";

describe("Test Creare Ctype", function () {
  it("Should create Ctype", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    // initial create ctype by org
    await typeManage.createCtype(
      0,
      "https://selendra.org",
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      true,
      true,
      true,
      0
    );

    // expect own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);
  });

  it("Should not create Ctype", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    await expect(
      typeManage
        .connect(SecondUser)
        .createCtype(
          0,
          "https://selendra.org",
          "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
          true,
          true,
          true,
          0
        )
    ).to.be.revertedWith(
      "must have Admin role in organazation to create credential type"
    );
  });

  it("Should not create with veryfier Ctype", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    await typeManage.grantRole(VERYFY_ROLE, SecondUser.address, 0);

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    await expect(
      typeManage
        .connect(SecondUser)
        .createCtype(
          0,
          "https://selendra.org",
          "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
          true,
          true,
          true,
          0
        )
    ).to.be.revertedWith(
      "must have Admin role in organazation to create credential type"
    );
  });

  it("Should sucess create ctype with other org admin", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    await typeManage.grantRole(ADMIN_ROLE, SecondUser.address, 0);

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    await typeManage
      .connect(SecondUser)
      .createCtype(
        0,
        "https://selendra.org",
        "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
        true,
        true,
        true,
        0
      );

    // expect  own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);
  });
});

describe("Test Delete Ctype", function () {
  it("Should delete Ctype", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    // initial create ctype by org
    await typeManage.createCtype(
      0,
      "https://selendra.org",
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      true,
      true,
      true,
      0
    );

    // expect own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);

    // delete ctype
    await typeManage.deleteCtype(0, 0);

    // expect own 0 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);
  });

  it("Should can not delete Ctype", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    // initial create ctype by org
    await typeManage.createCtype(
      0,
      "https://selendra.org",
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      true,
      true,
      true,
      0
    );

    // expect own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);

    await expect(
      typeManage.connect(SecondUser).deleteCtype(0, 0)
    ).to.be.revertedWith(
      "must have Admin role in organazation to delete credential type"
    );

    // expect own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);
  });

  it("Should not delete with veryfier Ctype", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    await typeManage.grantRole(VERYFY_ROLE, SecondUser.address, 0);

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    // initial create ctype by org
    await typeManage.createCtype(
      0,
      "https://selendra.org",
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      true,
      true,
      true,
      0
    );

    // expect own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);

    await expect(
      typeManage.connect(SecondUser).deleteCtype(0, 0)
    ).to.be.revertedWith(
      "must have Admin role in organazation to delete credential type"
    );

    // expect own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);
  });

  it("Should sucess create ctype with other org admin", async function () {
    const TypeManage = await hre.ethers.getContractFactory("CTypeManagement");
    const typeManage = await TypeManage.deploy();
    await typeManage.deployed();

    // call excecute account
    [firstUser, SecondUser] = await ethers.getSigners();

    // initial create organazation for contract excecute
    await typeManage.createOrg("hello", "say hello", "http://hello.com");

    await typeManage.grantRole(ADMIN_ROLE, SecondUser.address, 0);

    // expect not own any ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(0);

    await typeManage.createCtype(
      0,
      "https://selendra.org",
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      true,
      true,
      true,
      0
    );

    // expect own 1 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);

    // delete ctype
    await typeManage.connect(SecondUser).deleteCtype(0, 0);

    // expect own 0 ctype in org
    expect(await typeManage.ctypeOf(0)).to.equal(1);
  });
});
