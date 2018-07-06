const transaction = {
    'common': {
      'type': 0,
      'chain_id': 'chain-9ujDWI',
      'memo': 'For groceries',
      'ref': 'cdf28bf8d5a12AD84Bc'
    },
    'fees': [
      {
        'address': '0x6806ea1d9b2eb59DAc7fdcdf28bf8d5a12AD84Bc',
        'token_ticker': 'IOV',
        'whole_amount': 1,
        'fractional_amount': 2
      }
    ],
    'sender': [
      {
        'address': '0x6806ea1d9b2eb59DAc7fdcdf28bf8d5a12AD84Bc',
        'token_ticker': 'IOV',
        'whole_amount': 100,
        'fractional_amount': 100
      }
    ],
    'recipient': [
      {
        'address': '0xBbE6098c8a4a572fE428A4ab58CeC73a977364FE',
        'token_ticker': 'IOV',
        'whole_amount': 100,
        'fractional_amount': 100
      }
    ],
    'signatures': [
      {
        'address': '0x6806ea1d9b2eb59DAc7fdcdf28bf8d5a12AD84Bc',
        'sequence': 1
      }
    ],
    'metadata': {
      'hash': '54f5c06750727998229f6ea50c0299dbc76ce2d09d2c81ec4457f46bd5cea99c',
      'height': 263
    }
};

module.exports.transaction = transaction;