export const formatToPHP = (amount: number) => {
  return Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
};
