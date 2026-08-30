import { Transaction, CategoryBudget, Asset, Liability, Account } from '../types';

export function downloadCsvFile(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function escapeCsv(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

export function generateMonthlySummaryCsv(
  monthLabel: string,
  totalIncome: number,
  totalExpenses: number,
  netSavings: number,
  savingsRate: number,
  categorySpending: Record<string, number>,
  netWorth: number
): string {
  const lines: string[] = [];
  lines.push(`"MONTHLY FINANCIAL SUMMARY REPORT - ${monthLabel}"`);
  lines.push(`"Generated At",${escapeCsv(new Date().toLocaleString())}`);
  lines.push('');
  lines.push('"METRIC","AMOUNT (USD)"');
  lines.push(`"Total Monthly Income",${escapeCsv(totalIncome.toFixed(2))}`);
  lines.push(`"Total Monthly Expenses",${escapeCsv(totalExpenses.toFixed(2))}`);
  lines.push(`"Net Monthly Savings",${escapeCsv(netSavings.toFixed(2))}`);
  lines.push(`"Savings Rate",${escapeCsv(`${savingsRate.toFixed(1)}%`)}`);
  lines.push(`"Ending Net Worth",${escapeCsv(netWorth.toFixed(2))}`);
  lines.push('');
  lines.push('"SPENDING BREAKDOWN BY CATEGORY"');
  lines.push('"Category","Amount Spent (USD)","% of Total Expense"');

  const categories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
  for (const [cat, spent] of categories) {
    const pct = totalExpenses > 0 ? ((spent / totalExpenses) * 100).toFixed(1) : '0.0';
    lines.push(`${escapeCsv(cat)},${escapeCsv(spent.toFixed(2))},${escapeCsv(`${pct}%`)}`);
  }

  return lines.join('\n');
}

export function generateSemiMonthlyBudgetCsv(
  monthLabel: string,
  categoryBudgets: CategoryBudget[],
  p1Spending: Record<string, number>,
  p2Spending: Record<string, number>
): string {
  const lines: string[] = [];
  lines.push(`"SEMI-MONTHLY BUDGET PERFORMANCE REPORT - ${monthLabel}"`);
  lines.push(`"Generated At",${escapeCsv(new Date().toLocaleString())}`);
  lines.push('');
  lines.push(
    '"Category","Period 1 Limit (1st-15th)","Period 1 Spent","Period 1 Remaining","Period 2 Limit (16th-End)","Period 2 Spent","Period 2 Remaining","Monthly Total Limit","Monthly Total Spent"'
  );

  let totalP1Limit = 0;
  let totalP1Spent = 0;
  let totalP2Limit = 0;
  let totalP2Spent = 0;

  for (const b of categoryBudgets) {
    const p1Spent = p1Spending[b.category] || 0;
    const p1Rem = b.period1Limit - p1Spent;
    const p2Spent = p2Spending[b.category] || 0;
    const p2Rem = b.period2Limit - p2Spent;
    const mLimit = b.period1Limit + b.period2Limit;
    const mSpent = p1Spent + p2Spent;

    totalP1Limit += b.period1Limit;
    totalP1Spent += p1Spent;
    totalP2Limit += b.period2Limit;
    totalP2Spent += p2Spent;

    lines.push(
      [
        escapeCsv(b.category),
        escapeCsv(b.period1Limit.toFixed(2)),
        escapeCsv(p1Spent.toFixed(2)),
        escapeCsv(p1Rem.toFixed(2)),
        escapeCsv(b.period2Limit.toFixed(2)),
        escapeCsv(p2Spent.toFixed(2)),
        escapeCsv(p2Rem.toFixed(2)),
        escapeCsv(mLimit.toFixed(2)),
        escapeCsv(mSpent.toFixed(2))
      ].join(',')
    );
  }

  lines.push(
    [
      '"TOTAL"',
      escapeCsv(totalP1Limit.toFixed(2)),
      escapeCsv(totalP1Spent.toFixed(2)),
      escapeCsv((totalP1Limit - totalP1Spent).toFixed(2)),
      escapeCsv(totalP2Limit.toFixed(2)),
      escapeCsv(totalP2Spent.toFixed(2)),
      escapeCsv((totalP2Limit - totalP2Spent).toFixed(2)),
      escapeCsv((totalP1Limit + totalP2Limit).toFixed(2)),
      escapeCsv((totalP1Spent + totalP2Spent).toFixed(2))
    ].join(',')
  );

  return lines.join('\n');
}

export function generateTransactionsCsv(
  transactions: Transaction[],
  accounts: Account[]
): string {
  const accMap = new Map(accounts.map((a) => [a.id, a.name]));
  const lines: string[] = [];
  lines.push('"Date","Title / Merchant","Type","Category","Amount (USD)","Account","Status","Source","Tags","Notes"');

  for (const tx of transactions) {
    lines.push(
      [
        escapeCsv(tx.date),
        escapeCsv(tx.title),
        escapeCsv(tx.type.toUpperCase()),
        escapeCsv(tx.category),
        escapeCsv((tx.type === 'expense' ? -tx.amount : tx.amount).toFixed(2)),
        escapeCsv(accMap.get(tx.accountId) || tx.accountId),
        escapeCsv(tx.status),
        escapeCsv(tx.source),
        escapeCsv(tx.tags?.join('; ') || ''),
        escapeCsv(tx.notes || '')
      ].join(',')
    );
  }

  return lines.join('\n');
}

export function generateAssetPortfolioCsv(
  assets: Asset[],
  liabilities: Liability[],
  accounts: Account[]
): string {
  const lines: string[] = [];
  lines.push('"ASSET AND NET WORTH REPORT"');
  lines.push(`"Generated At",${escapeCsv(new Date().toLocaleString())}`);
  lines.push('');
  lines.push('"Section","Name / Holding","Category","Symbol / Lender","Cost Basis (USD)","Current Value / Balance (USD)","Gain / Loss (USD)","Return %"');

  // Liquid Accounts
  for (const acc of accounts) {
    lines.push(
      [
        '"Liquid Account"',
        escapeCsv(acc.name),
        escapeCsv(acc.type.toUpperCase()),
        escapeCsv(acc.institution),
        escapeCsv(acc.balance.toFixed(2)),
        escapeCsv(acc.balance.toFixed(2)),
        '"$0.00"',
        '"0.0%"'
      ].join(',')
    );
  }

  // Assets
  for (const ast of assets) {
    const gain = ast.currentValue - ast.costBasis;
    const retPct = ast.costBasis > 0 ? ((gain / ast.costBasis) * 100).toFixed(2) : '0.00';
    lines.push(
      [
        '"Asset Holding"',
        escapeCsv(ast.name),
        escapeCsv(ast.category.toUpperCase()),
        escapeCsv(ast.symbol || '-'),
        escapeCsv(ast.costBasis.toFixed(2)),
        escapeCsv(ast.currentValue.toFixed(2)),
        escapeCsv(gain.toFixed(2)),
        escapeCsv(`${retPct}%`)
      ].join(',')
    );
  }

  // Liabilities
  for (const liab of liabilities) {
    lines.push(
      [
        '"Liability / Debt"',
        escapeCsv(liab.name),
        escapeCsv(liab.category.toUpperCase()),
        escapeCsv(liab.lender),
        escapeCsv(liab.totalBalance.toFixed(2)),
        escapeCsv((-liab.totalBalance).toFixed(2)),
        '"-"',
        escapeCsv(`APR ${liab.interestRate}%`)
      ].join(',')
    );
  }

  return lines.join('\n');
}
