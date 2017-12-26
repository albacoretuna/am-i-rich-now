import React, { Component } from 'react'
import { FormattedNumber, IntlProvider } from 'react-intl'
import loadingIcon from './loading.svg'
import middleparrot from './middleparrot.gif'
import sadparrot from './sadparrot.gif'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

class Result extends Component {
  state = {
    hideCoinslist: true,
  }

  // outputs between 1 to 31 happy or sad party parrots
  renderParrots = (difference, totalPaid) => {
    if (!difference || !totalPaid) return
    let profit = difference > 0
    let parrotQuantity =
      Math.min(Math.ceil(Math.abs(parseInt(difference / totalPaid, 10))), 30) +
      1
    return [...Array(parrotQuantity)].map((x, i) =>
      <img
        src={profit ? middleparrot : sadparrot}
        alt="Party parrot"
        key={i}
      />,
    )
  }

  renderResult = portfolio => {
    if (portfolio.length < 1) {
      return (
        <div>
          Start by adding your coins:
          <Link className="result__link" to="/manage-coins">
            manage coins
          </Link>
        </div>
      )
    }

    const reducer = (accumulator, currentValue) =>
      parseFloat(accumulator, 10) + parseFloat(currentValue.subtotal, 10)

    let portfolioValue = Math.floor(portfolio.reduce(reducer, 0))
    let difference = portfolioValue - this.props.totalPaid
    return (
      <div>
        <h1 className="profit-loss">
          <IntlProvider locale="en">
            <FormattedNumber
              value={difference}
              style="currency"
              currency={this.props.currency}
            />
          </IntlProvider>
          <span className="profit-loss__span">
            {difference > 0 ? 'profit' : 'loss'}
          </span>
        </h1>
        <span className="calculation">
          (Current total worth of coins)<IntlProvider locale="en">
            <FormattedNumber
              value={portfolioValue}
              style="currency"
              currency={this.props.currency}
            />
          </IntlProvider>{' '}
          -  <br />
          (What you paid to buy them)
          <IntlProvider locale="en">
            <FormattedNumber
              value={this.props.totalPaid}
              style="currency"
              currency={this.props.currency}
            />
          </IntlProvider>{' '}
        </span>
        {this.renderParrots(difference, this.props.totalPaid)}
        {difference > 0 &&
          <div>
            <span className="verdict">Maybe! You've made some profit</span>
          </div>}

        {difference < 0 &&
          <div>
            <span className="verdict">
              No you should be poorer now. You lost some.
            </span>
          </div>}
        <button
          className="result__button"
          onClick={() => this.displayDetails()}
        >
          Details
        </button>
      </div>
    )
  }
  displayDetails = () => {
    this.setState({ hideCoinslist: !this.state.hideCoinslist })
  }

  render() {
    return (
      <div className="result">
        {!this.props.loading
          ? <span className="loader">
              <img src={loadingIcon} alt="loading spinner" />Loading...
            </span>
          : <div>
              {this.renderResult(this.props.portfolio)}
              <div
                className={classNames('coins-list', {
                  'coins-list__is-hidden': this.state.hideCoinslist,
                })}
              >
                <p>
                  Coin {' | '} Quantity {' | '} Subtotal
                </p>
                <div>
                  <Link to="/manage-coins">manage coins</Link>
                </div>
                <ol className="coins-list__ol">
                  {this.props.portfolio.map((x, i) =>
                    <li className="coins-list__li" key={i}>
                      <span className="coins-list__span">
                        {x.symbol}   {x.quantity}
                      </span>{' '}
                      {' '}
                      <span className="coins-list__span--currency">
                        <IntlProvider locale="en">
                          <FormattedNumber
                            value={x.subtotal}
                            style="currency"
                            currency={this.props.currency}
                          />
                        </IntlProvider>
                      </span>
                    </li>,
                  )}
                </ol>
              </div>
            </div>}
      </div>
    )
  }
}

export default Result
