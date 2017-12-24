import React, { Component } from 'react'
import './App.css'
import Result from './Result.js'

class App extends Component {
  state = {
    portfolio: [],
    currency: 'EUR',
    totalPaid: 1140,
    resultLoading: true,
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
      {
        symbol: 'XRP',
        quantity: 128,
      },
    ],
  }

  getPrices = () =>
    fetch(
      'https:\/\/api.coinmarketcap.com/v1/ticker/?convert=' +
        this.state.currency
    ).then(data => {
      data.json().then(prices => {
        let portfolio = []
        this.state.holding.forEach(coin => {
          let match = prices.filter(price => price.symbol === coin.symbol)[0]

          if (!match) return

          portfolio.push({
            symbol: match.symbol,
            subtotal:
              parseFloat(coin.quantity, 10) * parseFloat(match.price_eur),
          })
        })
        this.setState({
          portfolio,
          resultLoading: false,
        })
      })
    })
  componentDidMount() {
    this.getPrices()
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-title">Am I Rich Yet?</h1>
        <p className="App-intro" />
        <Result
          loading={this.state.resultLoading}
          totalPaid={this.state.totalPaid}
          portfolio={this.state.portfolio}
          currency={this.state.currency}
        />
      </div>
    )
  }
}

export default App
