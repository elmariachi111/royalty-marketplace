const Marketplace = artifacts.require("ClosedDesert");

module.exports = async function (deployer) {
  await deployer.deploy(Marketplace);
  const instance = await Marketplace.deployed();
  console.log(instance.address);
};
