import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_BASEURL;

const EmailVerification = () => {
  const { emailVerification } = useParams();
  const [status, setStatus] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.put(`${baseURL}/user/email-verification`, {
        otp: emailVerification,
      });
      setStatus(data.status);
      console.log("data => ", data);
      if (data.data != null) {
        return toast(data.data);
      } else {
        return toast(data.message);
      }
    }
    fetchData();
  }, []);

  const resendCode = async (e) => {
    e.preventDefault();

    async function resendEmailToken() {
      const userEmail = JSON.parse(Cookies.get("userEmail"));
      const { data } = await axios.put(`${baseURL}/user/resend-email-token`, {
        email: userEmail,
      });
      toast(data.message);
    }
    resendEmailToken();
  };

  return (
    <>
      {status !== 200 ? (
        <section className="text-center vh-100 centerMid">
          <div className="information">
            <h2>Email verification is not successful</h2>

            <p>Please click the link below to go to the login page.</p>
            <p className=" mt-4 mb-0">
              Did not receive code? <br />
              <button className="btn mt-3">
                <Link href="/" onClick={resendCode}>
                  Resend Code
                </Link>
              </button>
            </p>
          </div>
        </section>
      ) : (
        <section className="text-center vh-100 centerMid">
          <div className="information">
            <h2>Thanks for Email verification</h2>
            <br />
            <p>Please click the link below to go to the login page.</p>
            <p className=" mt-4 mb-0">
              <button className="btn">
                <Link className="d-flex" to="/login">
                  <img src="./assets/icons/leftArrow.svg" alt="" /> Back to log
                  in
                </Link>
              </button>
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default EmailVerification;
