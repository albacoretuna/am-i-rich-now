import React, { Component } from 'react'
import { FormattedNumber, IntlProvider } from 'react-intl'
import loadingIcon from './loading.svg'
import middleparrot from './middleparrot.gif'
import sadparrot from './sadparrot.gif'
import classNames from 'classnames';

class Result extends Component {
  state = {
    "hideCoinslist" : true
  }
  renderParrots = (difference, totalPaid) => {
    let profit = difference > 0
    let parrotQuantity = difference / totalPaid
    return [
      ...Array(Math.ceil(Math.abs(parseInt(parrotQuantity, 10))) + 1),
    ].map((x, i) =>
      <img
        src={profit ? middleparrot : sadparrot}
        alt="Party parrot"
        key={i}
      />,
    )
  }

  renderResult = portfolio => {
    const reducer = (accumulator, currentValue) =>
      parseFloat(accumulator, 10) + parseFloat(currentValue.subtotal, 10)

    let portfolioValue = Math.floor(portfolio.reduce(reducer, 0))
    let difference = portfolioValue - this.props.totalPaid
    return (
      <div>
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
        {this.renderParrots(difference, this.props.totalPaid)}

        <span className="calculation">
          <IntlProvider locale="en">
            <FormattedNumber
              value={portfolioValue}
              style="currency"
              currency={this.props.currency}
            />
          </IntlProvider>{' '}
          - {' '}
          <IntlProvider locale="en">
            <FormattedNumber
              value={this.props.totalPaid}
              style="currency"
              currency={this.props.currency}
            />
          </IntlProvider>{' '}
          = {' '}
        </span>
        <h1 className="profit-loss">
          <IntlProvider locale="en">
            <FormattedNumber
              value={difference}
              style="currency"
              currency={this.props.currency}
            />
          </IntlProvider>
        </h1>
      </div>
    )
  }
  displayDetails = () => {
    this.setState({'hideCoinslist': !this.state.hideCoinslist})
  }

  render() {
    return (
      <div className="Result">
        {this.props.loading
          ? <span className="loader">
              <img src={loadingIcon} alt="loading spinner" />Loading...
            </span>
          : <div>
              {this.renderResult(this.props.portfolio)}
              <button onClick={() => this.displayDetails()}>Details</button>
              <div className={classNames ("coins-list", {'coins-list__is-hidden': this.state.hideCoinslist} )}>
              <p>
                Symbl {' '} Subtotal
              </p>
              <ol className="coins-list__ol">
                {this.props.portfolio.map((x, i) =>
                  <li className="coins-list__li" key={i}>
                    {x.symbol}{' '}

                    <IntlProvider locale="en">
                      <FormattedNumber
                        value={x.subtotal}
                        style="currency"
                        currency={this.props.currency}
                      />
                    </IntlProvider>

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
