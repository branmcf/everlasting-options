"""
@title Everlasting Options Prototype
@notice A prototype implementation of Everlasting Options
@author Brandon McFarland
"""

# define the interfaces used by the contract
from vyper.interfaces import ERC20

# define the constants used by the contract
DAI: constant(address) = 0x6B175474E89094C44Da98b954EedeAC495271d0F
MIN_DEPOSIT_TIME: constant(uint256) = 60
TEN_EXP_18: constant(uint256) = 1000000000000000000

# define the structs used by the contract
struct Account:
    longDeposits: uint256
    shortDeposits: uint256
    lastShortDeposit: uint256
    lastLongDeposit: uint256
    longSize: uint256
    shortSize: int128
    reserves: uint256

# define the storage variables used by the contract
factory: public(address)
isPoolSetup: public(bool)
strike: public(uint256)
userAccounts: public(HashMap[address, Account])               
tokenPool: public(uint256)
collateralPool: public(uint256)
invariant: public(uint256)
token: public(address)
contractType: public(uint256)
priceCount: public(uint256)
lastAveragePrice: public(uint256)
fundingFrequency: public(uint256)
maxMove: public(uint256)
liquidatorBonus: public(uint256)

@external
def __init__():
    self.factory = msg.sender
    self.isPoolSetup = False

@internal
def _getMarkPrice() -> uint256:
    return (self.collateralPool * TEN_EXP_18) / self.tokenPool

@internal
def _calculateAveragePrice():
    self.priceCount += 1
    currentPrice: uint256 = self._getMarkPrice()
    differential: int128 = (convert(currentPrice, int128) - convert(self.lastAveragePrice, int128)) / convert(self.priceCount, int128)
    self.lastAveragePrice = convert(convert(self.lastAveragePrice, int128) + differential, uint256)

@external
def setup(_strike: uint256, _x_initial: uint256, _y_initial: uint256, _token: address, _contract_type: uint256, _funding_frequency: uint256, _max_move: uint256, _liquidator_bonus: uint256):
    assert msg.sender == self.factory, "Only the factory can call setup"
    assert self.isPoolSetup == False
    self.strike = _strike
    self.tokenPool = _x_initial
    self.collateralPool = _y_initial
    self.invariant = _x_initial * _y_initial
    self.token = _token
    self.contractType = _contract_type
    self.fundingFrequency = _funding_frequency
    self.maxMove = _max_move
    self.liquidatorBonus = _liquidator_bonus
    self._calculateAveragePrice()
    self.isPoolSetup = True

@internal
def _safeTransferFrom(
        _amount: uint256,
        _asset: address,
        _from: address,
        _to: address
    ):
    transferResponse: Bytes[32] = raw_call(
        _asset,
        concat(
            method_id("transferFrom(address,address,uint256)"),
            convert(_from, bytes32),
            convert(_to, bytes32),
            convert(_amount, bytes32),
        ),
        max_outsize=32,
    )
    if len(transferResponse) > 0:
        assert convert(transferResponse, bool), "Failed safeTransferFrom"

@internal
def _safeTransfer(
        _amount: uint256,
        _asset: address,
        _to: address
    ):
    transferResponse: Bytes[32] = raw_call(
        _asset,
        concat(
            method_id("transfer(address,uint256)"),
            convert(_to, bytes32),
            convert(_amount, bytes32),
        ),
        max_outsize=32,
    )
    if len(transferResponse) > 0:
        assert convert(transferResponse, bool), "Failed safeTransfer"

@internal
def _getSpotPrice() -> uint256:
    # TODO
    return 1

@external
def depositShort(_amount: uint256) -> bool:

    # transfer dai from the depositor to the pool
    self._safeTransferFrom(
        _amount,
        DAI,
        msg.sender,
        self
    )

    # calculate the decrease to the collateral pool
    newCollateralPool: uint256 = self.collateralPool - _amount

    # calculate the increase to the token pool
    newTokenPool: uint256 = self.invariant / newCollateralPool

    # calculate how many tokens were purchased
    tokensPurchased: int128 = convert(self.tokenPool, int128) - convert(newTokenPool, int128)

    # update the size of the token pool
    self.tokenPool = newTokenPool

    # update the size of the collateral pool
    self.collateralPool = newCollateralPool

    # update the depositor's account
    self.userAccounts[msg.sender].shortDeposits += _amount
    self.userAccounts[msg.sender].shortSize += tokensPurchased
    self.userAccounts[msg.sender].lastShortDeposit = block.timestamp

    # update the average price of the contract for the funding period 
    self._calculateAveragePrice()

    # return true on successful deposit
    return True

@external
def withdrawShort(_amount: uint256) -> bool:
    # calculate the decrease to the token pool
    newTokenPool: uint256 = self.tokenPool - _amount

    # calculate the increase to the collateral pool
    newCollateralPool: uint256 = self.invariant / newTokenPool

    # calculate the amount of collateral redeemed
    collateralRedeemed: uint256 = convert((convert(self.collateralPool, int128) - convert(newCollateralPool, int128)) * -1, uint256)

    # update the size of the token pool
    self.tokenPool = newTokenPool

    # update the size of the collateral pool
    self.collateralPool = newCollateralPool

    # update the user's account
    self.userAccounts[msg.sender].shortDeposits -= collateralRedeemed
    self.userAccounts[msg.sender].shortSize += convert(_amount, int128)

    # transfer the redeemed collateral to the user
    self._safeTransfer(
        collateralRedeemed,
        DAI,
        msg.sender
    )

    # update the average price of the contract for the funding period 
    self._calculateAveragePrice()

    # return true on successful withdraw
    return True 

@external
def depositLong(_amount: uint256) -> bool:

    # transfer dai from the depositor to the pool
    self._safeTransferFrom(
        _amount,
        DAI,
        msg.sender,
        self
    )
    
    # calculate the increase to the collateral pool
    newCollateralPool: uint256 = self.collateralPool + _amount

    # calculate the decrease to the token pool
    newTokenPool: uint256 = self.invariant / newCollateralPool

    # calculate how many tokens were purchased
    tokensPurchased: uint256 = self.tokenPool - newTokenPool

    # update the size of the token pool
    self.tokenPool = newTokenPool

    # update the size of the collateral pool
    self.collateralPool = newCollateralPool

    # update the depositor's account
    self.userAccounts[msg.sender].longDeposits += _amount
    self.userAccounts[msg.sender].longSize += tokensPurchased
    self.userAccounts[msg.sender].lastLongDeposit = block.timestamp

    # update the average price of the contract for the funding period 
    self._calculateAveragePrice()

    # return true on successful deposit
    return True

@external
def withdrawLong(_amount: uint256) -> bool:

    # calculate the increase to the token pool
    newTokenPool: uint256 = self.tokenPool + _amount

    # calculate the decrease to the collateral pool
    newCollateralPool: uint256 = self.invariant / newTokenPool

    # calculate the amount of collateral redeemed
    collateralRedeemed: uint256 = self.collateralPool - newCollateralPool

    # update the size of the token pool
    self.tokenPool = newTokenPool

    # update the size of the collateral pool
    self.collateralPool = newCollateralPool

    # update the user's account
    self.userAccounts[msg.sender].longDeposits -= collateralRedeemed
    self.userAccounts[msg.sender].longSize -= _amount

    # transfer the redeemed collateral to the user
    self._safeTransfer(
        collateralRedeemed,
        DAI,
        msg.sender
    )

    # update the average price of the contract for the funding period 
    self._calculateAveragePrice()

    # return true on successful withdraw
    return True 

@external
def getMarkPrice() -> uint256:

    # call internal getMarkPrice method
    return self._getMarkPrice()

@external
def calculateFunding() -> uint256:
    # TODO

    # check if the contract type is a call
    if self.contractType == 0:
        spotPrice: uint256 = self._getSpotPrice()
        payoff: uint256 = max(spotPrice - self.strike, 0)
        fundingRate: int128 = 1 * ((convert(self.lastAveragePrice, int128) - convert(payoff, int128)) / convert(self.fundingFrequency, int128))

        # TODO: figure out how people get paid

    # check if the contract type is a put
    elif self.contractType == 1:
        pass
    else:
        raise "Invalid contract type for calculateFunding"


    return 1

@internal
def _liquidate() -> uint256:
    # TODO

    return 1

@external
def liquidate(_account: address, _amount: uint256, _side: uint256) -> uint256:
    # assert _side == 0 or _side == 1
    
    # handle call liquidation
    if self.contractType == 0:
        spotPrice: uint256 = self._getSpotPrice()
        payoff: uint256 = max(spotPrice - self.strike, 0)
        mark: uint256 = self._getMarkPrice()

        # handle long liquidation
        if _side == 0:
            maxMoveSpot: uint256 = spotPrice * (1 - 1 * self.maxMove)
            maxMovePayoff: uint256 = max(maxMoveSpot - self.strike, 0)
            timeValue: uint256 = max(mark - payoff, 0)
            requiredBuffer: uint256 = timeValue + mark - maxMovePayoff

            if self.userAccounts[msg.sender].reserves < requiredBuffer:
                # liquidate
                return self._liquidate()
            else:
                raise "This position can not be liquidated"

        # handle short liquidation
        elif _side == 1:
            maxMoveSpot: uint256 = spotPrice * (1 + 1 * self.maxMove)
            maxMovePayoff: uint256 = max(maxMoveSpot - self.strike, 0)
            timeValue: uint256 = max(mark - payoff, 0)
            requiredBuffer: uint256 = maxMovePayoff + timeValue * 10

            if self.userAccounts[msg.sender].reserves < requiredBuffer:
                # liquidate
                return self._liquidate()
            else:
                raise "This position can not be liquidated"
        else:
            raise "Invalid side for liquidate"

    # handle put liquidation
    elif self.contractType == 1:
        spotPrice: uint256 = self._getSpotPrice()
        payoff: uint256 = max(self.strike - spotPrice, 0)
        mark: uint256 = self._getMarkPrice()

        # handle long liquidation
        if _side == 0:
            maxMoveSpot: uint256 = spotPrice * (1 + 1 * self.maxMove)
            maxMovePayoff: uint256 = max(self.strike - maxMoveSpot, 0)
            timeValue: uint256 = max(mark - payoff, 0)
            requiredBuffer: uint256 = timeValue + mark - maxMovePayoff

            if self.userAccounts[msg.sender].reserves < requiredBuffer:
                # liquidate
                return self._liquidate()
            else:
                raise "This position can not be liquidated"

        elif _side == 1:
            maxMoveSpot: uint256 = spotPrice * (1 - 1 * self.maxMove)
            maxMovePayoff: uint256 = max(self.strike - maxMoveSpot, 0)
            timeValue: uint256 = max(mark - payoff, 0)
            requiredBuffer: uint256 = maxMovePayoff + timeValue * 10

            if self.userAccounts[msg.sender].reserves < requiredBuffer:
                # liquidate
                return self._liquidate()
            else:
                raise "This position can not be liquidated"
        else:
            raise "Invalid side for liquidate"
    else:
        raise "Invalid contract for liquidate"

@external
def depositReserves(_amount: uint256):
    # transfer dai from the depositor to the pool
    self._safeTransferFrom(
        _amount,
        DAI,
        msg.sender,
        self
    )

    self.userAccounts[msg.sender].reserves += _amount

@external
def withdrawReserves(_amount: uint256):
    assert self.userAccounts[msg.sender].reserves >= _amount, "Withdrawing too much"
    self.userAccounts[msg.sender].reserves -= _amount
    self._safeTransfer(
        _amount,
        DAI,
        msg.sender
    )