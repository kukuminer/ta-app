import axios from "axios";

export async function wget(nav, url) {
  return await process(axios.get(url), nav);
}

export async function wpost(nav, url, obj) {
  return await process(axios.post(url, obj), nav);
}

async function process(req, nav) {
  try {
    return await req;
  } catch (err) {
    console.log(err);
    nav("/404");
  }
}
