"""
@title Everlasting Options Prototype
@notice A prototype implementation of Everlasting Options
@author Brandon McFarland
"""

# define the interfaces used by the contract

# define the constants used by the contract
DAI: constant(address) = 0x6B175474E89094C44Da98b954EedeAC495271d0F

# define the structs used by the contract
struct Account:
    longBalance: uint256
    shortBalance: uint256
    longSize: uint256
    shortSize: uint256

# define the storage variables used by the contract
factory: address
userBalances: public(HashMap[address, Account])
shortLiquidity: public(uint256)
longLiquidity: public(uint256)
contractsAvailable: public(uint256)

@external
def __init__():
    self.factory = msg.sender

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
def _calculateSizeForAmount(_amount: uint256) -> uint256:
    # TODO
    return 0

@internal
def _calculateAmountForSize(_size: uint256) -> uint256:
    # TODO
    return 0

@external
def depositShort(_amount: uint256) -> bool:

    # transfer dai from the depositor to the pool
    self._safeTransferFrom(
        _amount,
        DAI,
        msg.sender,
        self
    )

    # update user short balance
    self.userBalances[msg.sender].shortBalance += _amount

    # update total short liquidity
    self.shortLiquidity += _amount

    # calculate short size
    size: uint256 = self._calculateSizeForAmount(_amount)

    # update user short size
    self.userBalances[msg.sender].shortSize += size

    # update total contracts available
    self.contractsAvailable += size

    # return true on successful deposit
    return True

