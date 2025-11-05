/**
 * Calculate new average price when adding more shares
 * @param oldAvgPrice - Previous average price per share
 * @param oldQuantity - Previous number of shares
 * @param newPrice - New purchase price per share
 * @param newQuantity - New number of shares purchased
 * @returns Object containing new average price, total investment, and total shares
 */
export const calculateNewAverage = (
  oldAvgPrice: number,
  oldQuantity: number,
  newPrice: number,
  newQuantity: number
): { newAverage: number; totalInvestment: number; totalQuantity: number } => {
  const totalInvestment = (oldAvgPrice * oldQuantity) + (newPrice * newQuantity);
  const totalQuantity = oldQuantity + newQuantity;
  const newAverage = totalInvestment / totalQuantity;
  
  return {
    newAverage,
    totalInvestment,
    totalQuantity,
  };
};

/**
 * Calculate profit/loss for a position
 * @param averagePrice - Average purchase price
 * @param currentPrice - Current market price
 * @param quantity - Number of shares
 * @returns Object with absolute and percentage profit/loss
 */
export const calculateProfitLoss = (
  averagePrice: number,
  currentPrice: number,
  quantity: number
): { absolutePL: number; percentagePL: number; totalValue: number } => {
  const totalCost = averagePrice * quantity;
  const totalValue = currentPrice * quantity;
  const absolutePL = totalValue - totalCost;
  const percentagePL = (absolutePL / totalCost) * 100;
  
  return {
    absolutePL,
    percentagePL,
    totalValue,
  };
};
