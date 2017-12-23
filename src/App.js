import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    portfolio: [],
    holding: [
      {
        symbol: 'LTC',
        quantity: 0.9569,
      },
      {
        symbol: 'ETH',
        quantity: 0.4141,
      },
      {
        symbol: 'ADA',
        quantity: 556,
      },
      {
        symbol: 'GNT',
        quantity: 231,
      },
      {
        symbol: 'DGB',
        quantity: 3023,
      },
      {
        symbol: 'XMR',
        quantity: 0.276,
      },
      {
        symbol: 'DOGE',
        quantity: 10943,
      },
    ],
  }

  getPrices = () =>
    fetch('https://api.coinmarketcap.com/v1/ticker/?convert=eur')
      .then(data => {
        data.json().then(something => {
          this.calculateValue(something)
          return something
        })
    })
  componentDidMount () {
    this.getPrices()
  }

  calculateValue = prices => {
    this.state.holding.forEach(coin => {
      let match = prices.filter(price => price.symbol === coin.symbol)[0]
      this.state.portfolio.push({
        symbol: match.symbol,
        subtotal: parseFloat(coin.quantity, 10) * parseFloat(match.price_eur),
      })
    })
    const reducer = (accumulator, currentValue) =>
      parseFloat(accumulator, 10) + parseFloat(currentValue.subtotal, 10)
    let portfolioValue = Math.floor(this.state.portfolio.reduce(reducer, 0))
    let difference = portfolioValue - 1140
    document.querySelector(
      '#sign',
    ).innerHTML = `<span>${portfolioValue} - 1140 = </span><h1 class="profit-loss">${difference} </h1>`

    if (difference > 0) {
      document.querySelector('#smily').innerHTML = `
      <span>Profit yeaaay!</span>
      <div>
       <img src="middleparrot.gif" alt="Image description" />
       <img src="middleparrot.gif" alt="Image description" />
       <img src="middleparrot.gif" alt="Image description" />
       <img src="middleparrot.gif" alt="Image description" />
       <img src="middleparrot.gif" alt="Image description" />
       <img src="middleparrot.gif" alt="Image description" />
     </div>
`
    } else {
      document.querySelector('#smily').innerHTML = 'loss:('
    }
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-title">Am I Rich Now?</h1>
      </div>
    )
  }
}

export default App
