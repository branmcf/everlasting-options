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
        const initial_token = await pool.token.call()
        const initial_contractType = await pool.contractType.call()
        const initial_fundingFrequency = await pool.fundingFrequency.call()
        const initial_maxMove = await pool.maxMove.call()
        const initial_lastAveragePrice = await pool.lastAveragePrice.call()
        const initial_isPoolSetUp = await pool.isPoolSetup.call()

        logger(`================================================================================`);
        logger(``);
        logger(`Initial strike:           ${initial_strike}`)
        logger(`Initial tokenPool:        ${initial_tokenPool}`)
        logger(`Initial collateralPool:   ${initial_collateralPool}`)
        logger(`Initial invariant:        ${initial_invariant}`)
        logger(`Initial token:            ${initial_token}`)
        logger(`Initial contractType:     ${initial_contractType}`)
        logger(`Initial fundingFrequency: ${initial_fundingFrequency}`)
        logger(`Initial maxMove:          ${initial_maxMove}`)
        logger(`Initial lastAveragePrice: ${initial_lastAveragePrice}`)
        logger(`Initial isPoolSetup:      ${initial_isPoolSetUp}`)
        logger(``);

        const strike = web3.utils.toWei('2000', 'ether')
        const xInitial = web3.utils.toWei('10', 'ether')
        const yInitial = web3.utils.toWei('1000', 'ether')
        const token = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        const contractType = 0
        const fundingFrequency = 1

        await pool.setup(
            strike,
            xInitial,
            yInitial,
            token,
            contractType,
            fundingFrequency,
            {from: process.env.DEVELOPMENT_ADDRESS}
        )

        // get final values
        const final_strike = await pool.strike.call()
        const final_tokenPool = await pool.tokenPool.call()
        const final_collateralPool = await pool.collateralPool.call() 
        const final_invariant = await pool.invariant.call()
        const final_token = await pool.token.call()
        const final_contractType = await pool.contractType.call()
        const final_fundingFrequency = await pool.fundingFrequency.call()
        const final_maxMove = await pool.maxMove.call()
        const final_lastAveragePrice = await pool.lastAveragePrice.call()
        const final_isPoolSetUp = await pool.isPoolSetup.call()

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final strike:           ${final_strike}`)
        logger(`Final tokenPool:        ${final_tokenPool}`)
        logger(`Final collateralPool:   ${final_collateralPool}`)
        logger(`Final invariant:        ${final_invariant}`)
        logger(`Final token:            ${final_token}`)
        logger(`Final contractType:     ${final_contractType}`)
        logger(`Final fundingFrequency: ${final_fundingFrequency}`)
        logger(`Final maxMove:          ${final_maxMove}`)
        logger(`Final lastAveragePrice: ${final_lastAveragePrice}`)
        logger(`Final isPoolSetup:      ${final_isPoolSetUp}`)
        logger(``);

    })

    it("should successfully call depositReserves", async () => {

        // get initial values
        const initial_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const initial_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)

        logger(`================================================================================`);
        logger(``);
        logger(`Initial exchangeBalance:  ${initial_exchangeBalance}`)
        logger(`Initial longDeposits:     ${initial_account.reserves}`)
        logger(``);

        const depositAmount = web3.utils.toWei('10', 'ether')

        await pool.depositReserves(
            depositAmount,
            {from: process.env.DEVELOPMENT_ADDRESS}
        );

        // get final values
        const final_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const final_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final exchangeBalance:  ${final_exchangeBalance}`)
        logger(`Final longDeposits:     ${final_account.reserves}`)
        logger(``);

    });

    it("should successfully call withdrawReserves", async () => {

        // get initial values
        const initial_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const initial_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)

        logger(`================================================================================`);
        logger(``);
        logger(`Initial exchangeBalance:  ${initial_exchangeBalance}`)
        logger(`Initial longDeposits:     ${initial_account.reserves}`)
        logger(``);

        const withdrawAmount = web3.utils.toWei('10', 'ether')

        await pool.withdrawReserves(
            withdrawAmount,
            {from: process.env.DEVELOPMENT_ADDRESS}
        );

        // get final values
        const final_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const final_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final exchangeBalance:  ${final_exchangeBalance}`)
        logger(`Final longDeposits:     ${final_account.reserves}`)
        logger(``);

    });

    it("should successfully call depositLong", async () => {

        // get initial values
        const initial_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const initial_collateralPool = await pool.collateralPool.call() 
        const initial_tokenPool = await pool.tokenPool.call()
        const initial_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const initial_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`================================================================================`);
        logger(``);
        logger(`Initial exchangeBalance:  ${initial_exchangeBalance}`)
        logger(`Initial collateralPool:   ${initial_collateralPool}`)
        logger(`Initial tokenPool:        ${initial_tokenPool}`)
        logger(`Initial longDeposits:     ${initial_account.longDeposits}`)
        logger(`Initial longSize:         ${initial_account.longSize}`)
        logger(`Initial lastAveragePrice: ${initial_lastAveragePrice}`)
        logger(``);

        const depositAmount = web3.utils.toWei('10', 'ether')

        await pool.depositLong(
            depositAmount,
            {from: process.env.DEVELOPMENT_ADDRESS}
        );

        // get final values
        const final_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const final_collateralPool = await pool.collateralPool.call() 
        const final_tokenPool = await pool.tokenPool.call()
        const final_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const final_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final exchangeBalance:  ${final_exchangeBalance}`)
        logger(`Final collateralPool:   ${final_collateralPool}`)
        logger(`Final tokenPool:        ${final_tokenPool}`)
        logger(`Final longDeposits:     ${final_account.longDeposits}`)
        logger(`Final longSize:         ${final_account.longSize}`)
        logger(`Final lastAveragePrice: ${final_lastAveragePrice}`)
        logger(``);

    });

    it("should successfully call depositShort", async () => {

        // get initial values
        const initial_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const initial_collateralPool = await pool.collateralPool.call() 
        const initial_tokenPool = await pool.tokenPool.call()
        const initial_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const initial_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`================================================================================`);
        logger(``);
        logger(`Initial exchangeBalance:  ${initial_exchangeBalance}`)
        logger(`Initial collateralPool:   ${initial_collateralPool}`)
        logger(`Initial tokenPool:        ${initial_tokenPool}`)
        logger(`Initial shortDeposits:    ${initial_account.shortDeposits}`)
        logger(`Initial shortSize:        ${initial_account.shortSize}`)
        logger(`Initial lastAveragePrice: ${initial_lastAveragePrice}`)
        logger(``);

        const depositAmount = web3.utils.toWei('20', 'ether')

        await pool.depositShort(
            depositAmount,
            {from: process.env.DEVELOPMENT_ADDRESS}
        );

        // get final values
        const final_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const final_collateralPool = await pool.collateralPool.call() 
        const final_tokenPool = await pool.tokenPool.call()
        const final_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const final_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final exchangeBalance:  ${final_exchangeBalance}`)
        logger(`Final collateralPool:   ${final_collateralPool}`)
        logger(`Final tokenPool:        ${final_tokenPool}`)
        logger(`Final shortDeposits:    ${final_account.shortDeposits}`)
        logger(`Final shortSize:        ${final_account.shortSize}`)
        logger(`Final lastAveragePrice: ${final_lastAveragePrice}`)
        logger(``);

    });

    it("should successfully call withdrawLong", async () => {

        // get initial values
        const initial_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const initial_collateralPool = await pool.collateralPool.call() 
        const initial_tokenPool = await pool.tokenPool.call()
        const initial_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const initial_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`================================================================================`);
        logger(``);
        logger(`Initial exchangeBalance:  ${initial_exchangeBalance}`)
        logger(`Initial collateralPool:   ${initial_collateralPool}`)
        logger(`Initial tokenPool:        ${initial_tokenPool}`)
        logger(`Initial longDeposits:     ${initial_account.longDeposits}`)
        logger(`Initial longSize:         ${initial_account.longSize}`)
        logger(`Initial lastAveragePrice: ${initial_lastAveragePrice}`)
        logger(``);

        // const withdrawAmount = web3.utils.toWei('0.9', 'ether')
        const withdrawAmount = '99009900990099010'

        await pool.withdrawLong(
            withdrawAmount,
            {from: process.env.DEVELOPMENT_ADDRESS}
        );

        // get final values
        const final_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const final_collateralPool = await pool.collateralPool.call() 
        const final_tokenPool = await pool.tokenPool.call()
        const final_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const final_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final exchangeBalance:  ${final_exchangeBalance}`)
        logger(`Final collateralPool:   ${final_collateralPool}`)
        logger(`Final tokenPool:        ${final_tokenPool}`)
        logger(`Final longDeposits:     ${final_account.longDeposits}`)
        logger(`Final longSize:         ${final_account.longSize}`)
        logger(`Final lastAveragePrice: ${final_lastAveragePrice}`)
        logger(``);

    });

    it("should successfully call withdrawShort", async () => {

        // get initial values
        const initial_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const initial_collateralPool = await pool.collateralPool.call() 
        const initial_tokenPool = await pool.tokenPool.call()
        const initial_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const initial_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`================================================================================`);
        logger(``);
        logger(`Initial exchangeBalance:  ${initial_exchangeBalance}`)
        logger(`Initial collateralPool:   ${initial_collateralPool}`)
        logger(`Initial tokenPool:        ${initial_tokenPool}`)
        logger(`Initial shortDeposits:    ${initial_account.shortDeposits}`)
        logger(`Initial shortSize:        ${initial_account.shortSize}`)
        logger(`Initial lastAveragePrice: ${initial_lastAveragePrice}`)
        logger(``);

        // const depositAmount = web3.utils.toWei('20', 'ether')
        const withdrawAmount = '200020002000200020'

        await pool.withdrawShort(
            withdrawAmount,
            {from: process.env.DEVELOPMENT_ADDRESS}
        );

        // get final values
        const final_exchangeBalance = await dai.methods.balanceOf(pool.address).call()
        const final_collateralPool = await pool.collateralPool.call() 
        const final_tokenPool = await pool.tokenPool.call()
        const final_account = await pool.userAccounts.call(process.env.DEVELOPMENT_ADDRESS)
        const final_lastAveragePrice = await pool.lastAveragePrice.call()

        logger(`----------------------------------------`);
        logger(``);
        logger(`Final exchangeBalance:  ${final_exchangeBalance}`)
        logger(`Final collateralPool:   ${final_collateralPool}`)
        logger(`Final tokenPool:        ${final_tokenPool}`)
        logger(`Final shortDeposits:    ${final_account.shortDeposits}`)
        logger(`Final shortSize:        ${final_account.shortSize}`)
        logger(`Final lastAveragePrice: ${final_lastAveragePrice}`)
        logger(``);

    });

    
    
});