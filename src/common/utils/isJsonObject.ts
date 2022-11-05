export default function isJsonObject(strData) {
  try {
    JSON.parse(strData);
  } catch (e) {
    return false;
  }
  return true;
}
