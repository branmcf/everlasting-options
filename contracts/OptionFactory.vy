"""
@title  Everlasting Options Factory
@notice Deployer contract for Everlasting Options exchange pools
@author Brandon McFarland
"""

# define the interfaces used by the contract
interface Exchange():
    def setup(_strike: uint256, _x_initial: uint256, _y_initial: uint256, _token: address, _contract_type: uint256, _funding_frequency: uint256): nonpayable

# define the events emitted by the contract
event NewExchange:
    token: indexed(address)
    strike: uint256
    contractType: uint256
    exchange: indexed(address)

# define the structs used by the contract
struct Params:
    token: address
    strike: uint256
    contractType: uint256

# define the storage variables used by the contract
exchangeTemplate: public(address)
exchangeCount: public(uint256)
paramsToExchange: public(HashMap[address, HashMap[uint256, HashMap[uint256, address]]])
exchangeToParams: public(HashMap[address, Params])
idToParams: public(HashMap[uint256, Params])

@external
def __init__(_template: address):
    self.exchangeTemplate = _template

@external
def createExchange(_strike: uint256, _x_initial: uint256, _y_initial: uint256, _token: address, _contract_type: uint256, _funding_frequency: uint256) -> address:
    assert _token != ZERO_ADDRESS
    assert _strike > 0
    assert _contract_type == 0 or _contract_type == 1
    assert self.exchangeTemplate != ZERO_ADDRESS
    assert self.paramsToExchange[_token][_strike][_contract_type] == ZERO_ADDRESS

    exchange: address = create_forwarder_to(self.exchangeTemplate)
    
    Exchange(exchange).setup(_strike, _x_initial, _y_initial, _token, _contract_type, _funding_frequency)

    self.paramsToExchange[_token][_strike][_contract_type] = exchange
    self.exchangeToParams[exchange] = Params({
        token: _token,
        strike: _strike,
        contractType: _contract_type
    })
    exchangeId: uint256 = self.exchangeCount + 1
    self.idToParams[exchangeId] = Params({
        token: _token,
        strike: _strike,
        contractType: _contract_type
    })

    log NewExchange(_token, _strike, _contract_type, exchange)

    return exchange

@external
@view
def getExchangeWithParams(_token: address, _strike: uint256, _contract_type: uint256) -> address:
    return self.paramsToExchange[_token][_strike][_contract_type]

@external
@view
def getParamsWithExchange(_exchange: address) -> Params:
    return self.exchangeToParams[_exchange]

@external
@view
def getParamsWithId(_exchange_id: uint256) -> Params:
    return self.idToParams[_exchange_id]

