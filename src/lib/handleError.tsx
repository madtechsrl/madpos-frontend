import axios from "axios";

export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const err = error.response;
    if (Array.isArray(err?.data.errors)) {
      for (const val of err.data.errors) {
        console.log(val.description);
      }
    } else if (typeof err?.data.errors === "object") {
      for (const e of err.data.errors) {
        console.log(e[0]);
      }
    } else if (err?.data) {
      console.log(err.data);
    } else if (err?.status == 401) {
      console.log("Please login");
      window.history.pushState({}, "LoginPage", "/");
    } else if (err) {
      console.log(err?.data);
    }
  }
};