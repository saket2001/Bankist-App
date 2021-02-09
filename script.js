'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const updateUI = function (currAcc) {
  // displaying total balance
  showTotalBalance(currAcc);
  // displaying summary
  calcShowSummary(currAcc);
  // displaying movements
  showMoments(currAcc.movements);
};
// this shows summary of money
const showMoments = function (mov) {
  containerMovements.innerHTML = ' ';
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
                  <div class="movements__row">
                      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                      <div class="movements__value">${Math.abs(mov)} $</div>
                  </div>
                `;
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

const showTotalBalance = function (acc) {
  acc.totalBalance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.totalBalance} $`;
};
const calcTotalBalance = function (mov) {
  const totalBalance = mov.reduce((acc, mov) => acc + mov, 0);
  console.log(totalBalance);
  return totalBalance;
};
const calcShowSummary = function (acc) {
  const DepositIN = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${DepositIN} $`;

  const Withdraw = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(Withdraw)} $`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} $`;
};
//creating usernames for accounts
const createUsername = function (accArr) {
  accArr.forEach(function (acc) {
    // creating new property in each account object
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

// variables
let currentAccount;

// event handler
btnLogin.addEventListener('click', function (e) {
  // e is the event
  e.preventDefault();
  // taking username and assigning correct acc
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //Now checking the pin
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // clearing the input fields after login
    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentAccount);
  } else {
    alert(`You entered wrong Pin for account user ${currentAccount.owner}`);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // taking inputs
  const toUser = inputTransferTo.value;
  const toAmt = Number(inputTransferAmount.value);

  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  // check if All exists
  const toAcc = accounts.find(acc => acc.username === toUser);
  if (toAcc) {
    if (currentAccount.totalBalance >= toAmt) {
      // withdrawing acc from sender
      currentAccount.movements.push(-toAmt);
      console.log(currentAccount.movements);
      updateUI(currentAccount);
      // adding money to receiver
      toAcc.movements.push(toAmt);
    } else {
      alert(`You cannot withdraw amount greater then your Total balance`);
    }
  } else alert(`Enter valid account user id !!!`);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //adding loan amt in acc
  currentAccount.movements.push(Number(inputLoanAmount.value));
  updateUI(currentAccount);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // find acc index and delete acc
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = 0;
  }
  else alert(`Enter correct details of your account to close it !!`)
  // clear fields
  inputCloseUsername.value = inputClosePin.value = "";
});
/////////////////////////////////////////////////
