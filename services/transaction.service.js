const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const toOutput = (tx) => ({
  ...tx,
  amount: Number(tx.amount),
});

const createTransaction = async (payload, createdBy) => {
  const tx = await prisma.transaction.create({
    data: {
      amount: Number(payload.amount),
      type: payload.type,
      category: payload.category,
      description: payload.description || null,
      date: new Date(payload.date),
      createdBy,
    },
  });
  return toOutput(tx);
};

const listTransactions = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (query.type) where.type = query.type;
  if (query.category) where.category = query.category;
  if (query.from || query.to) {
    where.date = {};
    if (query.from) where.date.gte = new Date(query.from);
    if (query.to) where.date.lte = new Date(query.to);
  }

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    items: items.map(toOutput),
    pagination: { page, limit, total },
  };
};

const updateTransaction = async (id, payload) => {
  const existing = await prisma.transaction.findFirst({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    throw new AppError("Transaction not found.", 404);
  }

  const data = {};
  if (payload.amount !== undefined) data.amount = Number(payload.amount);
  if (payload.type !== undefined) data.type = payload.type;
  if (payload.category !== undefined) data.category = payload.category;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.date !== undefined) data.date = new Date(payload.date);

  const updated = await prisma.transaction.update({
    where: { id },
    data,
  });
  return toOutput(updated);
};

const softDeleteTransaction = async (id) => {
  const existing = await prisma.transaction.findFirst({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    throw new AppError("Transaction not found.", 404);
  }

  await prisma.transaction.update({
    where: { id },
    data: { isDeleted: true },
  });
};

module.exports = {
  createTransaction,
  listTransactions,
  updateTransaction,
  softDeleteTransaction,
};
