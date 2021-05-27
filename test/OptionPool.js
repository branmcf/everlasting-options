// test packages
const truffleAssert = require('truffle-assertions');

// test contracts
const OptionPool = artifacts.require("OptionPool");

// test globals
const MAX_UINT256 = web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1));
const erc20ABI = require('../interfaces/erc20');
const daiAddress  = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const dai = new web3.eth.Contract(erc20ABI, daiAddress);
const logs = true; // make this `true` to see console logs

// helper functions
const logger = (log) => {
    logs ? console.log(log) : null;
};

contract("OptionPool Test Suite", async accounts => {

    beforeEach(async function () {
        pool = await OptionPool.deployed();
        await dai.methods.approve(pool.address, MAX_UINT256.toString()).send({from: process.env.DEVELOPMENT_ADDRESS});
    });

    it("should successfully set the initial pool values", async () => {
        // get initial values
        const initial_strike = await pool.strike.call()
        const initial_tokenPool = await pool.tokenPool.call()
        const initial_collateralPool = await pool.collateralPool.call() 
        const initial_invariant = await pool.invariant.call()
        const initial_mark = await pool.mark.call()
        const initial_isPoolSetUp = await pool.isPoolSetup.call()

        logger(`================================================================================`);
        logger(``);
        logger(`Initial strike:         ${initial_strike}`)
        logger(`Initial tokenPool:      ${initial_tokenPool}`)
        logger(`Initial collateralPool: ${initial_collateralPool}`)
        logger(`Initial invariant:      ${initial_invariant}`)
        logger(`Initial mark:           ${initial_mark}`)
        logger(`Initial isPoolSetup:    ${initial_isPoolSetUp}`)
        logger(``);

        const strike = web3.utils.toWei('2000', 'ether')
        const xInitial = web3.utils.toWei('10', 'ether')
        const yInitial = web3.utils.toWei('1000', 'ether')

        await pool.setup(
            strike,
            xInitial,
            yInitial,
            {from: process.env.DEVELOPMENT_ADDRESS}
        )

        const final_strike = await pool.strike.call()
        const final_tokenPool = await pool.tokenPool.call()
        const final_collateralPool = await pool.collateralPool.call() 
        const final_invariant = await pool.invariant.call()
        const final_mark = await pool.mark.call()
        const final_isPoolSetUp = await pool.isPoolSetup.call()

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final strike:         ${final_strike}`)
        logger(`Final tokenPool:      ${final_tokenPool}`)
        logger(`Final collateralPool: ${final_collateralPool}`)
        logger(`Final invariant:      ${final_invariant}`)
        logger(`Final mark:           ${final_mark}`)
        logger(`Final isPoolSetup:    ${final_isPoolSetUp}`)
        logger(``);

    })

    // it("should successfully call depositShort", async () => {
    //     const depositAmount = web3.utils.toWei('3000', 'ether')

    //     // get initial values
    //     const initial_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
    //     const initial_shortLiquidity = await pool.shortLiquidity.call() 
    //     const initial_contractsAvailable = await pool.contractsAvailable.call()

    //     logger(`================================================================================`);
    //     logger(``);
    //     logger(`Initial account shortLiquidity: ${initial_account.shortDeposits}`)
    //     logger(`Initial shortLiquidity:         ${initial_shortLiquidity}`)
    //     logger(`Initial contractsAvailable:     ${initial_contractsAvailable}`)
    //     logger(``);


    //     await pool.depositShort(
    //         depositAmount,
    //         {from: process.env.DEVELOPMENT_ADDRESS}
    //     );

    //     // get final values
    //     const final_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
    //     const final_shortLiquidity = await pool.shortLiquidity.call() 
    //     const final_contractsAvailable = await pool.contractsAvailable.call()


    //     logger(`----------------------------------------`);
    //     logger(``);
    //     logger(`Final account shortLiquidity: ${final_account.shortDeposits}`)
    //     logger(`Final shortLiquidity:         ${final_shortLiquidity}`)
    //     logger(`Final contractsAvailable:     ${final_contractsAvailable}`)
    //     logger(``);
    // });

    
});