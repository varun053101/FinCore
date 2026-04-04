const prisma = require("../config/prisma");

const getSummary = async () => {
  const transactions = await prisma.transaction.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdBy: true,
    },
    orderBy: { date: "desc" },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotalsMap = {};
  const monthlyTrendMap = {};

  for (const tx of transactions) {
    const amount = Number(tx.amount);

    if (tx.type === "INCOME") totalIncome += amount;
    if (tx.type === "EXPENSE") totalExpense += amount;

    const categoryKey = `${tx.type}:${tx.category}`;
    categoryTotalsMap[categoryKey] = (categoryTotalsMap[categoryKey] || 0) + amount;

    const month = new Date(tx.date).toISOString().slice(0, 7);
    if (!monthlyTrendMap[month]) monthlyTrendMap[month] = { income: 0, expense: 0 };
    if (tx.type === "INCOME") monthlyTrendMap[month].income += amount;
    if (tx.type === "EXPENSE") monthlyTrendMap[month].expense += amount;
  }

  const categoryTotals = Object.entries(categoryTotalsMap).map(([key, value]) => {
    const [type, category] = key.split(":");
    return { type, category, total: value };
  });

  const monthlyTrend = Object.entries(monthlyTrendMap)
    .map(([month, value]) => ({
      month,
      income: value.income,
      expense: value.expense,
      net: value.income - value.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    categoryTotals,
    recentActivity: transactions.slice(0, 10).map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
    })),
    monthlyTrend,
  };
};

module.exports = {
  getSummary,
};
