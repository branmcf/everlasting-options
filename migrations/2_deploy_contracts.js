// required packages
require('dotenv').config();

// contract artifacts
const factory = artifacts.require("OptionFactory");
const pool = artifacts.require("OptionPool");



module.exports = async function(deployer, network, accounts) {
    if (network === 'mainnet') {

        // DO NOTHING

    } else if (network === 'kovan') {

        // DO NOTHING

    } else if (network === 'development') {
        // // deployment constants
        // const aaveV2LendingPoolAddress = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
        // const aaveV2PriceFeedAddress = '0xa50ba011c48153de246e5192c8f9258a2ba79ca9';
        // const zeroAddress = '0x0000000000000000000000000000000000000000';

        // // deploy Aavetrage
        // await deployer.deploy(aavetrage, process.env.DEVELOPMENT_ADDRESS, aaveV2LendingPoolAddress, aaveV2PriceFeedAddress);

        // // set up Aavetrage
        // const instance = await aavetrage.at(aavetrage.address);
        // await instance.updateMarkets('0xFFC97d72E13E01096502Cb8Eb52dEe56f74DAD7B', '1000000000000000000', '0', '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9')  // AAVE
        // await instance.updateMarkets('0x272F97b7a56a387aE942350bBC7Df5700f8a4576', '1000000000000000000', '1', '0xba100000625a3754423978a60c9317c58a424e3d')  // BAL
        // await instance.updateMarkets('0x05Ec93c0365baAeAbF7AefFb0972ea7ECdD39CF1', '1000000000000000000', '2', '0x0d8775f648430679a709e98d2b0cb6250d2887ef')  // BAT
        // await instance.updateMarkets('0xA361718326c15715591c299427c62086F69923D9', '1000000000000000000', '3', '0x4Fabb145d64652a948d72533023f6E7A623C7C53')  // BUSD
        // await instance.updateMarkets('0x8dAE6Cb04688C62d939ed9B68d32Bc62e49970b1', '1000000000000000000', '4', '0xD533a949740bb3306d119CC777fa900bA034cd52')  // CRV
        // await instance.updateMarkets('0x028171bCA77440897B824Ca71D1c56caC55b68A3', '1000000000000000000', '5', '0x6B175474E89094C44Da98b954EedeAC495271d0F')  // DAI
        // await instance.updateMarkets('0xaC6Df26a590F08dcC95D5a4705ae8abbc88509Ef', '1000000000000000000', '6', '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c')  // ENJ
        // await instance.updateMarkets('0xD37EE7e4f452C6638c96536e68090De8cBcdb583', '100', '7', '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd')                  // GUSD
        // await instance.updateMarkets('0x39C6b3e42d6A679d7D776778Fe880BC9487C2EDA', '1000000000000000000', '8', '0xdd974D5C2e2928deA5F71b9825b8b646686BD200')  // KNC
        // await instance.updateMarkets('0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0', '1000000000000000000', '9', '0x514910771AF9Ca656af840dff83E8264EcF986CA')  // LINK
        // await instance.updateMarkets('0xa685a61171bb30d4072B338c80Cb7b2c865c873E', '1000000000000000000', '10', '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942') // MANA
        // await instance.updateMarkets('0xc713e5E149D5D0715DcD1c156a020976e7E56B88', '1000000000000000000', '11', '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2') // MKR
        // await instance.updateMarkets('0xCC12AbE4ff81c9378D670De1b57F8e0Dd228D77a', '1000000000000000000', '12', '0x408e41876cCCDC0F92210600ef50372656052a38') // REN
        // await instance.updateMarkets('0x35f6B052C598d933D69A4EEC4D04c73A191fE6c2', '1000000000000000000', '13', '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F') // SNX
        // await instance.updateMarkets('0x6C5024Cd4F8A59110119C56f8933403A539555EB', '1000000000000000000', '14', '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51') // SUSD
        // await instance.updateMarkets('0x101cc05f4A51C0319f570d5E146a8C625198e636', '1000000000000000000', '15', '0x0000000000085d4780B73119b644AE5ecd22b376') // TUSD
        // await instance.updateMarkets('0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1', '1000000000000000000', '16', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984') // UNI
        // await instance.updateMarkets('0xBcca60bB61934080951369a648Fb03DF4F96263C', '1000000', '17', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')             // USDC
        // await instance.updateMarkets('0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', '1000000', '18', '0xdAC17F958D2ee523a2206206994597C13D831ec7')             // USDT
        // await instance.updateMarkets('0x9ff58f4fFB29fA2266Ab25e75e2A8b3503311656', '100000000', '19', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599')           // WBTC
        // await instance.updateMarkets('0x030bA81f1c18d280636F32af80b9AAd02Cf0854e', '1000000000000000000', '20', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') // WETH
        // await instance.updateMarkets('0xf256cc7847e919fac9b808cc216cac87ccf2f47a', '1000000000000000000', '21', '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272') // XSUSHI
        // await instance.updateMarkets('0x5165d24277cD063F5ac44Efd447B27025e888f37', '1000000000000000000', '22', '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e') // YFI
        // await instance.updateMarkets('0xDf7FF54aAcAcbFf42dfe29DD6144A69b629f8C9e', '1000000000000000000', '23', '0xE41d2489571d322189246DaFA5ebDe1F4699F498') // ZRX
    } else {
        throw new Error(`Unhandled network argument`)
    }
};