import { schema } from "@uniswap/token-lists";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const UNI_LIST = "https://cloudflare-ipfs.com/ipns/tokens.uniswap.org";

export async function getTokenList() {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
  });
  addFormats(ajv);
  const validator = ajv.compile(schema);
  const response = await fetch(UNI_LIST);
  const data = await response.json();

  if (validator(response)) {
    throw validator.errors?.map((error) => {
      delete error.data;
      return error;
    });
  } else {
    return data;
  }
}
