# remedian-js

A small JavaScript library for efficient approximation of median value on a streaming data.

![MIT license](https://img.shields.io/github/license/VMois/remedian-js)

## Features

- **no dependencies**: no need to worry about conflicts
- **robust algorithm**: library is based on *Remedian* algorithm 

## Example

```javascript
const Remedian = require('remedian');

const remedian = new Remedian();
remedian.write(1);
remedian.write(2);
remedian.write(3);

console.log('My approximate median is ', remedian.approximate());
```

## References

- [The Remedian: A Robust Averaging Method for Large Data Sets (paper)](https://www.researchgate.net/publication/247974442_The_Remedian_A_Robust_Averaging_Method_for_Large_Data_Sets)
- [Further analysis of the remedian algorithm (paper)](https://doi.org/10.1016/j.tcs.2013.05.039)
