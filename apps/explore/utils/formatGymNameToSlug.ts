export const formatGymNameToSlug = (gymName: string) => {
  //   return gymName.toLowerCase().split(' ').join('-');
  // name could have commas in it
  return gymName.toLowerCase().split(',').join('').split(' ').join('-');
};
