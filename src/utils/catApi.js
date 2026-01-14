export const TOTAL_CATS = 10;

export const createRandomCat = async () => {
  const res = await fetch("https://cataas.com/cat?width=420&height=520", {
    cache: "no-store",
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};
