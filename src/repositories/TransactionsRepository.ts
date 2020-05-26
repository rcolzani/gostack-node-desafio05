import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTotal = this.transactions.reduce((soma, transaction) => {
      if (transaction.type === 'income') {
        return soma + transaction.value;
      }
      return soma;
    }, 0);

    const outcomeTotal = this.transactions.reduce((soma, transaction) => {
      if (transaction.type === 'outcome') {
        return soma + transaction.value;
      }
      return soma;
    }, 0);

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome') {
      const balance = this.getBalance();

      if (balance.total < value) {
        throw Error("The balance can't be negative");
      }
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
