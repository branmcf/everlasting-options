# OptionFactory
This contract is used for going long and short everlasting options

[View on Etherscan](https://etherscan.io/address/0x0000000000000000000000000000000000000000)

## Contract Constants
| Name | Type | Value | Description |
| ------------- |------------- | -----| -----|
| `DAI`| `address` | `0x6B175474E89094C44Da98b954EedeAC495271d0F` | The address of the DAI token |

## External Contract Interfaces

### IExampleInterface

##### Description
* This is an example description for an interface used in the contract.

##### Interface
```python
interface IExampleInterface:
	def exampleGetter() -> uint256: view
```

## Structs

### ExampleStrucrt

##### Description
* This is an example description for a struct used in the contract.

##### Struct
```python
struct ExampleStruct:
	member1: address
	member2: uint256
	member3: int128
	member4: bytes32
	member5: bool
```

## Storage Variables
| Name | Type | Description |
| ------------- |------------- | -----|
| `example` | `address` | This is an example description for a storage variable used in the contract. |

## Methods

### example()

```python
@external
def example(_example_arg: uint256) -> bool:
```
##### Description

* This is an example description for an external method exposed by the contract.

##### Arguments
| Name | Type | Description |
| ------------- |------------- | -----|
| `_example_arg` | `uint256` | This is an example description for an argument |

##### Web3.js example usage
```js
// call the method
const example = await optionFactory.example.call('1000000000000000000');

// log the return value
console.log(`Example return value: ${example}`);
```