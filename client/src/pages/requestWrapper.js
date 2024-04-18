import axios from "axios";
import { PubSub } from "pubsub-js";
import { alertSubName } from "./components/error_alert_sub";

export async function wget(nav, url) {
  return await process(axios.get(url), nav);
}

export async function wpost(nav, url, obj) {
  return await process(axios.post(url, obj), nav);
}

async function process(req, nav = null) {
  try {
    return await req;
  } catch (err) {
    PubSub.publish(alertSubName, {
      title: "Warning",
      msg: "There was an error: " + err?.response?.data?.detail,
    });
    switch (err?.request?.status) {
      case 403:
        window.location.reload();
        // nav(0); // This line does the same as window.location.reload()
        break;
      // case 500:
      //   throw err;
      default:
        //nav("/404");
        console.log("throwing err from requestWrapper", err);
        throw err;
    }
    // return err.response;
  }
}
