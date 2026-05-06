export class GameModel {
  public balance: number;
  public bet: number;
  public isSpinning: boolean;
  public lastResult: number[][] | null;

  constructor() {
    this.balance = 1000;
    this.bet = 1;
    this.isSpinning = false;
    this.lastResult = null;
  }

  public canSpin(): boolean {
    return !this.isSpinning && this.balance >= this.bet;
  }

  public deductBet(): void {
    this.balance -= this.bet;
  }

  public addWin(amount: number): void {
    this.balance += amount;
  }
}
